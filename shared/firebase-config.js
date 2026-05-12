// --- Konfiguracja Firebase dla prywatnych danych DataVault / Firebase config for private DataVault data ---
// Ten plik NIE zawiera hasła. / This file does NOT contain the password.
// Hasło użytkownik wpisuje w formularzu aplikacji. / Password is entered by the user in the app form.
// Web firebaseConfig nie jest hasłem; bezpieczeństwo zapewniają Firebase Auth i reguły RTDB. / Web firebaseConfig is not a password; security is provided by Firebase Auth and RTDB rules.
window.WG_FIREBASE_CONFIG = {
  apiKey: "TU_PRAWDZIWY_API_KEY",
  authDomain: "wh40k-data-slate.firebaseapp.com",
  databaseURL: "https://wh40k-data-slate-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wh40k-data-slate",
  storageBucket: "wh40k-data-slate.firebasestorage.app",
  messagingSenderId: "TU_PRAWDZIWY_MESSAGING_SENDER_ID",
  appId: "TU_PRAWDZIWY_APP_ID"
};

window.WG_DATA_ACCESS_EMAIL = "taryf@o2.pl";
