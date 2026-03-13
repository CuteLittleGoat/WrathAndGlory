export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx);
    } catch (error) {
      console.error("[push-worker] Unhandled error:", error);
      return jsonResponse(
        { ok: false, error: "Internal server error." },
        500,
        request,
        env
      );
    }
  },
};

async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return handleOptions(request, env);
  }

  if (url.pathname === "/api/push/health" && request.method === "GET") {
    const count = await countSubscriptions(env);
    return jsonResponse(
      {
        ok: true,
        hasVapid: Boolean(
          env.VAPID_PUBLIC_KEY &&
            env.VAPID_PRIVATE_KEY &&
            env.VAPID_SUBJECT
        ),
        subscriptions: count,
      },
      200,
      request,
      env
    );
  }

  if (url.pathname === "/api/push/subscribe" && request.method === "POST") {
    return handleSubscribe(request, env);
  }

  if (url.pathname === "/api/push/trigger" && request.method === "POST") {
    return handleTrigger(request, env);
  }

  return jsonResponse({ ok: false, error: "Not found." }, 404, request, env);
}

async function handleSubscribe(request, env) {
  if (!env.SUBSCRIPTIONS_KV) {
    return jsonResponse(
      { ok: false, error: "Missing SUBSCRIPTIONS_KV binding." },
      500,
      request,
      env
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { ok: false, error: "Invalid JSON body." },
      400,
      request,
      env
    );
  }

  const subscription = body?.subscription;
  if (!isValidSubscription(subscription)) {
    return jsonResponse(
      { ok: false, error: "Invalid subscription payload." },
      400,
      request,
      env
    );
  }

  const key = await subscriptionStorageKey(subscription.endpoint);
  const existing = await env.SUBSCRIPTIONS_KV.get(key);

  const record = {
    endpoint: subscription.endpoint,
    source: typeof body?.source === "string" ? body.source : "unknown",
    createdAt:
      typeof body?.createdAt === "number" ? body.createdAt : Date.now(),
    subscription,
  };

  await env.SUBSCRIPTIONS_KV.put(key, JSON.stringify(record));

  return jsonResponse(
    { ok: true, alreadyExists: Boolean(existing) },
    existing ? 200 : 201,
    request,
    env
  );
}

async function handleTrigger(request, env) {
  if (!env.SUBSCRIPTIONS_KV) {
    return jsonResponse(
      { ok: false, error: "Missing SUBSCRIPTIONS_KV binding." },
      500,
      request,
      env
    );
  }

  if (
    !env.VAPID_PUBLIC_KEY ||
    !env.VAPID_PRIVATE_KEY ||
    !env.VAPID_SUBJECT
  ) {
    return jsonResponse(
      {
        ok: false,
        error:
          "Missing VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY or VAPID_SUBJECT.",
      },
      500,
      request,
      env
    );
  }

  const authHeader = request.headers.get("Authorization") || "";
  const expected = `Bearer ${env.TRIGGER_TOKEN || ""}`;
  if (!env.TRIGGER_TOKEN || authHeader !== expected) {
    return jsonResponse(
      { ok: false, error: "Unauthorized." },
      401,
      request,
      env
    );
  }

  let body = {};
  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      body = await request.json();
    }
  } catch {
    return jsonResponse(
      { ok: false, error: "Invalid JSON body." },
      400,
      request,
      env
    );
  }

  // Payload przyjmujemy dla zgodności z frontendem,
  // ale wysyłamy pusty push.
  // Service Worker po stronie klienta ma już fallbacki:
  // title/body/icon/url.
  const normalizedPayload = normalizePayload(body);

  const records = await listAllSubscriptionRecords(env);
  if (records.length === 0) {
    return jsonResponse(
      {
        ok: true,
        sent: 0,
        removed: 0,
        subscriptions: 0,
        note: "No subscriptions stored.",
        payloadAccepted: normalizedPayload,
      },
      200,
      request,
      env
    );
  }

  let sent = 0;
  let failed = 0;
  const expiredKeys = [];

  for (const record of records) {
    try {
      const result = await sendWebPush(record.subscription, env);
      if (result.ok) {
        sent += 1;
      } else if (result.expired) {
        expiredKeys.push(record.__kvKey);
      } else {
        failed += 1;
        console.error(
          "[push-worker] Send failed:",
          result.status,
          result.text
        );
      }
    } catch (error) {
      failed += 1;
      console.error("[push-worker] Send exception:", error);
    }
  }

  if (expiredKeys.length > 0) {
    await Promise.all(expiredKeys.map((key) => env.SUBSCRIPTIONS_KV.delete(key)));
  }

  return jsonResponse(
    {
      ok: true,
      sent,
      failed,
      removed: expiredKeys.length,
      subscriptions: records.length,
      payloadAccepted: normalizedPayload,
    },
    200,
    request,
    env
  );
}

function normalizePayload(rawPayload) {
  const payload = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
  return {
    title:
      typeof payload.title === "string" && payload.title.trim()
        ? payload.title.trim()
        : "Infoczytnik",
    body:
      typeof payload.body === "string" && payload.body.trim()
        ? payload.body.trim()
        : "+++ INCOMING DATA-TRANSMISSION +++",
    icon:
      typeof payload.icon === "string" && payload.icon.trim()
        ? payload.icon.trim()
        : "/IkonaPowiadomien.png",
    badge:
      typeof payload.badge === "string" && payload.badge.trim()
        ? payload.badge.trim()
        : "/IkonaPowiadomien.png",
    tag:
      typeof payload.tag === "string" && payload.tag.trim()
        ? payload.tag.trim()
        : "infoczytnik-new-message",
    url:
      typeof payload.url === "string" && payload.url.trim()
        ? payload.url.trim()
        : "/Infoczytnik/Infoczytnik.html",
  };
}

function isValidSubscription(subscription) {
  return Boolean(
    subscription &&
      typeof subscription === "object" &&
      typeof subscription.endpoint === "string" &&
      subscription.endpoint.startsWith("https://") &&
      subscription.keys &&
      typeof subscription.keys === "object" &&
      typeof subscription.keys.p256dh === "string" &&
      typeof subscription.keys.auth === "string"
  );
}

async function subscriptionStorageKey(endpoint) {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(endpoint)
  );
  return `sub:${bufferToHex(hashBuffer)}`;
}

async function countSubscriptions(env) {
  let total = 0;
  let cursor = undefined;

  do {
    const page = await env.SUBSCRIPTIONS_KV.list({ prefix: "sub:", cursor });
    total += page.keys.length;
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return total;
}

async function listAllSubscriptionRecords(env) {
  const results = [];
  let cursor = undefined;

  do {
    const page = await env.SUBSCRIPTIONS_KV.list({ prefix: "sub:", cursor });

    for (const item of page.keys) {
      const raw = await env.SUBSCRIPTIONS_KV.get(item.name);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        if (isValidSubscription(parsed.subscription)) {
          parsed.__kvKey = item.name;
          results.push(parsed);
        }
      } catch (error) {
        console.error("[push-worker] Invalid record in KV:", item.name, error);
      }
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return results;
}

async function sendWebPush(subscription, env) {
  const endpoint = subscription.endpoint;
  const audience = new URL(endpoint).origin;
  const jwt = await createVapidJwt({
    aud: audience,
    sub: env.VAPID_SUBJECT,
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  });

  const headers = {
    TTL: "60",
    Urgency: "normal",
    Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}`,
    "Crypto-Key": `p256ecdsa=${env.VAPID_PUBLIC_KEY}`,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
  });

  if (response.ok) {
    return { ok: true, status: response.status };
  }

  const text = await response.text().catch(() => "");
  if (response.status === 404 || response.status === 410) {
    return { ok: false, expired: true, status: response.status, text };
  }

  return { ok: false, expired: false, status: response.status, text };
}

async function createVapidJwt({ aud, sub, publicKey, privateKey }) {
  const now = Math.floor(Date.now() / 1000);
  const header = { typ: "JWT", alg: "ES256" };
  const payload = {
    aud,
    exp: now + 12 * 60 * 60,
    sub,
  };

  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const cryptoKey = await importVapidPrivateKeyJwk(publicKey, privateKey);
  const derSignature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const joseSignature = derToJose(new Uint8Array(derSignature), 64);
  return `${signingInput}.${base64UrlEncodeBytes(joseSignature)}`;
}

async function importVapidPrivateKeyJwk(publicKeyBase64Url, privateKeyBase64Url) {
  const publicBytes = base64UrlToBytes(publicKeyBase64Url);
  const privateBytes = base64UrlToBytes(privateKeyBase64Url);

  if (publicBytes.length !== 65 || publicBytes[0] !== 0x04) {
    throw new Error("Invalid VAPID public key format.");
  }

  if (privateBytes.length !== 32) {
    throw new Error("Invalid VAPID private key format.");
  }

  const x = publicBytes.slice(1, 33);
  const y = publicBytes.slice(33, 65);

  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: base64UrlEncodeBytes(x),
    y: base64UrlEncodeBytes(y),
    d: base64UrlEncodeBytes(privateBytes),
    ext: true,
  };

  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
}

function handleOptions(request, env) {
  const origin = request.headers.get("Origin") || "";
  const headers = buildCorsHeaders(origin, env);
  return new Response(null, { status: 204, headers });
}

function jsonResponse(data, status, request, env) {
  const origin = request.headers.get("Origin") || "";
  const headers = buildCorsHeaders(origin, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data, null, 2), { status, headers });
}

function buildCorsHeaders(origin, env) {
  const headers = new Headers();
  const allowedOrigin = (env.ALLOWED_ORIGIN || "").trim();

  if (allowedOrigin && origin === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

function base64UrlEncodeJson(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(JSON.stringify(value)));
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < array.length; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function derToJose(signature, outputLength) {
  if (signature[0] !== 0x30) {
    throw new Error("Invalid DER signature.");
  }

  let offset = 2;
  if (signature[1] & 0x80) {
    offset = 2 + (signature[1] & 0x7f);
  }

  if (signature[offset] !== 0x02) {
    throw new Error("Invalid DER signature (r marker).");
  }

  const rLength = signature[offset + 1];
  let r = signature.slice(offset + 2, offset + 2 + rLength);
  offset = offset + 2 + rLength;

  if (signature[offset] !== 0x02) {
    throw new Error("Invalid DER signature (s marker).");
  }

  const sLength = signature[offset + 1];
  let s = signature.slice(offset + 2, offset + 2 + sLength);

  const rawLength = outputLength / 2;
  r = trimAndPadInt(r, rawLength);
  s = trimAndPadInt(s, rawLength);

  const jose = new Uint8Array(outputLength);
  jose.set(r, 0);
  jose.set(s, rawLength);
  return jose;
}

function trimAndPadInt(bytes, length) {
  let result = bytes;

  while (result.length > 0 && result[0] === 0x00) {
    result = result.slice(1);
  }

  if (result.length > length) {
    throw new Error("Invalid DER integer length.");
  }

  if (result.length === length) {
    return result;
  }

  const padded = new Uint8Array(length);
  padded.set(result, length - result.length);
  return padded;
}
