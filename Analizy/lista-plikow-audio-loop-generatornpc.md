# Lista plików objętych patchem audio loop + GeneratorNPC

Data przygotowania: 2026-06-09

Patch: `Analizy/patch-audio-loop-generatornpc.patch`

Źródło patcha: skumulowany diff z commitów od bazy `ec43e9a^` do aktualnego `HEAD`, ograniczony do plików modułów `Audio`, `GeneratorNPC` oraz wspólnego `DetaleLayout.md`. Zakres odpowiada commitom:

- `ec43e9a` — `Add loop playback to Audio module`;
- `ee298bd` — `Hide audio loop controls in admin view`;
- `5e754e2` — `Add editable GeneratorNPC keywords`;
- `81e5457` — `Update GeneratorNPC edit button contrast`.

## Pliki objęte patchem

| Plik | Zakres zmiany |
| --- | --- |
| `Audio/index.html` | Dodaje logikę przycisku **Loop** w zwykłym widoku użytkownika: losowanie kolejnych wariantów, zapętlanie po zdarzeniu `ended`, czerwony stan aktywny, obsługę `aria-pressed`, synchronizację głośności i usunięcie/renderowanie braku Loop w panelu admina. |
| `Audio/docs/README.md` | Aktualizuje instrukcję użytkownika PL/EN dla modułu Audio: opisuje różnicę między zwykłym odtworzeniem a **Loop**, czerwony aktywny stan, losowanie wariantów oraz brak przycisku Loop w `?admin=1`. |
| `Audio/docs/Documentation.md` | Aktualizuje dokumentację techniczną Audio: opisuje stan `activePlayers`, `loop`, `lastUrl`, `toggleLoop()`, `updateLoopButtonState()`, renderowanie Loop tylko poza adminem oraz powiązanie z suwakiem głośności. |
| `GeneratorNPC/index.html` | Rozszerza nadpisania bestiariusza o `keywords` i `keywordsEditing`, dodaje `EDITABLE_KEYWORDS_KEY`, wspólny renderer `createEditableTextRow(...)`, obsługę edycji „Słów Kluczowych”, zapis/odczyt/reset nadpisań i użycie nadpisanych słów kluczowych na karcie do druku. |
| `GeneratorNPC/style.css` | Dodaje/aktualizuje klasę `.editable-text-button`, aby przyciski **Edytuj/Zapisz** przy „Umiejętnościach” i „Słowach Kluczowych” miały jasny tekst i obramowanie w kolorze `var(--code)` oraz `opacity: 1`. |
| `GeneratorNPC/docs/README.md` | Aktualizuje instrukcję użytkownika PL/EN GeneratorNPC: opisuje edycję „Umiejętności” i „Słów Kluczowych”, przyciski **Edytuj/Zapisz**, zachowanie kolorowego podglądu i czarno-białej karty. |
| `GeneratorNPC/docs/Documentation.md` | Aktualizuje dokumentację techniczną GeneratorNPC: opisuje stan `keywords`/`keywordsEditing`, `EDITABLE_TEXT_FIELDS`, wspólny renderer pól tekstowych, serializację ulubionych, reset, kartę do druku i styl `.editable-text-button`. |
| `DetaleLayout.md` | Aktualizuje wspólny opis layoutu: aktywny czerwony przycisk **Loop** w Audio oraz jasny wariant przycisków **Edytuj/Zapisz** w GeneratorNPC. |

## Kontrola zakresu

Patch nie obejmuje plików `Analizy/*.md`, plików `AGENTS.md`, konfiguracji prywatnych ani danych źródłowych typu XLSX/JSON. Zakres został ograniczony do funkcji audio loop, edycji słów kluczowych w GeneratorNPC, wyglądu przycisków edycji oraz dokumentacji tych zmian.
