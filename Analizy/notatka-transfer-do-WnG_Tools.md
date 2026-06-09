# Notatka transferowa do repozytorium `WnG_Tools`

Data przygotowania: 2026-06-09

Plik patcha do przeniesienia: `Analizy/patch-audio-loop-generatornpc.patch`

## Co robi patch

Patch przenosi dwie grupy zmian:

1. **Audio — opcja Loop**
   - Dodaje przełącznik **Loop** w zwykłym widoku użytkownika modułu Audio.
   - Pierwsze kliknięcie uruchamia dźwięk i aktywuje pętlę.
   - Po zakończeniu pliku aplikacja startuje kolejne odtworzenie jak po ponownym kliknięciu Play.
   - Przy kilku wariantach dźwięku kolejne odtworzenia są losowane i próbują unikać natychmiastowej powtórki tego samego URL.
   - Ponowne kliknięcie aktywnego **Loop** zatrzymuje odtwarzanie i wyłącza czerwony stan.
   - Przycisk **Loop** jest renderowany tylko w prawdziwym widoku użytkownika, bez `?admin=1`; panel admina zostaje przy zwykłym odsłuchu **Odtwórz/Zatrzymaj**.

2. **GeneratorNPC — edycja słów kluczowych i jaśniejsze przyciski edycji**
   - Rozszerza mechanizm nadpisań bestiariusza o pole „Słowa Kluczowe”.
   - Uogólnia edytowalny wiersz tekstowy tak, aby działał dla „Umiejętności” i „Słów Kluczowych”.
   - Zachowuje kolorowy podgląd słów kluczowych w tabeli bazowej oraz czarno-biały wygląd wygenerowanej karty.
   - Używa nadpisanych słów kluczowych przy generowaniu karty.
   - Dodaje jasny tekst i jasne obramowanie przycisków **Edytuj/Zapisz** dla edytowalnych pól tekstowych w kolorze `var(--code)`.

## Fragmenty, które mogą wymagać dostosowania do angielskiej wersji aplikacji

- Patch rozpoznaje kolumny danych po polskich nazwach: `"Umiejętności"` i `"Słowa Kluczowe"`. W `WnG_Tools` trzeba sprawdzić, czy angielska wersja danych używa odpowiedników typu `"Skills"` i `"Keywords"`. Jeśli tak, należy dostosować stałe `EDITABLE_SKILLS_KEY`, `EDITABLE_KEYWORDS_KEY`, odczyt `getRecordValue(...)` oraz ewentualne formatowanie kolumn.
- Etykiety UI w dokumentacji i części tekstów mogą mieć polskie brzmienie: **Odtwórz**, **Zatrzymaj**, **Edytuj**, **Zapisz**, **Słowa Kluczowe**, **Umiejętności**. W angielskim repo należy dopasować je do aktualnego systemu tłumaczeń.
- Dokumentacja `docs/README.md`, `docs/Documentation.md` i `DetaleLayout.md` w patchu jest dwujęzyczna zgodnie z regułami repo `WrathAndGlory`. Jeśli `WnG_Tools` utrzymuje tylko wersję angielską albo inną strukturę dokumentacji, te fragmenty trzeba przeredagować zamiast przenosić 1:1.
- Selektory i układ DOM mogą różnić się w `WnG_Tools`; szczególnie należy sprawdzić kontenery `data-playback-root`, `data-action="loop"`, `data-role="volume"`, `renderUserMainView()`, `renderUserFavorites()` oraz renderer tabeli bestiariusza.

## Czy patch zawiera polskie etykiety UI

Tak. Patch dotyka polskojęzycznych nazw danych i etykiet opisowych, między innymi `"Słowa Kluczowe"`, `"Umiejętności"`, **Edytuj**, **Zapisz**, **Odtwórz** i **Zatrzymaj**. Sam przycisk **Loop** pozostaje angielski. Przed zastosowaniem w `WnG_Tools` trzeba sprawdzić, czy te nazwy są w tym repo używane w danych, czy powinny zostać zamienione na angielskie odpowiedniki.

## Ryzyko przeniesienia prywatnych danych

Patch nie powinien przenosić prywatnych danych. Nie obejmuje tokenów, haseł, konfiguracji produkcyjnych, plików Firebase z sekretami, arkuszy XLSX ani danych użytkowników. Zawiera wyłącznie zmiany w HTML/CSS/JS i dokumentacji.

## Na co uważać przy przenoszeniu do `WnG_Tools`

- Nie stosować patcha bezpośrednio, jeśli struktura modułów w `WnG_Tools` ma inne ścieżki niż `Audio/` i `GeneratorNPC/`.
- Przed aplikacją patcha porównać aktualne funkcje odtwarzania audio, szczególnie sposób kluczowania `activePlayers`. Ten patch zakłada kluczowanie po widocznym elemencie `playbackRoot`.
- Nie zastępować losowania wariantów natywnym `audio.loop = true`, bo natywna pętla powtarzałaby ten sam plik i nie spełni wymogu losowania wariantów.
- Po przeniesieniu sprawdzić, czy kolejne iteracje Loop respektują aktualną wartość suwaka głośności.
- Przy GeneratorNPC zweryfikować formatowanie słów kluczowych po zapisie. Podgląd bazowy powinien przechodzić przez dotychczasowy formatter słów kluczowych, a karta do druku powinna pozostać czarno-biała.
- Zweryfikować zapis i odczyt ulubionych/stanu po dodaniu pola `keywords`, aby nie utracić zgodności ze starszymi zapisami.
- Jeśli `WnG_Tools` nie ma dokumentu `DetaleLayout.md`, zmiany layoutowe trzeba przenieść do właściwego dokumentu projektowego albo pominąć część dokumentacyjną.
- Po aplikacji patcha uruchomić testy manualne w zwykłym widoku użytkownika i w panelu admina, aby potwierdzić, że **Loop** nie pojawia się w `?admin=1`.
