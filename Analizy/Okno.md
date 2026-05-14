# Problem z pozycjonowaniem okna hasła na telefonie

## Kontekst

W aplikacji z repozytorium `WrathAndGlory` pole do wpisania hasła, czyli bramka dostępu `accessGate`, pojawia się w dwóch modułach:

- `DataVault`
- `GeneratorNPC`

Na komputerze oba moduły działają prawidłowo.

Na telefonie pojawia się jednak różnica:

- w module `DataVault` okno hasła jest poprawnie widoczne i wyśrodkowane,
- w module `GeneratorNPC` ekran zostaje przyciemniony, ale samo okno hasła znajduje się poza widoczną częścią ekranu,
- okno widać dopiero po pomniejszeniu strony lub przesunięciu widoku.

Problem dotyczy wyłącznie położenia okna. Treść, fonty i działanie logowania są poprawne.

---

## Obserwacje

Komponent bramki dostępu jest współdzielony między modułami i korzysta ze wspólnego pliku:

```text
shared/access-gate.css
```

Obecnie główna definicja `.accessGate` wygląda tak:

```css
.accessGate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(0,0,0,.92);}
.accessGate[hidden]{display:none;}
.accessGate__card{width:min(520px,calc(100vw - 32px));border:1px solid var(--border,#1cff6b);background:#020802;padding:24px;}
```

Teoretycznie `position: fixed`, `inset: 0` i `place-items: center` powinny sprawiać, że okno będzie zawsze wyśrodkowane na ekranie.

W praktyce na telefonie moduł `GeneratorNPC` ma bardzo szeroką zawartość, głównie przez tabele i kolumny z wymuszonymi szerokościami minimalnymi. Strona może więc mieć większą szerokość niż widoczny ekran telefonu.

W takiej sytuacji mobilna przeglądarka może centrować element `fixed` względem rozciągniętego layoutu dokumentu, a nie względem realnie widocznego viewportu. Efekt jest taki, że półprzezroczyste przyciemnienie pokrywa ekran, ale karta hasła znajduje się poza widocznym obszarem.

---

## Wniosek

Najbardziej prawdopodobna przyczyna problemu to nie sama treść okna logowania, lecz sposób, w jaki mobilny layout `GeneratorNPC` rozpycha szerokość dokumentu.

`DataVault` zachowuje się poprawnie, ponieważ jego układ tabel i kontenerów lepiej izoluje szeroką zawartość od całego dokumentu.

`GeneratorNPC` prawdopodobnie powoduje poziome rozszerzenie strony, przez co bramka dostępu jest wyśrodkowana względem zbyt szerokiego obszaru.

---

## Cel poprawki

Poprawka powinna:

- ujednolicić zachowanie `accessGate` w `DataVault` i `GeneratorNPC`,
- sprawić, żeby okno hasła zawsze pojawiało się w widocznej części ekranu telefonu,
- nie zmieniać treści, fontów ani logiki działania okna,
- nie zepsuć widoku na komputerze,
- zachować obecny maksymalny rozmiar karty logowania na PC.

---

## Sugerowana poprawka główna

Najbezpieczniej poprawić wspólny plik:

```text
shared/access-gate.css
```

i zastąpić początkową definicję:

```css
.accessGate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(0,0,0,.92);}
.accessGate[hidden]{display:none;}
.accessGate__card{width:min(520px,calc(100vw - 32px));border:1px solid var(--border,#1cff6b);background:#020802;padding:24px;}
```

następującą wersją:

```css
.accessGate{
  position:fixed;
  left:0;
  top:0;
  z-index:9999;
  display:grid;
  place-items:center;
  width:100vw;
  max-width:100vw;
  height:100vh;
  height:100dvh;
  overflow:auto;
  padding:16px;
  background:rgba(0,0,0,.92);
}

.accessGate[hidden]{
  display:none;
}

.accessGate__card{
  width:min(520px,100%);
  border:1px solid var(--border,#1cff6b);
  background:#020802;
  padding:24px;
}
```

Następnie warto dodać mobilne doprecyzowanie:

```css
@media (max-width:640px){
  .accessGate{
    place-items:center;
    padding:16px;
  }

  .accessGate__card{
    max-height:calc(100dvh - 32px);
    overflow:auto;
  }
}
```

---

## Dlaczego ta poprawka powinna pomóc

Zamiast polegać wyłącznie na `inset: 0`, poprawka jawnie wymusza:

```css
width:100vw;
max-width:100vw;
height:100dvh;
```

Dzięki temu bramka dostępu ma być liczona względem rzeczywistego widocznego obszaru ekranu, a nie względem szerokości całego rozciągniętego dokumentu.

Dodatkowo:

```css
overflow:auto;
padding:16px;
```

zabezpiecza sytuację, w której ekran telefonu jest bardzo niski albo przeglądarka pokazuje dużo elementów interfejsu. Wtedy karta nie zostanie ucięta, tylko będzie można ją przewinąć.

Na PC karta nadal zachowuje maksymalną szerokość `520px`, więc wygląd desktopowy nie powinien się zmienić.

---

## Sugerowana poprawka dodatkowa dla GeneratorNPC

Niezależnie od samego okna logowania warto ograniczyć wpływ szerokich tabel na cały layout modułu `GeneratorNPC`.

W pliku:

```text
GeneratorNPC/style.css
```

można dodać:

```css
.card{
  overflow-x:auto;
}

.data-table{
  width:100%;
  min-width:max-content;
}
```

Ta poprawka sprawi, że szerokie tabele będą przewijały się poziomo wewnątrz swoich kart, zamiast rozpychać cały dokument.

---

## Priorytet zmian

### Poprawka konieczna

Zmiana w:

```text
shared/access-gate.css
```

To jest główna poprawka dotycząca położenia okna hasła.

### Poprawka zalecana

Zmiana w:

```text
GeneratorNPC/style.css
```

To jest poprawka porządkująca responsywność tabel i ograniczająca ryzyko podobnych problemów w przyszłości.

---

## Zakres ryzyka

Ryzyko zepsucia widoku PC jest niskie, ponieważ:

- karta nadal ma maksymalną szerokość `520px`,
- zachowane jest centrowanie przez `display: grid` i `place-items: center`,
- zmiana dotyczy głównie sposobu wyliczania obszaru overlayu na telefonie,
- logika JS, treść, fonty i struktura formularza nie są zmieniane.

---

## Podsumowanie

Problem najprawdopodobniej wynika z tego, że `GeneratorNPC` na telefonie rozciąga szerokość dokumentu przez szerokie tabele. W efekcie bramka dostępu jest centrowana względem rozszerzonego layoutu, a nie względem widocznego ekranu.

Najlepszym rozwiązaniem jest wymuszenie, aby `.accessGate` zawsze miało szerokość i wysokość realnego viewportu:

```css
width:100vw;
max-width:100vw;
height:100dvh;
```

oraz dodanie przewijania awaryjnego dla samego overlayu i karty.

Dodatkowo warto zamknąć szerokie tabele `GeneratorNPC` w poziomo przewijanych kontenerach, żeby nie rozpychały całej strony na telefonie.


## Zmiany wykonane w kodzie

### Plik: `shared/access-gate.css`

Lokalizacja: sekcja `.accessGate` oraz `@media (max-width:640px)`.

Było:

```css
.accessGate{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(0,0,0,.92);}
.accessGate__card{width:min(520px,calc(100vw - 32px));...}
```

Jest:

```css
.accessGate{position:fixed;left:0;top:0;width:100vw;max-width:100vw;height:100vh;height:100dvh;overflow:auto;padding:16px;...}
.accessGate__card{width:min(520px,100%);...}
@media (max-width:640px){ .accessGate__card{max-height:calc(100dvh - 32px);overflow:auto;} }
```

Opis: overlay bramki został jawnie przypięty do viewportu i dostał awaryjne przewijanie, aby karta hasła zawsze była widoczna na telefonie.

### Plik: `GeneratorNPC/style.css`

Lokalizacja: reguły `.card` i `.data-table`.

Było:

```css
/* brak lokalnego ograniczenia szerokości dla kart z tabelami */
```

Jest:

```css
.card{overflow-x:auto;}
.data-table{width:100%;min-width:max-content;}
```

Opis: szerokie tabele przewijają się poziomo w obrębie kart i nie rozpychają całego dokumentu na urządzeniach mobilnych.
