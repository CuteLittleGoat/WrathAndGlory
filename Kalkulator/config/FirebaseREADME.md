# 🇵🇱 Instrukcja Firebase dla modułu `Kalkulator` (PL)

## 1. Skąd skopiować dane do `config/firebase-config.js`
1. Firebase Console → wybierz projekt.
2. **Project settings** → **Your apps** → aplikacja Web (`</>`).
3. Skopiuj z `Firebase SDK snippet (Config)` wartości: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
4. Wklej je do `Kalkulator/config/firebase-config.js` jako `window.firebaseConfig`.

## 2. Oczekiwana struktura Firestore
- Ścieżka główna: `character_builder/current`.
- Najważniejsze pola: `schemaVersion, xpPool/xpSpent/xpAvailable, attributes, skills, talents, formSnapshot`.
- Struktura musi być zgodna z logiką modułu (zapisy/odczyty przycisków UI).

## 3. Jak utworzyć bazę krok po kroku
1. Firebase Console → **Build → Firestore Database**.
2. Jeśli brak bazy: **Create database** → wybierz tryb i region.
3. Utwórz kolekcję i dokument zgodnie ze ścieżką `character_builder/current`.
4. Dodaj wymagane pola.
5. Ustaw **Rules** tak, aby moduł miał potrzebny odczyt/zapis.

## 4. Skrypt Node.js do utworzenia struktury
Dla modułu `Kalkulator` zalecany skrypt: `config/init-firestore-character-builder.js`.

Uruchomienie:
1. `npm i firebase-admin`
2. Ustaw konto serwisowe: `GOOGLE_APPLICATION_CREDENTIALS`.
3. Uruchom: `node Kalkulator/config/init-firestore-character-builder.js` (jeżeli skrypt istnieje lokalnie).
4. Sprawdź log `[OK]` i zweryfikuj dokument `character_builder/current` w Firestore.

## 5. Co przekazać nowej osobie
- Treść `config/firebase-config.js` z jej własnego projektu.
- Informację, że struktura musi mieć ścieżkę `character_builder/current` i pola `schemaVersion, xpPool/xpSpent/xpAvailable, attributes, skills, talents, formSnapshot`.
- Informację, gdzie w module wykonać test zapisu/odczytu po podpięciu Firebase.

---

# 🇬🇧 Firebase guide for `Kalkulator` module (EN)

## 1. Where to copy data for `config/firebase-config.js`
1. Firebase Console → select project.
2. **Project settings** → **Your apps** → Web app (`</>`).
3. Copy from `Firebase SDK snippet (Config)`: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
4. Paste into `Kalkulator/config/firebase-config.js` as `window.firebaseConfig`.

## 2. Expected Firestore structure
- Main path: `character_builder/current`.
- Key fields: `schemaVersion, xpPool/xpSpent/xpAvailable, attributes, skills, talents, formSnapshot`.
- Structure must match module UI save/load behavior.

## 3. Exact database creation flow
1. Firebase Console → **Build → Firestore Database**.
2. If missing: **Create database** and choose mode/region.
3. Create collection/document for `character_builder/current`.
4. Add required fields.
5. Configure Firestore **Rules** for required reads/writes.

## 4. Node.js bootstrap script
Recommended script for `Kalkulator`: `config/init-firestore-character-builder.js`.

Run steps:
1. `npm i firebase-admin`
2. Set service account via `GOOGLE_APPLICATION_CREDENTIALS`.
3. Run: `node Kalkulator/config/init-firestore-character-builder.js` (if script exists locally).
4. Verify `[OK]` output and check `character_builder/current` in Firestore.

## 5. Handover checklist for another person
- Their own `config/firebase-config.js` values.
- Required path `character_builder/current` and fields `schemaVersion, xpPool/xpSpent/xpAvailable, attributes, skills, talents, formSnapshot`.
- A module-level smoke test for read/write after setup.
