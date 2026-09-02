/**
 * Bramka dostępowa modułu Audio / Audio module access gateway
 * Cloudflare Worker — wariant C: pliki pozostają w prywatnym repozytorium GitHub.
 * Cloudflare Worker — variant C: files stay in the private GitHub repository.
 *
 * Po co to jest / Why this exists:
 *   GitHub Pages zna tylko dwa stany: repozytorium publiczne (pliki dostępne dla
 *   każdego) albo prywatne (pliki niedostępne dla nikogo). Ta bramka dodaje stan
 *   trzeci — „dostępne wyłącznie dla uprawnionych”. Repozytorium AudioRPG zostaje
 *   prywatne na stałe, a jedyną drogą do plików jest ten Worker.
 *   GitHub Pages only knows two states: public repository (files readable by anyone)
 *   or private (files readable by nobody). This gateway adds a third state —
 *   "readable only by authorised users".
 *
 * Dlaczego nie pyta o hasło przy każdym odtworzeniu / Why it does not prompt every time:
 *   Autoryzacja jedzie w tokenie i w podpisie w adresie URL, nigdy przez ciasteczko
 *   ani przez nagłówek WWW-Authenticate. Przeglądarka nie ma więc czego blokować
 *   ani o co pytać. Poprzednia próba z Cloudflare Access zawiodła dokładnie dlatego,
 *   że opierała się na ciasteczku third-party przy żądaniach cross-origin.
 *   Authorisation travels in a bearer token and in a URL signature, never in a cookie
 *   and never through a WWW-Authenticate challenge.
 *
 * Wymagane zmienne środowiskowe / Required environment variables:
 *   GROUP_PASSWORD  [Secret] hasło grupy podawane raz na urządzenie
 *   SIGNING_KEY     [Secret] klucz HMAC do podpisywania tokenów i adresów
 *   GITHUB_TOKEN    [Secret] fine-grained PAT, tylko AudioRPG, Contents: Read-only
 *   ALLOWED_ORIGIN  [Text]   np. https://cutelittlegoat.github.io
 */

// --- Konfiguracja stała / Fixed configuration ---
// Repozytorium z plikami chronionymi / Repository holding the protected files
const REPO = "CuteLittleGoat/AudioRPG";
// Gałąź, z której czytamy / Branch we read from
const REF = "main";
// Nazwa pliku manifestu w repozytorium prywatnym / Manifest file name in the private repo
const MANIFEST_PATH = "audio-manifest.json";

// Ważność tokenu sesji: 30 dni / Session token lifetime: 30 days
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
// Ważność podpisanego adresu, wyrównana do pełnej godziny / Signed URL lifetime, hour-aligned
// Adres jest identyczny przez całą godzinę zegarową, dzięki czemu przeglądarka
// nie pobiera tego samego pliku wielokrotnie. Realna ważność: od 1 do 2 godzin.
// The URL stays identical for a whole clock hour so the browser can reuse its cache.
const LINK_BUCKET_SECONDS = 3600;
const LINK_BUCKETS_AHEAD = 2;

// Jak długo trzymamy manifest w pamięci podręcznej / How long the manifest stays cached
const MANIFEST_CACHE_SECONDS = 300;

// Dozwolone rozszerzenia plików / Allowed file extensions
const ALLOWED_EXTENSIONS = [".ogg", ".mp3"];

// Typy MIME po rozszerzeniu / MIME types by extension
const MIME_TYPES = {
  ".ogg": "audio/ogg",
  ".mp3": "audio/mpeg"
};

// --- Pomocnicze kodowanie base64url / base64url helpers ---
const textEncoder = new TextEncoder();

const toBase64Url = (bytes) => {
  let binary = "";
  const view = new Uint8Array(bytes);
  for (let i = 0; i < view.length; i += 1) {
    binary += String.fromCharCode(view[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

// --- Podpis HMAC-SHA256 / HMAC-SHA256 signature ---
// Klucz importujemy raz na izolat, bo import jest kosztowniejszy niż samo podpisanie.
// The key is imported once per isolate because importing costs more than signing.
let cachedKey = null;
let cachedKeySource = "";

const getKey = async (secret) => {
  if (cachedKey && cachedKeySource === secret) {
    return cachedKey;
  }
  cachedKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  cachedKeySource = secret;
  return cachedKey;
};

const sign = async (secret, message) => {
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(message));
  return toBase64Url(signature);
};

// --- Porównanie w czasie stałym / Constant-time comparison ---
// Zwykłe === kończy porównanie na pierwszej różnicy, co przy zdalnym pomiarze czasu
// pozwala odgadywać sekret znak po znaku.
// A plain === bails out on the first difference, which leaks the secret to timing attacks.
const timingSafeEqual = (a, b) => {
  const left = textEncoder.encode(String(a));
  const right = textEncoder.encode(String(b));
  if (left.length !== right.length) {
    // Nadal wykonujemy porównanie, żeby nie ujawniać różnicy długości czasem odpowiedzi
    // Still compare, so response time does not reveal the length difference
    let dummy = 0;
    for (let i = 0; i < left.length; i += 1) {
      dummy |= left[i];
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left[i] ^ right[i];
  }
  return diff === 0;
};

// --- Nagłówki CORS / CORS headers ---
// Bez nich Web Audio w module dostałby „skażony” strumień i grałby ciszę.
// Without these the module's Web Audio graph would be tainted and play silence.
const corsHeaders = (env) => ({
  "Access-Control-Allow-Origin": (env.ALLOWED_ORIGIN || "").trim() || "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin"
});

const jsonResponse = (data, status, env) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders(env)
    }
  });

// --- Token sesji / Session token ---
// Format: base64url(JSON) + "." + base64url(HMAC). Bez bazy danych — ważność i podpis
// wystarczą, a unieważnienie wszystkich sesji naraz robi się przez zmianę SIGNING_KEY.
// No database needed: expiry plus signature is enough, and rotating SIGNING_KEY
// invalidates every session at once.
const createSessionToken = async (env, nowSeconds) => {
  const payload = { exp: nowSeconds + SESSION_TTL_SECONDS };
  const encoded = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = await sign(env.SIGNING_KEY, encoded);
  return { token: `${encoded}.${signature}`, exp: payload.exp };
};

const verifySessionToken = async (env, token, nowSeconds) => {
  if (typeof token !== "string" || !token.includes(".")) {
    return false;
  }
  const [encoded, signature] = token.split(".", 2);
  if (!encoded || !signature) {
    return false;
  }
  const expected = await sign(env.SIGNING_KEY, encoded);
  if (!timingSafeEqual(signature, expected)) {
    return false;
  }
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded)));
    return Number(payload.exp) > nowSeconds;
  } catch (error) {
    return false;
  }
};

const readBearerToken = (request) => {
  const header = request.headers.get("Authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
};

// --- Walidacja ścieżki pliku / File path validation ---
// Token sesji ma uprawniony użytkownik, ale to nie powód, żeby pozwolić mu wyjść
// poza katalog repozytorium. Odrzucamy wszystko poza czystą ścieżką do pliku audio.
// A session token belongs to an authorised user, but that is no reason to let them
// escape the repository directory.
const isSafeAudioPath = (path) => {
  if (typeof path !== "string" || !path || path.length > 400) {
    return false;
  }
  if (path.startsWith("/") || path.includes("..") || path.includes("\\") || path.includes("//")) {
    return false;
  }
  const lower = path.toLowerCase();
  return ALLOWED_EXTENSIONS.some((extension) => lower.endsWith(extension));
};

const getMimeType = (path) => {
  const lower = path.toLowerCase();
  const match = ALLOWED_EXTENSIONS.find((extension) => lower.endsWith(extension));
  return (match && MIME_TYPES[match]) || "application/octet-stream";
};

// --- Wyliczenie momentu wygaśnięcia podpisu / Signature expiry calculation ---
// Wyrównanie do pełnej godziny sprawia, że w obrębie jednej godziny zegarowej
// powstaje dokładnie ten sam adres, więc cache przeglądarki działa.
// Hour alignment produces the exact same URL within one clock hour, so the browser
// cache keeps working instead of re-downloading the file.
const computeLinkExpiry = (nowSeconds) =>
  (Math.floor(nowSeconds / LINK_BUCKET_SECONDS) + LINK_BUCKETS_AHEAD) * LINK_BUCKET_SECONDS;

// --- Pobranie pliku z prywatnego repozytorium / Fetch a file from the private repo ---
// Używamy Contents API z typem raw: zwraca surowe bajty, a nie base64 w JSON-ie.
// We use the Contents API with the raw media type: it returns raw bytes, not base64 JSON.
const fetchFromGitHub = async (env, path) => {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const url = `https://api.github.com/repos/${REPO}/contents/${encodedPath}?ref=${REF}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.raw",
      // GitHub odrzuca żądania bez User-Agent / GitHub rejects requests without a User-Agent
      "User-Agent": "audio-gate-worker"
    }
  });
};

// --- Obsługa logowania / Login handling ---
const handleLogin = async (request, env, nowSeconds) => {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse({ ok: false, error: "bad_request" }, 400, env);
  }
  if (!timingSafeEqual(body?.password ?? "", env.GROUP_PASSWORD || "")) {
    return jsonResponse({ ok: false, error: "invalid_password" }, 401, env);
  }
  const session = await createSessionToken(env, nowSeconds);
  return jsonResponse({ ok: true, token: session.token, exp: session.exp }, 200, env);
};

// --- Wydanie manifestu warstwy chronionej / Serving the protected manifest ---
// Manifest jest przekazywany dalej bez parsowania — Worker ma tylko 10 ms czasu CPU,
// a parsowanie pół megabajta JSON-a zjadłoby ten budżet bez żadnego zysku.
// The manifest is passed through without parsing: the Worker has only 10 ms of CPU
// and parsing half a megabyte of JSON would burn that budget for nothing.
const handleManifest = async (env, ctx) => {
  const cache = caches.default;
  const cacheKey = new Request(`https://audio-gate.internal/manifest/${REF}`);
  const cached = await cache.match(cacheKey);
  if (cached) {
    const headers = new Headers(cached.headers);
    Object.entries(corsHeaders(env)).forEach(([key, value]) => headers.set(key, value));
    return new Response(cached.body, { status: 200, headers });
  }

  const upstream = await fetchFromGitHub(env, MANIFEST_PATH);
  if (!upstream.ok) {
    return jsonResponse(
      { ok: false, error: "manifest_unavailable", status: upstream.status },
      502,
      env
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": `public, max-age=${MANIFEST_CACHE_SECONDS}`
  });
  const body = await upstream.arrayBuffer();
  ctx.waitUntil(cache.put(cacheKey, new Response(body, { status: 200, headers: new Headers(headers) })));

  Object.entries(corsHeaders(env)).forEach(([key, value]) => headers.set(key, value));
  return new Response(body, { status: 200, headers });
};

// --- Wydanie podpisanego adresu / Issuing a signed URL ---
const handleSign = async (request, env, url, nowSeconds) => {
  const path = url.searchParams.get("p") || "";
  if (!isSafeAudioPath(path)) {
    return jsonResponse({ ok: false, error: "invalid_path" }, 400, env);
  }
  const exp = computeLinkExpiry(nowSeconds);
  const signature = await sign(env.SIGNING_KEY, `${path}|${exp}`);
  const signed = new URL("/a", url.origin);
  signed.searchParams.set("p", path);
  signed.searchParams.set("e", String(exp));
  signed.searchParams.set("s", signature);
  return jsonResponse({ ok: true, url: signed.toString(), exp }, 200, env);
};

// --- Wydanie pliku audio / Serving the audio file ---
const handleAudio = async (request, env, url, ctx, nowSeconds) => {
  const path = url.searchParams.get("p") || "";
  const exp = Number(url.searchParams.get("e") || "0");
  const signature = url.searchParams.get("s") || "";

  if (!isSafeAudioPath(path) || !Number.isFinite(exp)) {
    return new Response("Bad request", { status: 400, headers: corsHeaders(env) });
  }
  if (exp <= nowSeconds) {
    // Link wygasł — moduł poprosi o nowy podpis / Link expired: the module will re-sign
    return new Response("Link expired", { status: 403, headers: corsHeaders(env) });
  }
  const expected = await sign(env.SIGNING_KEY, `${path}|${exp}`);
  if (!timingSafeEqual(signature, expected)) {
    return new Response("Forbidden", { status: 403, headers: corsHeaders(env) });
  }

  const cache = caches.default;
  const cacheKey = new Request(`https://audio-gate.internal/file/${encodeURIComponent(path)}`);
  let fileResponse = await cache.match(cacheKey);

  if (!fileResponse) {
    const upstream = await fetchFromGitHub(env, path);
    if (!upstream.ok) {
      const status = upstream.status === 404 ? 404 : 502;
      return new Response("Upstream error", { status, headers: corsHeaders(env) });
    }
    const buffer = await upstream.arrayBuffer();
    fileResponse = new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(path),
        "Content-Length": String(buffer.byteLength),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
    ctx.waitUntil(cache.put(cacheKey, fileResponse.clone()));
  }

  const headers = new Headers(fileResponse.headers);
  Object.entries(corsHeaders(env)).forEach(([key, value]) => headers.set(key, value));

  // Obsługa żądań częściowych, potrzebna przy przewijaniu dźwięku
  // Range support, needed when the player seeks inside a file
  const range = request.headers.get("Range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (match) {
      const buffer = await fileResponse.arrayBuffer();
      const total = buffer.byteLength;
      const start = match[1] === "" ? Math.max(total - Number(match[2]), 0) : Number(match[1]);
      const end = match[1] === "" || match[2] === "" ? total - 1 : Math.min(Number(match[2]), total - 1);
      if (start >= total || start > end) {
        headers.set("Content-Range", `bytes */${total}`);
        return new Response(null, { status: 416, headers });
      }
      headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
      headers.set("Content-Length", String(end - start + 1));
      return new Response(buffer.slice(start, end + 1), { status: 206, headers });
    }
  }

  return new Response(fileResponse.body, { status: 200, headers });
};

// --- Router / Router ---
const handleRequest = async (request, env, ctx) => {
  const url = new URL(request.url);
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(env) });
  }

  // Kontrola stanu, nie wymaga logowania / Health check, no authentication required
  if (url.pathname === "/health" && request.method === "GET") {
    return jsonResponse(
      {
        ok: true,
        hasPassword: Boolean(env.GROUP_PASSWORD),
        hasSigningKey: Boolean(env.SIGNING_KEY),
        hasGithubToken: Boolean(env.GITHUB_TOKEN),
        allowedOrigin: (env.ALLOWED_ORIGIN || "").trim() || null
      },
      200,
      env
    );
  }

  if (url.pathname === "/login" && request.method === "POST") {
    return handleLogin(request, env, nowSeconds);
  }

  // Wydanie pliku sprawdza podpis w adresie, a nie token sesji — dzięki temu
  // element <audio> nie musi wysyłać żadnych nagłówków.
  // Serving a file checks the URL signature rather than the session token, so the
  // <audio> element does not have to send any headers.
  if (url.pathname === "/a" && request.method === "GET") {
    return handleAudio(request, env, url, ctx, nowSeconds);
  }

  // Pozostałe endpointy wymagają ważnego tokenu sesji
  // The remaining endpoints require a valid session token
  const token = readBearerToken(request);
  if (!(await verifySessionToken(env, token, nowSeconds))) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401, env);
  }

  if (url.pathname === "/manifest" && request.method === "GET") {
    return handleManifest(env, ctx);
  }

  if (url.pathname === "/sign" && request.method === "GET") {
    return handleSign(request, env, url, nowSeconds);
  }

  return jsonResponse({ ok: false, error: "not_found" }, 404, env);
};

export default {
  async fetch(request, env, ctx) {
    try {
      return await handleRequest(request, env, ctx);
    } catch (error) {
      console.error("[audio-gate] Unhandled error:", error);
      return jsonResponse({ ok: false, error: "internal_error" }, 500, env);
    }
  }
};
