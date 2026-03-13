const SW_VERSION = "wg-pwa-v2";
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

  const isNavigationRequest = event.request.mode === "navigate";

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
      .then((response) => {
        if (response) return response;

        if (isNavigationRequest) {
          return new Response(
            "Aplikacja wymaga połączenia z internetem. Sprawdź sieć i odśwież stronę.",
            {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" }
            }
          );
        }

        return Response.error();
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
  const url = payload.url || "./Infoczytnik/Infoczytnik.html";

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
  const targetUrl = event.notification.data?.url || "./Infoczytnik/Infoczytnik.html";

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
