"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
require("dotenv").config();

const app = express();

const PORT = Number(process.env.PORT || 8787);
const subscriptionsFile = path.resolve(process.env.SUBSCRIPTIONS_FILE || "./data/subscriptions.json");
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const vapidPublicKey = (process.env.WEB_PUSH_VAPID_PUBLIC_KEY || "").trim();
const vapidPrivateKey = (process.env.WEB_PUSH_VAPID_PRIVATE_KEY || "").trim();
const vapidSubject = (process.env.WEB_PUSH_VAPID_SUBJECT || "mailto:admin@example.com").trim();

if (!vapidPublicKey || !vapidPrivateKey) {
  console.warn("[web-push] Brak kluczy VAPID w .env. Endpointy push będą zwracać błąd konfiguracji.");
} else {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

app.use(express.json({ limit: "256kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin not allowed: ${origin}`));
    }
  })
);

async function ensureSubscriptionsFile() {
  const directory = path.dirname(subscriptionsFile);
  await fs.mkdir(directory, { recursive: true });
  try {
    await fs.access(subscriptionsFile);
  } catch {
    await fs.writeFile(subscriptionsFile, "[]\n", "utf8");
  }
}

async function readSubscriptions() {
  await ensureSubscriptionsFile();
  const raw = await fs.readFile(subscriptionsFile, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeSubscriptions(subscriptions) {
  await ensureSubscriptionsFile();
  await fs.writeFile(subscriptionsFile, `${JSON.stringify(subscriptions, null, 2)}\n`, "utf8");
}

function validateSubscription(subscription) {
  if (!subscription || typeof subscription !== "object") return false;
  if (typeof subscription.endpoint !== "string" || !subscription.endpoint.startsWith("https://")) return false;
  if (!subscription.keys || typeof subscription.keys !== "object") return false;
  if (typeof subscription.keys.p256dh !== "string" || typeof subscription.keys.auth !== "string") return false;
  return true;
}

function normalizePayload(rawPayload) {
  const payload = rawPayload && typeof rawPayload === "object" ? rawPayload : {};
  return {
    title: typeof payload.title === "string" && payload.title.trim() ? payload.title.trim() : "Infoczytnik",
    body:
      typeof payload.body === "string" && payload.body.trim()
        ? payload.body.trim()
        : "+++ INCOMING DATA-TRANSMISSION +++",
    icon: typeof payload.icon === "string" && payload.icon.trim() ? payload.icon.trim() : "./IkonaPowiadomien.png",
    badge: typeof payload.badge === "string" && payload.badge.trim() ? payload.badge.trim() : "./IkonaPowiadomien.png",
    tag: typeof payload.tag === "string" && payload.tag.trim() ? payload.tag.trim() : "infoczytnik-new-message",
    url:
      typeof payload.url === "string" && payload.url.trim()
        ? payload.url.trim()
        : "./Infoczytnik/Infoczytnik.html"
  };
}

app.get("/api/push/health", async (_req, res) => {
  const subscriptions = await readSubscriptions();
  res.json({
    ok: true,
    hasVapid: Boolean(vapidPublicKey && vapidPrivateKey),
    subscriptions: subscriptions.length
  });
});

app.post("/api/push/subscribe", async (req, res) => {
  const subscription = req.body?.subscription;
  if (!validateSubscription(subscription)) {
    res.status(400).json({ ok: false, error: "Invalid subscription payload." });
    return;
  }

  const subscriptions = await readSubscriptions();
  const exists = subscriptions.some((item) => item.endpoint === subscription.endpoint);
  if (!exists) {
    subscriptions.push({
      source: req.body?.source || "unknown",
      createdAt: req.body?.createdAt || Date.now(),
      subscription
    });
    await writeSubscriptions(subscriptions);
  }

  res.status(201).json({ ok: true, alreadyExists: exists });
});

app.post("/api/push/trigger", async (req, res) => {
  if (!vapidPublicKey || !vapidPrivateKey) {
    res.status(500).json({ ok: false, error: "Missing WEB_PUSH_VAPID_PUBLIC_KEY or WEB_PUSH_VAPID_PRIVATE_KEY." });
    return;
  }

  const payload = normalizePayload(req.body || {});
  const message = JSON.stringify(payload);
  const subscriptions = await readSubscriptions();

  let sent = 0;
  const expiredEndpoints = [];

  for (const item of subscriptions) {
    try {
      await webpush.sendNotification(item.subscription, message);
      sent += 1;
    } catch (error) {
      const statusCode = error?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        expiredEndpoints.push(item.subscription.endpoint);
      } else {
        console.error("[web-push] Błąd wysyłki:", statusCode, error?.message || error);
      }
    }
  }

  if (expiredEndpoints.length > 0) {
    const filtered = subscriptions.filter((item) => !expiredEndpoints.includes(item.subscription.endpoint));
    await writeSubscriptions(filtered);
  }

  res.json({
    ok: true,
    sent,
    removedExpired: expiredEndpoints.length,
    subscriptions: subscriptions.length
  });
});

app.listen(PORT, () => {
  console.log(`[web-push] Backend działa na porcie ${PORT}`);
  console.log(`[web-push] Subskrypcje: ${subscriptionsFile}`);
});
