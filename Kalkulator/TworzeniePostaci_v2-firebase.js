/* Integracja Firebase wersji 2, odseparowana od character_builder/current. / Firebase v2 integration isolated from character_builder/current. */
(function installAdvancedCreatorFirebase() {
  'use strict';

  const SCHEMA_VERSION = 3;
  const MODULE_NAME = 'Kalkulator/TworzeniePostaci_v2';
  const COLLECTION_NAME = 'character_builder';
  const DOCUMENT_NAME = 'v2';
  let dependenciesPromise = null;

  const byId = id => document.getElementById(id);

  const loadScript = src => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-v2-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.dataset.v2Src = src;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Nie udało się załadować ${src}.`)), { once: true });
    document.head.appendChild(script);
  });

  // --- Uruchomienie App Check / Starting App Check ---
  // Wywołanie nie jest krytyczne: gdy którykolwiek składnik się nie wczyta, kreator zapisuje
  // i wczytuje postać dokładnie tak jak przed wprowadzeniem App Check.
  // The call is not critical: when any piece fails to load, the creator saves and reads a character
  // exactly as it did before App Check was introduced.
  async function ensureAppCheck() {
    try {
      if (!window.firebase?.appCheck) {
        await loadScript('https://www.gstatic.com/firebasejs/12.6.0/firebase-app-check-compat.js');
      }
      if (!window.WG_APPCHECK_SITE_KEYS) {
        await loadScript('../shared/appcheck-config.js');
      }
      // Bibliotekę reCAPTCHA wczytujemy sami, bo SDK dokłada swój znacznik bez obsługi błędu
      // wczytania i przy zablokowanym adresie czeka bez końca, blokując wszystkie zapytania.
      // We load the reCAPTCHA library ourselves, because the SDK appends its own tag with no
      // load-error handler and, with a blocked address, waits forever, stalling every request.
      if (!window.grecaptcha?.enterprise) {
        await loadScript('https://www.google.com/recaptcha/enterprise.js');
      }
      if (typeof window.WG_activateAppCheckCompat !== 'function') {
        await loadScript('../shared/firebase-app-check-compat.js');
      }
      if (typeof window.WG_activateAppCheckCompat === 'function') {
        window.WG_activateAppCheckCompat(window.firebase);
      }
    } catch (error) {
      console.warn('[AppCheck] Pominięto App Check / App Check skipped:', error);
    }
  }

  async function ensureFirebase() {
    if (dependenciesPromise) return dependenciesPromise;

    dependenciesPromise = (async () => {
      // Nazwy plików kończą się na "-compat", bo od wersji 9 plik firebase-app.js jest plikiem
      // modułowym i wczytany znacznikiem <script> nie tworzy obiektu "firebase".
      // The file names end with "-compat" because since version 9 firebase-app.js is a module file
      // and, loaded with a <script> tag, does not create the "firebase" object.
      if (typeof window.firebase === 'undefined') {
        await loadScript('https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js');
      }
      if (!window.firebase?.firestore) {
        await loadScript('https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore-compat.js');
      }
      if (!window.firebaseConfig) {
        await loadScript('./config/firebase-config.js');
      }
      if (!window.firebaseConfig) throw new Error('Brak konfiguracji Firebase.');
      if (!window.firebase.apps.length) window.firebase.initializeApp(window.firebaseConfig);
      // App Check zaraz po utworzeniu aplikacji, a przed pierwszym użyciem Firestore.
      // App Check right after the app is created and before Firestore is first used.
      await ensureAppCheck();

      return window.firebase.firestore().collection(COLLECTION_NAME).doc(DOCUMENT_NAME);
    })();

    try {
      return await dependenciesPromise;
    } catch (error) {
      dependenciesPromise = null;
      throw error;
    }
  }

  function buildPayload() {
    const snapshot = window.WNGCreatorV2.getState();
    return {
      schemaVersion: SCHEMA_VERSION,
      module: MODULE_NAME,
      savedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
      savedBy: 'anonymous-web-client',
      xpPool: snapshot.xpPool,
      talentCount: snapshot.talentCount,
      data: snapshot.data
    };
  }

  function validatePayload(payload) {
    if (!payload || typeof payload !== 'object') throw new Error('Dokument jest pusty lub uszkodzony.');
    if (payload.schemaVersion !== SCHEMA_VERSION) {
      throw new Error(`Nieobsługiwana wersja schematu: ${String(payload.schemaVersion)}.`);
    }
    if (payload.module !== MODULE_NAME) {
      throw new Error(`Nieprawidłowy moduł dokumentu: ${String(payload.module)}.`);
    }
  }

  async function save() {
    const confirmed = await window.WNGCreatorV2.showConfirmation({
      title: 'Potwierdzenie zapisu',
      message: 'Czy na pewno chcesz zapisać aktualny stan postaci?'
    });
    if (!confirmed) return;

    const button = byId('saveFirebaseButton');
    button.disabled = true;
    try {
      const documentRef = await ensureFirebase();
      await documentRef.set(buildPayload(), { merge: false });
      await window.WNGCreatorV2.showInfo({
        title: 'Potwierdzenie zapisu',
        message: 'Stan postaci został zapisany.'
      });
    } catch (error) {
      console.error('[TworzeniePostaci_v2 Firebase] Save failed:', error);
      await window.WNGCreatorV2.showInfo({
        title: 'Błąd zapisu',
        message: `Nie udało się zapisać stanu postaci.\n${error.message || error}`
      });
    } finally {
      button.disabled = false;
    }
  }

  async function load() {
    const confirmed = await window.WNGCreatorV2.showConfirmation({
      title: 'Potwierdzenie wczytania',
      message: 'Czy na pewno chcesz wczytać zapisany stan postaci?'
    });
    if (!confirmed) return;

    const button = byId('loadFirebaseButton');
    button.disabled = true;
    try {
      const documentRef = await ensureFirebase();
      const snapshot = await documentRef.get();
      if (!snapshot.exists) throw new Error('Brak zapisanego stanu postaci.');

      const payload = snapshot.data();
      validatePayload(payload);
      window.WNGCreatorV2.applyState(payload);

      await window.WNGCreatorV2.showInfo({
        title: 'Potwierdzenie wczytania',
        message: 'Stan postaci został wczytany.'
      });
    } catch (error) {
      console.error('[TworzeniePostaci_v2 Firebase] Load failed:', error);
      await window.WNGCreatorV2.showInfo({
        title: 'Błąd wczytywania',
        message: `Nie udało się wczytać stanu postaci.\n${error.message || error}`
      });
    } finally {
      button.disabled = false;
    }
  }

  function initialize() {
    byId('saveFirebaseButton')?.addEventListener('click', save);
    byId('loadFirebaseButton')?.addEventListener('click', load);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
