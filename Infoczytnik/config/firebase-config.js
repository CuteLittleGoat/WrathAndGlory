// Plik logiki modułu: konfiguracja, funkcje i obsługa zdarzeń / Module logic file: configuration, functions, and event handling
// config/firebase-config.js
// GLOBALNA konfiguracja Firebase dla GM.html i Infoczytnik.html
// (nie używamy "export", żeby działało też z firebase-*-compat)

// WAŻNE WDROŻENIE: Każda grupa (każdy serwer) powinna mieć własny projekt Firebase i własny komplet kluczy poniżej.
// IMPORTANT DEPLOYMENT: Each group (each server) should use its own Firebase project and its own full key set below.
window.firebaseConfig = {
  apiKey: "AIzaSyCVoWzXtO-vipsxnvZlFkcqcNgYYuH3osc",
  authDomain: "wh40k-data-slate.firebaseapp.com",
  projectId: "wh40k-data-slate",
  storageBucket: "wh40k-data-slate.firebasestorage.app",
  messagingSenderId: "382792444120",
  appId: "1:382792444120:web:9eb27e2ed29109ac838fad",
};
