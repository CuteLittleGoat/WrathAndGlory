# 🇵🇱 Konfiguracja Firebase dla modułów współdzielonych

## 1) Co powinno być w pliku `shared/firebase-config.js`
Skopiuj szablon konfiguracji Firebase (jeśli istnieje w Twoim module) do pliku `shared/firebase-config.js` i uzupełnij wartości z Firebase Console.

```js
// shared/firebase-config.js
window.firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};
```

Plik `firebase-config.js` powinien zawierać wyłącznie publiczną konfigurację aplikacji web Firebase (bez sekretów serwerowych i bez kluczy prywatnych).

## 2) Oczekiwana struktura danych (wariant współdzielony)
Ponieważ folder `shared` jest używany przez wiele modułów, kolekcje i dokumenty mogą się różnić zależnie od modułu.

Minimalna zasada:
- każdy moduł zapisujący dane do Firestore powinien mieć własną, jednoznaczną ścieżkę (np. osobną kolekcję lub dokument),
- pola wspólne powinny mieć stabilne nazwy i typy,
- dokumenty współdzielone powinny zawierać pole `updatedAt` (timestamp) aktualizowane przy zapisie.

Przykładowy bezpieczny szkielet dokumentu współdzielonego:

- `shared`
  - dokument `state`
    - `modules` (object map)
    - `updatedAt` (timestamp)

> Jeżeli konkretny moduł wymaga innej struktury, najważniejsze jest zachowanie zgodności z logiką tego modułu i jego dokumentacją.

## 3) Czy potrzebny jest skrypt Node.js?
Skrypt Node.js jest potrzebny wtedy, gdy:
- chcesz automatycznie utworzyć startową strukturę w Firestore,
- kilka modułów musi dostać identyczny zestaw pól,
- chcesz uniknąć ręcznego klikania w konsoli Firebase.

Jeżeli struktura ma być utworzona tylko raz i jest bardzo mała, można ją utworzyć ręcznie.

## 4) Przykładowy skrypt Node.js do utworzenia struktury

> Wymagania: `npm i firebase-admin` oraz konto serwisowe (JSON) ustawione jako `GOOGLE_APPLICATION_CREDENTIALS`.

```js
// shared/init-firestore-structure.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function main() {
  await db.collection("shared").doc("state").set(
    {
      modules: {},
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("[OK] Utworzono/uzupełniono dokument shared/state");
}

main().catch((error) => {
  console.error("[ERR]", error);
  process.exit(1);
});
```

## 5) Instrukcja krok-po-kroku
1. Otwórz [https://console.firebase.google.com](https://console.firebase.google.com) i wybierz projekt.
2. Wejdź w **Build → Firestore Database**.
3. Jeśli Firestore nie jest aktywny: kliknij **Create database**, wybierz tryb i region.
4. Wejdź w **Project settings → Your apps** i skopiuj snippet konfiguracji web.
5. Utwórz/uzupełnij `shared/firebase-config.js` zgodnie z sekcją 1.
6. (Opcjonalnie) uruchom skrypt Node.js z sekcji 4, aby utworzyć dokument `shared/state`.
7. Sprawdź reguły Firestore i upewnij się, że moduły mają wymagany odczyt/zapis do używanych ścieżek.

---

# 🇬🇧 Firebase configuration for shared modules

## 1) What should be inside `shared/firebase-config.js`
Copy your Firebase config template (if your module has one) into `shared/firebase-config.js` and fill it with values from Firebase Console.

```js
// shared/firebase-config.js
window.firebaseConfig = {
  apiKey: "PASTE_HERE",
  authDomain: "PASTE_HERE",
  projectId: "PASTE_HERE",
  storageBucket: "PASTE_HERE",
  messagingSenderId: "PASTE_HERE",
  appId: "PASTE_HERE"
};
```

The `firebase-config.js` file should contain only the public Firebase web app config (no server secrets and no private keys).

## 2) Expected data structure (shared variant)
Because the `shared` folder is used by multiple modules, exact Firestore collections/documents may differ by module.

Minimum rule:
- each module writing to Firestore should use a clear dedicated path (for example its own collection or document),
- shared fields should keep stable names and types,
- shared documents should include an `updatedAt` timestamp updated on write.

Example safe shared document skeleton:

- `shared`
  - document `state`
    - `modules` (object map)
    - `updatedAt` (timestamp)

> If a specific module requires a different structure, compatibility with that module's logic and docs is the top priority.

## 3) Is a Node.js script needed?
A Node.js script is useful when:
- you want to auto-create initial Firestore structure,
- multiple modules need the same initial field set,
- you want to avoid manual setup in Firebase Console.

If structure is tiny and created once, manual setup is also fine.

## 4) Example Node.js script to initialize structure

> Requirements: `npm i firebase-admin` and a service account JSON provided via `GOOGLE_APPLICATION_CREDENTIALS`.

```js
// shared/init-firestore-structure.js
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function main() {
  await db.collection("shared").doc("state").set(
    {
      modules: {},
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("[OK] Created/updated shared/state document");
}

main().catch((error) => {
  console.error("[ERR]", error);
  process.exit(1);
});
```

## 5) Step-by-step setup
1. Open [https://console.firebase.google.com](https://console.firebase.google.com) and select your project.
2. Go to **Build → Firestore Database**.
3. If Firestore is not enabled, click **Create database**, choose mode and region.
4. Go to **Project settings → Your apps** and copy the web config snippet.
5. Create/fill `shared/firebase-config.js` as shown in section 1.
6. (Optional) run the Node.js script from section 4 to create `shared/state`.
7. Verify Firestore rules so modules have required read/write access to their paths.
