/* Firebase integration dedicated to Kalkulator/test.html.
 * Production document character_builder/current is never read or written here.
 */
(function installTestFirebaseIntegration() {
  'use strict';

  const SCHEMA_VERSION = 2;
  const MODULE_NAME = 'Kalkulator/test';
  const COLLECTION_NAME = 'character_builder';
  const DOCUMENT_NAME = 'test-v2';
  const ATTRIBUTE_KEYS = ['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd', 'Speed'];
  const SKILL_KEYS = [
    'analysis', 'athletics', 'awareness', 'leadership', 'insight', 'tech',
    'medicae', 'psychicMastery', 'deception', 'persuasion', 'pilot', 'cunning',
    'survival', 'stealth', 'ballisticSkill', 'weaponSkill', 'scholar', 'intimidation'
  ];

  const byId = id => document.getElementById(id);
  const toInt = (value, fallback = 0) => {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const dispatchInput = element => {
    if (element) element.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const setValue = (id, value) => {
    const element = byId(id);
    if (!element || value === undefined || value === null) return;
    element.value = String(value);
  };
  const setMessage = (message, isError = false) => {
    const target = byId('warningMessage');
    if (!target) return;
    target.textContent = message;
    target.style.color = isError ? 'var(--red)' : 'var(--yellow)';
  };

  function initializeFirebase() {
    if (typeof firebase === 'undefined' || !window.firebaseConfig) {
      return { ready: false, ref: null, error: 'Brak bibliotek Firebase lub konfiguracji firebase-config.js.' };
    }

    try {
      if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
      const ref = firebase.firestore().collection(COLLECTION_NAME).doc(DOCUMENT_NAME);
      return { ready: true, ref, error: '' };
    } catch (error) {
      console.error('[test-firebase] Firebase initialization failed:', error);
      return { ready: false, ref: null, error: error.message || 'Nie udało się uruchomić Firebase.' };
    }
  }

  function collectTalents() {
    return Array.from(document.querySelectorAll('[id^="talent_name_"]'))
      .sort((left, right) => toInt(left.id.replace('talent_name_', '')) - toInt(right.id.replace('talent_name_', '')))
      .map(textarea => {
        const index = textarea.id.replace('talent_name_', '');
        return {
          name: textarea.value || '',
          cost: Math.max(0, toInt(byId(`talent_cost_${index}`)?.value, 0))
        };
      });
  }

  function collectSpecialRules() {
    return Array.from(document.querySelectorAll('#specialRulesTable tr[data-rule-index]')).map(row => {
      const index = row.dataset.ruleIndex;
      return {
        type: byId(`rule_type_${index}`)?.value || 'other',
        name: byId(`rule_name_${index}`)?.value || '',
        target: byId(`rule_target_${index}`)?.value || 'none',
        value: toInt(byId(`rule_value_${index}`)?.value, 0)
      };
    });
  }

  function collectState() {
    const attributes = {};
    ATTRIBUTE_KEYS.forEach(key => {
      attributes[key] = toInt(byId(`attr_${key}`)?.value, key === 'Speed' ? 6 : 1);
    });

    const skills = {};
    SKILL_KEYS.forEach(key => {
      skills[key] = toInt(byId(`skill_${key}`)?.value, 0);
    });

    const talents = collectTalents();
    return {
      schemaVersion: SCHEMA_VERSION,
      module: MODULE_NAME,
      savedAt: firebase.firestore.FieldValue.serverTimestamp(),
      savedBy: 'anonymous-web-client',
      xpPool: Math.max(0, toInt(byId('xpPool')?.value, 0)),
      talentCount: talents.length,
      attributes,
      skills,
      talents,
      character: {
        gameTier: toInt(byId('character_gameTier')?.value, 1),
        speciesName: byId('character_speciesName')?.value || '',
        size: byId('character_size')?.value || 'Średni',
        factionName: byId('character_factionName')?.value || '',
        archetypeName: byId('character_archetypeName')?.value || '',
        keywords: byId('character_keywords')?.value || ''
      },
      derived: {
        influenceAttribute: byId('derived_influenceAttribute')?.value || 'Ogd',
        corruptionBase: toInt(byId('derived_corruptionBase')?.value, 0)
      },
      specialRules: collectSpecialRules()
    };
  }

  function validateState(data) {
    if (!data || typeof data !== 'object') throw new Error('Dokument testowy jest pusty lub uszkodzony.');
    if (data.schemaVersion !== SCHEMA_VERSION) {
      throw new Error(`Nieobsługiwana wersja schematu: ${String(data.schemaVersion)}. Oczekiwano ${SCHEMA_VERSION}.`);
    }
    if (data.module !== MODULE_NAME) {
      throw new Error(`Nieprawidłowy moduł dokumentu: ${String(data.module)}.`);
    }
  }

  function resizeTalents(targetCount) {
    const addButton = byId('addTalentRowButton');
    const removeButton = byId('removeTalentRowButton');
    const safeTarget = Math.max(2, Math.min(100, targetCount % 2 === 0 ? targetCount : targetCount + 1));
    let current = document.querySelectorAll('[id^="talent_name_"]').length;

    while (current < safeTarget && addButton) {
      addButton.click();
      current = document.querySelectorAll('[id^="talent_name_"]').length;
    }
    while (current > safeTarget && removeButton) {
      removeButton.click();
      const next = document.querySelectorAll('[id^="talent_name_"]').length;
      if (next === current) break;
      current = next;
    }
  }

  function resizeSpecialRules(targetCount) {
    const addButton = byId('addSpecialRuleButton');
    const removeButton = byId('removeSpecialRuleButton');
    const safeTarget = Math.max(1, Math.min(100, targetCount));
    let current = document.querySelectorAll('#specialRulesTable tr[data-rule-index]').length;

    while (current < safeTarget && addButton) {
      addButton.click();
      current = document.querySelectorAll('#specialRulesTable tr[data-rule-index]').length;
    }
    while (current > safeTarget && removeButton) {
      removeButton.click();
      const next = document.querySelectorAll('#specialRulesTable tr[data-rule-index]').length;
      if (next === current) break;
      current = next;
    }
  }

  function applyState(data) {
    validateState(data);

    setValue('xpPool', data.xpPool);
    Object.entries(data.attributes || {}).forEach(([key, value]) => setValue(`attr_${key}`, value));
    Object.entries(data.skills || {}).forEach(([key, value]) => setValue(`skill_${key}`, value));

    const talents = Array.isArray(data.talents) ? data.talents : [];
    resizeTalents(Math.max(toInt(data.talentCount, talents.length || 2), talents.length || 2));
    talents.forEach((talent, index) => {
      setValue(`talent_name_${index + 1}`, talent?.name || '');
      setValue(`talent_cost_${index + 1}`, Math.max(0, toInt(talent?.cost, 0)));
    });

    const character = data.character || {};
    setValue('character_gameTier', character.gameTier ?? 1);
    setValue('character_speciesName', character.speciesName ?? '');
    setValue('character_size', character.size ?? 'Średni');
    setValue('character_factionName', character.factionName ?? '');
    setValue('character_archetypeName', character.archetypeName ?? '');
    setValue('character_keywords', character.keywords ?? '');

    const derived = data.derived || {};
    setValue('derived_influenceAttribute', derived.influenceAttribute ?? 'Ogd');
    setValue('derived_corruptionBase', derived.corruptionBase ?? 0);

    const rules = Array.isArray(data.specialRules) && data.specialRules.length ? data.specialRules : [{ type: 'other', name: '', target: 'none', value: 0 }];
    resizeSpecialRules(rules.length);
    rules.forEach((rule, index) => {
      setValue(`rule_type_${index}`, rule?.type || 'other');
      setValue(`rule_name_${index}`, rule?.name || '');
      setValue(`rule_target_${index}`, rule?.target || 'none');
      setValue(`rule_value_${index}`, toInt(rule?.value, 0));
    });

    dispatchInput(byId('xpPool'));
    document.querySelectorAll('textarea').forEach(textarea => dispatchInput(textarea));
  }

  async function saveToFirebase(context) {
    if (!context.ready) throw new Error(context.error || 'Firebase nie jest gotowe.');
    await context.ref.set(collectState(), { merge: false });
  }

  async function loadFromFirebase(context) {
    if (!context.ready) throw new Error(context.error || 'Firebase nie jest gotowe.');
    const snapshot = await context.ref.get();
    if (!snapshot.exists) throw new Error(`Brak dokumentu ${COLLECTION_NAME}/${DOCUMENT_NAME}.`);
    applyState(snapshot.data());
  }

  function installButtons() {
    const saveButton = byId('saveFirebaseButton');
    const loadButton = byId('loadFirebaseButton');
    if (!saveButton || !loadButton) return;

    const context = initializeFirebase();
    if (!context.ready) {
      saveButton.disabled = true;
      loadButton.disabled = true;
      saveButton.title = context.error;
      loadButton.title = context.error;
      setMessage(`Firebase testowe nieaktywne: ${context.error}`, true);
      return;
    }

    saveButton.addEventListener('click', async () => {
      if (!window.confirm('Zapisać bieżący stan do osobnego dokumentu Firebase character_builder/test-v2?')) return;
      saveButton.disabled = true;
      try {
        await saveToFirebase(context);
        setMessage('Zapisano w Firebase: character_builder/test-v2. Produkcyjny dokument current nie został zmieniony.');
      } catch (error) {
        console.error('[test-firebase] Save failed:', error);
        setMessage(`Błąd zapisu Firebase: ${error.message || error}`, true);
      } finally {
        saveButton.disabled = false;
      }
    });

    loadButton.addEventListener('click', async () => {
      if (!window.confirm('Wczytać stan z osobnego dokumentu Firebase character_builder/test-v2?')) return;
      loadButton.disabled = true;
      try {
        await loadFromFirebase(context);
        setMessage('Wczytano dane z Firebase: character_builder/test-v2.');
      } catch (error) {
        console.error('[test-firebase] Load failed:', error);
        setMessage(`Błąd wczytywania Firebase: ${error.message || error}`, true);
      } finally {
        loadButton.disabled = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installButtons, { once: true });
  } else {
    installButtons();
  }
})();
