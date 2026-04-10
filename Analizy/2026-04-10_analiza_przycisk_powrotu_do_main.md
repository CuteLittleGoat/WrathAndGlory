# Analiza: dodanie przycisku powrotu do `Main/index.html`

## Prompt użytkownika

> „Przeprowadź analizę i zapisz jej wyniki. Chciałbym w stronach:
> DataVault/index.html
> Kalkulator/KalkulatorXP.html
> Kalkulator/TworzeniePostaci.html
> DiceRoller/index.html
> dodać przycisk przenoszący do strony Main/index.html (w widoku użytkownika a nie admina).
> Przeprowadź pełną analizę kodu aplikacji. Zaproponuj rozwiązania.
> Zadbaj o to, żeby przycisk był stylistycznie zgodny z resztą aplikacji.”

## Zakres analizy

Przeanalizowano:
- strukturę HTML i istniejące strefy akcji (`topbar`, `language-switcher`, przyciski funkcjonalne),
- sposób internacjonalizacji (PL/EN) i miejsca, gdzie trzeba dodać etykietę nowego przycisku,
- wspólne zasady stylu (paleta, fonty, klasy `.btn`, hover/focus),
- logikę „admin vs user” w DataVault.

Pliki sprawdzone:
- `DataVault/index.html`
- `DataVault/style.css`
- `DataVault/app.js`
- `Kalkulator/KalkulatorXP.html`
- `Kalkulator/kalkulatorxp.css`
- `Kalkulator/TworzeniePostaci.html`
- `DiceRoller/index.html`
- `DiceRoller/style.css`
- `DiceRoller/script.js`

## Wnioski z analizy architektury

### 1) DataVault (ma wyraźny podział admin/user)

- Tryb admin jest rozpoznawany przez query param `?admin=1` (`ADMIN_MODE` w `DataVault/app.js`).
- W interfejsie istnieje wspólna sekcja akcji (`.actions`) i klasy przycisków (`.btn`, `.btn.secondary`).
- To najlepsze miejsce na dodanie przycisku „Powrót do Main” dla usera.

**Implikacja:**
- przycisk powinien być **widoczny tylko gdy `ADMIN_MODE === false`**,
- w adminie może być ukryty (np. `display:none`) lub w ogóle niewstrzykiwany,
- etykieta przycisku powinna wejść do `translations` (PL/EN), aby był zgodny z obecnym i18n.

### 2) KalkulatorXP (spójny layout topbar/actions)

- Strona używa `kalkulatorxp.css`, ma gotową sekcję `.actions` z `language-switcher` i `#btnReset`.
- Istnieją gotowe style przycisku (`.btn.secondary`) pasujące do estetyki modułu.
- Tłumaczenia są inline (obiekt `translations` w HTML), więc nowy label powinien zostać dodany tam.

**Implikacja:**
- najniższe ryzyko: dodać `<a class="btn secondary" ...>` albo `<button class="btn secondary" ...>` obok resetu,
- dla `<button>` potrzebny listener `window.location.href = '../Main/index.html'`,
- dla `<a>` wystarczy `href`, ale trzeba pamiętać o stylu linku jak button (np. `text-decoration:none; display:inline-flex; align-items:center;`).

### 3) TworzeniePostaci (odmienna struktura: `wrapper + language-switcher`)

- Brak `topbar`; akcje są w prawym górnym rogu w `.language-switcher`.
- Już istnieje tam dodatkowy przycisk `#manualButton` (obok selecta), więc UX-owo to naturalne miejsce.
- Tłumaczenia są bardzo szczegółowe i obejmują etykiety przycisków (`manualButton`).

**Implikacja:**
- dodać drugi przycisk (np. `#backToMainButton`) bez zmiany układu całej strony,
- rozszerzyć `translations.pl.labels` i `translations.en.labels` o `backToMainButton`,
- w `updateLanguage()` podmieniać jego tekst analogicznie do `manualButton`.

### 4) DiceRoller (oddzielny system klas, bez `.btn`)

- W module jest własny styl przycisków (`.roll`) oraz pozycjonowany `.language-switcher`.
- Dla spójności modułu lepiej **nie kopiować bezpośrednio** klas `.btn` z innych modułów,
  tylko użyć stylu lokalnego: np. nowa klasa `.nav-button` oparta o te same tokeny kolorów.
- Tłumaczenia są w `DiceRoller/script.js` i już obsługują dynamiczne podmiany etykiet.

**Implikacja:**
- dodać element przy language-switcher lub pod nagłówkiem (bardziej czytelne na mobile),
- dopisać label PL/EN i aktualizację tekstu w `updateLanguage()`.

## Spójność stylistyczna (kluczowe zasady)

Wspólny „język wizualny” repo:
- font monospace (`Consolas/Fira Code/Source Code Pro`),
- neonowa zieleń (`#16c60c`) + ciemne tło,
- uppercase + tracking liter dla akcji,
- wyraźne obramowanie, hover i focus glow.

Rekomendacja globalna dla przycisku powrotu:
1. wariant **secondary/outline** (nie primary),
2. etykieta krótsza: `Powrót do Main` / `Back to Main`,
3. zawsze focus-ring dla klawiatury,
4. `aria-label` zgodny z językiem.

## Rekomendowane rozwiązanie (docelowe)

### A. Mechanika nawigacji

- Link docelowy: `../Main/index.html` (ze wszystkich 4 wskazanych stron).
- Preferencja techniczna: element `<a href="../Main/index.html">` stylizowany jak button.
  - Zaleta: natywna nawigacja, mniej JS, lepsza semantyka.

### B. Widok user/admin (DataVault)

- Przycisk pokazywać tylko w trybie user (czyli bez `?admin=1`).
- W adminie brak przycisku, aby nie „rozpraszać” flow aktualizacji danych.

### C. i18n

Dodać klucz w każdym module:
- PL: `Powrót do Main`
- EN: `Back to Main`

Miejsca aktualizacji:
- DataVault: `translations` + mapowanie `data-i18n`.
- KalkulatorXP: inline `translations` i `applyLanguage()`.
- TworzeniePostaci: `translations` + `updateLanguage()`.
- DiceRoller: `translations` w `script.js` + `updateLanguage()`.

### D. Styl i layout

- DataVault + KalkulatorXP: użyć istniejących `.btn.secondary`.
- TworzeniePostaci: styl analogiczny do `#manualButton` (ta sama wysokość i obramowanie).
- DiceRoller: dodać klasę lokalną (`.nav-button`) bazującą na stylu `.roll`, ale mniej akcentowaną.

## Proponowany plan wdrożenia (bez modyfikacji kodu na tym etapie)

1. Dodać przyciski/linki do 4 plików HTML w miejscach zgodnych z obecnym UI.
2. Rozszerzyć tłumaczenia PL/EN o etykietę przycisku.
3. W DataVault warunkowo ukryć przycisk dla admina (`ADMIN_MODE`).
4. Dodać/uzupełnić style dla linka-buttona tam, gdzie brak odpowiedniej klasy.
5. Zweryfikować responsywność (<980 px) i nawigację klawiaturą.

## Ryzyka i punkty kontrolne

- **Ryzyko i18n:** brak klucza tłumaczenia zostawi „martwy” tekst po zmianie języka.
- **Ryzyko UI mobilnego:** dodatkowy przycisk w prawym górnym rogu może zawijać układ (szczególnie TworzeniePostaci, DiceRoller).
- **Ryzyko semantyczne:** użycie `<button>` do nawigacji bez JS fallback.
- **Ryzyko DataVault:** przypadkowe wyświetlenie przycisku w adminie (wymaganie użytkownika: user-only).

## Kryteria akceptacji dla przyszłej implementacji

1. We wszystkich 4 stronach użytkownik widzi przycisk „Powrót do Main / Back to Main”.
2. Kliknięcie zawsze otwiera `../Main/index.html`.
3. W DataVault przycisk nie jest widoczny w `?admin=1`.
4. Styl przycisku jest zgodny z lokalnym modułem (bez wizualnego „odstawania”).
5. Zmiana języka aktualizuje etykietę przycisku bez odświeżania.

## Rejestr wdrożonych zmian (pełny, z wartościami przed/po)

Poniżej znajduje się pełny rejestr zmian z numerami linii (nagłówki `@@ -stare +nowe @@`) oraz wartościami **przed** (`-`) i **po** (`+`) dla wszystkich zmienionych plików objętych wdrożeniem.

```diff
diff --git a/DataVault/app.js b/DataVault/app.js
index ce5ae3b..aa5f081 100644
--- a/DataVault/app.js
+++ b/DataVault/app.js
@@ -10,0 +11 @@ const els = {
+  btnMainPage: document.getElementById("btnMainPage"),
@@ -30,0 +32 @@ const translations = {
+      mainPageButton: "Strona Główna",
@@ -92,0 +95 @@ const translations = {
+      mainPageButton: "Main Page",
@@ -235,0 +239,8 @@ const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";
+if (els.btnMainPage) {
+  els.btnMainPage.addEventListener("click", () => {
+    window.location.href = "../Main/index.html";
+  });
+  if (ADMIN_MODE) {
+    els.btnMainPage.style.display = "none";
+  }
+}
diff --git a/DataVault/docs/Documentation.md b/DataVault/docs/Documentation.md
index 7fb9e86..58d6fbd 100644
--- a/DataVault/docs/Documentation.md
+++ b/DataVault/docs/Documentation.md
@@ -22,0 +23,3 @@ Dokument opisuje **mechanizmy aplikacji i wygląd 1:1**, tak aby ktoś mógł od
+
+- Dodano przycisk `#btnMainPage` (klasy: `.btn.secondary`) z etykietą tłumaczoną przez i18n (`mainPageButton`) i nawigacją do `../Main/index.html`.
+- Logika JS ukrywa `#btnMainPage` wyłącznie w trybie admina (`ADMIN_MODE === true`).
diff --git a/DataVault/docs/README.md b/DataVault/docs/README.md
index d2b705d..b998d99 100644
--- a/DataVault/docs/README.md
+++ b/DataVault/docs/README.md
@@ -35,0 +36,3 @@ Najważniejsze zasady działania:
+
+- **Nowy przycisk nawigacyjny (tryb gracza):** w górnym pasku dostępny jest przycisk **Strona Główna / Main Page**, który przenosi do `../Main/index.html`.
+- W trybie admina (`?admin=1`) ten przycisk jest ukryty, żeby nie zakłócać workflow administracyjnego.
@@ -136,0 +140,3 @@ Key behavior:
+
+- **New navigation button (player mode):** the top bar now includes **Strona Główna / Main Page**, which opens `../Main/index.html`.
+- In admin mode (`?admin=1`) this button is hidden to keep the admin workflow focused.
diff --git a/DataVault/index.html b/DataVault/index.html
index b4bd994..602b1b1 100644
--- a/DataVault/index.html
+++ b/DataVault/index.html
@@ -31,0 +32 @@
+        <button class="btn secondary" id="btnMainPage" data-i18n="mainPageButton">Strona Główna</button>
diff --git a/DiceRoller/doc/Documentation.md b/DiceRoller/doc/Documentation.md
index d2055e9..1e8e675 100644
--- a/DiceRoller/doc/Documentation.md
+++ b/DiceRoller/doc/Documentation.md
@@ -30,0 +31,2 @@ Pola:
+- Obok selecta dodano link-przycisk `#mainPageButton` (`.nav-button`) kierujący do `../Main/index.html`.
+- Etykieta linku jest tłumaczona w `translations[lang].labels.mainPageButton`: `Strona Główna` / `Main Page`.
@@ -61,0 +64 @@ Zdefiniowane w `:root` (motyw zielonego terminala spójny z główną stroną):
+- `.nav-button` używa lokalnego stylu modułu (outline + neon hover) i nie korzysta z klas `.btn` z innych modułów.
@@ -191,0 +195 @@ Media query do 600px:
+   - Aktualizuje także tekst linku `#mainPageButton` (`mainPageButton`: `Strona Główna` / `Main Page`).
diff --git a/DiceRoller/doc/README.md b/DiceRoller/doc/README.md
index 1b48c0f..cfd52a4 100644
--- a/DiceRoller/doc/README.md
+++ b/DiceRoller/doc/README.md
@@ -6,0 +7 @@
+4. W tym samym panelu jest przycisk **Strona Główna / Main Page** przenoszący do `../Main/index.html`.
@@ -25,0 +27 @@
+4. The same panel also includes a **Strona Główna / Main Page** button that navigates to `../Main/index.html`.
diff --git a/DiceRoller/index.html b/DiceRoller/index.html
index ebb1677..0f8726d 100644
--- a/DiceRoller/index.html
+++ b/DiceRoller/index.html
@@ -15,0 +16 @@
+      <a id="mainPageButton" class="nav-button" href="../Main/index.html">Strona Główna</a>
diff --git a/DiceRoller/script.js b/DiceRoller/script.js
index 87a85da..3747d4b 100644
--- a/DiceRoller/script.js
+++ b/DiceRoller/script.js
@@ -13,0 +14 @@ const languageSelect = document.getElementById("languageSelect");
+const mainPageButton = document.getElementById("mainPageButton");
@@ -34,0 +36 @@ const translations = {
+      mainPageButton: "Strona Główna",
@@ -59,0 +62 @@ const translations = {
+      mainPageButton: "Main Page",
@@ -206,0 +210 @@ const updateLanguage = (lang) => {
+  mainPageButton.textContent = t.labels.mainPageButton;
diff --git a/DiceRoller/style.css b/DiceRoller/style.css
index c965871..fdfb2fa 100644
--- a/DiceRoller/style.css
+++ b/DiceRoller/style.css
@@ -52,0 +53,4 @@ body {
+  display: flex;
+  flex-direction: column;
+  gap: 8px;
+  align-items: flex-end;
@@ -70,0 +75,22 @@ body {
+.nav-button {
+  text-decoration: none;
+  padding: 7px 10px;
+  border-radius: 6px;
+  border: 2px solid var(--border);
+  background: rgba(22, 198, 12, 0.06);
+  color: var(--text);
+  font-size: 12px;
+  text-transform: uppercase;
+  letter-spacing: 0.05em;
+}
+
+.nav-button:hover {
+  background: rgba(22, 198, 12, 0.14);
+  box-shadow: 0 0 12px rgba(22, 198, 12, 0.25);
+}
+
+.nav-button:focus-visible {
+  outline: none;
+  box-shadow: 0 0 0 2px rgba(22, 198, 12, 0.25);
+}
+
diff --git a/Kalkulator/KalkulatorXP.html b/Kalkulator/KalkulatorXP.html
index 3f78c38..25836f0 100644
--- a/Kalkulator/KalkulatorXP.html
+++ b/Kalkulator/KalkulatorXP.html
@@ -24,0 +25 @@
+        <a class="btn secondary" id="btnMainPage" href="../Main/index.html">Strona Główna</a>
@@ -135,0 +137 @@
+          mainPageButton: "Strona Główna",
@@ -154,0 +157 @@
+          mainPageButton: "Main Page",
@@ -183,0 +187 @@
+    const mainPageButton = document.getElementById("btnMainPage");
@@ -235,0 +240 @@
+      mainPageButton.textContent = t.mainPageButton;
diff --git a/Kalkulator/TworzeniePostaci.html b/Kalkulator/TworzeniePostaci.html
index fad8f9d..24a245f 100644
--- a/Kalkulator/TworzeniePostaci.html
+++ b/Kalkulator/TworzeniePostaci.html
@@ -123,0 +124 @@
+      <button type="button" id="backToMainButton">Strona Główna</button>
@@ -129,148 +130,148 @@
-    <div class="xp-section">
-      <label id="xpPoolLabel">Pula XP do wydania:</label>
-      <input type="number" id="xpPool" value="100" min="0">
-      <span id="xpRemainingLabel">Pozostało: <strong id="xpRemaining">100</strong></span>
-    </div>
-
-    <!-- Obszar komunikatów o błędach / Error message area -->
-    <div class="error-message" id="errorMessage"> </div>
-
-    <!-- Sekcja Atrybutów / Attributes Section -->
-    <h2 class="section-title" id="attributesHeader">Atrybuty</h2>
-    <table class="attributes-table table">
-      <tr>
-        <th id="attrLabel1">S</th>
-        <th id="attrLabel2">Wt</th>
-        <th id="attrLabel3">Zr</th>
-        <th id="attrLabel4">I</th>
-        <th id="attrLabel5">SW</th>
-        <th id="attrLabel6">Int</th>
-        <th id="attrLabel7">Ogd</th>
-      </tr>
-      <tr>
-        <td><input type="number" id="attr_S" value="1" min="1" max="12"></td>
-        <td><input type="number" id="attr_Wt" value="1" min="1" max="12"></td>
-        <td><input type="number" id="attr_Zr" value="1" min="1" max="12"></td>
-        <td><input type="number" id="attr_I" value="1" min="1" max="12"></td>
-        <td><input type="number" id="attr_SW" value="1" min="1" max="12"></td>
-        <td><input type="number" id="attr_Int" value="1" min="1" max="12"></td>
-        <td><input type="number" id="attr_Ogd" value="1" min="1" max="12"></td>
-      </tr>
-    </table>
-
-    <!-- Sekcja Umiejętności / Skills Section -->
-    <h2 class="section-title" id="skillsHeader">Umiejętności</h2>
-    <table class="skills-table table">
-      <tr>
-        <th id="skillHeader1">Umiejętność</th>
-        <th id="skillHeader2">Wartość</th>
-        <th id="skillHeader3">Umiejętność</th>
-        <th id="skillHeader4">Wartość</th>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row1">Analiza (Int)</td>
-        <td><input type="number" id="skill_Column1Row1" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row1">Perswazja (Ogd)</td>
-        <td><input type="number" id="skill_Column2Row1" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row2">Atletyka (S)</td>
-        <td><input type="number" id="skill_Column1Row2" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row2">Pilotaż (Zr)</td>
-        <td><input type="number" id="skill_Column2Row2" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row3">Czujność (Int)</td>
-        <td><input type="number" id="skill_Column1Row3" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row3">Przebiegłość (Ogd)</td>
-        <td><input type="number" id="skill_Column2Row3" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row4">Dowodzenie (SW)</td>
-        <td><input type="number" id="skill_Column1Row4" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row4">Przetrwanie (SW)</td>
-        <td><input type="number" id="skill_Column2Row4" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row5">Intuicja (Ogd)</td>
-        <td><input type="number" id="skill_Column1Row5" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row5">Ukrywanie się (Zr)</td>
-        <td><input type="number" id="skill_Column2Row5" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row6">Korzystanie z technologii (Int)</td>
-        <td><input type="number" id="skill_Column1Row6" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row6">Umiejętności strzeleckie (Zr)</td>
-        <td><input type="number" id="skill_Column2Row6" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row7">Medycyna (Int)</td>
-        <td><input type="number" id="skill_Column1Row7" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row7">Walka wręcz (I)</td>
-        <td><input type="number" id="skill_Column2Row7" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row8">Mistrzostwo psioniczne (SW)</td>
-        <td><input type="number" id="skill_Column1Row8" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row8">Wiedza ogólna (Int)</td>
-        <td><input type="number" id="skill_Column2Row8" value="0" min="0" max="8"></td>
-      </tr>
-      <tr>
-        <td id="skillLabelColumn1Row9">Oszukiwanie (Ogd)</td>
-        <td><input type="number" id="skill_Column1Row9" value="0" min="0" max="8"></td>
-        <td id="skillLabelColumn2Row9">Zastraszanie (SW)</td>
-        <td><input type="number" id="skill_Column2Row9" value="0" min="0" max="8"></td>
-      </tr>
-    </table>
-
-    <!-- Sekcja Talentów / Talents Section -->
-    <h2 class="section-title" id="talentsHeader">Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne</h2>
-    <table class="talents-table table">
-      <tr>
-        <th id="talentHeader1">Nazwa</th>
-        <th id="talentHeader2">Koszt</th>
-        <th id="talentHeader3">Nazwa</th>
-        <th id="talentHeader4">Koszt</th>
-      </tr>
-      <tr>
-        <td><textarea id="talent_name_1" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_1" value="0" min="0"></td>
-        <td><textarea id="talent_name_2" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_2" value="0" min="0"></td>
-      </tr>
-      <tr>
-        <td><textarea id="talent_name_3" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_3" value="0" min="0"></td>
-        <td><textarea id="talent_name_4" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_4" value="0" min="0"></td>
-      </tr>
-      <tr>
-        <td><textarea id="talent_name_5" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_5" value="0" min="0"></td>
-        <td><textarea id="talent_name_6" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_6" value="0" min="0"></td>
-      </tr>
-      <tr>
-        <td><textarea id="talent_name_7" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_7" value="0" min="0"></td>
-        <td><textarea id="talent_name_8" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_8" value="0" min="0"></td>
-      </tr>
-      <tr>
-        <td><textarea id="talent_name_9" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_9" value="0" min="0"></td>
-        <td><textarea id="talent_name_10" class="talent-name"></textarea></td>
-        <td><input type="number" id="talent_cost_10" value="0" min="0"></td>
-      </tr>
-    </table>
-
-    <!-- Stopka / Footer -->
-    <div class="footer" id="footerText">Wykonane przez Spaczoną Inteligencję</div>
-  </div>
-
-  <!-- Sekcja JavaScript / JavaScript Section -->
-  <script>
-    /* Inicjalizacja po załadowaniu strony / Initialization after page load */
-    document.addEventListener('DOMContentLoaded', function() {
-      // --- Obiekt tłumaczeń dla obsługi wielu języków / Translation object for multi-language support ---
-      const translations = {
+    <div class="xp-section">
+      <label id="xpPoolLabel">Pula XP do wydania:</label>
+      <input type="number" id="xpPool" value="100" min="0">
+      <span id="xpRemainingLabel">Pozostało: <strong id="xpRemaining">100</strong></span>
+    </div>
+
+    <!-- Obszar komunikatów o błędach / Error message area -->
+    <div class="error-message" id="errorMessage"> </div>
+
+    <!-- Sekcja Atrybutów / Attributes Section -->
+    <h2 class="section-title" id="attributesHeader">Atrybuty</h2>
+    <table class="attributes-table table">
+      <tr>
+        <th id="attrLabel1">S</th>
+        <th id="attrLabel2">Wt</th>
+        <th id="attrLabel3">Zr</th>
+        <th id="attrLabel4">I</th>
+        <th id="attrLabel5">SW</th>
+        <th id="attrLabel6">Int</th>
+        <th id="attrLabel7">Ogd</th>
+      </tr>
+      <tr>
+        <td><input type="number" id="attr_S" value="1" min="1" max="12"></td>
+        <td><input type="number" id="attr_Wt" value="1" min="1" max="12"></td>
+        <td><input type="number" id="attr_Zr" value="1" min="1" max="12"></td>
+        <td><input type="number" id="attr_I" value="1" min="1" max="12"></td>
+        <td><input type="number" id="attr_SW" value="1" min="1" max="12"></td>
+        <td><input type="number" id="attr_Int" value="1" min="1" max="12"></td>
+        <td><input type="number" id="attr_Ogd" value="1" min="1" max="12"></td>
+      </tr>
+    </table>
+
+    <!-- Sekcja Umiejętności / Skills Section -->
+    <h2 class="section-title" id="skillsHeader">Umiejętności</h2>
+    <table class="skills-table table">
+      <tr>
+        <th id="skillHeader1">Umiejętność</th>
+        <th id="skillHeader2">Wartość</th>
+        <th id="skillHeader3">Umiejętność</th>
+        <th id="skillHeader4">Wartość</th>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row1">Analiza (Int)</td>
+        <td><input type="number" id="skill_Column1Row1" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row1">Perswazja (Ogd)</td>
+        <td><input type="number" id="skill_Column2Row1" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row2">Atletyka (S)</td>
+        <td><input type="number" id="skill_Column1Row2" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row2">Pilotaż (Zr)</td>
+        <td><input type="number" id="skill_Column2Row2" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row3">Czujność (Int)</td>
+        <td><input type="number" id="skill_Column1Row3" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row3">Przebiegłość (Ogd)</td>
+        <td><input type="number" id="skill_Column2Row3" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row4">Dowodzenie (SW)</td>
+        <td><input type="number" id="skill_Column1Row4" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row4">Przetrwanie (SW)</td>
+        <td><input type="number" id="skill_Column2Row4" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row5">Intuicja (Ogd)</td>
+        <td><input type="number" id="skill_Column1Row5" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row5">Ukrywanie się (Zr)</td>
+        <td><input type="number" id="skill_Column2Row5" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row6">Korzystanie z technologii (Int)</td>
+        <td><input type="number" id="skill_Column1Row6" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row6">Umiejętności strzeleckie (Zr)</td>
+        <td><input type="number" id="skill_Column2Row6" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row7">Medycyna (Int)</td>
+        <td><input type="number" id="skill_Column1Row7" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row7">Walka wręcz (I)</td>
+        <td><input type="number" id="skill_Column2Row7" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row8">Mistrzostwo psioniczne (SW)</td>
+        <td><input type="number" id="skill_Column1Row8" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row8">Wiedza ogólna (Int)</td>
+        <td><input type="number" id="skill_Column2Row8" value="0" min="0" max="8"></td>
+      </tr>
+      <tr>
+        <td id="skillLabelColumn1Row9">Oszukiwanie (Ogd)</td>
+        <td><input type="number" id="skill_Column1Row9" value="0" min="0" max="8"></td>
+        <td id="skillLabelColumn2Row9">Zastraszanie (SW)</td>
+        <td><input type="number" id="skill_Column2Row9" value="0" min="0" max="8"></td>
+      </tr>
+    </table>
+
+    <!-- Sekcja Talentów / Talents Section -->
+    <h2 class="section-title" id="talentsHeader">Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne</h2>
+    <table class="talents-table table">
+      <tr>
+        <th id="talentHeader1">Nazwa</th>
+        <th id="talentHeader2">Koszt</th>
+        <th id="talentHeader3">Nazwa</th>
+        <th id="talentHeader4">Koszt</th>
+      </tr>
+      <tr>
+        <td><textarea id="talent_name_1" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_1" value="0" min="0"></td>
+        <td><textarea id="talent_name_2" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_2" value="0" min="0"></td>
+      </tr>
+      <tr>
+        <td><textarea id="talent_name_3" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_3" value="0" min="0"></td>
+        <td><textarea id="talent_name_4" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_4" value="0" min="0"></td>
+      </tr>
+      <tr>
+        <td><textarea id="talent_name_5" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_5" value="0" min="0"></td>
+        <td><textarea id="talent_name_6" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_6" value="0" min="0"></td>
+      </tr>
+      <tr>
+        <td><textarea id="talent_name_7" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_7" value="0" min="0"></td>
+        <td><textarea id="talent_name_8" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_8" value="0" min="0"></td>
+      </tr>
+      <tr>
+        <td><textarea id="talent_name_9" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_9" value="0" min="0"></td>
+        <td><textarea id="talent_name_10" class="talent-name"></textarea></td>
+        <td><input type="number" id="talent_cost_10" value="0" min="0"></td>
+      </tr>
+    </table>
+
+    <!-- Stopka / Footer -->
+    <div class="footer" id="footerText">Wykonane przez Spaczoną Inteligencję</div>
+  </div>
+
+  <!-- Sekcja JavaScript / JavaScript Section -->
+  <script>
+    /* Inicjalizacja po załadowaniu strony / Initialization after page load */
+    document.addEventListener('DOMContentLoaded', function() {
+      // --- Obiekt tłumaczeń dla obsługi wielu języków / Translation object for multi-language support ---
+      const translations = {
@@ -283,2 +284,2 @@
-            skillsHeader: 'Umiejętności',
-            talentsHeader: 'Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne',
+            skillsHeader: 'Umiejętności',
+            talentsHeader: 'Talenty, wiara, moce psioniczne, archetypy, pakiety wyniesienia i inne',
@@ -288 +289,2 @@
-            manualButton: 'Instrukcja'
+            manualButton: 'Instrukcja',
+            backToMainButton: 'Strona Główna'
@@ -290,15 +292,15 @@
-          attributes: ['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd'],
-          skillsColumn1: [
-            'Analiza (Int)', 'Atletyka (S)', 'Czujność (Int)', 'Dowodzenie (SW)', 'Intuicja (Ogd)',
-            'Korzystanie z technologii (Int)', 'Medycyna (Int)', 'Mistrzostwo psioniczne (SW)', 'Oszukiwanie (Ogd)'
-          ],
-          skillsColumn2: [
-            'Perswazja (Ogd)', 'Pilotaż (Zr)', 'Przebiegłość (Ogd)', 'Przetrwanie (SW)', 'Ukrywanie się (Zr)',
-            'Umiejętności strzeleckie (Zr)', 'Walka wręcz (I)', 'Wiedza ogólna (Int)', 'Zastraszanie (SW)'
-          ],
-          errors: {
-            tooMuchXP: 'Przekroczono dostępną pulę XP!',
-            treeOfLearning: 'Niezgodność z zasadą Drzewa Nauki (str. 25)',
-            languageChangeWarning: 'Zmiana języka spowoduje zresetowanie wszystkich danych. Czy na pewno chcesz kontynuować?'
-          }
-        },
+          attributes: ['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd'],
+          skillsColumn1: [
+            'Analiza (Int)', 'Atletyka (S)', 'Czujność (Int)', 'Dowodzenie (SW)', 'Intuicja (Ogd)',
+            'Korzystanie z technologii (Int)', 'Medycyna (Int)', 'Mistrzostwo psioniczne (SW)', 'Oszukiwanie (Ogd)'
+          ],
+          skillsColumn2: [
+            'Perswazja (Ogd)', 'Pilotaż (Zr)', 'Przebiegłość (Ogd)', 'Przetrwanie (SW)', 'Ukrywanie się (Zr)',
+            'Umiejętności strzeleckie (Zr)', 'Walka wręcz (I)', 'Wiedza ogólna (Int)', 'Zastraszanie (SW)'
+          ],
+          errors: {
+            tooMuchXP: 'Przekroczono dostępną pulę XP!',
+            treeOfLearning: 'Niezgodność z zasadą Drzewa Nauki (str. 25)',
+            languageChangeWarning: 'Zmiana języka spowoduje zresetowanie wszystkich danych. Czy na pewno chcesz kontynuować?'
+          }
+        },
@@ -311,2 +313,2 @@
-            skillsHeader: 'Skills',
-            talentsHeader: 'Talents, Faith, Psionic Powers, Archetypes, Ascension Packages, and Others',
+            skillsHeader: 'Skills',
+            talentsHeader: 'Talents, Faith, Psionic Powers, Archetypes, Ascension Packages, and Others',
@@ -316 +318,2 @@
-            manualButton: 'Manual'
+            manualButton: 'Manual',
+            backToMainButton: 'Main Page'
@@ -318,29 +321,29 @@
-          attributes: ['S', 'T', 'A', 'I', 'Will', 'Int', 'Fell'],
-          skillsColumn1: [
-            'Athletics (S)', 'Awareness (Int)', 'Ballistic Skill (A)', 'Cunning (Fel)', 'Deception (Fel)',
-            'Insight (Fel)', 'Intimidation (Will)', 'Investigation (Int)', 'Leadership (Will)'
-          ],
-          skillsColumn2: [
-            'Medicae (Int)', 'Persuasion (Fel)', 'Pilot (A)', 'Psychic Mastery (Will)', 'Scholar (Int)',
-            'Stealth (A)', 'Survival (Will)', 'Tech (Int)', 'Weapon Skill (I)'
-          ],
-          errors: {
-            tooMuchXP: 'Too much XP spent!',
-            treeOfLearning: '"Tree of Learning" rule broken (page 26)', // Poprawiono na (page 26)
-            languageChangeWarning: 'Changing the language will reset all data. Are you sure you want to continue?'
-          }
-        }
-      };
-
-      // --- Domyślny język (polski) / Default language (Polish) ---
-      let currentLanguage = 'pl';
-
-      // --- Koszty atrybutów i umiejętności / Attribute and skill costs ---
-      const attributeCosts = {
-        1: 0, 2: 4, 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, 8: 110, 9: 145, 10: 185, 11: 230, 12: 280
-      };
-      const skillCosts = {
-        0: 0, 1: 2, 2: 6, 3: 12, 4: 20, 5: 30, 6: 42, 7: 56, 8: 72
-      };
-
-      // --- Funkcja aktualizująca teksty w wybranym języku / Function to update texts in the selected language ---
+          attributes: ['S', 'T', 'A', 'I', 'Will', 'Int', 'Fell'],
+          skillsColumn1: [
+            'Athletics (S)', 'Awareness (Int)', 'Ballistic Skill (A)', 'Cunning (Fel)', 'Deception (Fel)',
+            'Insight (Fel)', 'Intimidation (Will)', 'Investigation (Int)', 'Leadership (Will)'
+          ],
+          skillsColumn2: [
+            'Medicae (Int)', 'Persuasion (Fel)', 'Pilot (A)', 'Psychic Mastery (Will)', 'Scholar (Int)',
+            'Stealth (A)', 'Survival (Will)', 'Tech (Int)', 'Weapon Skill (I)'
+          ],
+          errors: {
+            tooMuchXP: 'Too much XP spent!',
+            treeOfLearning: '"Tree of Learning" rule broken (page 26)', // Poprawiono na (page 26)
+            languageChangeWarning: 'Changing the language will reset all data. Are you sure you want to continue?'
+          }
+        }
+      };
+
+      // --- Domyślny język (polski) / Default language (Polish) ---
+      let currentLanguage = 'pl';
+
+      // --- Koszty atrybutów i umiejętności / Attribute and skill costs ---
+      const attributeCosts = {
+        1: 0, 2: 4, 3: 10, 4: 20, 5: 35, 6: 55, 7: 80, 8: 110, 9: 145, 10: 185, 11: 230, 12: 280
+      };
+      const skillCosts = {
+        0: 0, 1: 2, 2: 6, 3: 12, 4: 20, 5: 30, 6: 42, 7: 56, 8: 72
+      };
+
+      // --- Funkcja aktualizująca teksty w wybranym języku / Function to update texts in the selected language ---
@@ -352,9 +355,9 @@
-        document.getElementById('xpRemainingLabel').innerHTML = `${t.labels.remainingXP} <strong id="xpRemaining">100</strong>`;
-        document.getElementById('attributesHeader').innerText = t.labels.attributesHeader;
-        document.getElementById('skillsHeader').innerText = t.labels.skillsHeader;
-        document.getElementById('talentsHeader').innerText = t.labels.talentsHeader;
-        document.getElementById('skillHeader1').innerText = t.labels.skillsTableHeaders[0];
-        document.getElementById('skillHeader2').innerText = t.labels.skillsTableHeaders[1];
-        document.getElementById('skillHeader3').innerText = t.labels.skillsTableHeaders[2];
-        document.getElementById('skillHeader4').innerText = t.labels.skillsTableHeaders[3];
-        document.getElementById('talentHeader1').innerText = t.labels.talentsTableHeaders[0];
+        document.getElementById('xpRemainingLabel').innerHTML = `${t.labels.remainingXP} <strong id="xpRemaining">100</strong>`;
+        document.getElementById('attributesHeader').innerText = t.labels.attributesHeader;
+        document.getElementById('skillsHeader').innerText = t.labels.skillsHeader;
+        document.getElementById('talentsHeader').innerText = t.labels.talentsHeader;
+        document.getElementById('skillHeader1').innerText = t.labels.skillsTableHeaders[0];
+        document.getElementById('skillHeader2').innerText = t.labels.skillsTableHeaders[1];
+        document.getElementById('skillHeader3').innerText = t.labels.skillsTableHeaders[2];
+        document.getElementById('skillHeader4').innerText = t.labels.skillsTableHeaders[3];
+        document.getElementById('talentHeader1').innerText = t.labels.talentsTableHeaders[0];
@@ -366,169 +369,170 @@
-
-        // Aktualizacja etykiet atrybutów / Update attribute labels
-        for (let i = 1; i <= 7; i++) {
-          document.getElementById(`attrLabel${i}`).innerText = t.attributes[i - 1];
-        }
-
-        // Aktualizacja etykiet umiejętności w kolumnie 1 / Update skill labels in column 1
-        for (let i = 1; i <= 9; i++) {
-          document.getElementById(`skillLabelColumn1Row${i}`).innerText = t.skillsColumn1[i - 1];
-        }
-
-        // Aktualizacja etykiet umiejętności w kolumnie 2 / Update skill labels in column 2
-        for (let i = 1; i <= 9; i++) {
-          document.getElementById(`skillLabelColumn2Row${i}`).innerText = t.skillsColumn2[i - 1];
-        }
-      }
-
-      // --- Funkcja resetująca wszystkie pola do wartości domyślnych / Function to reset all fields to default values ---
-      function resetAll() {
-        document.getElementById('xpPool').value = 100;
-        ['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd'].forEach(id => {
-          document.getElementById(`attr_${id}`).value = 1;
-        });
-        for (let i = 1; i <= 9; i++) {
-          document.getElementById(`skill_Column1Row${i}`).value = 0;
-          document.getElementById(`skill_Column2Row${i}`).value = 0;
-        }
-        for (let i = 1; i <= 10; i++) {
-          document.getElementById(`talent_name_${i}`).value = '';
-          document.getElementById(`talent_cost_${i}`).value = 0;
-        }
-        recalcXP();
-      }
-
-      // --- Funkcja przeliczająca zużycie XP / Function to recalculate XP usage ---
-      function recalcXP() {
-        let xpPool = parseInt(document.getElementById('xpPool').value) || 0;
-        let totalAttrCost = 0;
-        const attrIds = ['attr_S', 'attr_Wt', 'attr_Zr', 'attr_I', 'attr_SW', 'attr_Int', 'attr_Ogd'];
-        attrIds.forEach(id => {
-          let inp = document.getElementById(id);
-          let val = parseInt(inp.value) || 1;
-          if (val < 1) val = 1;
-          if (val > 12) val = 12;
-          inp.value = val;
-          totalAttrCost += attributeCosts[val];
-          inp.classList.toggle('attribute-high', val > 8);
-        });
-
-        let totalSkillCost = 0;
-        const skillIds = [];
-        for (let i = 1; i <= 9; i++) {
-          skillIds.push(`skill_Column1Row${i}`);
-          skillIds.push(`skill_Column2Row${i}`);
-        }
-        skillIds.forEach(id => {
-          let inp = document.getElementById(id);
-          let val = parseInt(inp.value) || 0;
-          if (val < 0) val = 0;
-          if (val > 8) val = 8;
-          inp.value = val;
-          totalSkillCost += skillCosts[val];
-        });
-
-        let totalTalentCost = 0;
-        for (let i = 1; i <= 10; i++) {
-          let inp = document.getElementById(`talent_cost_${i}`);
-          let val = parseInt(inp.value) || 0;
-          if (val < 0) val = 0;
-          inp.value = val;
-          totalTalentCost += val;
-        }
-
-        let xpSpent = totalAttrCost + totalSkillCost + totalTalentCost;
-        let xpRemaining = xpPool - xpSpent;
-        document.getElementById('xpRemaining').innerText = xpRemaining;
-
-        // Sprawdzenie przekroczenia puli XP / Check for exceeding XP pool
-        if (xpRemaining < 0) {
-          displayError(translations[currentLanguage].errors.tooMuchXP);
-        } else {
-          // Jeśli XP jest w normie, sprawdzamy "Drzewo Nauki" / If XP is fine, check "Tree of Learning"
-          checkSkillTree();
-        }
-      }
-
-      // --- Funkcja wyświetlająca komunikaty o błędach / Function to display error messages ---
-      function displayError(msg) {
-        document.getElementById('errorMessage').innerText = msg;
-      }
-
-      // --- Funkcja sprawdzająca zasadę "Drzewa Nauki" / Function to check the "Tree of Learning" rule ---
-      function checkSkillTree() {
-        const skillIds = [];
-        for (let i = 1; i <= 9; i++) {
-          skillIds.push(`skill_Column1Row${i}`);
-          skillIds.push(`skill_Column2Row${i}`);
-        }
-
-        // Liczenie aktywnych umiejętności / Counting active skills
-        let totalActiveSkills = 0;
-        skillIds.forEach(id => {
-          let val = parseInt(document.getElementById(id).value) || 0;
-          if (val > 0) totalActiveSkills++;
-        });
-
-        // Sprawdzanie zasady "Drzewa Nauki" / Checking the "Tree of Learning" rule
-        let valid = true;
-        for (let id of skillIds) {
-          let level = parseInt(document.getElementById(id).value) || 0;
-          if (level > 1 && totalActiveSkills < level) {
-            valid = false;
-            break;
-          }
-        }
-
-        // Jeśli XP jest w normie, pokazujemy błąd "Drzewa Nauki" tylko jeśli zasada nie jest spełniona
-        // If XP is fine, show "Tree of Learning" error only if the rule is broken
-        let xpRemaining = parseInt(document.getElementById('xpRemaining').innerText) || 0;
-        if (xpRemaining >= 0) {
-          if (!valid) {
-            displayError(translations[currentLanguage].errors.treeOfLearning);
-          } else {
-            displayError(""); // Kasowanie komunikatu, jeśli wszystko jest poprawne / Clear message if everything is correct
-          }
-        }
-      }
-
-      // --- Funkcja ustawiająca domyślne wartości po utracie fokusu / Function to set default values on blur ---
-      function attachDefaultOnBlur(selector, defaultValue) {
-        document.querySelectorAll(selector).forEach(inp => {
-          inp.addEventListener('blur', () => {
-            if (!inp.value || isNaN(inp.value)) {
-              inp.value = defaultValue;
-              recalcXP();
-            }
-          });
-        });
-      }
-
-      // --- Funkcja dostosowująca rozmiar czcionki w polach talentów / Function to adjust font size in talent fields ---
-      function adjustTalentFontSize(el) {
-        el.style.fontSize = '16px';
-        let fontSize = 16;
-        while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && fontSize > 10) {
-          fontSize -= 1;
-          el.style.fontSize = `${fontSize}px`;
-        }
-      }
-
-      // --- Logika przełącznika języka z ostrzeżeniem / Language switcher logic with warning ---
-      document.getElementById('languageSelect').addEventListener('change', function(e) {
-        const newLang = e.target.value;
-        const confirmed = confirm(translations[currentLanguage].errors.languageChangeWarning);
-        if (confirmed) {
-          updateLanguage(newLang);
-          resetAll();
-        } else {
-          e.target.value = currentLanguage; // Powrót do poprzedniego języka / Revert to previous language
-        }
-      });
-
-      // --- Podpinanie zdarzeń do pól wejściowych / Attaching events to input fields ---
-      document.querySelectorAll('input').forEach(inp => {
-        inp.addEventListener('input', recalcXP);
-        inp.addEventListener('change', recalcXP);
-      });
-
-      // --- Podpinanie zdarzeń do pól tekstowych talentów / Attaching events to talent text fields ---
+        document.getElementById('backToMainButton').innerText = t.labels.backToMainButton;
+
+        // Aktualizacja etykiet atrybutów / Update attribute labels
+        for (let i = 1; i <= 7; i++) {
+          document.getElementById(`attrLabel${i}`).innerText = t.attributes[i - 1];
+        }
+
+        // Aktualizacja etykiet umiejętności w kolumnie 1 / Update skill labels in column 1
+        for (let i = 1; i <= 9; i++) {
+          document.getElementById(`skillLabelColumn1Row${i}`).innerText = t.skillsColumn1[i - 1];
+        }
+
+        // Aktualizacja etykiet umiejętności w kolumnie 2 / Update skill labels in column 2
+        for (let i = 1; i <= 9; i++) {
+          document.getElementById(`skillLabelColumn2Row${i}`).innerText = t.skillsColumn2[i - 1];
+        }
+      }
+
+      // --- Funkcja resetująca wszystkie pola do wartości domyślnych / Function to reset all fields to default values ---
+      function resetAll() {
+        document.getElementById('xpPool').value = 100;
+        ['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd'].forEach(id => {
+          document.getElementById(`attr_${id}`).value = 1;
+        });
+        for (let i = 1; i <= 9; i++) {
+          document.getElementById(`skill_Column1Row${i}`).value = 0;
+          document.getElementById(`skill_Column2Row${i}`).value = 0;
+        }
+        for (let i = 1; i <= 10; i++) {
+          document.getElementById(`talent_name_${i}`).value = '';
+          document.getElementById(`talent_cost_${i}`).value = 0;
+        }
+        recalcXP();
+      }
+
+      // --- Funkcja przeliczająca zużycie XP / Function to recalculate XP usage ---
+      function recalcXP() {
+        let xpPool = parseInt(document.getElementById('xpPool').value) || 0;
+        let totalAttrCost = 0;
+        const attrIds = ['attr_S', 'attr_Wt', 'attr_Zr', 'attr_I', 'attr_SW', 'attr_Int', 'attr_Ogd'];
+        attrIds.forEach(id => {
+          let inp = document.getElementById(id);
+          let val = parseInt(inp.value) || 1;
+          if (val < 1) val = 1;
+          if (val > 12) val = 12;
+          inp.value = val;
+          totalAttrCost += attributeCosts[val];
+          inp.classList.toggle('attribute-high', val > 8);
+        });
+
+        let totalSkillCost = 0;
+        const skillIds = [];
+        for (let i = 1; i <= 9; i++) {
+          skillIds.push(`skill_Column1Row${i}`);
+          skillIds.push(`skill_Column2Row${i}`);
+        }
+        skillIds.forEach(id => {
+          let inp = document.getElementById(id);
+          let val = parseInt(inp.value) || 0;
+          if (val < 0) val = 0;
+          if (val > 8) val = 8;
+          inp.value = val;
+          totalSkillCost += skillCosts[val];
+        });
+
+        let totalTalentCost = 0;
+        for (let i = 1; i <= 10; i++) {
+          let inp = document.getElementById(`talent_cost_${i}`);
+          let val = parseInt(inp.value) || 0;
+          if (val < 0) val = 0;
+          inp.value = val;
+          totalTalentCost += val;
+        }
+
+        let xpSpent = totalAttrCost + totalSkillCost + totalTalentCost;
+        let xpRemaining = xpPool - xpSpent;
+        document.getElementById('xpRemaining').innerText = xpRemaining;
+
+        // Sprawdzenie przekroczenia puli XP / Check for exceeding XP pool
+        if (xpRemaining < 0) {
+          displayError(translations[currentLanguage].errors.tooMuchXP);
+        } else {
+          // Jeśli XP jest w normie, sprawdzamy "Drzewo Nauki" / If XP is fine, check "Tree of Learning"
+          checkSkillTree();
+        }
+      }
+
+      // --- Funkcja wyświetlająca komunikaty o błędach / Function to display error messages ---
+      function displayError(msg) {
+        document.getElementById('errorMessage').innerText = msg;
+      }
+
+      // --- Funkcja sprawdzająca zasadę "Drzewa Nauki" / Function to check the "Tree of Learning" rule ---
+      function checkSkillTree() {
+        const skillIds = [];
+        for (let i = 1; i <= 9; i++) {
+          skillIds.push(`skill_Column1Row${i}`);
+          skillIds.push(`skill_Column2Row${i}`);
+        }
+
+        // Liczenie aktywnych umiejętności / Counting active skills
+        let totalActiveSkills = 0;
+        skillIds.forEach(id => {
+          let val = parseInt(document.getElementById(id).value) || 0;
+          if (val > 0) totalActiveSkills++;
+        });
+
+        // Sprawdzanie zasady "Drzewa Nauki" / Checking the "Tree of Learning" rule
+        let valid = true;
+        for (let id of skillIds) {
+          let level = parseInt(document.getElementById(id).value) || 0;
+          if (level > 1 && totalActiveSkills < level) {
+            valid = false;
+            break;
+          }
+        }
+
+        // Jeśli XP jest w normie, pokazujemy błąd "Drzewa Nauki" tylko jeśli zasada nie jest spełniona
+        // If XP is fine, show "Tree of Learning" error only if the rule is broken
+        let xpRemaining = parseInt(document.getElementById('xpRemaining').innerText) || 0;
+        if (xpRemaining >= 0) {
+          if (!valid) {
+            displayError(translations[currentLanguage].errors.treeOfLearning);
+          } else {
+            displayError(""); // Kasowanie komunikatu, jeśli wszystko jest poprawne / Clear message if everything is correct
+          }
+        }
+      }
+
+      // --- Funkcja ustawiająca domyślne wartości po utracie fokusu / Function to set default values on blur ---
+      function attachDefaultOnBlur(selector, defaultValue) {
+        document.querySelectorAll(selector).forEach(inp => {
+          inp.addEventListener('blur', () => {
+            if (!inp.value || isNaN(inp.value)) {
+              inp.value = defaultValue;
+              recalcXP();
+            }
+          });
+        });
+      }
+
+      // --- Funkcja dostosowująca rozmiar czcionki w polach talentów / Function to adjust font size in talent fields ---
+      function adjustTalentFontSize(el) {
+        el.style.fontSize = '16px';
+        let fontSize = 16;
+        while ((el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) && fontSize > 10) {
+          fontSize -= 1;
+          el.style.fontSize = `${fontSize}px`;
+        }
+      }
+
+      // --- Logika przełącznika języka z ostrzeżeniem / Language switcher logic with warning ---
+      document.getElementById('languageSelect').addEventListener('change', function(e) {
+        const newLang = e.target.value;
+        const confirmed = confirm(translations[currentLanguage].errors.languageChangeWarning);
+        if (confirmed) {
+          updateLanguage(newLang);
+          resetAll();
+        } else {
+          e.target.value = currentLanguage; // Powrót do poprzedniego języka / Revert to previous language
+        }
+      });
+
+      // --- Podpinanie zdarzeń do pól wejściowych / Attaching events to input fields ---
+      document.querySelectorAll('input').forEach(inp => {
+        inp.addEventListener('input', recalcXP);
+        inp.addEventListener('change', recalcXP);
+      });
+
+      // --- Podpinanie zdarzeń do pól tekstowych talentów / Attaching events to talent text fields ---
@@ -543,13 +547,17 @@
-
-      // --- Inicjalizacja domyślnych wartości / Initialization of default values ---
-      attachDefaultOnBlur('#xpPool', 100);
-      attachDefaultOnBlur("input[id^='attr_']", 1);
-      attachDefaultOnBlur("input[id^='skill_Column']", 0);
-      attachDefaultOnBlur("input[id^='talent_cost_']", 0);
-
-      // --- Inicjalna konfiguracja / Initial setup ---
-      updateLanguage(currentLanguage);
-      recalcXP();
-    });
-  </script>
-</body>
+
+      document.getElementById('backToMainButton').addEventListener('click', () => {
+        window.location.href = '../Main/index.html';
+      });
+
+      // --- Inicjalizacja domyślnych wartości / Initialization of default values ---
+      attachDefaultOnBlur('#xpPool', 100);
+      attachDefaultOnBlur("input[id^='attr_']", 1);
+      attachDefaultOnBlur("input[id^='skill_Column']", 0);
+      attachDefaultOnBlur("input[id^='talent_cost_']", 0);
+
+      // --- Inicjalna konfiguracja / Initial setup ---
+      updateLanguage(currentLanguage);
+      recalcXP();
+    });
+  </script>
+</body>
diff --git a/Kalkulator/docs/Documentation.md b/Kalkulator/docs/Documentation.md
index afa9d42..cd57e79 100644
--- a/Kalkulator/docs/Documentation.md
+++ b/Kalkulator/docs/Documentation.md
@@ -99,0 +100 @@ W `TworzeniePostaci.html` skrypt dodaje klasę `attribute-high` dla wartości at
+- W `div.actions` dodano link-przycisk `#btnMainPage` (`<a class="btn secondary" href="../Main/index.html">`). Etykieta jest tłumaczona dynamicznie: `Strona Główna` (PL) / `Main Page` (EN).
@@ -145,0 +147 @@ const skillCosts = {
+- W `.language-switcher` dodano przycisk `#backToMainButton`, który prowadzi do `../Main/index.html` i jest tłumaczony w `translations.labels.backToMainButton`.
@@ -185,0 +188 @@ const skillCosts = {
+   - Ustawia etykietę przycisku `#btnMainPage` na `Strona Główna` (PL) lub `Main Page` (EN).
@@ -269,0 +273,4 @@ const skillCosts = {
+
+5.5. **Nawigacja do modułu Main**
+   - `#backToMainButton` ma nasłuchiwacz `click`, który wykonuje `window.location.href = "../Main/index.html"`.
+
diff --git a/Kalkulator/docs/README.md b/Kalkulator/docs/README.md
index fd01c78..0eae327 100644
--- a/Kalkulator/docs/README.md
+++ b/Kalkulator/docs/README.md
@@ -18,0 +19 @@ Ten projekt to zestaw statycznych stron HTML do planowania rozwoju postaci w sys
+1.5. Obok przycisku resetu jest teraz przycisk **Strona Główna / Main Page**, który przenosi do `../Main/index.html`.
@@ -26,0 +28 @@ Ten projekt to zestaw statycznych stron HTML do planowania rozwoju postaci w sys
+7. W prawym górnym rogu dodano przycisk **Strona Główna / Main Page** prowadzący do `../Main/index.html`.
@@ -93,0 +96 @@ Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games
+1.5. Next to reset there is now a **Strona Główna / Main Page** button that navigates to `../Main/index.html`.
@@ -101,0 +105 @@ Warhammer 40,000 oraz powiązane nazwy i znaki towarowe są własnością Games
+7. The top-right area now includes a **Strona Główna / Main Page** button that opens `../Main/index.html`.
diff --git a/Kalkulator/kalkulatorxp.css b/Kalkulator/kalkulatorxp.css
index b770d67..abd8d27 100644
--- a/Kalkulator/kalkulatorxp.css
+++ b/Kalkulator/kalkulatorxp.css
@@ -84,0 +85,4 @@ body{
+  text-decoration:none;
+  display:inline-flex;
+  align-items:center;
+  justify-content:center;
```
