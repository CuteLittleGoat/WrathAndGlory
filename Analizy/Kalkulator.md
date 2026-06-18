# Analiza modułu Kalkulator — Tworzenie Postaci i eksport PDF

Data przygotowania: 2026-06-18

Dokument zbiera aktualne ustalenia dotyczące rozbudowy pliku `Kalkulator/TworzeniePostaci.html` o modal **Cechy i zasady specjalne** oraz funkcję **Eksportuj PDF**.

Zakres tego dokumentu wynika z rozmowy projektowej i ma służyć jako specyfikacja robocza przed implementacją.

---

## 1. Istniejący kontekst modułu

W repozytorium istnieje moduł:

```text
Kalkulator/TworzeniePostaci.html
```

Aktualny plik jest samodzielnym widokiem tworzenia postaci. Zawiera między innymi:

- pulę PD,
- tabelę atrybutów,
- tabelę umiejętności,
- sekcję talentów / kosztów / innych wpisów,
- logikę przeliczania PD,
- zapis i wczytywanie danych,
- istniejący modal limitów gatunkowych,
- istniejący modal potwierdzający.

Nowe prace mają **rozbudować istniejący kalkulator**, a nie zastąpić go nową stroną.

Docelowy układ główny:

```text
Kalkulator/TworzeniePostaci.html
│
├─ istniejąca zawartość kalkulatora
│  ├─ pula PD
│  ├─ atrybuty
│  ├─ umiejętności
│  ├─ talenty / koszty / inne istniejące sekcje
│  └─ dwa nowe przyciski:
│     [Cechy i zasady specjalne] [Eksportuj PDF]
│
└─ ukryty modal: Cechy i zasady specjalne
   ├─ tytuł
   ├─ X w prawym górnym rogu
   ├─ tabela: Dane postaci do obliczeń i eksportu
   ├─ tabela: Cechy obliczalne
   ├─ tabela zasad:
   │  Typ / źródło | Nazwa | Modyfikuje | Wartość
   └─ [Dodaj zasadę] [Usuń zasadę]
```

Najważniejsze: przygotowywane wizualizacje i późniejsza implementacja dotyczą **jednego nowego modala**, a nie osobnej strony ani modala w modalu.

---

## 2. Styl i dopasowanie wizualne

Nowy modal musi stylistycznie pasować do istniejącego modułu `Kalkulator`.

Źródłem prawdy dla kolorów i stylu jest plik:

```text
DetaleLayout.md
```

Zgodnie z dokumentacją modułu Kalkulator:

```css
--bg: #031605;
--panel: #000;
--panel2: #000;
--text: #9cf09c;
--text2: #4FAF4F;
--muted: #4a8b4a;
--code: #D2FAD2;
--red: #d74b4b;
--border: #16c60c;
--accent: #16c60c;
--accent-dark: #0d7a07;
--b: rgba(22,198,12,.35);
--b2: rgba(22,198,12,.2);
--div: rgba(22,198,12,.18);
--hbg: rgba(22,198,12,.06);
--zebra: rgba(22,198,12,.04);
--hover: rgba(22,198,12,.08);
--glow: 0 0 25px rgba(22, 198, 12, 0.45);
--glowH: 0 0 18px rgba(22, 198, 12, 0.35);
```

Nowy modal powinien używać tych samych zmiennych CSS. Nie należy wprowadzać jasnego, białego stylu podglądowego.

Istniejący `TworzeniePostaci.html` ma już styl modali w konwencji:

```css
.species-max-modal{
  position:fixed;
  inset:0;
  display:none;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:rgba(0,0,0,.75);
  z-index:1000;
}
.species-max-modal.is-open{display:flex;}
.species-max-modal__dialog{
  width:min(1100px, 96vw);
  max-height:88vh;
  background:var(--panel);
  border:1px solid var(--b);
  border-radius:10px;
  box-shadow:var(--glow);
  padding:14px;
  overflow:auto;
}
```

Nowy modal powinien albo użyć analogicznej struktury klas, albo nowych klas zachowujących identyczny styl.

Zalecane nazwy klas dla nowego modala:

```css
.character-rules-modal
.character-rules-modal.is-open
.character-rules-modal__dialog
.character-rules-modal__header
.character-rules-modal__close
.character-rules-modal__table-wrap
```

Przycisk `X` ma być w prawym górnym rogu okna modala.

---

## 3. Dwa nowe przyciski na głównej stronie

Do istniejącej strony `TworzeniePostaci.html` należy dodać dwa przyciski:

```text
[Cechy i zasady specjalne] [Eksportuj PDF]
```

Ich miejsce: na głównej stronie kalkulatora, po istniejących sekcjach. Przyciski nie są częścią modala.

Przycisk **Cechy i zasady specjalne**:

- otwiera nowy modal,
- nie eksportuje PDF,
- nie zapisuje sam z siebie danych do Firebase.

Przycisk **Eksportuj PDF**:

- pozostaje na głównej stronie kalkulatora,
- przygotowuje PDF na podstawie danych z kalkulatora i danych zapisanych w stanie modala,
- nie powinien znajdować się wewnątrz modala.

Szkic HTML:

```html
<div class="data-actions character-creation-actions">
  <button type="button" id="openCharacterRulesModalButton">Cechy i zasady specjalne</button>
  <button type="button" id="exportCharacterPdfButton">Eksportuj PDF</button>
</div>
```

---

## 4. Rola nowego modala

Modal **Cechy i zasady specjalne** służy do początkowych obliczeń postaci oraz przygotowania danych do PDF-a.

Wygenerowany PDF nie jest docelową kartą do gry przy stole. Służy jako pomoc do początkowych obliczeń. Gracz może potem przepisać wartości na właściwą kartę postaci.

Mimo tego PDF nadal powinien zawierać odpowiednie informacje w odpowiednich miejscach. Dane opisowe mają być brane z pola **Nazwa** w tabeli zasad.

Modal zawiera trzy sekcje:

1. **Dane postaci do obliczeń i eksportu**
2. **Cechy obliczalne**
3. **Cechy i zasady specjalne**

---

## 5. Tabela: Dane postaci do obliczeń i eksportu

Ta tabela ma znajdować się w modalu.

Pola, które zostają:

- Poziom Gry,
- Gatunek,
- Rozmiar,
- Frakcja,
- Archetyp,
- Słowa Kluczowe.

Pola, z których rezygnujemy:

- Imię gracza,
- Imię postaci,
- Ranga.

Uzasadnienie:

- Ranga nie wpływa na obliczenia i zmienia się w trakcie gry.
- Imię gracza i imię postaci nie są potrzebne w tym module obliczeniowym.

Szkic HTML:

```html
<h3 class="section-title">Dane postaci do obliczeń i eksportu</h3>

<table class="table character-details-table">
  <tr>
    <th>Poziom Gry</th>
    <th>Gatunek</th>
    <th>Rozmiar</th>
  </tr>
  <tr>
    <td>
      <input id="gameTier" type="number" min="1" max="5" step="1" value="1" data-save-key="character.gameTier">
    </td>
    <td>
      <textarea id="speciesName" data-save-key="character.speciesName" data-pdf-key="species" placeholder="np. Człowiek, Adeptus Astartes, Kroot, gatunek homebrew..."></textarea>
    </td>
    <td>
      <select id="characterSize" data-save-key="character.size">
        <option value="tiny" data-defense-mod="2">Malutki (+2 Obrona)</option>
        <option value="small" data-defense-mod="1">Mały (+1 Obrona)</option>
        <option value="medium" data-defense-mod="0" selected>Średni</option>
        <option value="large" data-defense-mod="0">Duży</option>
        <option value="huge" data-defense-mod="0">Wielki</option>
        <option value="massive" data-defense-mod="0">Masywny</option>
        <option value="monstrous" data-defense-mod="0">Monstrualny</option>
      </select>
    </td>
  </tr>
  <tr>
    <th>Frakcja</th>
    <th>Archetyp</th>
    <th>Słowa Kluczowe</th>
  </tr>
  <tr>
    <td><textarea id="factionName" data-save-key="character.factionName" data-pdf-key="faction"></textarea></td>
    <td><textarea id="archetypeName" data-save-key="character.archetypeName" data-pdf-key="archetype"></textarea></td>
    <td><textarea id="keywords" data-save-key="character.keywords" data-pdf-key="keywords"></textarea></td>
  </tr>
</table>
```

---

## 6. Poziom Gry i pula PD

**Poziom Gry** jest liczbą całkowitą od 1 do 5.

Poziom Gry nie ustawia automatycznie startowej puli PD.

Pula PD pozostaje osobną wartością w istniejącym kalkulatorze. MG może przyznać niestandardową liczbę PD. Gracz sam ustawia pulę PD według instrukcji lub decyzji MG.

Poziom Gry służy do obliczeń takich jak:

- Żywotność maksymalna,
- Odporność Psychiczna,
- Majątek.

---

## 7. Rozmiar

Pole **Rozmiar** jest dropdownem.

Domyślny rozmiar: **Średni**.

Wpływ na obliczenia:

- Malutki: +2 do Obrony,
- Mały: +1 do Obrony,
- pozostałe rozmiary: 0 do Obrony.

Nie należy hardkodować gatunków ani automatycznie wiązać gatunku z rozmiarem. Kalkulator ma być homebrew friendly.

Gatunek wpisywany jest ręcznie i może być oficjalny albo homebrew.

---

## 8. Tabela: Cechy obliczalne

Ta tabela ma znajdować się w modalu.

Docelowe cechy obliczalne:

| Cecha | Wzór bazowy | Minimum |
|---|---|---:|
| Żywotność maksymalna | Wt + (2 × Poziom Gry) + bonusy | 1 |
| Odporność Psychiczna | SW + Poziom Gry + bonusy | 1 |
| Determinacja | Wt + bonusy | 1 |
| Obrona | I - 1 + modyfikator Rozmiaru + bonusy | 1 |
| Odporność | Wt + 1 + bonusy | 1 |
| Upór | SW + bonusy | 1 |
| Odwaga | SW - 1 + bonusy | 1 |
| Wpływy | wybrany atrybut bazowy - 1 + bonusy | 1 |
| Majątek | Poziom Gry + bonusy | 1 |
| Spaczenie | wartość ręczna + bonusy | 0 |

Ważne nazewnictwo:

- Nie używać nazwy **Maks. Trauma**.
- Wystarczy **Odporność Psychiczna**.
- Nie stosować `Odporność bazowa`, `Odporność suma`, `WP Pancerza` jako osobnych cech obliczalnych.
- W kalkulatorze zostaje po prostu **Odporność**.

Uzasadnienie dla pancerza:

- WP / Wartość Pancerza zależy od ekwipunku.
- Nie powinno być obliczane w tym modalu.
- `Odporność suma` jest zbędna.
- Jeśli PDF ma pole `Bazowa`, to nasza **Odporność** może zostać wpisana właśnie tam.

Zaokrąglanie i minimum:

- Wszystkie wartości ułamkowe zaokrąglać w górę.
- Wszystkie cechy poza Spaczeniem mają minimum 1.
- Spaczenie może wynosić 0.

Przykładowa funkcja pomocnicza:

```js
function minOne(value) {
  return Math.max(1, Math.ceil(Number(value) || 0));
}

function minZero(value) {
  return Math.max(0, Math.ceil(Number(value) || 0));
}
```

---

## 9. Wpływy

Wpływy normalnie bazują na Ogładzie:

```text
Wpływy = Ogłada - 1 + bonusy
```

Jednak w systemie istnieją wyjątki, np. sytuacje, w których inny atrybut może być używany do testów Wpływów. Część wyjątków dotyczy tylko testów w trakcie gry i nie powinna automatycznie zmieniać wartości startowej.

Ustalony kompromis:

- w modalu zostaje dropdown **Atrybut bazowy Wpływów**,
- domyślnie: **Ogłada - 1**,
- pozostałe opcje: Siła, Wytrzymałość, Zręczność, Inicjatywa, Siła Woli, Inteligencja — każda jako `atrybut - 1`,
- użytkownik zmienia podstawę tylko wtedy, gdy zasada gatunku, frakcji, słowa kluczowego albo homebrew zmienia stałą podstawę Wpływów.

Szkic:

```html
<select id="influenceAttribute" data-save-key="derived.influenceAttribute">
  <option value="attr_ogd" selected>Ogłada - 1</option>
  <option value="attr_s">Siła - 1</option>
  <option value="attr_wt">Wytrzymałość - 1</option>
  <option value="attr_zr">Zręczność - 1</option>
  <option value="attr_i">Inicjatywa - 1</option>
  <option value="attr_sw">Siła Woli - 1</option>
  <option value="attr_int">Inteligencja - 1</option>
</select>
```

---

## 10. Majątek i Wpływy w PDF

Na wcześniejszym etapie rozważano drukowanie `start: X`, ponieważ Majątek i Wpływy mogą zmieniać się w trakcie gry.

Aktualna koncepcja zmieniła się:

- wygenerowana karta PDF nie jest docelową kartą do gry,
- gracz przepisze wartości na swoją kartę,
- kalkulator i PDF służą do początkowych obliczeń.

W związku z tym eksport PDF może wpisywać obliczone wartości startowe, bez specjalnej logiki `start: X`, chyba że później użytkownik wróci do pomysłu drukowania karty.

---

## 11. Tabela: Cechy i zasady specjalne

Ta tabela znajduje się w modalu pod tabelą Cechy obliczalne.

Kolumny:

```text
Typ / źródło | Nazwa | Modyfikuje | Wartość
```

Usunięte kolumny:

- Aktywne,
- Eksportuj do,
- Opis na kartę.

Uzasadnienie:

- Wszystkie istniejące wiersze są aktywne.
- Jeśli cecha ma być nieaktywna, gracz ją usuwa.
- Miejsce eksportu wynika z typu wpisu.
- Dane opisowe do PDF mają być brane z pola **Nazwa**, nie z osobnego pola **Opis na kartę**.

W wizualizacjach tabela ma pokazywać 5 wierszy startowych.

Przyciski pod tabelą:

```text
[Dodaj zasadę] [Usuń zasadę]
```

Nie stosować przycisku **Usuń puste wiersze**.

---

## 12. Typy / źródła zasad

Aktualny zestaw wartości dla pola **Typ / źródło**:

1. **Zdolności Gatunkowe**
2. **Zdolność Archetypu**
3. **Premia z przeszłości**
4. **Bonusy Słów Kluczowych**
5. **Specjalne Bonusy Frakcji**
6. **Inne**

Konfiguracja typów:

```js
const ruleTypeConfig = {
  speciesAbility: {
    label: "Zdolności Gatunkowe",
    placeholder: "np. Honor Zakonu, Orczy, Łasuch, Intensywne emocje",
    allowModifier: true,
    exportTarget: "notes"
  },
  archetypeAbility: {
    label: "Zdolność Archetypu",
    placeholder: "np. Oddane współczucie, Płomienna zachęta, Na ziemię!",
    allowModifier: false,
    exportTarget: "notes"
  },
  backgroundBonus: {
    label: "Premia z przeszłości",
    placeholder: "np. +1 do Żywotności, Słowo Kluczowe [DOWOLNE]",
    allowModifier: true,
    exportTarget: "background"
  },
  keywordBonus: {
    label: "Bonusy Słów Kluczowych",
    placeholder: "np. Stalowy Legion Armageddonu, Ordo Hereticus, Zakon Uświęconej Tarczy",
    allowModifier: true,
    exportTarget: "notes"
  },
  specialFactionBonus: {
    label: "Specjalne Bonusy Frakcji",
    placeholder: "np. Ścieżki Asuryani (Ścieżka przebudzenia), Mutacja Krootów (Ludojad)",
    allowModifier: true,
    exportTarget: "notes"
  },
  other: {
    label: "Inne",
    placeholder: "np. Zakony Pierwszego Powołania, Homebrew",
    allowModifier: true,
    exportTarget: "notes"
  }
};
```

Dodatkowe ustalenie:

- `Premia z przeszłości` może być opisowa albo modyfikować cechę.
- `Premia z przeszłości` eksportuje tekst z pola **Nazwa** do pola **Przeszłość**.
- Pozostałe typy eksportują tekst z pola **Nazwa** do **Notatek**, chyba że później ustalimy inne zachowanie dla `Specjalne Bonusy Frakcji`.
- `Zdolność Archetypu` jest tylko opisowa: `Modyfikuje = Brak — tylko opis`, `Wartość = 0`, oba pola zablokowane.

---

## 13. Dynamiczne zachowanie wierszy zasad

Zmiana pola **Typ / źródło** w danym wierszu ma automatycznie zmieniać:

- placeholder w polu **Nazwa**,
- dostępność pola **Modyfikuje**,
- dostępność pola **Wartość**.

Dla `Zdolność Archetypu`:

- `Modyfikuje` ustawia się na `Brak — tylko opis`,
- `Modyfikuje` zostaje zablokowane,
- `Wartość` ustawia się na `0`,
- `Wartość` zostaje zablokowana.

Szkic:

```js
function updateRuleRowByType(row) {
  const typeSelect = row.querySelector(".special-rule-type");
  const nameField = row.querySelector(".special-rule-name");
  const targetSelect = row.querySelector(".special-rule-target");
  const valueInput = row.querySelector(".special-rule-value");

  const config = ruleTypeConfig[typeSelect.value] || ruleTypeConfig.speciesAbility;

  nameField.placeholder = config.placeholder;

  if (!config.allowModifier) {
    targetSelect.value = "none";
    targetSelect.disabled = true;
    valueInput.value = 0;
    valueInput.disabled = true;
  } else {
    targetSelect.disabled = false;
    valueInput.disabled = false;
  }

  recalcSpecialRuleBonuses();
}
```

---

## 14. Lista pól w kolumnie Modyfikuje

Aktualny zestaw opcji:

```html
<option value="none" selected>Brak — tylko opis</option>
<option value="wounds">Żywotność</option>
<option value="shock">Odporność Psychiczna</option>
<option value="determination">Determinacja</option>
<option value="defence">Obrona</option>
<option value="resilience">Odporność</option>
<option value="resolve">Upór</option>
<option value="conviction">Odwaga</option>
<option value="speed">Szybkość</option>
<option value="influence">Wpływy</option>
<option value="wealth">Majątek</option>
<option value="corruption">Spaczenie</option>
```

Usunięte / nieużywane jako cele:

- WP Pancerza,
- Odporność bazowa,
- Odporność suma.

---

## 15. Stan modala, zamykanie i zapis

Modal ma być częścią formularza kalkulatora, a nie osobną tymczasową pamięcią.

Zasady:

- zamknięcie modala przez `X` zapisuje dane z modala do pamięci kalkulatora,
- dane nie znikają po zamknięciu modala,
- ponowne otwarcie pokazuje te same dane,
- kasowanie z pamięci następuje dopiero po odświeżeniu strony / aplikacji, o ile dane nie zostały zapisane przyciskiem Zapisz,
- istniejące przyciski `Zapisz / Wczytaj` muszą obejmować dane z modala,
- wartości z modala wpływają na obliczenia również po zamknięciu modala.

Szkic stanu:

```js
const calculatorState = {
  character: {},
  derived: {},
  specialRules: []
};
```

Szkic zamykania:

```js
function closeCharacterRulesModal() {
  calculatorState.character = collectCharacterDetailsFromModal();
  calculatorState.derived = collectDerivedSettingsFromModal();
  calculatorState.specialRules = collectSpecialRulesFromModal();

  recalcDerivedStats();

  characterRulesModal.classList.remove("is-open");
  characterRulesModal.setAttribute("aria-hidden", "true");
}
```

---

## 16. Zapis / Wczytaj

Istniejąca funkcja zapisu/wczytywania musi zostać rozszerzona.

Do zapisu muszą trafić:

- `character.gameTier`,
- `character.speciesName`,
- `character.size`,
- `character.factionName`,
- `character.archetypeName`,
- `character.keywords`,
- `derived.influenceAttribute`,
- `derived.corruptionBase`,
- `specialRules[]`,
- dynamiczne wiersze zasad,
- dynamiczne wiersze talentów, jeśli później zostaną przerobione.

Szkic struktury zapisu:

```js
const payload = {
  version: 2,
  language: currentLang,
  xpPool,
  attributes,
  skills,
  talents,
  character: {
    gameTier,
    speciesName,
    size,
    factionName,
    archetypeName,
    keywords
  },
  derived: {
    influenceAttribute,
    corruptionBase
  },
  specialRules: [
    {
      type: "speciesAbility",
      name: "Honor Zakonu",
      target: "conviction",
      value: 1
    }
  ]
};
```

Przy wczytywaniu starszych zapisów należy przyjąć bezpieczne wartości domyślne.

---

## 17. Sekcja talentów

Wizualizacje nowego modala nie mają pokazywać istniejącej sekcji talentów.

Oddzielne ustalenia dotyczące przyszłej przebudowy sekcji talentów:

- obecne 10 wierszy × 2 wpisy należy kiedyś zmienić na 1 wiersz × 2 wpisy startowo,
- dodać przyciski `Dodaj wiersz` i `Usuń wiersz`,
- `Usuń wiersz` ma być aktywny tylko wtedy, gdy istnieje więcej niż jeden zajęty/dodany wiersz,
- dynamiczne wiersze talentów muszą integrować się z PD, zapisem/wczytaniem i eksportem PDF.

To nie jest zakres bieżącego modala.

---

## 18. Eksport PDF — założenia ogólne

W folderze repozytorium istnieją edytowalne PDF-y:

```text
Kalkulator/pdf/
```

Jeden plik dla języka polskiego i jeden dla angielskiego.

Z poziomu `Kalkulator/TworzeniePostaci.html` ścieżki powinny być względne:

```js
"./pdf/nazwa-pliku-polskiego.pdf"
"./pdf/nazwa-pliku-angielskiego.pdf"
```

Do implementacji trzeba ustalić dokładne nazwy plików.

Eksport PDF powinien:

- wybrać profil na podstawie języka UI albo osobnego ustawienia eksportu,
- pobrać właściwy PDF przez `fetch`,
- wypełnić pola formularza,
- wygenerować plik do pobrania.

Nie należy hardkodować mapowania pozycyjnego. Trzeba mapować po logicznych kluczach i profilach PDF.

---

## 19. Eksport PDF — profile językowe

Ponieważ układ polskiej i angielskiej karty postaci różni się, szczególnie w sekcji umiejętności, trzeba zastosować profile PDF.

Szkic:

```js
const pdfProfiles = {
  pl: {
    templatePath: "./pdf/karta-postaci-pl.pdf",
    fields: {
      species: "...",
      faction: "...",
      archetype: "...",
      keywords: "...",
      woundsMax: "...",
      shock: "...",
      determination: "...",
      defence: "...",
      resilience: "...",
      resolve: "...",
      conviction: "...",
      influence: "...",
      wealth: "...",
      corruption: "...",
      notes: "...",
      background: "..."
    }
  },
  en: {
    templatePath: "./pdf/character-sheet-en.pdf",
    fields: {
      species: "...",
      size: "...",
      faction: "...",
      archetype: "...",
      keywords: "...",
      woundsMax: "...",
      shock: "...",
      determination: "...",
      defence: "...",
      resilience: "...",
      resolve: "...",
      conviction: "...",
      influence: "...",
      wealth: "...",
      corruption: "...",
      notes: "...",
      background: "..."
    }
  }
};
```

Wymagane zadanie techniczne:

- odczytać rzeczywiste nazwy pól formularza z obu PDF-ów,
- zbudować mapowanie `data-pdf-key -> fieldName`,
- osobno przetestować eksport PL i EN.

---

## 20. Eksport PDF — które pola uzupełniać

Ustalenia z rozmowy:

- Żywotność: uzupełniać pole opisane jako **MAKSYMALNA**.
- Bieżące pole Żywotności ma pozostać puste, jeśli PDF miałby być używany jako karta do gry; przy aktualnej koncepcji PDF służy głównie do obliczeń, ale warto zachować logikę rozróżnienia pól.
- Trauma: nie używać w UI nazwy `Maks. Trauma`; uzupełniać **Odporność Psychiczna** i **Determinacja**.
- Przetrwanie: uzupełniać **Obrona** i **Odporność** / pole bazowe odporności, jeśli taki jest układ PDF.
- Pancerz i Suma nie są obliczane przez modal.
- Wpływy i Majątek eksportować jako wartości obliczone, chyba że później wróci decyzja o formacie `start: X`.

Teksty z tabeli zasad:

- `Premia z przeszłości` -> tekst z pola **Nazwa** trafia do pola **Przeszłość**.
- `Zdolności Gatunkowe`, `Zdolność Archetypu`, `Bonusy Słów Kluczowych`, `Specjalne Bonusy Frakcji`, `Inne` -> tekst z pola **Nazwa** trafia do **Notatek**, chyba że zostanie ustalone inaczej.

Przykład agregacji:

```js
function buildExportTextBuckets(specialRules) {
  const buckets = {
    notes: [],
    background: []
  };

  specialRules.forEach((rule) => {
    const config = ruleTypeConfig[rule.type];
    const text = String(rule.name || "").trim();

    if (!text || !config) return;

    if (config.exportTarget === "background") {
      buckets.background.push(text);
    } else {
      buckets.notes.push(text);
    }
  });

  return {
    notes: buckets.notes.join("\n"),
    background: buckets.background.join("\n")
  };
}
```

---

## 21. Brak integracji z DataVault jako źródłem danych

Kalkulator `TworzeniePostaci.html` ma pozostać czysty i manualny.

Nie należy robić z niego prowadzonego kreatora w stylu Doctors of Doom.

Nie pobierać automatycznie list:

- gatunków,
- archetypów,
- frakcji,
- słów kluczowych,
- premii frakcji,
- specjalnych bonusów.

DataVault może być źródłem referencyjnym dla gracza, ale użytkownik ręcznie wpisuje dane do kalkulatora.

Kalkulator ma być homebrew friendly.

---

## 22. Biblioteka do PDF

Do eksportu PDF po stronie przeglądarki najwygodniejsza będzie biblioteka `pdf-lib`.

Opcje:

1. Lokalny plik JS w repo, np.:

```text
Kalkulator/vendor/pdf-lib.min.js
```

2. CDN, jeśli projekt dopuszcza zależności zewnętrzne.

Bezpieczniejszy wariant dla działania offline / lokalnego to lokalny plik vendor.

Szkic użycia:

```js
async function exportCharacterPdf() {
  const profile = pdfProfiles[currentLang] || pdfProfiles.pl;

  const existingPdfBytes = await fetch(profile.templatePath).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  const data = buildPdfDataFromCalculator();

  Object.entries(profile.fields).forEach(([key, fieldName]) => {
    if (!fieldName) return;
    const value = data[key];
    if (value === undefined || value === null) return;

    try {
      form.getTextField(fieldName).setText(String(value));
    } catch (error) {
      console.warn("Brak pola PDF:", key, fieldName, error);
    }
  });

  const pdfBytes = await pdfDoc.save();
  downloadBlob(pdfBytes, "karta-postaci.pdf", "application/pdf");
}
```

---

## 23. Ważne ograniczenia i ryzyka

1. **Nazwy pól PDF**
   - Bez rzeczywistych nazw pól w PDF nie da się poprawnie dokończyć mapowania.
   - Trzeba przygotować narzędzie / skrypt do wypisania pól formularza.

2. **Różnice PL/EN**
   - Nie wolno zakładać, że pola są w tej samej kolejności.
   - Umiejętności szczególnie różnią się układem między wersjami językowymi.

3. **Zapis / wczytywanie**
   - Największe ryzyko regresji to pominięcie danych z modala w zapisie.
   - Zamknięcie modala musi synchronizować stan.

4. **Styl**
   - Nowy modal nie może wyglądać jak osobna biała strona testowa.
   - Musi używać zmiennych CSS z modułu Kalkulator.

5. **Nie modyfikować mechaniki PD przez przypadek**
   - Poziom Gry nie może automatycznie nadpisywać puli PD.

6. **Pancerz**
   - Nie obliczać WP Pancerza.
   - Nie obliczać Odporność suma.

---

## 24. Proponowane etapy prac

### Etap 1 — Przygotowanie struktury UI

- Dodać dwa przyciski na głównej stronie:
  - `Cechy i zasady specjalne`,
  - `Eksportuj PDF`.
- Dodać ukryty modal `Cechy i zasady specjalne`.
- Użyć stylu zgodnego z istniejącymi modalami.
- W modalu umieścić trzy tabele:
  - Dane postaci do obliczeń i eksportu,
  - Cechy obliczalne,
  - Cechy i zasady specjalne.

### Etap 2 — Stan modala i dynamiczne wiersze

- Dodać `calculatorState.character`, `calculatorState.derived`, `calculatorState.specialRules`.
- Obsłużyć otwieranie i zamykanie modala.
- Zamknięcie modala ma synchronizować dane.
- Dodać `Dodaj zasadę` i `Usuń zasadę`.
- Przy zmianie `Typ / źródło` aktualizować placeholder i blokady pól.

### Etap 3 — Obliczenia

- Podpiąć dane z istniejących atrybutów do cech obliczalnych.
- Podpiąć bonusy z tabeli zasad specjalnych.
- Dodać zaokrąglanie w górę i minimum 1 / 0.
- Dodać obsługę rozmiaru dla Obrony.
- Dodać dropdown podstawy Wpływów.

### Etap 4 — Zapis / Wczytaj

- Rozszerzyć istniejący payload zapisu.
- Dodać wczytywanie danych z modala.
- Zachować kompatybilność ze starszymi zapisami.
- Przetestować zapis po zamknięciu i ponownym otwarciu modala.

### Etap 5 — Przygotowanie PDF

- Ustalić dokładne nazwy plików w `Kalkulator/pdf`.
- Dodać lokalną bibliotekę `pdf-lib` albo zdecydować o CDN.
- Odczytać nazwy pól formularza z PL i EN PDF.
- Zbudować `pdfProfiles.pl` i `pdfProfiles.en`.

### Etap 6 — Eksport PDF

- Zbudować `buildPdfDataFromCalculator()`.
- Zbudować agregację tekstów do `notes` i `background`.
- Wypełnić pola PDF.
- Dodać pobieranie pliku.
- Przetestować PL i EN.

### Etap 7 — Porządkowanie i testy regresji

- Sprawdzić, czy PD dalej liczy się poprawnie.
- Sprawdzić, czy obecna sekcja talentów działa bez zmian.
- Sprawdzić zapis/wczytanie.
- Sprawdzić responsywność modala.
- Sprawdzić brak błędów w konsoli.

---

## 25. Minimalny szkielet modala

```html
<div id="characterRulesModal" class="character-rules-modal" aria-hidden="true">
  <div class="character-rules-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="characterRulesModalTitle">
    <div class="character-rules-modal__header">
      <h2 id="characterRulesModalTitle">Cechy i zasady specjalne</h2>
      <button type="button" id="closeCharacterRulesModalButton" class="character-rules-modal__close" aria-label="Zamknij">×</button>
    </div>

    <h3 class="section-title">Dane postaci do obliczeń i eksportu</h3>
    <!-- tabela character-details-table -->

    <h3 class="section-title">Cechy obliczalne</h3>
    <!-- tabela derived-stats-table -->

    <h3 class="section-title">Cechy i zasady specjalne</h3>
    <!-- tabela special-rules-table -->

    <div class="data-actions special-rules-actions">
      <button type="button" id="addSpecialRuleButton">Dodaj zasadę</button>
      <button type="button" id="removeSpecialRuleButton">Usuń zasadę</button>
    </div>
  </div>
</div>
```

---

## 26. Decyzje zamknięte

- Nowy modal jest jeden.
- Dwa nowe przyciski są na głównej stronie, nie w modalu.
- W modalu są nowe tabele i obliczenia.
- Nie dodawać Imienia gracza ani Imienia postaci.
- Nie dodawać Rangi.
- Nie używać `Maks. Trauma`.
- Nie liczyć WP Pancerza.
- Nie liczyć Odporność suma.
- Nie dodawać pola `Opis na kartę`.
- Nie dodawać pola `Eksportuj do`.
- Nie dodawać kolumny `Aktywne`.
- Nie dodawać przycisku `Usuń puste wiersze`.
- Źródłem opisu do PDF jest pole `Nazwa`.
- `Premia z przeszłości` trafia do `Przeszłość`.
- Pozostałe wpisy trafiają do `Notatek`, chyba że później zostanie ustalone inaczej.
- Kalkulator nie ma pobierać danych z DataVault.
- PDF-y są w `Kalkulator/pdf`.

---

## 27. Otwarte kwestie techniczne

- Dokładne nazwy plików PDF w `Kalkulator/pdf`.
- Rzeczywiste nazwy pól formularza PDF dla PL i EN.
- Decyzja: lokalny `pdf-lib.min.js` czy CDN.
- Czy `Specjalne Bonusy Frakcji` na pewno trafiają do Notatek, czy część z nich powinna mieć osobny bucket eksportowy.
- Czy eksport PDF ma automatycznie flattenować formularz, czy pozostawiać pola edytowalne.
