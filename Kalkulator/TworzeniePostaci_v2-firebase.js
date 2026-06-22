/* Integracja Firebase wersji 2, odseparowana od character_builder/current. / Firebase v2 integration isolated from character_builder/current. */
(function installAdvancedCreatorFirebase() {
  'use strict';

  const SCHEMA_VERSION = 2;
  const MODULE_NAME = 'Kalkulator/TworzeniePostaci_v2';
  const LEGACY_MODULE_NAME = 'Kalkulator/test';
  const COLLECTION_NAME = 'character_builder';
  const DOCUMENT_NAME = 'v2';
  const LEGACY_DOCUMENT_NAME = 'test-v2';
  let dependenciesPromise = null;

  const byId = id => document.getElementById(id);

  // Ładuje pojedynczy skrypt tylko raz. / Loads a single script only once.
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

  // Firebase jest pobierane dopiero przy pierwszym zapisie lub odczycie. / Firebase is fetched only on the first save or load.
  async function ensureFirebase() {
    if (dependenciesPromise) return dependenciesPromise;

    dependenciesPromise = (async () => {
      if (typeof window.firebase === 'undefined') {
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
      }
      if (!window.firebase?.firestore) {
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js');
      }
      if (!window.firebaseConfig) {
        await loadScript('./config/firebase-config.js');
      }
      if (!window.firebaseConfig) throw new Error('Brak konfiguracji Firebase.');
      if (!window.firebase.apps.length) window.firebase.initializeApp(window.firebaseConfig);

      const db = window.firebase.firestore();
      return {
        current: db.collection(COLLECTION_NAME).doc(DOCUMENT_NAME),
        legacy: db.collection(COLLECTION_NAME).doc(LEGACY_DOCUMENT_NAME)
      };
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
    if (payload.module !== MODULE_NAME && payload.module !== LEGACY_MODULE_NAME) {
      throw new Error(`Nieprawidłowy moduł dokumentu: ${String(payload.module)}.`);
    }
  }

  function normalizeLegacyPayload(payload) {
    if (payload.data) return payload;
    return {
      xpPool: payload.xpPool,
      talentCount: payload.talentCount,
      data: {
        attrs: payload.attributes,
        skills: payload.skills,
        talents: payload.talents,
        character: payload.character,
        influenceAttribute: payload.derived?.influenceAttribute,
        corruptionBase: payload.derived?.corruptionBase,
        rules: payload.specialRules
      }
    };
  }

  const isPermissionError = error => error?.code === 'permission-denied' || /permission/i.test(String(error?.message || ''));

  // Do czasu wdrożenia nowych reguł zapis może użyć starego, odizolowanego dokumentu test-v2. / Until new rules are deployed, saving can use the old isolated test-v2 document.
  async function writeWithMigrationFallback(refs, payload) {
    try {
      await refs.current.set(payload, { merge: false });
      return { usedLegacy: false };
    } catch (error) {
      if (!isPermissionError(error)) throw error;
      console.warn('[TworzeniePostaci_v2 Firebase] Brak dostępu do character_builder/v2; użyto tymczasowego test-v2.', error);
      await refs.legacy.set(payload, { merge: false });
      return { usedLegacy: true };
    }
  }

  async function readWithMigrationFallback(refs) {
    try {
      const currentSnapshot = await refs.current.get();
      if (currentSnapshot.exists) return { snapshot: currentSnapshot, usedLegacy: false };
    } catch (error) {
      if (!isPermissionError(error)) throw error;
      console.warn('[TworzeniePostaci_v2 Firebase] Brak dostępu do character_builder/v2; sprawdzono test-v2.', error);
    }

    const legacySnapshot = await refs.legacy.get();
    return { snapshot: legacySnapshot, usedLegacy: legacySnapshot.exists };
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
      const refs = await ensureFirebase();
      await writeWithMigrationFallback(refs, buildPayload());
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
      const refs = await ensureFirebase();
      const { snapshot, usedLegacy } = await readWithMigrationFallback(refs);
      if (!snapshot.exists) throw new Error('Brak zapisanego stanu postaci.');

      const payload = snapshot.data();
      validatePayload(payload);
      window.WNGCreatorV2.applyState(normalizeLegacyPayload(payload));

      // Próba migracji jest bezpieczna; brak nowych reguł nie blokuje samego odczytu. / Migration is best-effort; missing new rules do not block the load itself.
      if (usedLegacy) {
        try {
          await refs.current.set(buildPayload(), { merge: false });
        } catch (error) {
          if (!isPermissionError(error)) throw error;
          console.info('[TworzeniePostaci_v2 Firebase] Migracja do character_builder/v2 zaczeka na wdrożenie reguł.');
        }
      }

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
