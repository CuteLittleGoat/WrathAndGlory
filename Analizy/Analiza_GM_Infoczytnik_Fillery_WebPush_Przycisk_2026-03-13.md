# Analiza wymagań: `Infoczytnik/GM_test.html` i `Infoczytnik/Infoczytnik_test.html`

## Prompt użytkownika
> Przeprowadź analizę dotyczącą kodu plików: Infoczytnik/GM_test.html i Infoczytnik/Infoczytnik_test.html
>
> 1. Nic nie zmieniaj w kodzie dotyczącym powiadomień Web Push
>
> 2. W module GM w sekcji z podglądem rozszerz sekcję w której wyświetlają się prefixy i suffixy, żeby były jeden pod drugim jak jest ich więcej niż jeden. Podobnie jak to jest obok pola do wpisania treści komunikatu. Załączam screeny
>
> 3. W Infoczytnik jest wyraźna różnica w odległości między wyświetlanymi prefixami, tekstem a suffixami.
> a. jak jest 5 linii fillerów to ostatnia linia prefixu jest w takiej samej odległości do początku tekstu jak od końca tekstu do pierwszej linii suffixu.
> b. Jeżeli linii fillerów jest mniej to jest wyraźna różnica w odległości między ostatnią linią prefixu a początkiem tekstu a ostatnią linią tekstu a początkiem suffixu.
>
> Należy to wyrównać. Zwróć uwagę, że jest też wyświetlane logo. Więc należy się skupić, żeby obniżyć sekcję suffixów.
>
> 4. Sprawdź czy przycisk "Włącz powiadomienia" jest niezbędny do działania PWA i Web Push
> 4.1 Jeżeli przycisk jest niezbędny to sprawdź czy nie można go przenieść do Main/index.html
> 4.2 Jeżeli można go przenieść to niech ma czerwony kolor, żeby się odróżniał.
>
> Przeanalizuj te wymagania, zaproponuj rozwiązania i zapisz wyniki w nowej analizie.

---

## 1) Stan obecny (as-is)

### 1.1 GM (`GM_test.html`) — podgląd prefix/suffix
- Blok podglądu „live preview” ma osobne elementy `#livePreviewPrefix` i `#livePreviewSuffix`.
- Wypełnienie treści podglądu odbywa się przez `join("\n")` dla tablic `prefixLines/suffixLines`.
- Jednak styl tej sekcji nie wymusza renderowania znaków nowej linii tak, jak w blokach `#prefixPreview` i `#suffixPreview`.

Wniosek: obecna logika danych wspiera wieloliniowość, ale sposób renderu w podglądzie może wizualnie „spłaszczać” separację linii i wyglądać inaczej niż dedykowane bloki preview obok pola wiadomości.

### 1.2 Infoczytnik (`Infoczytnik_test.html`) — odstępy prefix / tekst / suffix
- Sekcja ekranu ma układ: `.prefixRow` → `.msg` → `.suffixRow`.
- Odstępy są realizowane asymetrycznie: `margin-bottom` w `.prefixRow` oraz `margin-top` w `.suffixRow`.
- Prefix jest w wierszu współdzielonym z logo (`display:flex; justify-content:space-between`), więc jego wysokość zależy nie tylko od liczby linii prefixu, ale też od stałego boxa logo (`54x54`).

Wniosek: przy mniejszej liczbie linii prefixu logo utrzymuje wysokość górnego wiersza, co zaburza percepcję symetrii odstępów i sprawia, że sekcja suffixu wydaje się „za wysoko” względem dolnej części tekstu.

### 1.3 Web Push / PWA i przycisk „Włącz powiadomienia”
- Przycisk `#pushBtn` wywołuje `enablePushNotifications()`.
- W tej funkcji jest `Notification.requestPermission()`, rejestracja SW i zapis subskrypcji do backendu.
- Dodatkowo SW rejestrowany jest także „w tle” na starcie (`ensureServiceWorkerRegistration()`), ale bez wymuszenia zgody i bez tworzenia subskrypcji push.

Wniosek:
- **Dla PWA** (instalowalność, cache, SW) ten przycisk nie jest wymagany.
- **Dla Web Push** jakiś element wywoływany przez użytkownika (gesture) jest praktycznie wymagany, aby legalnie i przewidywalnie wykonać `Notification.requestPermission()` i utworzyć subskrypcję.

---

## 2) Odpowiedź na wymagania użytkownika

## 2.1 Wymaganie 1 — „nie zmieniać kodu Web Push”
Rekomendacja: wszystkie poprawki layoutu (pkt 2 i 3) wykonać wyłącznie w CSS/HTML renderu fillerów. Funkcje:
- `getPushConfig`,
- `refreshPushButtonState`,
- `setPushButtonMessage`,
- `enablePushNotifications`,
- `ensureServiceWorkerRegistration`,
oraz endpointy backendowe pozostawić bez ingerencji.

## 2.2 Wymaganie 2 — GM: prefixy i suffixy jeden pod drugim
Rekomendacja implementacyjna (bez zmiany logiki losowania):
1. W sekcji live preview wymusić render wielolinii analogiczny do `prefixPreview/suffixPreview`:
   - opcja A: `white-space: pre-line` na `.livePreviewBox .prefix` i `.livePreviewBox .suffix`,
   - opcja B: zamiana zawartości na listę `<div class="line">` per linia.
2. Zachować `textContent` (bez `innerHTML`) dla bezpieczeństwa.
3. Nie zmieniać pól wysyłanych do Firestore (`prefixLines/suffixLines` pozostają bez zmian).

Efekt: w podglądzie GM wiele linii będzie prezentowane pionowo 1:1 tak jak w panelach pod tekstem wiadomości.

## 2.3 Wymaganie 3 — wyrównanie odstępów w Infoczytnik
Problem źródłowy to połączenie prefixu i logo we wspólnym flex-row oraz niezależne marginesy góra/dół. Najbezpieczniejsze rozwiązanie:

1. Zastąpić układ marginesowy układem kolumnowym z kontrolowanymi „przerwami sekcji”:
   - `.screen` jako `display:flex; flex-direction:column;`
   - zdefiniować stałe zmienne:
     - `--gap-prefix-to-msg`
     - `--gap-msg-to-suffix`
   - ustawić je równo lub świadomie asymetrycznie (np. większy dół, zgodnie z Twoją uwagą o „obniżeniu suffixów”).

2. Rozdzielić wpływ logo na geometrię:
   - zachować logo po prawej, ale wyrównać je do topu prefixu i nie pozwolić, by wysokość logo sztucznie „dźwigała” cały blok prefixu przy małej liczbie linii.
   - praktycznie: osobny wrapper dla tekstu prefixu i kontrola `align-self`/`min-height` tylko tam, gdzie konieczne.

3. Dla celu „obniżyć suffix”:
   - zwiększyć tylko `--gap-msg-to-suffix` (np. clamp z odrobinę większym minimum),
   - pozostawić `--gap-prefix-to-msg` bez zmian lub minimalnie zmniejszyć.

4. Przetestować 1..5 linii fillerów oraz z logo on/off, by potwierdzić brak „skoków optycznych”.

## 2.4 Wymaganie 4 — czy przycisk „Włącz powiadomienia” jest niezbędny i czy można go przenieść

### Czy jest niezbędny?
- **Dla PWA:** nie.
- **Dla Web Push:** nie sam przycisk jako taki, ale **mechanizm uruchamiany akcją użytkownika** jest de facto potrzebny.

### Czy można przenieść do `Main/index.html`?
Tak, technicznie można, ponieważ:
- permission `Notification` jest na poziomie origin,
- SW jest wspólny (`/service-worker.js`),
- subskrypcję można wykonać z dowolnej strony tego samego origin, o ile ma dostęp do configu i endpointu.

Warunki bezpiecznego przeniesienia:
1. Przenieść/udostępnić logikę subskrypcji do wspólnego skryptu (żeby nie dublować kodu).
2. Zapewnić dostęp do `vapidPublicKey` i `subscribeEndpoint` również z Main.
3. Zachować kompatybilność źródła (`source`) jeśli backend raportuje statystyki per moduł.

### Kolor czerwony przy przeniesieniu
- Wymaganie 4.2 jest możliwe do spełnienia czysto stylami (np. dedykowana klasa wariantu ostrzegawczego/akcyjnego).

---

## 3) Proponowana sekwencja wdrożenia (plan)

1. **Etap A (GM preview):** poprawa renderu multiline prefix/suffix w `GM_test.html` (bez zmian Web Push).
2. **Etap B (Infoczytnik spacing):** przebudowa odstępów na kontrolowany układ kolumnowy, test 1..5 linii + logo on/off.
3. **Etap C (decyzja o przycisku):**
   - wariant 1: zostaje w Infoczytnik (najmniejszy zakres zmian),
   - wariant 2: migracja do Main + czerwony styl + wspólny moduł JS do subskrypcji.
4. **Etap D (testy):** ręczne scenariusze wizualne i test przepływu push od subskrypcji do triggera.

---

## 4) Ryzyka i uwagi

1. Zmiany w spacingu łatwo zepsuć dla konkretnego layoutu frakcji (inne insets i proporcje tła), więc testy powinny objąć co najmniej mechanicus + inquisition + militarum.
2. Przeniesienie przycisku do Main poprawia onboarding, ale użytkownik może nie odwiedzić Main przed wejściem do Infoczytnika — warto zostawić fallback (np. link/informację) także w Infoczytniku.
3. Zgodnie z wymaganiem nr 1: żadna z rekomendacji nie wymaga ingerencji w samą logikę Web Push.

---

## 5) Decyzja rekomendowana

- Wdrożyć pkt 2 i 3 jako poprawki UI/CSS.
- Nie ruszać logiki Web Push.
- Przycisk push można przenieść do Main, ale najlepiej jako etap osobny po zatwierdzeniu UX (i z zachowaniem fallbacku informacyjnego w Infoczytniku).
