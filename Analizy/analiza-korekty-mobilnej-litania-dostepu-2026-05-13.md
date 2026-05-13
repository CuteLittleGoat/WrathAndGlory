# Data analizy
2026-05-13

# Temat analizy
Korekta widoku mobilnego okna hasła „Litania Dostępu” po ostatniej poprawce layoutu.

# Oryginalny pełny prompt użytkownika
Przeczytaj analizę Analizy/analiza-poprawy-okna-hasla-litania-dostepu.md
Po ostatniej poprawce popsuł się widok w wersji mobilnej.
W Analizy/Screenshot_2026-05-12-14-16-05-231_com.android.chrome.png masz screena jak to wyglądało przed poprawką na telefonie.
W Analizy/PC.jpg masz screena jak to obecnie (po poprawce) wygląda na PC. Jest prawidłowo.
W Analizy/Screenshot_2026-05-13-12-41-06-827_com.android.chrome.png masz screena jak to wygląda po poprawce na telefonie.

Po poprawce na telefonie nie widać napisu "Litania dostępu" (ciemniejszym fontem). Przed poprawką układ w wersji mobilnej był ok.
W jednej linii "Litania dostępu" (ciemniejszym fontem), niżej pole do wpisania hasła i jeszcze niżej przycisk.
Pod tym wszystkim ewentualnie pole na komunikat błędu.

Dodatkowa informacja - po poprawce zarówno w wersji na telefon jak i na PC czerwony komunikat błędu wyświetla się prawidłowo.

Przeprowadź analizę korekty, żeby w widoku mobilnym wszystko się wyświetlało i żeby nic się nie popsuło w widoku PC.

# Zakres analizy
- Odczyt wcześniejszej analizy: `Analizy/analiza-poprawy-okna-hasla-litania-dostepu.md`.
- Porównanie screenshotów mobilnych „przed” i „po”.
- Weryfikacja aktualnej implementacji layoutu w `shared/access-gate.css` oraz markupu w `DataVault/index.html` i `GeneratorNPC/index.html`.
- Wskazanie minimalnej, bezpiecznej korekty CSS, która naprawi mobile i nie naruszy desktopu.

# Wnioski
## 1) Główna przyczyna problemu na mobile
W `shared/access-gate.css` w media query `@media (max-width:640px)` elementy `.accessGate__label`, `.accessGate__password`, `.accessGate__submit` mają ustawione tylko `grid-column: 1`, ale **nie mają nadpisanych `grid-row`**.

Poza media query elementy mają:
- `.accessGate__label { grid-row: 1; }`
- `.accessGate__password { grid-row: 1; }`
- `.accessGate__submit { grid-row: 2; }`

To powoduje, że w mobile etykieta i input dalej lądują w tym samym wierszu siatki (row 1), a biały input wizualnie przykrywa napis „Litania Dostępu”.

## 2) Dlaczego PC działa poprawnie
Desktop ma układ 2-kolumnowy i kolizja row 1 nie przeszkadza, bo elementy są w różnych kolumnach (etykieta po lewej, input po prawej). Dlatego widok PC po poprawce wygląda prawidłowo.

## 3) Komunikat błędu jest niezależny od problemu
`#accessError` (`.accessGate__error`) jest poza gridem `.accessGate__credentials`, więc czerwony komunikat błędu wyświetla się poprawnie zarówno na mobile, jak i PC — zgodnie z obserwacją użytkownika.

# Rekomendowana korekta
## Minimalna poprawka (tylko CSS, bez zmian HTML/JS)
W media query mobilnym dopisać jawne kolejki wierszy:

```css
@media (max-width:640px){
  .accessGate__credentials{grid-template-columns:1fr;row-gap:10px;}
  .accessGate__label,.accessGate__password,.accessGate__submit{grid-column:1;justify-self:stretch;}
  .accessGate__label{grid-row:1;}
  .accessGate__password{grid-row:2;}
  .accessGate__submit{grid-row:3;justify-self:end;}
}
```

Efekt po tej korekcie na telefonie:
1. wiersz 1: „Litania Dostępu” (ciemniejszy napis),
2. wiersz 2: pole hasła,
3. wiersz 3: przycisk,
4. poniżej (jak dotychczas): pole czerwonego błędu.

## Dlaczego ta korekta jest bezpieczna
- Dotyka wyłącznie breakpointu mobilnego (`max-width:640px`).
- Nie zmienia selektorów JS (`#accessForm`, `#accessPassword`, `#accessError`).
- Nie wpływa na desktopowy układ 2-kolumnowy.
- Działa centralnie dla obu modułów (`DataVault`, `GeneratorNPC`) przez wspólny plik `shared/access-gate.css`.

# Ryzyka
- Jeśli gdzieś indziej w projekcie `#accessForm` byłby użyty z inną strukturą HTML, ten sam CSS mógłby wpłynąć na tamten widok. W aktualnie sprawdzonych modułach struktura jest spójna.
- Przy bardzo wąskich ekranach przycisk wyrównany do prawej może optycznie wyglądać „ciasno”; to UX-owo akceptowalne i zgodne z oczekiwaniem użytkownika.

# Następne kroki
1. Wdrożyć powyższą korektę w `shared/access-gate.css`.
2. Zweryfikować manualnie oba moduły (`DataVault`, `GeneratorNPC`) na:
   - mobile (<=640px),
   - desktop (>640px).
3. Potwierdzić:
   - widoczność napisu „Litania Dostępu” na mobile,
   - prawidłową kolejność label → input → button,
   - brak regresji na PC,
   - poprawne działanie komunikatu błędu.


## Zmiany wykonane w kodzie

### Plik: `shared/access-gate.css`

Lokalizacja: sekcja `@media (max-width:640px)`

Było:

```css
.accessGate__label,.accessGate__password,.accessGate__submit{grid-column:1;justify-self:stretch;}
.accessGate__submit{justify-self:end;}
```

Jest:

```css
.accessGate__label,.accessGate__password,.accessGate__submit{grid-column:1;justify-self:stretch;}
.accessGate__label{grid-row:1;}
.accessGate__password{grid-row:2;}
.accessGate__submit{grid-row:3;justify-self:end;}
```

Opis: dodano jawne `grid-row` dla mobile, aby etykieta „Litania Dostępu” nie była przykrywana przez pole hasła.

### Plik: `DataVault/docs/README.md`

Lokalizacja: sekcja `Układ pola „Litania Dostępu”` (PL/EN)

Było: ogólny opis układu pionowego na telefonie.

Jest: doprecyzowana kolejność wierszy na mobile (etykieta → pole hasła → przycisk + błąd pod formularzem).

### Plik: `DataVault/docs/Documentation.md`

Lokalizacja: sekcja `🇬🇧 “Litany of Access” field layout`

Było: brak technicznego opisu wymuszenia kolejności wierszy mobilnych.

Jest: dopisany opis `max-width: 640px` i jawnych `grid-row` w `shared/access-gate.css`.

### Plik: `GeneratorNPC/docs/README.md`

Lokalizacja: sekcja `Układ pola „Litania Dostępu”` (PL/EN)

Było: ogólny opis układu pionowego na telefonie.

Jest: doprecyzowana kolejność wierszy na mobile (etykieta → pole hasła → przycisk + błąd pod formularzem).

### Plik: `GeneratorNPC/docs/Documentation.md`

Lokalizacja: sekcja `🇬🇧 “Litany of Access” field layout`

Było: brak technicznego opisu wymuszenia kolejności wierszy mobilnych.

Jest: dopisany opis `max-width: 640px` i jawnych `grid-row` w `shared/access-gate.css`.
