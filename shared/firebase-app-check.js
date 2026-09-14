// --- Wspólne uruchamianie App Check dla SDK 12.6.0 (zapis modularny) / Shared App Check activation for SDK 12.6.0 (modular) ---
//
// PL: App Check dokłada do każdego zapytania do Firebase krótkotrwały znacznik potwierdzający,
//     że zapytanie pochodzi z zarejestrowanej aplikacji WrathAndGlory, a nie z obcego programu.
//     Znacznik wystawia reCAPTCHA Enterprise na podstawie klucza witryny z shared/appcheck-config.js.
// EN: App Check attaches a short-lived token to every Firebase request, proving the request comes
//     from the registered WrathAndGlory application and not from a foreign program. The token is
//     issued by reCAPTCHA Enterprise based on the site key from shared/appcheck-config.js.
//
// PL: Moduł obsługuje wyłącznie aplikacje Firebase utworzone przez SDK 12.6.0 w zapisie modularnym:
//     DataVault (shared/firebase-data-loader.js), GeneratorNPC i moduł Audio. Infoczytnik oraz oba
//     Kreatory Postaci używają zapisu zgodnościowego (compat) i uruchamiają App Check u siebie,
//     korzystając z tego samego pliku z kluczami.
// EN: This module only serves Firebase apps created by SDK 12.6.0 in modular form: DataVault
//     (shared/firebase-data-loader.js), GeneratorNPC and the Audio module. Infoczytnik and both
//     character creators use the compat form and activate App Check on their own, reading the
//     site keys from the same file.
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app-check.js";

// PL: Jedna aplikacja Firebase może dostać App Check tylko raz — druga próba zgłasza błąd.
//     Tu zapamiętujemy aplikacje już obsłużone, żeby wywołanie dało się powtórzyć bezpiecznie.
// EN: A single Firebase app can be given App Check only once — a second attempt throws.
//     Here we remember the apps already handled so the call can be repeated safely.
const activatedApps = new WeakSet();

// --- Sprawdzenie, czy biblioteka reCAPTCHA Enterprise jest już wczytana / Check whether the reCAPTCHA Enterprise library is already loaded ---
//
// PL: To jest warunek konieczny i dlatego jest sprawdzany osobno. Firebase, gdy nie zastanie
//     gotowej biblioteki, dokłada znacznik <script> WYŁĄCZNIE z obsługą poprawnego wczytania —
//     bez obsługi błędu. Jeżeli adres www.google.com/recaptcha zostanie zablokowany (dodatek do
//     przeglądarki, filtr w sieci, brak internetu), SDK czeka na tę bibliotekę w nieskończoność,
//     a razem z nim czeka każde zapytanie do Firestore i do Firebase Auth. Sprawdzone
//     uruchomieniem: moduł Audio zostawał wtedy na ekranie wczytywania i po 10 sekundach
//     przechodził w tryb bez połączenia.
//     Dlatego bibliotekę wczytuje sama strona (znacznik <script> w pliku HTML modułu, umieszczony
//     przed skryptami modularnymi), a tutaj tylko sprawdzamy wynik. Gdy biblioteki nie ma,
//     App Check jest pomijany i moduł pracuje dokładnie tak jak przed jego wprowadzeniem.
// EN: This is a hard precondition, hence the separate check. When Firebase does not find the
//     library already loaded, it appends a <script> tag with an onload handler ONLY — there is no
//     error handler. If www.google.com/recaptcha is blocked (browser extension, network filter, no
//     internet), the SDK waits for that library forever, and so does every Firestore and Firebase
//     Auth request. Verified by running it: the Audio module stayed on its loading screen and after
//     10 seconds fell back to offline mode.
//     Therefore the page itself loads the library (a <script> tag in the module's HTML file, placed
//     before the module scripts) and here we only check the outcome. With no library present
//     App Check is skipped and the module works exactly as it did before App Check existed.
function isReCaptchaEnterpriseLoaded() {
  return !!(window.grecaptcha && window.grecaptcha.enterprise);
}

// --- Dobór klucza witryny do projektu danej aplikacji / Site key lookup for the app's project ---
function getSiteKeyForApp(app) {
  const projectId = app && app.options ? app.options.projectId : "";
  if (typeof window.WG_getAppCheckSiteKey === "function") {
    return window.WG_getAppCheckSiteKey(projectId);
  }
  const keys = window.WG_APPCHECK_SITE_KEYS || {};
  return keys[String(projectId || "")] || "";
}

// --- Uruchomienie App Check dla wskazanej aplikacji Firebase / App Check activation for a given Firebase app ---
//
// PL: Wywołanie NIE jest krytyczne. Jeżeli brakuje klucza albo biblioteka reCAPTCHA się nie
//     załaduje (blokada w przeglądarce, brak sieci, zły adres strony), funkcja zapisuje ostrzeżenie
//     w konsoli i zwraca null — moduł ma działać dalej dokładnie tak jak przed wprowadzeniem
//     App Check. Dopóki w Firebase nie jest włączone wymuszanie (Enforce), brak znacznika niczego
//     nie blokuje.
// EN: The call is NOT critical. When the key is missing or the reCAPTCHA library fails to load
//     (browser blocking, no network, wrong page address), the function logs a warning and returns
//     null — the module must keep working exactly as it did before App Check was introduced.
//     As long as enforcement is off in Firebase, a missing token blocks nothing.
export function activateAppCheck(app) {
  if (!app || activatedApps.has(app)) return null;

  const siteKey = getSiteKeyForApp(app);
  if (!siteKey) {
    console.warn("[AppCheck] Brak klucza witryny dla projektu / Missing site key for project:",
      app && app.options ? app.options.projectId : null);
    return null;
  }

  if (!isReCaptchaEnterpriseLoaded()) {
    console.warn("[AppCheck] reCAPTCHA Enterprise nie jest wczytana — App Check pominięty, moduł działa bez znacznika. "
      + "/ reCAPTCHA Enterprise is not loaded — App Check skipped, the module runs without a token.");
    return null;
  }

  try {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      // PL: Znacznik odnawia się sam przed wygaśnięciem, więc użytkownik nie musi odświeżać strony.
      // EN: The token refreshes itself before expiry, so the user never has to reload the page.
      isTokenAutoRefreshEnabled: true
    });
    activatedApps.add(app);
    return appCheck;
  } catch (error) {
    console.warn("[AppCheck] Nie udało się uruchomić App Check / Could not start App Check:", error);
    return null;
  }
}
