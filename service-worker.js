// Plik logiki modułu: konfiguracja, funkcje i obsługa zdarzeń / Module logic file: configuration, functions, and event handling
const SW_VERSION = "wg-pwa-v3";
const APP_SHELL_CACHE = `${SW_VERSION}-shell`;
const APP_SHELL_ASSETS = [
  "./",
  "./Main/index.html",
  "./manifest.webmanifest",
  "./IkonaGlowna.png",
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
