window.infWebPushConfig = {
  // Klucz VAPID publiczny (Base64URL) z backendu Web Push.
  // Wygeneruj komendą: npx web-push generate-vapid-keys
  vapidPublicKey: "",

  // Endpoint backendu zapisujący subskrypcję użytkownika (POST JSON subscription).
  subscribeEndpoint: "http://localhost:8787/api/push/subscribe",

  // Opcjonalny endpoint backendu do triggera testowego po wysłaniu wiadomości przez GM.
  triggerEndpoint: "http://localhost:8787/api/push/trigger"
};
