# 🇵🇱 Instrukcja konfiguracji Firebase dla folderu `shared/` (PL)

## Cel tego pliku
Ten dokument opisuje **dokładnie** jak przygotować konfigurację Firebase dla plików współdzielonych przez moduły (szczególnie DataVault i GeneratorNPC), aby inna osoba mogła podpiąć repozytorium pod **własny** projekt Firebase bez zgadywania.

## Pliki konfiguracyjne w `shared/` i ich rola
- `shared/firebase-config.js` — główny plik runtime. Zawiera:
  - `window.WG_FIREBASE_CONFIG` (konfiguracja web Firebase),
  - `window.WG_DATA_ACCESS_EMAIL` (techniczny e-mail użytkownika Auth, którego hasło wpisuje się w UI).
- `shared/firebase-data-loader.js` — loader danych prywatnych:
  - logowanie Firebase Auth (email+hasło),
  - odczyt Firebase Realtime Database z `datavault/live`,
  - rozpakowanie wrappera `datavault-firebase-import-v1`.
- `shared/access-gate.css` — tylko style bramki dostępu (bez danych konfiguracyjnych).

## Jak uzupełnić `shared/firebase-config.js`
Uzupełnij pola (bez kluczy prywatnych i bez tokenów admin):

```js
window.WG_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...", // wymagane, bo loader czyta RTDB
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
window.WG_DATA_ACCESS_EMAIL = "TECHNICZNY_EMAIL_UZYTKOWNIKA_AUTH";
```

Skąd skopiować dane:
1. Firebase Console → projekt → **Project settings** → zakładka **General**.
2. Sekcja **Your apps** → aplikacja web (`</>`).
3. Blok **Firebase SDK snippet / Config** — stąd kopiujesz `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
4. `databaseURL` pobierz z sekcji Realtime Database (adres instancji) albo z configu, jeśli już jest widoczny.
5. `WG_DATA_ACCESS_EMAIL`: wpisz e-mail użytkownika utworzonego w **Authentication → Users**.

## Oczekiwana struktura Firebase dla `shared/`
W tym wariancie podstawą jest **Realtime Database**, nie Firestore:
- Ścieżka: `datavault/live`
- Wartość: obiekt wrappera:
  - `schemaVersion: "datavault-firebase-import-v1"`
  - `createdAt`
  - `source`
  - `dataJson` (string JSON z właściwymi danymi).

Wniosek praktyczny: struktura zwykle powstaje przez DataVault (eksport/import `firebase-import.json`), więc osobny skrypt Node.js do `shared/` zazwyczaj **nie jest potrzebny**.

## Czy tworzyć skrypt Node.js dla `shared/`?
W aktualnym układzie: **zwykle nie**.
- Jeżeli działają DataVault i GeneratorNPC, to zakładamy, że struktura `datavault/live` już jest i musi zostać zgodna z formatem DataVault.
- Ręczne „wymyślanie” struktury lub inny skrypt może uszkodzić zgodność loadera.

## Bardzo dokładna procedura utworzenia własnej bazy (krok po kroku)
1. Utwórz nowy projekt w Firebase Console.
2. Dodaj aplikację Web (`</>`) i skopiuj config.
3. Włącz **Authentication** i provider **Email/Password**.
4. Dodaj użytkownika technicznego (email+hasło) — email wpiszesz do `WG_DATA_ACCESS_EMAIL`.
5. Włącz **Realtime Database** i utwórz instancję w wybranym regionie.
6. Ustaw reguły RTDB tak, aby zalogowany użytkownik miał odczyt `datavault/live`.
7. Wklej wartości do `shared/firebase-config.js`.
8. Zaloguj się do modułu hasłem użytkownika technicznego i sprawdź odczyt danych.

## Gdy nowa osoba przejmuje moduły
Nowa osoba musi podać własne:
- `WG_FIREBASE_CONFIG` (z własnego projektu Firebase),
- `WG_DATA_ACCESS_EMAIL` (z własnego Firebase Auth),
- hasło do tego konta (wpisywane tylko w UI, nie do repozytorium).

---

# 🇬🇧 Firebase setup guide for `shared/` folder (EN)

## Purpose
This file explains exactly how to connect shared runtime files (especially DataVault + GeneratorNPC) to a different person’s Firebase project.

## Config-related files in `shared/`
- `shared/firebase-config.js`
  - `window.WG_FIREBASE_CONFIG` (public web Firebase config)
  - `window.WG_DATA_ACCESS_EMAIL` (technical Firebase Auth user email)
- `shared/firebase-data-loader.js`
  - signs in with email/password,
  - reads Realtime Database path `datavault/live`,
  - unwraps `datavault-firebase-import-v1` payload.
- `shared/access-gate.css` (UI style only).

## How to fill `shared/firebase-config.js`

```js
window.WG_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
window.WG_DATA_ACCESS_EMAIL = "TECHNICAL_AUTH_USER_EMAIL";
```

Where values come from:
1. Firebase Console → project → **Project settings** → **General**.
2. **Your apps** → Web app (`</>`).
3. Copy web `firebaseConfig` values.
4. Get `databaseURL` from Realtime Database instance details.
5. Create Auth user in **Authentication → Users**, then put that email into `WG_DATA_ACCESS_EMAIL`.

## Expected Firebase structure for `shared/`
This integration uses **Realtime Database** (not Firestore) at:
- `datavault/live`
- value format:
  - `schemaVersion: "datavault-firebase-import-v1"`
  - `createdAt`
  - `source`
  - `dataJson` (JSON string).

Because DataVault produces this wrapper, a custom shared Node.js bootstrap is usually unnecessary.

## Should `shared/` have a Node.js bootstrap script?
Usually: **no**.
- If DataVault + GeneratorNPC are working, required structure already exists.
- Custom script may break strict compatibility expected by the shared loader.

## Exact setup steps for a new Firebase project
1. Create Firebase project.
2. Register a Web app and copy config values.
3. Enable **Authentication → Email/Password**.
4. Create technical auth user (email/password).
5. Enable **Realtime Database**.
6. Configure RTDB rules so authenticated access can read `datavault/live`.
7. Fill `shared/firebase-config.js`.
8. Use module login UI with that password and verify data loading.

## Handover to another person
They must provide their own:
- `WG_FIREBASE_CONFIG`,
- `WG_DATA_ACCESS_EMAIL`,
- Auth password typed in app UI (never stored in repo).
