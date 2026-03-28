# Analiza modułu Infoczytnik — nowy layout bez prefix/suffix/flicker/logo + zachowanie audio

## Prompt użytkownika
> Przeprowadź mi analizę modułu Infoczytnik.
> Chcę rozbudować moduł. Chcę dodać nowy layout. W tym layoucie ma nie być prefixów, suffixów, efektu Flicker i logo. Nie powinno też być możliwości ich dodania w panelu (zablokowane/wyszarzone przyciski lub po prostu mają zostać ukryte w panelu GM - zaproponuj rozwiązanie).
> Przeprowadź mi analizę wprowadzenia takiej funkcji.
>
> Ma się też nie odtwarzać plik audio Infoczytnik/assets/audio/global/Message.mp3
>
> Dodatkowo przeprowadź drugą analizę. Czy jak zmienię nazwę pliku Infoczytnik/assets/audio/global/Message.mp3 na Infoczytnik/assets/audio/global/old_Message.mp3 i wgram nowy plik o nazwie Infoczytnik/assets/audio/global/Message.mp3 to czy aplikacja zignoruje old_Message.mp3 i odtworzy tylko nowy plik mp3?

---

## 1) Stan obecny (jak działa moduł teraz)

### 1.1 Panel GM (`GM_test.html`)
- Wybór layoutu jest realizowany przez `<select id="faction">` i aktualnie obsługuje 8 frakcji/layoutów.
- Panel ma aktywne kontrolki:
  - losowanie i podgląd prefix/suffix,
  - `showLogo` (checkbox),
  - `flicker` (checkbox).
- Przy wysyłce `type: "message"` panel zawsze przekazuje do Firestore m.in. `prefixLines`, `suffixLines`, `showLogo`, `flicker`.

### 1.2 Ekran odbiorczy (`Infoczytnik_test.html`)
- Odbiornik przy `type: "message"` buduje prefix/suffix z danych dokumentu (`prefixLines` lub fallback z list fillerów), nawet gdy nie przyszły jawne pola `prefix` i `suffix`.
- Odbiornik zawsze uruchamia odtwarzanie audio dla wiadomości: finalnie liczy `msgUrl` i wywołuje `window.__dsPlayUrlOnce(msgUrl)`.
- Domyślny fallback audio wiadomości to `assets/audio/global/Message.mp3?v=${ASSET_VERSION}`.

---

## 2) Analiza wdrożenia nowego layoutu „bez dodatków”

### Cel funkcjonalny
Dodać nowy layout (np. `silent_clean`), który wymusza:
1. brak prefixów,
2. brak suffixów,
3. brak logo,
4. brak flicker,
5. brak dźwięku wiadomości (`Message.mp3`),
6. brak możliwości włączenia powyższych opcji z panelu GM.

### 2.1 Najbezpieczniejsza architektura: podwójne zabezpieczenie

**A. Blokada w panelu GM (UX + prewencja):**
- Po wybraniu layoutu `silent_clean` ukryć lub zablokować sekcje:
  - filler/prefix/suffix,
  - `showLogo`,
  - `flicker`.
- Wysyłka dokumentu dla tego layoutu powinna wymuszać wartości „off” niezależnie od stanu kontrolek:
  - `prefixLines: []`, `suffixLines: []`,
  - `showLogo: false`, `flicker: false`,
  - opcjonalnie nowa flaga: `disableMessageAudio: true`.

**B. Wymuszenie po stronie Infoczytnika (hard guard):**
- Gdy przyjdzie `faction === "silent_clean"`:
  - nie generować fallbacku prefix/suffix,
  - zawsze wyłączyć logo,
  - zawsze wyłączyć flicker,
  - nie wywoływać odtwarzania audio message.

Ta kombinacja jest odporna na przypadkowe ręczne modyfikacje dokumentu Firestore (np. ktoś wstrzyknie `showLogo: true`).

### 2.2 Ukryć czy wyszarzyć w panelu?

**Rekomendacja:** _wyszarzyć + dodać krótki opis „niedostępne dla tego layoutu”_.

Powód:
- użytkownik GM widzi, że funkcja istnieje globalnie, ale jest zablokowana dla wybranego layoutu (mniej pytań „gdzie zniknęło?”),
- mniej „skakania” interfejsu niż przy dynamicznym ukrywaniu sekcji,
- łatwiejsza lokalizacja (PL/EN) i spójność dokumentacji.

Technicznie można też całe sekcje ukryć (`display:none`), ale to gorsze pod kątem czytelności trybów działania.

### 2.3 Konkretne miejsca zmian (zakres)

1. `Infoczytnik/GM_test.html`
   - dodać opcję layoutu do `<select id="faction">`,
   - dodać logikę `isRestrictedLayout` dla `silent_clean`,
   - w `sendMessage()` i `ping()` wymusić pola off dla restricted layout,
   - w podglądzie live dla restricted layout pokazywać tylko treść komunikatu.

2. `Infoczytnik/Infoczytnik_test.html`
   - dodać tło layoutu w `LAYOUT_BG` (i ewentualnie insets/AR),
   - w `onSnapshot` dodać warunek layoutu restricted:
     - prefix/suffix = puste,
     - logo/flicker zawsze off,
     - pominięcie `window.__dsPlayUrlOnce(msgUrl)`.

3. Zgodność produkcyjna
   - obecnie użytkownik ręcznie przenosi zmiany do `GM.html` i `Infoczytnik.html`, więc po testach trzeba przenieść analogiczny patch 1:1.

### 2.4 Potencjalne ryzyka i jak je zbić

1. **Ryzyko fallbacku fillerów mimo pustych tablic**
   - Obecny kod ma fallback z `getFillerText()` gdy `prefix/suffix` puste i jest `text`.
   - Dla restricted layout trzeba ten fallback wyciąć warunkowo.

2. **Ryzyko ponownego dźwięku przez `msgUrl` z Firestore**
   - Nawet gdy ktoś poda własne `msgUrl`, restricted layout powinien ignorować audio całkowicie.

3. **Ryzyko niespójności GM vs odbiornik**
   - Potrzebny hard guard po obu stronach (nie tylko UI).

### 2.5 Szacowanie prac

- Implementacja logiczna: mała/średnia (głównie warunki i jedna nowa opcja layoutu).
- Testy manualne: średnie (scenariusze message/ping/clear + przełączanie layoutów).
- Ryzyko regresji: niskie, jeśli zmiana warunkowana tylko dla jednego nowego klucza layoutu.

---

## 3) Analiza audio i zmiany nazwy `Message.mp3`

### Pytanie A
„Czy dla nowego layoutu można sprawić, by nie odtwarzał się `assets/audio/global/Message.mp3`?”

**Tak.**
Najprościej: w gałęzi `d.type === "message"` dodać warunek, że jeśli `faction === "silent_clean"` (lub `disableMessageAudio === true`), to **nie** wywoływać `window.__dsPlayUrlOnce(...)`.

### Pytanie B
„Jeśli zmienię nazwę starego pliku `Message.mp3` na `old_Message.mp3`, a nowy plik wrzucę jako `Message.mp3`, czy aplikacja zignoruje `old_Message.mp3`?”

**Tak, z punktu widzenia obecnego kodu — będzie odtwarzany tylko plik wskazany przez ścieżkę `assets/audio/global/Message.mp3?...`**.

Dlaczego:
- Kod używa konkretnej ścieżki fallbacku (`DEFAULT_MSG_URL`) do `Message.mp3`,
- nie ma skanowania katalogu ani mechanizmu „wybierz pierwszy mp3”,
- plik `old_Message.mp3` nie będzie użyty, dopóki żaden fragment kodu nie wskaże go jawnie.

Uwaga praktyczna:
- ponieważ URL zawiera `?v=${ASSET_VERSION}`, po podmianie pliku dobrze podnieść wersję cache-busting (żeby klient na pewno pobrał nową zawartość, a nie stary cache).

---

## 4) Rekomendowany plan wdrożenia (krótki)

1. Dodać layout `silent_clean` w `GM_test.html` i `Infoczytnik_test.html`.
2. W GM: wyszarzyć kontrolki prefix/suffix/logo/flicker przy `silent_clean` + wymuszać wartości off przy zapisie.
3. W Infoczytniku: dodać twardy warunek layoutu — bez fillerów, bez logo, bez flicker, bez audio message.
4. Przetestować 6 scenariuszy: `message/ping/clear` dla layoutu normalnego i `silent_clean`.
5. Po akceptacji przenieść zmiany do plików produkcyjnych (`GM.html`, `Infoczytnik.html`) ręcznie.
