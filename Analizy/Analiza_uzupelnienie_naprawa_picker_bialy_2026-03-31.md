# Uzupełnienie analizy: co dokładnie zostało wdrożone w naprawie błędu pickera `#ffffff`

Data: 2026-03-31  
Moduł: `Infoczytnik`  
Zakres opisu wdrożenia: `Infoczytnik/GM_test.html`, `Infoczytnik/Infoczytnik_test.html`, `Infoczytnik/docs/*`

## Prompt użytkownika (oryginał)
> Bez dalszych zmian w kodzie uzupełnij analizę o to co dokładnie zrobiłeś, żeby naprawić błąd.

---

## Kontekst
To uzupełnienie dotyczy już wykonanej poprawki zgłoszonego błędu:
- przy ustawieniu koloru `#ffffff` (szczególnie sekcja Prefix/Suffix) picker sprawiał wrażenie, że przestaje działać.

Poniżej dokładny opis **co zostało wdrożone**.

## 1) Wersjonowanie plików testowych (cache-busting)
Zmieniono `INF_VERSION` z `2026-03-31_12-37-44` na `2026-03-31_14-20-00` w:
- `Infoczytnik/GM_test.html`
- `Infoczytnik/Infoczytnik_test.html`

Cel:
- wymuszenie odświeżenia zasobów po stronie przeglądarki i uniknięcie testowania starego kodu z cache.

## 2) Dodanie jawnego stanu źródła edycji koloru
W `GM_test.html` dodano obiekt stanu:
- `const colorEditSource = { message: 'text', ps: 'text' };`

Znaczenie:
- `message` i `ps` trzymają informację, czy ostatnia intencjonalna zmiana koloru pochodziła z:
  - pola tekstowego HEX (`text`),
  - czy pickera (`picker`).

Dlaczego to ważne:
- wcześniejsza logika opierała się na „czy text wygląda jak poprawny HEX”, co dla `#ffffff` stale dawało priorytet polu tekstowemu.
- nowa logika opiera się na **ostatnim kanale edycji**, nie tylko na kształcie wartości.

## 3) Rozszerzenie `resolveHexColor(...)`
Wdrożono nową sygnaturę:
- `resolveHexColor(textValue, pickerValue, fallback, preferText = true)`

Działanie:
- obie wartości są normalizowane,
- gdy `preferText=true`, priorytet ma tekst (jak wcześniej),
- gdy `preferText=false`, priorytet ma picker.

Efekt:
- można jawnie sterować, które źródło jest „prawdą” podczas renderu i budowania payloadu.

## 4) Podpięcie nowej logiki do `renderPreview()`
W `renderPreview()`:
- kolor wiadomości i Prefix/Suffix jest teraz liczony z uwzględnieniem `colorEditSource`.
- jeśli aktywny był picker, to picker ma pierwszeństwo,
- jeśli aktywny był tekst, to tekst ma pierwszeństwo.

Dodatkowo:
- pole tekstowe jest nadpisywane kolorem wynikowym natychmiast, gdy aktywny był picker,
- zachowano wcześniejsze bezpieczne zachowanie dla niepełnych wpisów HEX.

Skutek praktyczny:
- po wyborze `#ffffff` picker nie jest już „przykrywany” przez stale poprawny tekstowy HEX.

## 5) Podpięcie nowej logiki do `getPayload()`
Wysyłane do Firestore pola:
- `messageColor`, `prefixColor`, `suffixColor`

są wyliczane tą samą regułą źródła (`text`/`picker`) co preview.

Po co:
- spójność między tym, co widzi użytkownik w podglądzie, a tym, co rzeczywiście trafia do dokumentu `dataslate/current`.

## 6) Aktualizacja handlerów zdarzeń
Doprecyzowano wszystkie miejsca zmiany koloru:

1. `messageColorText` i `psColorText` (`input`/`change`):
   - ustawiają źródło na `text`.

2. `messageColorPicker` i `psColorPicker` (`input`/`change`):
   - ustawiają źródło na `picker`,
   - synchronizują value do pola tekstowego,
   - odpalają `renderPreview()`.

3. `blur` na polach tekstowych:
   - ustawia źródło na `text`,
   - normalizuje/uzupełnia wartość przez `resolveHexColor(..., preferText=true)`,
   - odświeża preview.

4. kliknięcia szybkich chipów:
   - ustawiają źródło na `text`,
   - wpisują ten sam kolor do tekstu i pickera,
   - odświeżają preview.

5. `restoreDefaults()`:
   - resetuje `colorEditSource` dla obu sekcji do `text`.

## 7) Aktualizacja dokumentacji modułu
Zaktualizowano:
- `Infoczytnik/docs/README.md` (PL+EN)
- `Infoczytnik/docs/Documentation.md`

Zakres opisów:
- dodany opis naprawy edge-case `#ffffff`,
- opis nowego mechanizmu „aktywnego kanału edycji”,
- informacja o podniesionej wersji testowej.

## 8) Co **nie** było zmieniane
Zgodnie z zasadami modułu:
- nie modyfikowano plików produkcyjnych `GM.html`, `Infoczytnik.html` ani backupów,
- zmiany dotyczyły wyłącznie plików testowych i dokumentacji.

## 9) Podsumowanie techniczne
Naprawa nie polegała na „specjalnym traktowaniu samego białego koloru”, tylko na:
1. usunięciu niejednoznaczności źródła prawdy (text vs picker),
2. jawnej pamięci ostatniego kanału edycji,
3. użyciu tej samej reguły zarówno w preview, jak i payloadzie.

Dzięki temu przypadek `#ffffff` przestał blokować odczuwalne działanie pickera.
