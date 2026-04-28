# Kalkulator Wrath & Glory — instrukcja użytkownika / User Guide

## 🇵🇱 Instrukcja dla użytkownika (PL)

### Co znajdziesz w module
Moduł **Kalkulator** ma dwie główne części:
1. **Kalkulator PD** – szybkie liczenie kosztu rozwoju.
2. **Tworzenie Postaci** – pełny panel budowy postaci.

Na stronie startowej znajduje się też **Tajny przycisk!** (easter egg).

### Jak rozpocząć
1. Otwórz `Kalkulator/index.html`.
2. Wybierz, czy chcesz wejść do:
   - **Kalkulator PD**,
   - **Tworzenie Postaci**.

### 1) Kalkulator PD — krok po kroku
1. Ustaw język w prawym górnym rogu.
2. Wpisz wartości bieżące i docelowe dla atrybutów i umiejętności.
3. Obserwuj koszty w wierszach i sumę całkowitą (liczy się automatycznie).
4. Jeśli chcesz zacząć od nowa, kliknij **Resetuj wartości**.
5. Aby wrócić do menu głównego modułów, kliknij **Strona Główna**.

### 2) Tworzenie Postaci — krok po kroku
1. Ustaw pulę punktów (domyślnie 155).
2. Uzupełnij atrybuty.
3. Uzupełnij umiejętności i koszty dodatkowe (np. talenty/archetyp/moce).
4. Obserwuj komunikaty ostrzegawcze:
   - przekroczenie puli punktów,
   - zasada „Tree of Learning”.
5. Przycisk **Instrukcja / Manual** otwiera plik PDF pomocy.
6. Przycisk **Maksymalne wartości atrybutów** pokazuje limity ras.
7. **Reset** przywraca wartości początkowe.

### 3) Tajny przycisk
1. Na stronie startowej kliknij **Tajny przycisk!**.
2. Otworzy się okno z animacją.
3. Zamkniesz je przez:
   - przycisk **Zamknij**,
   - kliknięcie tła,
   - klawisz `Escape`.

### Ważne informacje
- W języku polskim moduł używa skrótu **PD**.
- W języku angielskim używa skrótu **XP**.
- Tabele limitów ras są podpowiedzią i nie wpisują wartości automatycznie.

---

## 🇬🇧 User instructions (EN)

### What this module includes
The **Calculator** module has two main parts:
1. **XP Calculator** – quick progression cost counting.
2. **Character Creation** – full character building panel.

The landing page also includes a **Secret button!** (easter egg).

### Getting started
1. Open `Kalkulator/index.html`.
2. Choose one section:
   - **XP Calculator**,
   - **Character Creation**.

### 1) XP Calculator — step by step
1. Set language in top-right corner.
2. Enter current and target values for attributes and skills.
3. Read row costs and total (updated automatically).
4. Click **Reset values** to clear editable fields.
5. Click **Main Page** to return to module launcher.

### 2) Character Creation — step by step
1. Set point pool (default 155).
2. Fill attribute values.
3. Fill skills and extra costs (talents/archetype/powers).
4. Watch warning messages:
   - pool exceeded,
   - Tree of Learning rule.
5. **Instruction / Manual** opens help PDF.
6. **Maximum attribute values** opens species limits.
7. **Reset** returns defaults.

### 3) Secret button
1. Click **Secret button!** on landing page.
2. An overlay animation opens.
3. Close it with:
   - **Close** button,
   - background click,
   - `Escape` key.

### Important notes
- Polish language uses **PD** label.
- English language uses **XP** label.
- Species limit tables are reference-only and do not auto-fill fields.


### Integracja Firebase — wymagana dla pełnego zapisu postaci
Aby funkcja zapisu/odczytu postaci w części **Tworzenie Postaci** działała poprawnie między urządzeniami, musisz mieć aktywny projekt Firebase i bazę Firestore.

#### Krok po kroku (Firebase Console)
1. Wejdź na stronę [https://console.firebase.google.com](https://console.firebase.google.com).
2. Kliknij **Utwórz projekt**.
3. Wpisz nazwę projektu i kliknij **Dalej**.
4. (Opcjonalnie) wyłącz Google Analytics, jeśli nie jest potrzebne, i kliknij **Utwórz projekt**.
5. Po utworzeniu projektu kliknij ikonę **Web** (`</>`) aby dodać aplikację webową.
6. Podaj nazwę aplikacji i kliknij **Zarejestruj aplikację**.
7. Skopiuj dane konfiguracyjne `firebaseConfig`.
8. Otwórz plik `Kalkulator/config/firebase-config.js` i wklej tam skopiowane wartości.
9. W lewym menu Firebase kliknij **Firestore Database**.
10. Kliknij **Utwórz bazę danych**.
11. Wybierz tryb startowy (na start testowy, potem reguły produkcyjne) i kliknij **Dalej**.
12. Wybierz region najbliższy użytkownikom i kliknij **Włącz**.
13. W zakładce **Reguły** ustaw reguły dostępu odpowiednie do Twojej grupy.
14. Zapisz reguły i odśwież `Kalkulator/TworzeniePostaci.html`.
15. Wykonaj próbny zapis postaci i sprawdź, czy dane wracają po ponownym wczytaniu.

### Ważne przy kopiowaniu modułu
W Kalkulatorze występuje przycisk **Strona Główna / Main Page**. Po skopiowaniu aplikacji do innej lokalizacji **musisz edytować hiperłącze**, aby wskazywało poprawny adres modułu Main.

---

### Firebase integration — required for full character save
To use cross-device save/load in **Character Creation**, you need an active Firebase project and Firestore database.

#### Step by step (Firebase Console)
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com).
2. Click **Create a project**.
3. Enter project name and click **Continue**.
4. (Optional) disable Google Analytics if not needed, then click **Create project**.
5. After project creation, click the **Web** icon (`</>`) to add a web app.
6. Enter app nickname and click **Register app**.
7. Copy the `firebaseConfig` values.
8. Open `Kalkulator/config/firebase-config.js` and paste those values.
9. In Firebase left menu, open **Firestore Database**.
10. Click **Create database**.
11. Choose initial mode (test first, production rules later) and click **Next**.
12. Select region closest to users and click **Enable**.
13. In **Rules** tab set access rules for your group.
14. Save rules and refresh `Kalkulator/TworzeniePostaci.html`.
15. Perform a test character save and verify data loads again.

### Important when copying the module
Calculator contains a **Strona Główna / Main Page** button. After moving the app to another location, **edit its hyperlink** to point to the correct Main module path.
## Kopia modułu dla nowej grupy
- Ustaw osobny `Kalkulator/config/firebase-config.js` dla serwera grupy.
- Sprawdź przycisk **Strona Główna / Main Page** w `TworzeniePostaci`, aby wracał do właściwego `Main` na tym serwerze.
- Wykonaj test: zapisz postać i odczytaj ją ponownie.

## Copying module for a new group
- Set a separate `Kalkulator/config/firebase-config.js` for the group server.
- Verify the **Strona Główna / Main Page** button in `TworzeniePostaci` returns to the correct `Main` on that server.
- Run a test: save a character and load it back.
