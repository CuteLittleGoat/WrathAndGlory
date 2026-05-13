# 🇵🇱 Instrukcja Firebase dla modułu `GeneratorNPC` (PL)

## 1. Skąd skopiować dane do `config/firebase-config.js`
1. Firebase Console → wybierz projekt.
2. **Project settings** → **Your apps** → aplikacja Web (`</>`).
3. Skopiuj z `Firebase SDK snippet (Config)` wartości: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
4. Wklej je do `GeneratorNPC/config/firebase-config.js` jako `window.firebaseConfig`.

## 2. Oczekiwana struktura Firestore
- Ścieżka główna: `generatorNpc/favorites`.
- Najważniejsze pola: `favorites[] z payloadem builda NPC + updatedAt`.
- Struktura musi być zgodna z logiką modułu (zapisy/odczyty przycisków UI).

## 3. Jak utworzyć bazę krok po kroku
1. Firebase Console → **Build → Firestore Database**.
2. Jeśli brak bazy: **Create database** → wybierz tryb i region.
3. Utwórz kolekcję i dokument zgodnie ze ścieżką `generatorNpc/favorites`.
4. Dodaj wymagane pola.
5. Ustaw **Rules** tak, aby moduł miał potrzebny odczyt/zapis.

## 4. Skrypt Node.js do utworzenia struktury
Dla modułu `GeneratorNPC` zalecany skrypt: `config/init-firestore-structure.js`.

Uruchomienie:
1. `npm i firebase-admin`
2. Ustaw konto serwisowe: `GOOGLE_APPLICATION_CREDENTIALS`.
3. Uruchom: `node GeneratorNPC/config/init-firestore-structure.js` (jeżeli skrypt istnieje lokalnie).
4. Sprawdź log `[OK]` i zweryfikuj dokument `generatorNpc/favorites` w Firestore.

## 5. Co przekazać nowej osobie
- Treść `config/firebase-config.js` z jej własnego projektu.
- Informację, że struktura musi mieć ścieżkę `generatorNpc/favorites` i pola `favorites[] z payloadem builda NPC + updatedAt`.
- Informację, gdzie w module wykonać test zapisu/odczytu po podpięciu Firebase.

---

# 🇬🇧 Firebase guide for `GeneratorNPC` module (EN)

## 1. Where to copy data for `config/firebase-config.js`
1. Firebase Console → select project.
2. **Project settings** → **Your apps** → Web app (`</>`).
3. Copy from `Firebase SDK snippet (Config)`: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
4. Paste into `GeneratorNPC/config/firebase-config.js` as `window.firebaseConfig`.

## 2. Expected Firestore structure
- Main path: `generatorNpc/favorites`.
- Key fields: `favorites[] z payloadem builda NPC + updatedAt`.
- Structure must match module UI save/load behavior.

## 3. Exact database creation flow
1. Firebase Console → **Build → Firestore Database**.
2. If missing: **Create database** and choose mode/region.
3. Create collection/document for `generatorNpc/favorites`.
4. Add required fields.
5. Configure Firestore **Rules** for required reads/writes.

## 4. Node.js bootstrap script
Recommended script for `GeneratorNPC`: `config/init-firestore-structure.js`.

Run steps:
1. `npm i firebase-admin`
2. Set service account via `GOOGLE_APPLICATION_CREDENTIALS`.
3. Run: `node GeneratorNPC/config/init-firestore-structure.js` (if script exists locally).
4. Verify `[OK]` output and check `generatorNpc/favorites` in Firestore.

## 5. Handover checklist for another person
- Their own `config/firebase-config.js` values.
- Required path `generatorNpc/favorites` and fields `favorites[] z payloadem builda NPC + updatedAt`.
- A module-level smoke test for read/write after setup.
