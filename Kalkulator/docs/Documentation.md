# Kalkulator — dokumentacja techniczna

## 🇵🇱 Dokumentacja techniczna (PL)

### 1. Zakres modułu
Moduł zawiera:
- `Kalkulator/index.html` (nawigacja startowa),
- `Kalkulator/KalkulatorXP.html` (kalkulacje kosztów rozwoju),
- `Kalkulator/TworzeniePostaci.html` (kreator postaci z walidacjami i zapisem/odczytem).

### 2. Architektura
- Obliczenia XP/PD i walidacje działają po stronie przeglądarki.
- Zapis i odczyt stanu postaci w `TworzeniePostaci.html` korzystają z Firebase/Firestore po poprawnej konfiguracji.
- Przy braku poprawnej konfiguracji Firebase funkcje sieciowe zapisu/odczytu zgłaszają błąd użytkownikowi, a kalkulacje lokalne nadal działają.

### 3. Integracja Firebase
- Konfiguracja: `Kalkulator/config/firebase-config.js`.
- Usługa danych: **Firestore** (nie Realtime Database).
- Dokumentacja wdrożenia: `Kalkulator/config/FirebaseREADME.md`.

### 4. Główne mechaniki
- Pola wejściowe atrybutów, umiejętności i talentów są walidowane zakresami.
- Koszty są przeliczane dynamicznie po zmianie danych.
- Modale potwierdzeń są używane przy akcjach wymagających potwierdzenia użytkownika.
- Przycisk instrukcji otwiera PDF (`HowToUse/pl.pdf` lub `HowToUse/en.pdf`).

### 5. Języki
- Mechanizm tłumaczeń jest dostępny w kodzie modułu.
- Widoczność przełącznika języka zależy od aktualnego HTML/CSS w danym ekranie (`KalkulatorXP.html`, `TworzeniePostaci.html`).

### 6. Odtworzenie 1:1
1. Odtwórz trzy ekrany HTML (`index`, `KalkulatorXP`, `TworzeniePostaci`) i wspólne style.
2. Zachowaj tabele kosztów i funkcje walidacji wejścia.
3. Zachowaj logikę przeliczeń lokalnych.
4. Dodaj konfigurację Firebase Web App i integrację Firestore dla zapisu/odczytu.
5. Podłącz instrukcje PDF i przyciski nawigacyjne do Main.

---

## 🇬🇧 Technical documentation (EN)

### 1. Module scope
The module consists of:
- `Kalkulator/index.html` (entry navigation),
- `Kalkulator/KalkulatorXP.html` (XP/PD cost calculator),
- `Kalkulator/TworzeniePostaci.html` (character creation with validation and save/load).

### 2. Runtime architecture
- XP/PD calculations and validation run locally in the browser.
- Character state save/load in `TworzeniePostaci.html` uses Firebase **Firestore** when configuration is valid.
- If Firebase config is missing/invalid, network save/load reports errors while local calculations still work.

### 3. Firebase integration
- Config file: `Kalkulator/config/firebase-config.js`.
- Data service: **Firestore** (not Realtime Database).
- Setup guide: `Kalkulator/config/FirebaseREADME.md`.

### 4. Core mechanics
- Attribute/skill/talent inputs are range-validated.
- Costs are recalculated on input changes.
- Confirmation modals are used for protected actions.
- Manual button opens localized PDF files.

### 5. Languages
- Translation logic exists in code.
- Language switch visibility follows current HTML/CSS implementation on each page.

### 6. Rebuild checklist
1. Recreate `index`, `KalkulatorXP`, and `TworzeniePostaci` pages and shared styling.
2. Preserve cost tables and input-validation logic.
3. Preserve client-side calculation flow.
4. Configure Firebase Web app and Firestore save/load flow.
5. Keep PDF/manual links and navigation back to Main.
