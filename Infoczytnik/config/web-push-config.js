window.infWebPushConfig = {
  // Klucz VAPID publiczny (Base64URL) wygenerowany w Firebase Cloud Messaging.
  vapidPublicKey: "BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig",

  // Endpoint backendu zapisujący subskrypcję użytkownika (POST JSON subscription).
  // Ustaw tu produkcyjny endpoint HTTPS (bez localhost).
  subscribeEndpoint: "/api/push/subscribe",

  // Opcjonalny endpoint backendu do triggera po wysłaniu wiadomości przez GM.
  // Ustaw tu produkcyjny endpoint HTTPS (bez localhost).
  triggerEndpoint: "/api/push/trigger"
};
