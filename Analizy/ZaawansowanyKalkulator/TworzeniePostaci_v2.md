# 1. TworzeniePostaci_v2 — status i data aktualizacji

**Dokument:** `Analizy/ZaawansowanyKalkulator/TworzeniePostaci_v2.md`  
**Projekt:** rozbudowa modułu tworzenia postaci w `CuteLittleGoat/WrathAndGlory`  
**Moduł:** `Kalkulator/TworzeniePostaci_v2.html`  
**Status dokumentu:** samodzielna dokumentacja stanu docelowego, aktualnej implementacji i dalszego planu prac  
**Data aktualizacji:** 2026-06-22  
**Język:** polski

## Legenda statusów

| Status | Znaczenie |
| --- | --- |
| zaakceptowane wymaganie | Ostatni ustalony stan wymagania wynikający z dokumentów źródłowych i korekt chronologicznie późniejszych. |
| wdrożone | Potwierdzone w aktualnym kodzie odczytanym w repozytorium. |
| częściowo wdrożone | Wymaganie ma implementację, ale nie w pełnym docelowym kształcie albo wymaga ręcznej weryfikacji. |
| zaplanowane | Wymaganie docelowe, którego nie potwierdzono w aktualnym kodzie. |
| wymaga weryfikacji | Obszar, w którym dokumenty, kod albo środowisko mogą wymagać dodatkowego testu ręcznego lub decyzji. |

# 2. Cel dokumentu

Celem dokumentu jest zebranie w jednym miejscu obowiązującego projektu rozbudowy zaawansowanego kreatora postaci `TworzeniePostaci_v2`. Dokument zastępuje potrzebę czytania starszych analiz podczas dalszej implementacji, testów i odbioru.

Dokument opisuje:

- zaakceptowany stan docelowy modułu;
- aktualny stan implementacji odczytany z plików projektu;
- rozbieżności między wymaganiami i kodem;
- model danych kalkulatora;
- logikę obliczeń;
- relację wersji produkcyjnej i testowej/v2;
- integrację Firebase i Firestore;
- eksport polskiego formularza PDF;
- mapowania pól PDF;
- obsługę fontów, polskich znaków i długich tekstów;
- elementy ukończone, częściowo ukończone i niewdrożone;
- znane ograniczenia, ryzyka, plan dalszych prac i kryteria odbioru.

# 3. Zakres projektu

## 3.1. Zakres funkcjonalny

Projekt dotyczy rozbudowanego, ręcznego i przyjaznego homebrew kreatora postaci dla modułu `Kalkulator`. Kreator ma umożliwiać wprowadzenie danych postaci, atrybutów, umiejętności, talentów, zasad specjalnych, danych do cech wyliczanych oraz eksport tych danych do polskiej karty PDF.

W zakresie projektu znajdują się:

- strona `Kalkulator/TworzeniePostaci_v2.html` jako docelowy widok zaawansowanego kreatora;
- rdzeń logiki w `Kalkulator/TworzeniePostaci_v2-core.js`;
- integracja zapisu i odczytu Firebase w `Kalkulator/TworzeniePostaci_v2-firebase.js`;
- eksport PDF w `Kalkulator/TworzeniePostaci_v2-pdf.js`;
- polski formularz PDF `Kalkulator/pdf/pl.pdf`;
- lokalny lub zewnętrzny mechanizm ładowania bibliotek PDF, zależnie od aktualnego etapu implementacji;
- izolacja danych wersji v2/testowej od produkcyjnego kreatora `Kalkulator/TworzeniePostaci.html`.

## 3.2. Poza zakresem bieżącego dokumentu

Dokument nie zleca zmian w kodzie. Nie obejmuje refaktoryzacji produkcyjnego `Kalkulator/TworzeniePostaci.html`, przebudowy Firebase poza opisaniem wymagań, ani aktualizacji instrukcji użytkownika modułu.

# 4. Źródła prawdy i zasady interpretacji dokumentacji

## 4.1. Chronologia i rozstrzyganie sprzeczności

Dokumenty źródłowe powstawały etapami. Obowiązuje zasada, że późniejsza jawna korekta zastępuje wcześniejsze warianty. Starsze propozycje nie są utrzymywane jako alternatywy, jeżeli zostały zastąpione decyzją nowszą.

Najważniejsze późniejsze decyzje z 2026-06-22 dotyczą:

- migracji `test.html` do `Kalkulator/TworzeniePostaci_v2.html`;
- usunięcia dawnych plików testowych `Kalkulator/test.html`, `Kalkulator/test-core.html`, `Kalkulator/test-loader.js`, `Kalkulator/test-firebase.js` z aktualnej struktury;
- rozdzielenia produkcji i v2/testowej;
- zachowania bezpieczeństwa produkcyjnego `Kalkulator/TworzeniePostaci.html`;
- korekty obsługi Słów Kluczowych w PDF, w tym drugiego wiersza;
- uporządkowania podziału plików HTML/JS.

## 4.2. Relacja dokumentacji i kodu

Kod jest źródłem potwierdzenia statusu „wdrożone”, ale nie zastępuje zaakceptowanych wymagań. Jeżeli aktualny kod różni się od zaakceptowanego stanu docelowego, różnica jest opisana jako element do wdrożenia albo weryfikacji.

Przykład rozbieżności: wymaganie izolacji Firestore wskazuje produkcję jako `character_builder/current` i wersję testową/v2 jako `character_builder/test-v2`, natomiast aktualny kod `Kalkulator/TworzeniePostaci_v2-firebase.js` używa dokumentu głównego `character_builder/v2` oraz awaryjnego `character_builder/test-v2`. Tę rozbieżność należy rozstrzygnąć przed finalnym wdrożeniem reguł i migracji.

# 5. Aktualna architektura plików

## 5.1. Pliki aktywne wersji v2

| Plik | Status | Rola |
| --- | --- | --- |
| `Kalkulator/TworzeniePostaci_v2.html` | wdrożone | Strona zaawansowanego kreatora, zawiera strukturę widoku, style lokalne, przyciski, modale i ładuje pliki JS v2. |
| `Kalkulator/TworzeniePostaci_v2-core.js` | wdrożone | Rdzeń danych, renderowania tabel, obliczeń, talentów, zasad specjalnych, modalów i API `window.WNGCreatorV2`. |
| `Kalkulator/TworzeniePostaci_v2-firebase.js` | częściowo wdrożone | Oddzielona integracja Firebase dla wersji v2; obecnie zawiera fallback migracyjny. |
| `Kalkulator/TworzeniePostaci_v2-pdf.js` | częściowo wdrożone | Eksport polskiej karty PDF przez `pdf-lib`, fontkit i rysowanie tekstu na PDF. |
| `Kalkulator/pdf/pl.pdf` | wdrożone/wymaga weryfikacji | Polski formularz PDF używany przez eksport v2. Wymaga ręcznych testów pól po każdej zmianie mapowania. |
| `Kalkulator/vendor/pdf-lib.min.js` | wymaga weryfikacji | W starszych decyzjach preferowany lokalny plik biblioteki; aktualny kod v2 ładuje `pdf-lib` z CDN. |
| `Kalkulator/config/firebase-config.js` | wymaga weryfikacji | Konfiguracja Firebase ładowana na żądanie przez integrację v2, jeśli istnieje w środowisku. |

## 5.2. Pliki produkcyjne i dokumentacyjne odczytane tylko kontrolnie

| Plik | Status w kontekście projektu |
| --- | --- |
| `Kalkulator/TworzeniePostaci.html` | Produkcyjny prosty kreator; nie powinien być modyfikowany przy pracach nad v2 bez osobnego zadania. |
| `Kalkulator/config/FirebaseREADME.md` | Dokumentacja konfiguracji Firebase dla modułu. |
| `Kalkulator/config/FirebaseTestREADME.md` | Dokumentacja rozdzielenia dokumentów Firestore dla produkcji i testu. |
| `Kalkulator/docs/Documentation.md` | Techniczna dokumentacja modułu `Kalkulator`. |
| `Kalkulator/docs/README.md` | Instrukcja użytkownika modułu `Kalkulator`. |

## 5.3. Pliki testowe, które według aktualnego stanu nie istnieją

W aktualnym repozytorium nie potwierdzono istnienia:

- `Kalkulator/test.html`;
- `Kalkulator/test-core.html`;
- `Kalkulator/test-loader.js`;
- `Kalkulator/test-firebase.js`.

Obowiązujący kierunek to traktowanie `TworzeniePostaci_v2` jako następcy dawnego testowego widoku, bez przywracania starych plików testowych.

# 6. Rozdzielenie produkcji i wersji v2/testowej

## 6.1. Zaakceptowane wymaganie

Produkcja i wersja v2/testowa muszą być odseparowane funkcjonalnie oraz danychowo.

| Obszar | Produkcja | Wersja v2/testowa |
| --- | --- | --- |
| Widok | `Kalkulator/TworzeniePostaci.html` | `Kalkulator/TworzeniePostaci_v2.html` |
| Dane Firestore | `character_builder/current` | `character_builder/test-v2` |
| Cel | Stabilny kreator produkcyjny | Rozbudowany kreator do testów i docelowego rozwoju |
| Zasada bezpieczeństwa | Nie modyfikować przy pracach nad v2 bez osobnego polecenia | Może być rozwijany niezależnie |

## 6.2. Aktualny stan implementacji

- `Kalkulator/TworzeniePostaci_v2.html` istnieje i ładuje własne pliki `TworzeniePostaci_v2-core.js`, `TworzeniePostaci_v2-firebase.js` i `TworzeniePostaci_v2-pdf.js`.
- Produkcyjny `Kalkulator/TworzeniePostaci.html` pozostaje oddzielnym plikiem.
- Aktualny kod Firebase v2 wskazuje `DOCUMENT_NAME = 'v2'` oraz `LEGACY_DOCUMENT_NAME = 'test-v2'`, czyli nie jest w pełni zgodny z zaakceptowanym wymaganiem, według którego wersja testowa/v2 ma używać `character_builder/test-v2` jako oddzielnego dokumentu.

## 6.3. Bezpieczeństwo produkcyjne

Zaakceptowane wymaganie: prace nad v2 nie mogą przypadkowo nadpisać danych ani kodu produkcyjnego. W szczególności:

- v2 nie może zapisywać do `character_builder/current`;
- reguły Firestore nie mogą otwierać całej kolekcji `character_builder` tylko po to, aby obsłużyć test;
- produkcyjny `Kalkulator/TworzeniePostaci.html` ma pozostać bez zmian, dopóki nie zapadnie osobna decyzja o migracji.

# 7. Model danych kalkulatora

## 7.1. Dane główne

Aktualny model danych v2 jest budowany przez `window.WNGCreatorV2.getState()` i zawiera:

| Pole | Znaczenie | Status |
| --- | --- | --- |
| `xpPool` | Pula punktów doświadczenia dostępna dla postaci. | wdrożone |
| `talentCount` | Liczba slotów talentów renderowanych w formularzu. | wdrożone |
| `data.attrs` | Atrybuty postaci. | wdrożone |
| `data.skills` | Wartości umiejętności. | wdrożone |
| `data.skillTotals` | Sumy umiejętności: umiejętność + atrybut. | wdrożone |
| `data.character` | Dane do obliczeń i eksportu: poziom gry, gatunek, rozmiar, frakcja, archetyp, słowa kluczowe. | wdrożone |
| `data.rules` | Zasady specjalne i premie, w tym typ, nazwa/opis, cel modyfikacji i wartość. | wdrożone |
| `data.raw` | Surowe wyniki cech wyliczanych przed zastosowaniem minimów. | wdrożone |
| `data.values` | Końcowe wartości cech wyliczanych. | wdrożone |
| `data.influenceAttribute` | Atrybut użyty do obliczenia Wpływów. | wdrożone |
| `data.corruptionBase` | Ręczna wartość bazowa Spaczenia. | wdrożone |
| `data.talents` | Lista wpisów talentów z nazwą i kosztem. | wdrożone |

## 7.2. Schemat zapisu Firebase v2

Aktualny payload zapisu Firebase zawiera:

| Pole | Znaczenie |
| --- | --- |
| `schemaVersion` | Aktualnie `2`. |
| `module` | Aktualnie `Kalkulator/TworzeniePostaci_v2`. |
| `savedAt` | Znacznik czasu serwera Firestore. |
| `savedBy` | Aktualnie `anonymous-web-client`. |
| `xpPool` | Pula PD. |
| `talentCount` | Liczba slotów talentów. |
| `data` | Pełny snapshot danych kalkulatora. |

Status: częściowo wdrożone, ponieważ docelowy dokument Firestore wymaga doprecyzowania do `character_builder/test-v2`.

# 8. Interfejs i sekcje formularza

## 8.1. Główny widok

Aktualny widok `Kalkulator/TworzeniePostaci_v2.html` zawiera:

- nagłówek strony zaawansowanego kreatora;
- przyciski nawigacyjne i akcyjne;
- pole puli PD;
- wskaźnik pozostałych PD;
- tabelę atrybutów;
- tabelę umiejętności;
- tabelę talentów;
- ukryty techniczny log eksportu PDF;
- modal „Cechy i zasady specjalne”;
- modal maksymalnych wartości atrybutów gatunku;
- modal potwierdzeń i komunikatów.

Status: wdrożone.

## 8.2. Przyciski i akcje

| Element | Zachowanie | Status |
| --- | --- | --- |
| Powrót do menu | Przekierowuje do `../Main/index.html`. | wdrożone |
| Instrukcja | Otwiera `HowToUse/pl.pdf`. | wdrożone |
| Zapis Firebase | Pokazuje potwierdzenie i zapisuje stan. | częściowo wdrożone |
| Odczyt Firebase | Pokazuje potwierdzenie i wczytuje stan. | częściowo wdrożone |
| Eksport PDF | Otwiera podgląd i generuje polski PDF. | częściowo wdrożone |
| Cechy i zasady specjalne | Otwiera modal danych postaci, cech i zasad. | wdrożone |
| Maksymalne wartości atrybutów | Otwiera modal tabeli limitów gatunkowych. | wdrożone |
| Dodaj/usuń talent | Dodaje lub usuwa parę slotów talentów. | wdrożone |
| Dodaj/usuń zasadę | Dodaje lub usuwa wiersz zasady specjalnej. | wdrożone |

# 9. Atrybuty i maksymalne wartości gatunku

## 9.1. Atrybuty kalkulatora

| Klucz | Etykieta | Domyślnie | Zakres w aktualnym kodzie | Status |
| --- | --- | ---: | ---: | --- |
| `S` | Siła | 1 | 1–12 | wdrożone |
| `Wt` | Wytrzymałość | 1 | 1–12 | wdrożone |
| `Zr` | Zręczność | 1 | 1–12 | wdrożone |
| `I` | Inicjatywa | 1 | 1–12 | wdrożone |
| `SW` | Siła Woli | 1 | 1–12 | wdrożone |
| `Int` | Inteligencja | 1 | 1–12 | wdrożone |
| `Ogd` | Ogłada | 1 | 1–12 | wdrożone |
| `Speed` | Szybkość | 6 | 1–12 | wdrożone |

Koszt atrybutów jest liczony według tabeli kosztów dla wartości 1–12:

| Wartość | Koszt PD |
| ---: | ---: |
| 1 | 0 |
| 2 | 4 |
| 3 | 10 |
| 4 | 20 |
| 5 | 35 |
| 6 | 55 |
| 7 | 80 |
| 8 | 110 |
| 9 | 145 |
| 10 | 185 |
| 11 | 230 |
| 12 | 280 |

## 9.2. Maksymalne wartości gatunku

Modal maksymalnych wartości atrybutów prezentuje tabelę informacyjną. Aktualny kod nie blokuje automatycznie atrybutów według gatunku; ogranicza pola do zakresu ogólnego 1–12.

Status: częściowo wdrożone.

| Gatunek | S | Wt | Zr | I | SW | Int | Ogd | Szybkość |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Człowiek | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 |
| Ork | 12 | 12 | 7 | 7 | 8 | 7 | 7 | 7 |
| Aeldari | 8 | 7 | 12 | 12 | 12 | 10 | 6 | 10 |
| Adeptus Astartes | 10 | 10 | 9 | 9 | 10 | 10 | 8 | 9 |
| Primaris Astartes | 12 | 12 | 9 | 9 | 10 | 10 | 8 | 9 |
| Ogryn | 12 | 12 | 7 | 4 | 8 | 1 | 4 | 8 |
| Szczurak | 6 | 6 | 10 | 10 | 8 | 8 | 10 | 7 |
| Kroot | 12 | 12 | 12 | 12 | 10 | 6 | 6 | 10 |
| Drukhari | 8 | 8 | 12 | 12 | 10 | 10 | 6 | 10 |
| Konstrukt Upiorytowy | 12 | 12 | 8 | 8 | 12 | 10 | 4 | 8 |
| Kasta powietrza | 4 | 4 | 10 | 8 | 8 | 8 | 8 | 8 |
| Kasta ziemi | 6 | 6 | 8 | 8 | 8 | 10 | 8 | 6 |
| Kasta ognia | 7 | 7 | 8 | 8 | 8 | 8 | 8 | 8 |
| Kasta wody | 6 | 6 | 8 | 8 | 8 | 8 | 10 | 6 |
| Niebianie | 6 | 6 | 8 | 8 | 10 | 8 | 8 | 6 |
| Vespidzi | 8 | 8 | 12 | 8 | 8 | 8 | 5 | 14* |

# 10. Umiejętności i obliczanie sum

## 10.1. Lista umiejętności

Umiejętności mają zakres 0–8. Koszt PD umiejętności jest liczony według tabeli:

| Wartość | Koszt PD |
| ---: | ---: |
| 0 | 0 |
| 1 | 2 |
| 2 | 6 |
| 3 | 12 |
| 4 | 20 |
| 5 | 30 |
| 6 | 42 |
| 7 | 56 |
| 8 | 72 |

## 10.2. Obowiązujące mapowanie sum umiejętności

Zaakceptowane wymaganie: w kolumnie PDF „Suma” wartość umiejętności jest dodawana do powiązanego atrybutu kalkulatora.

Wzór:

```text
Suma umiejętności = wartość umiejętności + wartość powiązanego atrybutu
```

| Umiejętność | Powiązany atrybut | Status w aktualnym kodzie |
| --- | --- | --- |
| Analiza | Int | wdrożone |
| Czujność | Int | wdrożone |
| Korzystanie z technologii | Int | wdrożone |
| Medycyna | Int | wdrożone |
| Wiedza ogólna | Int | wdrożone |
| Atletyka | S | wdrożone |
| Dowodzenie | SW | wdrożone |
| Mistrzostwo psioniczne | SW | wdrożone |
| Przetrwanie | SW | wdrożone |
| Zastraszanie | SW | wdrożone |
| Intuicja | Ogd | wdrożone |
| Oszukiwanie | Ogd | wdrożone |
| Perswazja | Ogd | wdrożone |
| Przebiegłość | Ogd | wdrożone |
| Pilotaż | Zr | wdrożone |
| Ukrywanie się | Zr | wdrożone |
| Umiejętności strzeleckie | Zr | wdrożone |
| Walka wręcz | I | wdrożone |

## 10.3. Zasada Drzewa Nauki

Aktualny kod weryfikuje zasadę Drzewa Nauki dla poziomów 2–8. Dla każdego poziomu `rating` sprawdza, czy liczba umiejętności na poziomie co najmniej `rating - 1` jest co najmniej dwukrotnością liczby umiejętności na poziomie co najmniej `rating`.

Status: wdrożone.

# 11. Cechy wyliczane i ich wzory

## 11.1. Wzory aktualnie zaimplementowane

| Cecha | Wzór surowy | Minimum końcowe | Status |
| --- | --- | --- | --- |
| Żywotność maksymalna | `Wt + (2 × Poziom Gry) + bonusy` | 1 | wdrożone |
| Odporność Psychiczna | `SW + Poziom Gry + bonusy` | 1 | wdrożone |
| Determinacja | `Wt + bonusy` | 1 | wdrożone |
| Obrona | `I - 1 + premia za Rozmiar + bonusy` | 1 | wdrożone |
| Odporność | `Wt + 1 + bonusy` | 1 | wdrożone |
| Upór | `SW + bonusy` | 1 | wdrożone |
| Odwaga | `SW - 1 + bonusy` | 1 | wdrożone |
| Wpływy | `wybrany atrybut - 1 + bonusy` | 1 | wdrożone |
| Majątek | `Poziom Gry + bonusy` | 1 | wdrożone |
| Spaczenie | `wartość ręczna + bonusy` | 0 | wdrożone |
| Szybkość | `Szybkość + bonusy` | 1 | wdrożone |
| Pasywna Czujność | `ceil(Suma Czujność / 2)` | 1 wynikające z danych wejściowych | wdrożone |

## 11.2. Premia za rozmiar do Obrony

| Rozmiar | Premia do Obrony | Status |
| --- | ---: | --- |
| Malutki | +2 | wdrożone |
| Mały | +1 | wdrożone |
| Średni | 0 | wdrożone |
| Duży | 0 | wdrożone |
| Ogromny | 0 | wdrożone |
| Monstrualny | 0 | wdrożone |

## 11.3. Wpływy

Wpływy są homebrew-friendly: użytkownik może wybrać atrybut bazowy spośród `S`, `Wt`, `Zr`, `I`, `SW`, `Int`, `Ogd`. Domyślnie używana jest `Ogd`.

Status: wdrożone.

# 12. Poziom Gry i Spaczenie

## 12.1. Poziom Gry

Poziom Gry jest polem liczbowym w danych postaci do obliczeń i eksportu. Aktualny kod ogranicza go do zakresu 1–5.

Poziom Gry wpływa na:

- Żywotność maksymalną: `Wt + (2 × Poziom Gry) + bonusy`;
- Odporność Psychiczną: `SW + Poziom Gry + bonusy`;
- Majątek: `Poziom Gry + bonusy`;
- eksport do pola PDF `Poziom`.

Status: wdrożone.

## 12.2. Spaczenie

Spaczenie składa się z wartości ręcznej i bonusów z zasad specjalnych, których cel modyfikacji ustawiono na `corruption`.

W eksporcie PDF:

- pierwsze 25 pól `Check Box 1`–`Check Box 25` odpowiada punktom Spaczenia;
- kolumna poziomu Spaczenia używa pól `Check Box 26`–`Check Box 30`;
- liczba zaznaczonych pól poziomu jest liczona jako `ceil((Spaczenie - 5) / 5)`, ograniczona do zakresu 0–4 w aktualnym kodzie.

Status: częściowo wdrożone, ponieważ wcześniejsze korekty kolejności checkboxów wymagają ręcznej weryfikacji na aktualnym formularzu `Kalkulator/pdf/pl.pdf`.

# 13. Zdolności, Talenty, Przeszłość i Notatki

## 13.1. Talenty

Główna sekcja talentów przyjmuje pary pól:

- `Nazwa`;
- `Koszt`.

Koszt talentów zwiększa wydane PD. Do eksportu PDF w obszarze `Zdolności i Talenty` trafia nazwa talentu bez kosztu.

Status: wdrożone.

## 13.2. Typy zasad specjalnych

Aktualne typy zasad specjalnych:

| Klucz | Etykieta | Docelowy bucket eksportu |
| --- | --- | --- |
| `speciesAbility` | Zdolności Gatunkowe | `Notatki` |
| `archetypeAbility` | Zdolność Archetypu | `Zdolności i Talenty`, jeżeli `Modyfikuje = none`; w przeciwnym razie `Notatki` |
| `backgroundBonus` | Premia z Przeszłości | `Przeszłość` |
| `keywordBonus` | Bonusy Słów Kluczowych | `Notatki` |
| `factionBonus` | Specjalne Bonusy Frakcji | `Notatki` |
| `other` | Inne | `Notatki` |

Status: wdrożone w logice eksportu v2.

## 13.3. Premia z Przeszłości

Zaakceptowane wymaganie dla pola „Premia z Przeszłości”:

- nazwa pola brzmi dokładnie `Premia z Przeszłości`;
- pole należy do obszaru/kategorii `Przeszłość`;
- nie może trafiać do `Notatek`;
- wpisów nie należy automatycznie etykietować ogólnym słowem `Premia`;
- pole ma być homebrew-friendly;
- może zawierać efekty liczbowe, np. `+1 do Majątku`;
- może zawierać efekty opisowe lub nieliczbowe, np. nowe słowo kluczowe;
- nie wolno ograniczać go wyłącznie do bonusów liczbowych;
- inne bonusy, np. wynikające z gatunku, trafiają do `Notatek`.

Aktualny kod potwierdza, że `backgroundBonus` jest eksportowany do bucketu `background`, a obszar ten jest rysowany w polu `Przeszłość`. Jednocześnie pole może modyfikować cechy, jeśli użytkownik ustawi `Modyfikuje` i `Wartość`.

Status: wdrożone.

## 13.4. Notatki

Do `Notatek` trafiają wpisy, które nie powinny znaleźć się w `Zdolnościach i Talentach` ani w `Przeszłości`, w szczególności:

- Zdolności Gatunkowe;
- Specjalne Bonusy Frakcji;
- Bonusy Słów Kluczowych;
- wpisy `Inne`;
- Zdolność Archetypu modyfikująca cechę;
- inne bonusy, np. wynikające z gatunku.

Status: wdrożone.

# 14. Słowa Kluczowe

## 14.1. Dane wejściowe

Słowa Kluczowe są częścią danych postaci w modalu „Cechy i zasady specjalne”. Pole jest wieloliniowe i homebrew-friendly.

Status: wdrożone.

## 14.2. Eksport do PDF

Aktualna logika eksportu:

- normalizuje tekst wieloliniowy do zapisu z przecinkami;
- wypełnia główne pole PDF `Słowa Kluczowe`;
- próbuje użyć lub utworzyć drugie pole `Słowa Kluczowe 2` dla drugiego wiersza;
- w razie problemu z polem rysuje drugi wiersz tekstem na stronie PDF;
- dopasowuje rozmiar fontu od 10 do 4;
- ostrzega, jeżeli tekst przekracza dwie linie i nadmiar zostaje pominięty.

Status: częściowo wdrożone, ponieważ wymaga testu ręcznego na aktualnym `Kalkulator/pdf/pl.pdf`, szczególnie dla drugiego wiersza.

# 15. Zapis i odczyt danych

## 15.1. Zapis lokalny w stanie strony

Aktualny rdzeń udostępnia `getState()` i `applyState()`, które pozwalają zebrać i odtworzyć stan formularza. To jest podstawa zapisu Firebase.

Status: wdrożone.

## 15.2. Zapis Firebase

Zapis Firebase:

1. pyta użytkownika o potwierdzenie;
2. ładuje Firebase dopiero przy pierwszym użyciu;
3. buduje payload schematu `2`;
4. próbuje zapisać dokument v2;
5. przy błędzie uprawnień próbuje fallbacku do `test-v2`;
6. pokazuje komunikat powodzenia albo błędu.

Status: częściowo wdrożone z powodu rozbieżności docelowego dokumentu Firestore.

## 15.3. Odczyt Firebase

Odczyt Firebase:

1. pyta użytkownika o potwierdzenie;
2. ładuje Firebase dopiero przy pierwszym użyciu;
3. próbuje odczytać dokument v2;
4. przy braku dostępu lub braku dokumentu sprawdza `test-v2`;
5. waliduje `schemaVersion` i `module`;
6. normalizuje starszy payload, jeżeli nie zawiera pola `data`;
7. stosuje stan w formularzu;
8. próbuje migracji best-effort do dokumentu v2, jeśli odczytano fallback;
9. pokazuje komunikat powodzenia albo błędu.

Status: częściowo wdrożone z powodu rozbieżności docelowego dokumentu Firestore.

# 16. Firebase i Firestore

## 16.1. Docelowe dokumenty Firestore

Zaakceptowane wymaganie:

| Wersja | Dokument Firestore |
| --- | --- |
| Produkcja | `character_builder/current` |
| Wersja testowa/v2 | `character_builder/test-v2` |

## 16.2. Zakaz ogólnego otwierania kolekcji

Reguły Firestore nie mogą ogólnie otwierać całej kolekcji `character_builder`. Należy dopuszczać tylko konkretne dokumenty wymagane przez moduł, np. osobno `current` i `test-v2`.

Status: zaakceptowane wymaganie; aktualne wdrożenie reguł wymaga weryfikacji w `Kalkulator/config/firestore.rules` i środowisku Firebase.

## 16.3. Aktualna rozbieżność implementacyjna

Aktualny kod v2 używa:

```text
character_builder/v2
character_builder/test-v2 jako fallback
```

Docelowe wymaganie wskazuje:

```text
character_builder/test-v2 dla wersji testowej/v2
```

Rozbieżność należy rozwiązać przed finalnym odbiorem integracji Firebase. Do czasu rozstrzygnięcia nie należy uznawać integracji Firebase v2 za w pełni ukończoną.

# 17. Eksport PDF

## 17.1. Zaakceptowany zakres eksportu

Eksport PDF ma wypełniać polską kartę `Kalkulator/pdf/pl.pdf` danymi z kalkulatora v2, w szczególności:

- Poziom Gry;
- Gatunek;
- Archetyp;
- Frakcja;
- Słowa Kluczowe;
- Rozmiar;
- atrybuty;
- umiejętności i ich sumy;
- cechy wyliczane;
- Spaczenie i poziomy Spaczenia;
- Zdolności i Talenty;
- Notatki;
- Przeszłość.

Status: częściowo wdrożone.

## 17.2. Biblioteki PDF

Zaakceptowana wcześniejsza rekomendacja techniczna preferowała lokalny plik `Kalkulator/vendor/pdf-lib.min.js`, aby aplikacja działała przewidywalnie lokalnie/offline.

Aktualny kod `TworzeniePostaci_v2-pdf.js` ładuje z CDN:

- `pdf-lib@1.17.1`;
- `@pdf-lib/fontkit@1.1.1`;
- `NotoSans-Regular.ttf` z repozytorium Noto Fonts na CDN GitHub/jsDelivr.

Status: częściowo wdrożone; tryb offline/lokalny pozostaje do decyzji albo wdrożenia.

## 17.3. Spłaszczanie PDF

Starsze wymaganie wskazywało spłaszczanie formularza po wypełnieniu, aby odbiorca widział stabilny dokument. Aktualny kod nie wywołuje jawnie `form.flatten()`. Dodatkowo usuwa wybrane pola tekstowe i rysuje tekst bezpośrednio na PDF dla obszarów kolumnowych.

Status: częściowo wdrożone / wymaga weryfikacji. Należy zdecydować, czy finalny eksport ma jawnie spłaszczać cały formularz, czy utrzymać obecny model mieszany.

# 18. Mapowanie pól PDF

## 18.1. Pola główne

| Dane kalkulatora | Pole PDF | Status |
| --- | --- | --- |
| `character.gameTier` | `Poziom` | wdrożone |
| `character.speciesName` | `Gatunek` | wdrożone |
| `character.archetypeName` | `Archetyp` | wdrożone |
| `character.factionName` | `Frakcja` | wdrożone |
| `character.keywords` | `Słowa Kluczowe`, opcjonalnie `Słowa Kluczowe 2` | częściowo wdrożone |
| `character.size` | `Rozmiar` | wdrożone |
| `values.speed` | `Szybkość` | wdrożone |

## 18.2. Atrybuty

| Atrybut kalkulatora | Pole PDF | Status |
| --- | --- | --- |
| `S` | `S` | wdrożone |
| `Wt` | `Wt` | wdrożone |
| `Zr` | `Zr` | wdrożone |
| `I` | `I` | wdrożone |
| `SW` | `SW` | wdrożone |
| `Int` | `Int` | wdrożone |
| `Ogd` | `Ogd` | wdrożone |

## 18.3. Umiejętności

| Umiejętność | Pole wartości PDF | Pole sumy PDF | Status |
| --- | --- | --- | --- |
| Analiza | `Analiza` | `AnalizaSuma` | wdrożone |
| Atletyka | `Atletyka` | `AtletykaSuma` | wdrożone |
| Czujność | `Czujność` | `CzujnośćSuma` | wdrożone |
| Dowodzenie | `Dowodzenie` | `DowodzenieSuma` | wdrożone |
| Intuicja | `Intuicja` | `IntuicjaSuma` | wdrożone |
| Korzystanie z technologii | `Technologia` | `TechnologiaSuma` | wdrożone |
| Medycyna | `Medycyna` | `MedycynaSuma` | wdrożone |
| Mistrzostwo psioniczne | `Psionika` | `PsionikaSuma` | wdrożone |
| Oszukiwanie | `Oszukiwanie` | `OszukiwanieSuma` | wdrożone |
| Perswazja | `Perswazja` | `PerswazjaSuma` | wdrożone |
| Pilotaż | `Pilotaż` | `PilotażSuma` | wdrożone |
| Przebiegłość | `Przebiegłość` | `PrzebiegłośćSuma` | wdrożone |
| Przetrwanie | `Przetrwanie` | `PrzetrwanieSuma` | wdrożone |
| Ukrywanie się | `Ukrywanie się` | `Ukrywanie sięSuma` | wdrożone |
| Umiejętności strzeleckie | `Umiejętności strzeleckie` | `Umiejętności StrzeleckieSuma` | wdrożone |
| Walka wręcz | `Walka Wręcz` | `Walka WręczSuma` | wdrożone |
| Wiedza ogólna | `Wiedza ogólna` | `Wiedza ogólnaSuma` | wdrożone |
| Zastraszanie | `Zastraszanie` | `ZastraszanieSuma` | wdrożone |

## 18.4. Cechy wyliczane

| Cecha | Pole PDF | Status |
| --- | --- | --- |
| Upór | `Upór` | wdrożone |
| Odwaga | `Odwaga` | wdrożone |
| Obrona | `Obrona` | wdrożone |
| Odporność | `Bazowa Odporność` | wdrożone |
| Żywotność maksymalna | `Maksymalna Żywotność` | wdrożone |
| Odporność Psychiczna | `Odporność Psychiczna` | wdrożone |
| Determinacja | `Determinacja` | wdrożone |
| Wpływy | `Wpływy` | wdrożone |
| Majątek | `Majątek` | wdrożone |
| Pasywna Czujność | `Pasywna Czujność` | wdrożone |

## 18.5. Obszary rysowane na PDF

| Bucket | Źródło danych | Obszar | Status |
| --- | --- | --- | --- |
| `Zdolności i Talenty` | nazwy talentów oraz opisowe Zdolności Archetypu | strona 2, obszar `x=40`, `y=578`, `width=530`, `height=118` | wdrożone/wymaga testu wizualnego |
| `Notatki` | zasady inne niż opisowe zdolności i Premia z Przeszłości | strona 2, obszar `x=25`, `y=40`, `width=410`, `height=135` | wdrożone/wymaga testu wizualnego |
| `Przeszłość` | `Premia z Przeszłości` | strona 1, obszar `x=467`, `y=623`, `width=109`, `height=39` | wdrożone/wymaga testu wizualnego |

# 19. Obsługa tekstu, fontów i polskich znaków

## 19.1. Font

Aktualny eksport PDF używa `NotoSans-Regular.ttf`, rejestruje fontkit i aktualizuje wygląd pól formularza za pomocą osadzonego fontu. Celem jest poprawna obsługa polskich znaków.

Status: częściowo wdrożone, ponieważ font jest ładowany z zewnętrznego URL, a nie lokalnie.

## 19.2. Dynamiczne dopasowanie tekstu

Aktualne mechanizmy:

- pola formularza dostają rozmiar fontu zależny od długości tekstu: 10, 8, 7 albo 6;
- obszary rysowane na PDF dobierają liczbę kolumn i rozmiar fontu;
- tekst jest łamany po słowach, a bardzo długie słowa są dzielone znak po znaku;
- przy braku miejsca nadmiar linii jest pomijany i dodawane jest ostrzeżenie;
- Słowa Kluczowe mają osobny algorytm dopasowania do maksymalnie dwóch linii.

Status: wdrożone/wymaga testów ręcznych dla skrajnie długich treści.

# 20. Podgląd i pobieranie PDF

## 20.1. Zaakceptowane zachowanie

Eksport PDF ma otwierać podgląd w przeglądarce zamiast wymuszać natychmiastowe pobranie. Użytkownik może następnie zapisać plik z poziomu przeglądarki.

Status: wdrożone.

## 20.2. Aktualny przepływ

1. Kliknięcie eksportu otwiera nową kartę z komunikatem generowania.
2. Kod ładuje zależności PDF.
3. Pobierany jest `./pdf/pl.pdf`.
4. Formularz jest wypełniany i uzupełniany tekstem rysowanym na PDF.
5. Tworzony jest plik o nazwie `PL-YYYY-MM-DD-HHMM.pdf`.
6. Karta podglądu otrzymuje URL obiektu PDF.
7. URL jest zwalniany po 300 sekundach.

Status: wdrożone.

## 20.3. Blokada popupów

Kod próbuje otworzyć podgląd przed długimi operacjami, co zmniejsza ryzyko blokady popupu. Jeśli pierwsze okno nie istnieje, kod próbuje użyć `window.open(url, '_blank')` po wygenerowaniu PDF.

Status: częściowo wdrożone; wymaga testu w docelowych przeglądarkach.

# 21. Walidacja, ostrzeżenia i obsługa błędów

## 21.1. Walidacja formularza

Aktualna walidacja obejmuje:

- ograniczanie atrybutów do 1–12;
- ograniczanie umiejętności do 0–8;
- nieujemne koszty talentów;
- ograniczanie Poziomu Gry do 1–5;
- ograniczanie Spaczenia bazowego do wartości nieujemnych na poziomie pola HTML;
- wykrywanie przekroczenia puli PD;
- wykrywanie naruszenia zasady Drzewa Nauki;
- ostrzeganie o surowych wartościach cech mniejszych lub równych 0;
- ostrzeganie o Spaczeniu powyżej 25 pól PDF.

Status: wdrożone.

## 21.2. Ostrzeżenia eksportu PDF

Eksport PDF gromadzi ostrzeżenia, m.in.:

- brak pola PDF;
- problem z ustawieniem fontu pola;
- brak strony PDF;
- pominięte linie w obszarach kolumnowych;
- nadmiar Słów Kluczowych;
- błąd utworzenia drugiego pola Słów Kluczowych.

Status: wdrożone.

## 21.3. Obsługa błędów Firebase

Firebase pokazuje komunikaty dla:

- braku konfiguracji Firebase;
- braku zapisanego stanu;
- nieobsługiwanej wersji schematu;
- nieprawidłowego modułu dokumentu;
- błędów zapisu i odczytu.

Status: wdrożone/częściowo wdrożone ze względu na rozbieżność dokumentu docelowego.

# 22. Stan implementacji

## 22.1. Podsumowanie statusów

| Obszar | Status | Uzasadnienie |
| --- | --- | --- |
| Widok `TworzeniePostaci_v2.html` | wdrożone | Strona istnieje i ładuje podzielone pliki v2. |
| Rdzeń obliczeń | wdrożone | Atrybuty, umiejętności, PD, talenty, zasady i cechy są liczone. |
| Maksymalne wartości gatunku | częściowo wdrożone | Tabela istnieje, ale nie wymusza limitów na formularzu. |
| Premia z Przeszłości | wdrożone | Eksport do `Przeszłości`, nie do `Notatek`. |
| Słowa Kluczowe | częściowo wdrożone | Drugi wiersz obsłużony kodem, wymaga testu na PDF. |
| Eksport PDF | częściowo wdrożone | Działa dla PL, ale wymaga testów wizualnych i decyzji o spłaszczeniu oraz lokalnych bibliotekach. |
| Firebase v2 | częściowo wdrożone | Integracja istnieje, ale dokument docelowy jest rozbieżny z wymaganiem `test-v2`. |
| Rozdzielenie produkcji i v2 | częściowo wdrożone | Pliki są rozdzielone; Firestore wymaga korekty/weryfikacji. |
| Produkcyjny kreator | wdrożone jako nienaruszony obszar | Ma pozostać odrębny i bezpieczny. |

# 23. Elementy ukończone

Za ukończone można uznać:

- utworzenie i używanie `Kalkulator/TworzeniePostaci_v2.html` jako osobnego widoku v2;
- podział kodu v2 na HTML, core, Firebase i PDF;
- renderowanie atrybutów i umiejętności;
- obliczanie kosztów PD;
- obsługę talentów z kosztami;
- obliczanie sum umiejętności według obowiązującego mapowania;
- obliczanie cech wyliczanych;
- modal cech i zasad specjalnych;
- typ `Premia z Przeszłości` z eksportem do obszaru `Przeszłość`;
- typy zasad specjalnych i ich podstawowe bucketowanie eksportowe;
- eksport nazw talentów bez kosztu do `Zdolności i Talenty`;
- eksport Zdolności Archetypu zależnie od `Modyfikuje`;
- eksport Specjalnych Bonusów Frakcji do `Notatek`;
- ostrzeżenia dla cech wyliczanych i Spaczenia;
- podgląd PDF w przeglądarce;
- dynamiczny układ kolumn dla `Zdolności i Talenty`, `Notatki` i `Przeszłość`;
- obsługę polskich znaków przez osadzany font w eksporcie PDF;
- komunikaty zapisu, odczytu i błędów.

# 24. Elementy częściowo ukończone

Częściowo ukończone pozostają:

- integracja Firebase, ponieważ aktualny kod używa `character_builder/v2` z fallbackiem do `character_builder/test-v2`, a zaakceptowany docelowy dokument dla v2/testu to `character_builder/test-v2`;
- reguły Firestore, ponieważ trzeba potwierdzić, że nie otwierają całej kolekcji i dopuszczają tylko konkretne dokumenty;
- eksport PDF, ponieważ wymaga testów wizualnych i decyzji o pełnym spłaszczeniu;
- lokalność zależności PDF, ponieważ aktualny kod korzysta z CDN mimo wcześniejszej rekomendacji lokalnego `pdf-lib`;
- Słowa Kluczowe, ponieważ obsługa drugiego wiersza jest zaimplementowana, ale wymaga testu z rzeczywistym PDF;
- checkboxy Spaczenia, ponieważ logika istnieje, ale kolejność i zgodność pól z formularzem wymagają testu ręcznego;
- maksymalne wartości gatunku, ponieważ tabela informacyjna istnieje, ale wartości nie są automatycznie egzekwowane;
- pełna dokumentacja użytkowa i techniczna modułu `Kalkulator`, jeżeli w przyszłości kod zostanie zmieniony.

# 25. Elementy niewdrożone

Nie potwierdzono wdrożenia:

- pełnego wymuszenia limitów atrybutów według wybranego gatunku;
- finalnego użycia wyłącznie `character_builder/test-v2` dla v2/testu bez dokumentu pośredniego `v2`;
- finalnych reguł Firestore ograniczonych dokładnie do `character_builder/current` i `character_builder/test-v2`;
- jawnego spłaszczenia całego formularza PDF przez `form.flatten()`;
- lokalnego, offline-friendly ładowania `pdf-lib`, `fontkit` i fontu;
- eksportu angielskiej karty PDF w v2;
- automatycznej migracji v2 do produkcji;
- testów automatycznych eksportu PDF porównujących wizualny wynik;
- testów end-to-end zapisu i odczytu Firebase w środowisku produkcyjnym.

# 26. Znane ograniczenia i ryzyka

| Ryzyko | Opis | Zalecenie |
| --- | --- | --- |
| Rozbieżny dokument Firestore | Kod używa `v2`, wymaganie wskazuje `test-v2`. | Uzgodnić i poprawić przed odbiorem Firebase. |
| Zależności CDN | Eksport PDF wymaga sieci dla bibliotek i fontu. | Rozważyć lokalne pliki vendor/font. |
| Brak pełnego spłaszczenia PDF | Część pól może pozostać formularzowa. | Przetestować w różnych czytnikach PDF i zdecydować o `form.flatten()`. |
| Pojemność pól PDF | Długie teksty mogą zostać ucięte. | Utrzymać ostrzeżenia i testy długich wpisów. |
| Słowa Kluczowe | Drugi wiersz może zależeć od geometrii konkretnego PDF. | Wykonać test wizualny na `pl.pdf`. |
| Checkboxy Spaczenia | Pola `Check Box 1`–`30` muszą odpowiadać formularzowi. | Zweryfikować kolejność na aktualnym PDF. |
| Limity gatunkowe | Tabela nie blokuje wartości. | Zdecydować, czy limity mają być tylko informacyjne, czy walidowane. |
| Homebrew | Elastyczność pól utrudnia walidację semantyczną. | Nie ograniczać opisów; walidować tylko techniczne zakresy. |

# 27. Plan dalszych prac

1. Rozstrzygnąć dokument Firestore dla v2 i doprowadzić implementację do zaakceptowanego wymagania `character_builder/test-v2` albo formalnie zmienić wymaganie.
2. Zweryfikować reguły Firestore, aby nie otwierały całej kolekcji `character_builder`.
3. Wykonać ręczny test zapisu i odczytu v2 bez wpływu na `character_builder/current`.
4. Wykonać test eksportu PDF z pełnym zestawem danych, polskimi znakami i długimi tekstami.
5. Zweryfikować mapowanie wszystkich pól PDF na aktualnym `Kalkulator/pdf/pl.pdf`.
6. Zweryfikować kolejność checkboxów Spaczenia i poziomu Spaczenia.
7. Podjąć decyzję o lokalnym ładowaniu `pdf-lib`, `fontkit` i fontu.
8. Podjąć decyzję o pełnym spłaszczeniu PDF.
9. Zdecydować, czy maksymalne wartości gatunku mają być walidacją, ostrzeżeniem czy tylko tabelą informacyjną.
10. Po każdej przyszłej zmianie kodu zaktualizować dokumentację modułu zgodnie z instrukcjami repozytorium.

# 28. Kryteria odbioru

## 28.1. Kryteria funkcjonalne

- `Kalkulator/TworzeniePostaci_v2.html` uruchamia się bez błędów konsoli blokujących pracę.
- Zmiana atrybutów, umiejętności i talentów aktualizuje pozostałe PD.
- Naruszenie puli PD pokazuje błąd.
- Naruszenie Drzewa Nauki pokazuje błąd.
- Cechy wyliczane aktualizują się po zmianie danych wejściowych.
- `Premia z Przeszłości` trafia do obszaru `Przeszłość`, a nie do `Notatek`.
- Talenty trafiają do `Zdolności i Talenty` bez kosztu.
- Zdolność Archetypu z `Modyfikuje = none` trafia do `Zdolności i Talenty`.
- Zdolność Archetypu modyfikująca cechę trafia do `Notatek` i wpływa na obliczenia.
- Specjalne Bonusy Frakcji trafiają do `Notatek`.
- Słowa Kluczowe obsługują długi tekst z drugim wierszem albo ostrzeżeniem.

## 28.2. Kryteria Firebase

- Produkcyjny `Kalkulator/TworzeniePostaci.html` zapisuje tylko `character_builder/current`.
- `TworzeniePostaci_v2` zapisuje i odczytuje wyłącznie zaakceptowany dokument testowy/v2.
- Zapis v2 nie zmienia `character_builder/current`.
- Reguły Firestore nie zawierają ogólnego otwarcia całej kolekcji `character_builder`.
- Błędy braku uprawnień i braku konfiguracji są pokazywane użytkownikowi.

## 28.3. Kryteria PDF

- Eksport otwiera podgląd PDF w przeglądarce.
- Nazwa pliku ma format `PL-YYYY-MM-DD-HHMM.pdf`.
- Polskie znaki są widoczne poprawnie.
- Atrybuty, umiejętności i sumy trafiają do właściwych pól.
- Cechy wyliczane trafiają do właściwych pól.
- Checkboxy Spaczenia odpowiadają wartości Spaczenia.
- `Zdolności i Talenty`, `Notatki` i `Przeszłość` mieszczą typowe dane albo pokazują ostrzeżenia przy przepełnieniu.
- PDF jest czytelny w głównych przeglądarkach i typowych czytnikach PDF.

# 29. Lista dokumentów źródłowych

Do przygotowania dokumentu wykorzystano aktualne pliki projektu oraz dokumenty analityczne znajdujące się w repozytorium na dzień 2026-06-22.

## 29.1. Dokumenty analityczne

- `Analizy/Kalkulator.md`
- `Analizy/Kalkulator-changelog-2026-06-19.md`
- `Analizy/Kalkulator-decyzje-przed-implementacja-2026-06-19.md`
- `Analizy/Kalkulator-eksport-zdolnosci-talenty-pojemnosc-pdf-2026-06-19.md`
- `Analizy/Kalkulator-font-pdf-pl-2026-06-19.md`
- `Analizy/Kalkulator-font-pdf-pl-poprawka-per-field-2026-06-19.md`
- `Analizy/Kalkulator-korekta-strony-kolumn-i-slowa-kluczowe-2026-06-22.md`
- `Analizy/Kalkulator-logika-eksportu-pdf-2026-06-19.md`
- `Analizy/Kalkulator-mapowanie-pol-pdf-2026-06-19.md`
- `Analizy/Kalkulator-mapowanie-techniczne-pl-pdf-2026-06-19.md`
- `Analizy/Kalkulator-mechanizm-kolumnowy-zdolnosci-notatki-2026-06-19.md`
- `Analizy/Kalkulator-migracja-test-do-TworzeniePostaci-v2-i-porzadek-plikow-2026-06-22.md`
- `Analizy/Kalkulator-modal-maksymalne-atrybuty-korekta-naglowkow-2026-06-19.md`
- `Analizy/Kalkulator-modal-maksymalne-atrybuty-korekta-stylow-2026-06-19.md`
- `Analizy/Kalkulator-pakiet-uwag-1-2026-06-19.md`
- `Analizy/Kalkulator-patch-2026-06-19.md`
- `Analizy/Kalkulator-placeholdery-typy-domyslne-2026-06-19.md`
- `Analizy/Kalkulator-podglad-pdf-w-przegladarce-2026-06-19.md`
- `Analizy/Kalkulator-pola-tekstowe-plynne-dopasowanie-fontu-2026-06-19.md`
- `Analizy/Kalkulator-pola-tekstowe-scroll-font-2026-06-19.md`
- `Analizy/Kalkulator-pola-tekstowe-stabilizacja-layoutu-2026-06-19.md`
- `Analizy/Kalkulator-poprawka-slow-kluczowych-2026-06-22.md`
- `Analizy/Kalkulator-spaczenie-poziom-checkboxy-2026-06-19.md`
- `Analizy/Kalkulator-spaczenie-poziom-checkboxy-korekta-kolejnosci-2026-06-19.md`
- `Analizy/Kalkulator-status-etap1-2026-06-19.md`
- `Analizy/Kalkulator-status-test-html-2026-06-19.md`
- `Analizy/Kalkulator-wdrozenie-kolumn-przeszlosc-2026-06-19.md`
- `Analizy/Kalkulator-wdrozenie-kolumn-zdolnosci-notatki-2026-06-19.md`

## 29.2. Pliki projektu odczytane kontrolnie

- `Kalkulator/TworzeniePostaci_v2.html`
- `Kalkulator/TworzeniePostaci_v2-core.js`
- `Kalkulator/TworzeniePostaci_v2-firebase.js`
- `Kalkulator/TworzeniePostaci_v2-pdf.js`
- `Kalkulator/TworzeniePostaci.html`
- `Kalkulator/config/FirebaseREADME.md`
- `Kalkulator/config/FirebaseTestREADME.md`
- `Kalkulator/docs/Documentation.md`
- `Kalkulator/docs/README.md`

## 29.3. Pliki oczekiwane historycznie, lecz nieobecne w aktualnym repozytorium

- `Kalkulator/test.html`
- `Kalkulator/test-core.html`
- `Kalkulator/test-loader.js`
- `Kalkulator/test-firebase.js`
