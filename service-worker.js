const SW_VERSION = "wg-pwa-v1";
const APP_SHELL_CACHE = `${SW_VERSION}-shell`;
const APP_SHELL_ASSETS = [
  "./",
  "./Main/index.html",
  "./manifest.webmanifest",
  "./IkonaGlowna.png",
  "./IkonaPowiadomien.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_ASSETS)).catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== APP_SHELL_CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const cloned = response.clone();
          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(APP_SHELL_CACHE).then((cache) => cache.put(event.request, cloned)).catch(() => {});
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "Infoczytnik";
  const body = payload.body || "+++ INCOMING DATA-TRANSMISSION +++";
  const icon = payload.icon || "./IkonaPowiadomien.png";
  const badge = payload.badge || "./IkonaPowiadomien.png";
  const url = payload.url || "./Infoczytnik/Infoczytnik_test.html";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      tag: payload.tag || "infoczytnik-new-message",
      renotify: true,
      data: { url }
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "./Infoczytnik/Infoczytnik_test.html";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("Infoczytnik") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
      return Promise.resolve();
    })
  );
});
