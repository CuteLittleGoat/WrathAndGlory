window.infWebPushConfig = {
  // Publiczny VAPID key z Firebase Cloud Messaging (Web Push certificates).
  vapidPublicKey: "BHEgyK2LpItiJFrT28XceIiHehAsbya5cg9v88hKDOUkCMcZciwBjgBeum5VQs247VTuSJceWwOaZas0WoI-eig",

  // Produkcyjny backend HTTPS zapisujący subskrypcję urządzenia.
  subscribeEndpoint: "https://twoja-domena.pl/api/push/subscribe",

  // Produkcyjny backend HTTPS uruchamiający push po wysłaniu wiadomości przez GM.
  triggerEndpoint: "https://twoja-domena.pl/api/push/trigger"
};
