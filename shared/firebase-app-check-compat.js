// --- Wspólne uruchamianie App Check dla zapisu zgodnościowego (compat) / Shared App Check activation for the compat form ---
//
// PL: Ten plik jest zwykłym skryptem, a nie modułem, bo obsługuje strony wczytujące Firebase
//     znacznikami <script src="…firebase-app-compat.js">: Infoczytnik (panel GM i ekran gracza,
//     wersja 9.6.8) oraz oba Kreatory Postaci (wersja 12.6.0). Odpowiednik dla zapisu modularnego
//     jest w shared/firebase-app-check.js.
// EN: This file is a classic script, not a module, because it serves pages that load Firebase with
//     <script src="…firebase-app-compat.js"> tags: Infoczytnik (GM panel and reader screen,
//     version 9.6.8) and both character creators (version 12.6.0). The modular counterpart lives in
//     shared/firebase-app-check.js.
//
// PL: Klucze witryny pochodzą z shared/appcheck-config.js i nie są tu powielane.
// EN: Site keys come from shared/appcheck-config.js and are not duplicated here.
(function () {
  "use strict";

  // PL: Jedna aplikacja Firebase może dostać App Check tylko raz — druga próba zgłasza błąd.
  // EN: A single Firebase app can be given App Check only once — a second attempt throws.
  var activatedAppNames = [];

  // --- Sprawdzenie, czy biblioteka reCAPTCHA Enterprise jest już wczytana / Check whether the reCAPTCHA Enterprise library is already loaded ---
  //
  // PL: Warunek konieczny. Firebase, gdy nie zastanie gotowej biblioteki, dokłada znacznik <script>
  //     WYŁĄCZNIE z obsługą poprawnego wczytania — bez obsługi błędu. Przy zablokowanym adresie
  //     (dodatek do przeglądarki, filtr w sieci, brak internetu) SDK czeka na nią bez końca, a wraz
  //     z nim czeka każde zapytanie do Firestore. Sprawdzone uruchomieniem w wersji modularnej
  //     i identyczne w zapisie zgodnościowym — kod ładowania jest ten sam.
  //     Dlatego bibliotekę wczytuje sama strona znacznikiem <script defer>, a tutaj tylko
  //     sprawdzamy wynik i przy jej braku pomijamy App Check.
  // EN: A hard precondition. When Firebase does not find the library ready, it appends a <script>
  //     tag with an onload handler ONLY — no error handler. With a blocked address (browser
  //     extension, network filter, no internet) the SDK waits for it forever and every Firestore
  //     request waits with it. Verified by running the modular build; the compat build is identical
  //     because the loading code is the same.
  //     Therefore the page itself loads the library with a <script defer> tag and here we only check
  //     the outcome, skipping App Check when it is absent.
  function isReCaptchaEnterpriseLoaded() {
    return !!(window.grecaptcha && window.grecaptcha.enterprise);
  }

  // --- Uruchomienie App Check dla aplikacji zgodnościowej / App Check activation for a compat app ---
  //
  // PL: Wywołanie nie jest krytyczne. Każdy powód niepowodzenia — brak klucza, brak biblioteki
  //     reCAPTCHA, starsza wersja Firebase bez obsługi reCAPTCHA Enterprise — kończy się
  //     ostrzeżeniem w konsoli i zwróceniem null. Strona ma wtedy działać dokładnie tak jak przed
  //     wprowadzeniem App Check.
  // EN: The call is not critical. Every failure reason — missing key, missing reCAPTCHA library, an
  //     older Firebase without reCAPTCHA Enterprise support — ends with a console warning and a null
  //     return. The page must then work exactly as it did before App Check was introduced.
  window.WG_activateAppCheckCompat = function (firebaseNamespace) {
    var fb = firebaseNamespace || window.firebase;
    if (!fb || typeof fb.app !== "function") {
      console.warn("[AppCheck] Brak obiektu firebase / The firebase object is missing.");
      return null;
    }

    var app;
    try {
      app = fb.app();
    } catch (error) {
      console.warn("[AppCheck] Aplikacja Firebase nie jest jeszcze utworzona / The Firebase app is not created yet:", error);
      return null;
    }

    var appName = app && app.name ? app.name : "[DEFAULT]";
    if (activatedAppNames.indexOf(appName) !== -1) return null;

    if (typeof fb.appCheck !== "function" || !fb.appCheck.ReCaptchaEnterpriseProvider) {
      console.warn("[AppCheck] Ta wersja Firebase nie obsługuje reCAPTCHA Enterprise — App Check pominięty. "
        + "/ This Firebase version does not support reCAPTCHA Enterprise — App Check skipped.");
      return null;
    }

    var projectId = app && app.options ? app.options.projectId : "";
    var siteKey = typeof window.WG_getAppCheckSiteKey === "function"
      ? window.WG_getAppCheckSiteKey(projectId)
      : ((window.WG_APPCHECK_SITE_KEYS || {})[String(projectId || "")] || "");
    if (!siteKey) {
      console.warn("[AppCheck] Brak klucza witryny dla projektu / Missing site key for project:", projectId);
      return null;
    }

    if (!isReCaptchaEnterpriseLoaded()) {
      console.warn("[AppCheck] reCAPTCHA Enterprise nie jest wczytana — App Check pominięty, strona działa bez znacznika. "
        + "/ reCAPTCHA Enterprise is not loaded — App Check skipped, the page runs without a token.");
      return null;
    }

    try {
      var appCheck = fb.appCheck();
      // PL: Drugi argument włącza samoczynne odnawianie znacznika przed wygaśnięciem.
      // EN: The second argument turns on automatic token refresh before expiry.
      appCheck.activate(new fb.appCheck.ReCaptchaEnterpriseProvider(siteKey), true);
      activatedAppNames.push(appName);
      return appCheck;
    } catch (error) {
      console.warn("[AppCheck] Nie udało się uruchomić App Check / Could not start App Check:", error);
      return null;
    }
  };
})();
