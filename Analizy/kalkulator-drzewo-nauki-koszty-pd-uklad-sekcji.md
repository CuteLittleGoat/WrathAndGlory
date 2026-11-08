# Kalkulator — audyt Drzewa Nauki, kosztów PD i wyglądu sekcji „Umiejętności” oraz „Inne”

> **Data analizy:** 8 listopada 2026 (prompt główny: 3 listopada 2026, uzupełnienie: 8 listopada 2026)
> **Moduł:** `Kalkulator` — Prosty Kreator Postaci, Zaawansowany Kreator Postaci, Kalkulator PD
> **Pliki objęte analizą:** `Kalkulator/TworzeniePostaci.html`, `Kalkulator/TworzeniePostaci_v2.html`, `Kalkulator/TworzeniePostaci_v2-core.js`, `Kalkulator/KalkulatorXP.html` (pomocniczo `TworzeniePostaci_v2-firebase.js`, `TworzeniePostaci_v2-pdf.js`, `kalkulatorxp.css`, `HowToUse/pl.pdf`)
> **Stan kodu przed zmianami:** commit `883ca16` (gałąź `main`)
> **Poprawki w kodzie:** commit `f179d82` na gałęzi `claude/cool-maxwell-5l0irv`; do czasu jej scalenia gałąź `main` ma kod sprzed poprawek
> **Charakter dokumentu:** audyt z pomiarami w przeglądarce oraz opis wprowadzonych poprawek. Zmieniony został wyłącznie Zaawansowany Kreator Postaci (Drzewo Nauki, wygląd sekcji „Umiejętności” i „Inne”). Prosty Kreator Postaci i Kalkulator PD są bez zmian.
> **Odpowiedź w skrócie:** Prosty Kreator liczy Drzewo Nauki **poprawnie**, zgodnie z podręcznikiem. Zaawansowany Kreator stosował **inną, „piramidową” regułę**, której nie ma w podręczniku: była dużo surowsza (Analiza 4 wymagała 8 umiejętności zamiast 4), a umiejętności na poziomie 6–8 zawsze dawały błąd. Reguła została zastąpiona regułą z podręcznika i teraz oba kreatory dają identyczny wynik dla każdego układu. Obliczanie PD jest w obu kreatorach **identyczne i zgodne z tabelami z podręcznika** (3000 losowych postaci bez jednej rozbieżności); różnią się tylko obsługą nietypowych wpisów i sposobem pokazywania dwóch błędów naraz. `KalkulatorXP.html` liczy **poprawnie** wszystkie 250 możliwych par wartości. Sekcje „Umiejętności” i „Inne” w Zaawansowanym Kreatorze wyglądają i działają teraz jak w Prostym.

---

## Spis treści

1. [Prompty użytkownika (pełne)](#1-prompty-użytkownika-pełne)
2. [Zakres](#2-zakres)
3. [Podsumowanie wyników](#3-podsumowanie-wyników)
4. [Zasada Drzewa Nauki — wzorzec do porównań](#4-zasada-drzewa-nauki--wzorzec-do-porównań)
5. [Drzewo Nauki w Prostym Kreatorze](#5-drzewo-nauki-w-prostym-kreatorze)
6. [Drzewo Nauki w Zaawansowanym Kreatorze — stan przed poprawką](#6-drzewo-nauki-w-zaawansowanym-kreatorze--stan-przed-poprawką)
7. [Poprawka Drzewa Nauki w Zaawansowanym Kreatorze i weryfikacja](#7-poprawka-drzewa-nauki-w-zaawansowanym-kreatorze-i-weryfikacja)
8. [Moment pojawiania się i znikania komunikatów](#8-moment-pojawiania-się-i-znikania-komunikatów)
9. [Obliczanie PD — porównanie obu kreatorów](#9-obliczanie-pd--porównanie-obu-kreatorów)
10. [Kalkulator PD (`KalkulatorXP.html`)](#10-kalkulator-pd-kalkulatorxphtml)
11. [Sekcja „Umiejętności” w Zaawansowanym Kreatorze](#11-sekcja-umiejętności-w-zaawansowanym-kreatorze)
12. [Sekcja „Inne” w Zaawansowanym Kreatorze](#12-sekcja-inne-w-zaawansowanym-kreatorze)
13. [Zmienione pliki](#13-zmienione-pliki)
14. [Ryzyka](#14-ryzyka)
15. [Rekomendacje i decyzje do podjęcia](#15-rekomendacje-i-decyzje-do-podjęcia)
16. [Następne kroki](#16-następne-kroki)
17. [Załącznik — metoda testów](#17-załącznik--metoda-testów)

---

## 1. Prompty użytkownika (pełne)

### 1.1 Prompt główny (3 listopada 2026)

> Zapoznaj się z modułem Kalkulator (zarówno wersja prosta Kalkulator/TworzeniePostaci.html jak i zaawansowana Kalkulator/TworzeniePostaci_v2.html).
> Przeprowadź pełen audyt czy zasada "Drzewa Nauki" jest poprawnie wyliczana. Sprawdź czy komunikat o błędzie pojawia się w prawidłowym momencie i czy znika po naprawieniu błędu.
>
> Wyniki audytu zapisz w folderze Analizy/
>
> Poniżej wklejam opis zasady "Drzewa Nauki" z podręcznika.
>
>
> DRZEWKO NAUKI
> W trakcie rozwijania wiedzy i szkolenia w jednym obszarze zdobywasz też fragmenty informacji z innych dziedzin. Dzięki temu, aby rozwinąć dalej jakąś Umiejętność, będziesz potrzebować podstaw wiedzy z innych dyscyplin.
>
> Aby podnieść wartość Umiejętności do wyższego poziomu, najpierw musisz posiadać ogólną liczbę Umiejętności równą tej nowej wartości. Więc jeśli wartość Atletyki wynosi 4, musisz mieć punkty w przynajmniej trzech innych Umiejętnościach.
>
> Przykład: Jordan ma pomysł na postać, która jest muskularną i bardzo dobrą akrobatką, więc chce zacząć z wartością Atletyki na 4. Wydaje 2 PD, aby rozwinąć Atletykę na 1, ale potrzebuje zdobyć więcej Umiejętności, aby móc dodać kolejne punkty do tej Umiejętności.
>
> Wydaje 6 PD; 2 PD na Czujność 1, 2 PD na Umiejętności strzeleckie 1 i 2 PD na Ukrywanie się 1. Teraz postać Jordan ma 4 Umiejętności: Atletykę, Czujność, Umiejętności strzeleckie i Ukrywanie się. Wydaje dalsze 4 PD, aby rozwinąć Atletykę na 2 i kolejne 6 PD, by podnieść ją na 3 oraz następne 8 PD, podnosząc Atletykę na 4.
>
> Jordan uważa, że postać powinna też być całkiem dobrze wyszkolona w posługiwaniu się bronią. Wydaje 4 PD, aby zwiększyć Umiejętności strzeleckie do 2. Ponieważ jej bohaterka zna 4 Umiejętności, może nadal wydawać PD, aby rozwinąć Umiejętności strzeleckie do maksymalnie 4, jeśli tylko by chciała.
>
> Przykład A. Kroki jakie wykonuję:
>
> 1. Uruchamiam Prosty Kreator Postaci (https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/TworzeniePostaci.html)
> 2. Zmieniam wartość "Analiza (Int)" z 0 na 1.
> 3. Zmieniam wartość "Analiza (Int)" z 1 na 2. Pojawia się komunikat "Niezgodność z zasadą Drzewa Nauki (str. 26)"
> 4. Zmieniam wartość "Analiza (Int)" z 2 na 3. Komunikat o błędzie jest widoczny.
> 5. Zmieniam wartość "Analiza (Int)" z 3 na 4. Komunikat o błędzie jest widoczny.
> 6. Zmieniam wartość "Atletyka (S)" z 0 na 1. Komunikat o błędzie jest widoczny.
> 7. Zmieniam wartość "Czujność (Int)" z 0 na 1. Komunikat o błędzie jest widoczny.
> 8. Zmieniam wartość "Dowodzenie (SW)" z 0 na 1. Komunikat o błędzie znika.
>
> Przykład B. Kroki jakie wykonuję:
> 1. Uruchamiam Zaawansowany Kreator Postaci (https://cutelittlegoat.github.io/WrathAndGlory/Kalkulator/TworzeniePostaci_v2.html)
> 2. Zmieniam wartość "Analiza (Int)" z 0 na 1.
> 3. Zmieniam wartość "Analiza (Int)" z 1 na 2. Pojawia się komunikat "Niezgodność z zasadą Drzewa Nauki (str. 26)"
> 4. Zmieniam wartość "Analiza (Int)" z 2 na 3. Komunikat o błędzie jest widoczny.
> 5. Zmieniam wartość "Analiza (Int)" z 3 na 4. Komunikat o błędzie jest widoczny.
> 6. Zmieniam wartość "Atletyka (S)" z 0 na 1. Komunikat o błędzie jest widoczny.
> 7. Zmieniam wartość "Czujność (Int)" z 0 na 1. Komunikat o błędzie jest widoczny.
> 8. Zmieniam wartość "Dowodzenie (SW)" z 0 na 1. Komunikat o błędzie jest widoczny.
> 9. Zmieniam wartość "Intuicja (Ogd)" z 0 na 1. Komunikat o błędzie jest widoczny.
>
> Wygląda to tak jakby Zaawansowany Kreator Postaci działał inaczej niż Prosty Kreator Postaci
>
> Wykonaj też pełen audyt sposobów obliczania zużycia PD - czy są takie same w obu wariantach.
>
>
> DODATKOWO zwróć uwagę na szerokości kolumn w sekcji Umiejętności w obu wariantach. Są różne. Chciałbym, żeby Prosty Kreator Postaci był wzroem - więc trzeba poprawić wygląd sekcji w Zaawansowany Kreator Postaci
> Podobna sytuacja jest w sekcji "Inne: Talenty, Wiara, Psionika, Koszty Archetypu, Pakiety Wyniesienia, Majątek, Języki itd." - chcę, żeby w Zaawansowanym Kreatorze pole zachowywało się jak w Prostym (zarówno wielkość pola do wpisania tekstu jak i zachowanie - zmniejszenie fontu i przewijanie jak jest za dużo tekstu). *[załącznik: zrzut ekranu 1 — strona podręcznika „Atrybuty” z tabelą „Koszty atrybutów”]* *[załącznik: zrzut ekranu 2 — strona podręcznika „Maksima dla gatunków”, „Umiejętności”, „Talenty i Moce Psioniczne” z tabelą „Koszt umiejętności”]* Załączam screeny z podręcznika dotyczące kosztów Atrybutów oraz Umiejętności (z uwagi na układ tekstu musiałem na screenie uwzględnić też zbędne informacje. O Umiejętnościach jest w lewym dolnym rogu i końcówka tekstu w drugiej kolumnie z prawej strony u góry).

Zrzutów ekranu nie da się wkleić do tego pliku, dlatego niżej jest wierne przepisanie ich treści
dotyczącej kosztów.

**Zrzut 1 — „Koszty atrybutów”** oraz tekst obok tabeli: „Jeśli zwiększasz Atrybut od 1, użyj kolumny
Całkowity Koszt w PD z tabeli. Jeśli chcesz, by postać była bystra, możesz wydać 35 PD, aby zwiększyć jej
Inteligencję z 1 do 5. (…) Jeśli pozostały ci jeszcze PD z tworzenia postaci lub zdobyłeś ich trochę
podczas przygód, możesz je wydać, aby podnieść Atrybuty. Aby to zrobić, użyj kolumny Narastający Koszt
w PD z tabeli. Na przykład, jeśli postać jest już bardzo bystra i posiada Inteligencję 5, a chcesz by
była jeszcze bardziej błyskotliwa, możesz wydać 20 PD, aby podnieść Inteligencję z 5 do 6.”

| Wartość Atrybutu | Całkowity koszt w PD | Narastający koszt w PD |
| ---: | ---: | ---: |
| 1 | 0 | 0 |
| 2 | 4 | 4 |
| 3 | 10 | 6 |
| 4 | 20 | 10 |
| 5 | 35 | 15 |
| 6 | 55 | 20 |
| 7 | 80 | 25 |
| 8 | 110 | 30 |
| 9 | 145 | 35 |
| 10 | 185 | 40 |
| 11 | 230 | 45 |
| 12 | 280 | 50 |

**Zrzut 2 — „Koszt umiejętności”** oraz tekst: „Kiedy wartość Umiejętności wynosi 0 i wiesz już, do jakiej
wartości chcesz ją podnieść, znajdź ją w kolumnie Całkowity Koszt w PD w tabeli Koszt Umiejętności. Jeśli
chcesz, aby twoja postać była dobrym kłamcą możesz wydać 20 PD, by zwiększyć jej wartość Oszukiwania
z 0 do 4. Kiedy Umiejętność ma już jakąś wartość i chcesz ją podnieść, wykorzystaj kolumnę Narastający
Koszt w PD, aby zwiększyć wartość Umiejętności po jednym punkcie. Na przykład, jeśli postać jest już
elokwentna i posiada wartość Oszukiwania 4, możesz wydać 10 PD, aby zwiększyć wartość tej Umiejętności
do 5.” Na tym samym zrzucie, w akapicie „Maksima dla gatunków”: „Wartość bazowego Atrybutu przed
dodaniem bonusów nie może nigdy przekroczyć wartości podanej w Tabeli.”

| Wartość Umiejętności | Całkowity koszt w PD | Narastający koszt w PD |
| ---: | ---: | ---: |
| 1 | 2 | 2 |
| 2 | 6 | 4 |
| 3 | 12 | 6 |
| 4 | 20 | 8 |
| 5 | 30 | 10 |
| 6 | 42 | 12 |
| 7 | 56 | 14 |
| 8 | 72 | 16 |

### 1.2 Kontynuacja po ponownym uruchomieniu sesji (8 listopada 2026)

> Kontynuuj pracę.

### 1.3 Uzupełnienie zakresu (8 listopada 2026)

> Sprawdź też poprawność obliczeń w pliku Kalkulator/KalkulatorXP.html

---

## 2. Zakres

1. Poprawność reguły Drzewa Nauki w obu kreatorach względem treści z podręcznika.
2. Moment pojawiania się i znikania komunikatu `Niezgodność z zasadą Drzewa Nauki (str. 26)`.
3. Odtworzenie przykładów A i B użytkownika oraz przykładu Jordana z podręcznika.
4. Obliczanie zużycia PD w obu kreatorach: tabele kosztów, algorytm, zakresy, obsługa nietypowych wpisów.
5. Obliczenia w `KalkulatorXP.html` (uzupełnienie z 8 listopada).
6. Wygląd sekcji „Umiejętności” i zachowanie pola nazwy w sekcji „Inne” w Zaawansowanym Kreatorze, ze wzorem w Prostym Kreatorze — wraz z poprawką.

Poza zakresem: eksport PDF, zapis Firebase, cechy pochodne i zasady specjalne Zaawansowanego Kreatora
(sprawdzone tylko testem dymnym, że działają po zmianach).

---

## 3. Podsumowanie wyników

| # | Obszar | Wynik | Waga | Stan |
| --- | --- | --- | --- | --- |
| W1 | Drzewo Nauki — Prosty Kreator | Reguła zgodna z podręcznikiem; przykład A i przykład Jordana dają oczekiwany wynik. | — | bez zmian |
| W2 | Drzewo Nauki — Zaawansowany Kreator | Reguła „piramidowa”, której nie ma w podręczniku. Błędna ocena w 877 z 3000 losowych postaci (29%), zawsze zbyt surowa. Umiejętność 6–8 zawsze dawała błąd. | **wysoka** | **naprawione** |
| W3 | Moment komunikatu | W obu kreatorach komunikat pojawia się przy pierwszej zmianie łamiącej zasadę i znika przy pierwszej zmianie, która ją przywraca. | — | potwierdzone |
| W4 | Dwa błędy naraz | Prosty Kreator przy przekroczonej puli PD ukrywa błąd Drzewa Nauki (pokaże go dopiero po powrocie PD do normy); Zaawansowany pokazuje oba. | niska | do decyzji (R1) |
| W5 | Koszty PD w obu kreatorach | Tabele zgodne z podręcznikiem, algorytm identyczny, 0 rozbieżności w 3000 losowych postaciach. | — | potwierdzone |
| W6 | Nietypowe wpisy | Różnice: puste pole `Szybkość`, wyświetlanie kosztu talentu, puste pole puli PD. | niska | do decyzji (R2–R4) |
| W7 | Edycja atrybutu klawiaturą | W obu kreatorach: zaznaczenie, Backspace i wpisanie `3` daje `12` zamiast `3`. | średnia | do decyzji (R5) |
| W8 | Szybkość w kosztach PD | W obu kreatorach Szybkość 6 kosztuje 55 PD, a domyślna pula 155 to 100 + 55. Działa celowo, ale zależy od interpretacji zasad. | informacyjna | do weryfikacji (R6) |
| W9 | `KalkulatorXP.html` | Wszystkie 250 par (aktualna, docelowa) zgodne z kolumną „Narastający koszt w PD”; przykłady z podręcznika, suma i reset poprawne. | — | potwierdzone |
| W10 | Sekcja „Umiejętności” v2 | Cztery równe kolumny po 25%, długie nazwy w dwóch wierszach, nazwy do lewej, inna zebra. | średnia | **naprawione** |
| W11 | Sekcja „Inne” v2 | Pole 78 px zamiast 46 px, brak zmniejszania fontu. | średnia | **naprawione** |

---

## 4. Zasada Drzewa Nauki — wzorzec do porównań

### 4.1 Co mówi zasada

„Aby podnieść wartość Umiejętności do wyższego poziomu, najpierw musisz posiadać ogólną liczbę
Umiejętności równą tej nowej wartości. Więc jeśli wartość Atletyki wynosi 4, musisz mieć punkty
w przynajmniej trzech innych Umiejętnościach.”

Wnioski z treści i z przykładu Jordana:

- liczy się **łączna liczba Umiejętności z co najmniej 1 punktem**, wliczając tę podnoszoną
  (Atletyka 4 = Atletyka + trzy inne);
- poziom 1 nie wymaga niczego — umiejętność sama siebie „wspiera”;
- przy 4 znanych umiejętnościach każdą można podnieść do 4 (Jordan: Umiejętności strzeleckie „do
  maksymalnie 4”), a poziom 5 wymaga piątej umiejętności.

### 4.2 Reguła dla stanu końcowego

Kreatory nie znają kolejności zakupów — widzą tylko końcowe wartości. Zasada zakupu przekłada się na
warunek dla stanu końcowego:

```text
dla każdej umiejętności: wartość ≤ 1  albo  wartość ≤ liczba umiejętności z wartością ≥ 1
```

Uzasadnienie:

- jeżeli warunek jest spełniony, układ da się kupić zgodnie z zasadą: najpierw każda potrzebna
  umiejętność na 1 (liczba znanych osiąga wartość końcową), potem podnoszenie — każdy krok do poziomu
  `r` ma już `r` znanych umiejętności;
- jeżeli warunek nie jest spełniony, układu nie da się kupić w żadnej kolejności, bo liczba znanych
  umiejętności nigdy nie przekracza końcowej, a krok do najwyższego poziomu wymaga jej więcej.

Sprawdzone niezależnie: program przeszukał **wszystkie kolejności zakupu** (BFS, każdy krok to +1 do
jednej umiejętności z kontrolą zasady w chwili zakupu) dla **3888 układów** pięciu umiejętności
(wartości `0–5` dla czterech i `0–2` dla piątej). Warunek dla stanu końcowego dał ten sam wynik co
przeszukanie w **3888 / 3888** przypadkach.

---

## 5. Drzewo Nauki w Prostym Kreatorze

### 5.1 Kod (`TworzeniePostaci.html`, `checkSkillTree()`)

```js
let totalActiveSkills = 0;
skillIds.forEach(id => {
  let val = parseInt(document.getElementById(id).value) || 0;
  if (val > 0) totalActiveSkills++;
});
let valid = true;
for (let id of skillIds) {
  let level = parseInt(document.getElementById(id).value) || 0;
  if (level > 1 && totalActiveSkills < level) { valid = false; break; }
}
```

To dokładnie warunek z §4.2. Dokumentacja modułu nazywała go „uproszczoną zasadą” — w rzeczywistości
jest pełnym odpowiednikiem zasady z podręcznika dla stanu końcowego (opis w dokumentacji poprawiony).

### 5.2 Wyniki

Przykład A odtworzony w przeglądarce (Chromium, Playwright) — zachowanie identyczne z opisem użytkownika:

| Krok | Pozostało PD | Komunikat |
| --- | ---: | --- |
| start | 100 | — |
| Analiza 0→1 | 98 | — |
| Analiza 1→2 | 94 | Drzewo Nauki |
| Analiza 2→3 | 88 | Drzewo Nauki |
| Analiza 3→4 | 80 | Drzewo Nauki |
| Atletyka 0→1 | 78 | Drzewo Nauki |
| Czujność 0→1 | 76 | Drzewo Nauki |
| Dowodzenie 0→1 | 74 | **znika** (4 znane = 4) |
| Intuicja 0→1 | 72 | — |

Przykład Jordana (Atletyka 1, Czujność 1, Umiejętności strzeleckie 1, Ukrywanie się 1, Atletyka 2→3→4,
Umiejętności strzeleckie 2→3→4): brak błędu na każdym kroku; dopiero Umiejętności strzeleckie 5 dają błąd
— zgodnie z podręcznikiem.

Test różnicowy (§17): przy pulach PD w normie ocena Prostego Kreatora była zgodna ze wzorcem w **100%**
losowych postaci.

---

## 6. Drzewo Nauki w Zaawansowanym Kreatorze — stan przed poprawką

### 6.1 Kod (`TworzeniePostaci_v2-core.js`, commit `883ca16`)

```js
function isLearningTreeValid(values) {
  for(let rating=2;rating<=8;rating++){
    const atRatingOrHigher=values.filter(value=>value>=rating).length;
    const supports=values.filter(value=>value>=rating-1).length;
    if(atRatingOrHigher>0&&supports<atRatingOrHigher*2)return false;
  }
  return true;
}
```

Dla każdego poziomu `r` od 2 do 8 kod żądał, żeby umiejętności z wartością co najmniej `r-1` było
**dwa razy więcej** niż umiejętności z wartością co najmniej `r`. To „piramida”: każda umiejętność na
poziomie `r` potrzebowała własnej umiejętności na poziomie `r-1`, ta — kolejnej itd. W podręczniku nie
ma takiej zasady.

### 6.2 Skutki

Najtańszy układ dopuszczany przez każdą z reguł, gdy jedna umiejętność ma wartość `N` (pełne
przeszukanie wszystkich układów pozostałych 17 umiejętności):

| N | Podręcznik — najtańszy układ | Dawna reguła v2 — najtańszy układ |
| ---: | --- | --- |
| 2 | 8 PD: `2,1` | 8 PD: `2,1` |
| 3 | 16 PD: `3,1,1` | 22 PD: `3,2,1,1` |
| 4 | 26 PD: `4,1,1,1` | **52 PD**: `4,3,2,2,1,1,1,1` |
| 5 | 38 PD: `5,1,1,1,1` | **114 PD**: szesnaście umiejętności |
| 6 | 52 PD: `6,1,1,1,1,1` | **niemożliwe** — potrzeba 32 umiejętności, a jest 18 |

Wartości 6, 7 i 8 dawały więc błąd **zawsze**, niezależnie od reszty postaci. Do tego reguła odrzucała
też poprawne układy na niskich poziomach, np. `2,2,2` albo `3,3,1,1`.

### 6.3 Przykłady

- Przykład B: błąd widoczny po Dowodzeniu i Intuicji, bo przy `4,1,1,1,1` poziom 3 wymagał dwóch
  umiejętności z wartością co najmniej 2, a była jedna — dokładnie jak opisał użytkownik.
- Przykład Jordana z podręcznika: dawna reguła zgłaszała błąd już przy Atletyce 3 (cztery znane
  umiejętności), mimo że podręcznik pozwala na Atletykę 4.

### 6.4 Test różnicowy przed poprawką

3000 losowych postaci wpisanych równolegle do obu kreatorów: **877 błędnych ocen** Zaawansowanego
Kreatora (29%), **wszystkie zbyt surowe** (błąd przy poprawnym układzie), zero zbyt łagodnych.

---

## 7. Poprawka Drzewa Nauki w Zaawansowanym Kreatorze i weryfikacja

### 7.1 Nowy kod

```js
function isLearningTreeValid(values) {
  const knownSkills=values.filter(value=>value>=1).length;
  return values.every(value=>value<=1||value<=knownSkills);
}
```

Funkcja jest opatrzona komentarzem PL/EN z treścią zasady, uzasadnieniem warunku dla stanu końcowego
i odwołaniem do `checkSkillTree()` w Prostym Kreatorze. Reszta `recalcXP()` bez zmian: oba błędy (PD
i Drzewo Nauki) mogą być nadal widoczne jednocześnie.

### 7.2 Wyniki po poprawce

| Test | Wynik |
| --- | --- |
| Przykład B | Identyczny z przykładem A: błąd od Analizy 2 do Czujności, **znika po Dowodzeniu**. |
| Przykład Jordana | Brak błędu do Umiejętności strzeleckich 4; błąd przy 5. |
| Porównanie funkcji (bez przeglądarki) | Nowa `isLearningTreeValid` i logika `checkSkillTree` — **0 różnic na 306 561 układach**, w tym wszystkich 6561 kombinacjach czterech umiejętności `0–8`. |
| Test różnicowy w przeglądarce, 3000 postaci | **0 błędnych ocen** w Zaawansowanym Kreatorze, 0 rozbieżności PD. |
| Test dymny | Brak błędów konsoli; modal `Cechy i zasady specjalne`, cechy pochodne i `getState()` działają. |

---

## 8. Moment pojawiania się i znikania komunikatów

Ta sama sekwencja w obu kreatorach, po poprawce (`PD` — błąd przekroczenia puli, `DRZEWO` — błąd Drzewa
Nauki):

| Krok | Prosty | Zaawansowany |
| --- | --- | --- |
| Analiza 3 (1 znana < 3) | 88, DRZEWO | 88, DRZEWO |
| Atletyka 1 (2 znane < 3) | 86, DRZEWO | 86, DRZEWO |
| Czujność 1 (3 znane = 3) | 84, — | 84, — |
| Czujność 0 (usunięte wsparcie) | 86, DRZEWO | 86, DRZEWO |
| Analiza 2 (obniżenie najwyższej) | 92, — | 92, — |
| Pula 50 | −13, PD | −13, PD |
| Analiza 5 przy przekroczonej puli | −37, **PD** | −37, **PD + DRZEWO** |
| Pula 500 | 413, DRZEWO | 413, DRZEWO |
| Dowodzenie 1, Intuicja 1 | DRZEWO | DRZEWO |
| Medycyna 1 (5 znanych = 5) | 407, — | 407, — |
| Koszt talentu 600 | −193, PD | −193, PD |
| Koszt talentu 0 | 407, — | 407, — |

Wnioski:

- w obu kreatorach komunikat pojawia się **dokładnie przy zmianie**, która łamie zasadę, i znika
  **dokładnie przy zmianie**, która ją przywraca — także przy obniżeniu najwyższej umiejętności i przy
  zabraniu punktów umiejętności wspierającej;
- przeliczenie uruchamiają zdarzenia `input` i `change` każdego pola (strzałki, klawiatura, wpisanie),
  reset oraz wczytanie zapisu, więc nie ma sytuacji, w której komunikat zostaje „nieświeży”;
- jedyna różnica: przy przekroczonej puli Prosty Kreator pokazuje tylko błąd PD, a błąd Drzewa Nauki
  pokaże dopiero po powrocie PD do normy — w kroku „Pula 500”, choć użytkownik nie ruszał wtedy
  umiejętności. W teście różnicowym takich postaci było 313–315 na 3000. Zachowanie jest opisane
  w instrukcji, więc jest zamierzone, ale różni oba kreatory (R1).

---

## 9. Obliczanie PD — porównanie obu kreatorów

### 9.1 Tabele kosztów

| Wartość | Atrybut — podręcznik | Prosty (`attributeCosts`) | Zaawansowany (`ATTRIBUTE_COSTS`) | Umiejętność — podręcznik | Prosty (`skillCosts`) | Zaawansowany (`SKILL_COSTS`) |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | — | — | — | — | 0 | 0 |
| 1 | 0 | 0 | 0 | 2 | 2 | 2 |
| 2 | 4 | 4 | 4 | 6 | 6 | 6 |
| 3 | 10 | 10 | 10 | 12 | 12 | 12 |
| 4 | 20 | 20 | 20 | 20 | 20 | 20 |
| 5 | 35 | 35 | 35 | 30 | 30 | 30 |
| 6 | 55 | 55 | 55 | 42 | 42 | 42 |
| 7 | 80 | 80 | 80 | 56 | 56 | 56 |
| 8 | 110 | 110 | 110 | 72 | 72 | 72 |
| 9 | 145 | 145 | 145 | — | — | — |
| 10 | 185 | 185 | 185 | — | — | — |
| 11 | 230 | 230 | 230 | — | — | — |
| 12 | 280 | 280 | 280 | — | — | — |

Wszystkie wartości zgodne z kolumną „Całkowity koszt w PD” z podręcznika. Przykłady z podręcznika:
Inteligencja 1→5 = 35 PD, Oszukiwanie 0→4 = 20 PD, Atletyka Jordana 0→4 = 2+4+6+8 = 20 PD — zgodne.

### 9.2 Algorytm

Oba kreatory liczą tak samo:

```text
wydane PD = Σ koszt_całkowity(atrybut)  dla 8 atrybutów (z Szybkością), zakres 1–12
          + Σ koszt_całkowity(umiejętność)  dla 18 umiejętności, zakres 0–8
          + Σ max(0, koszt talentu)  dla wszystkich pól sekcji „Inne”
pozostało PD = pula PD − wydane PD
```

Wartości są ucinane do liczby całkowitej (`parseInt`) i ograniczane do zakresu. Zasady specjalne
Zaawansowanego Kreatora nie mają kosztu PD.

### 9.3 Test różnicowy

3000 losowych postaci (atrybuty, Szybkość, umiejętności, dwa koszty talentów, pula PD) wpisanych do obu
kreatorów: **0 rozbieżności** pozostałych PD między kreatorami i względem obliczenia wzorcowego,
komunikat przekroczenia puli zawsze poprawny w obu.

### 9.4 Różnice w obsłudze nietypowych wpisów

| Wpis | Prosty Kreator | Zaawansowany Kreator | Wpływ na PD |
| --- | --- | --- | --- |
| Puste pole `Szybkość` | pole zmienia się na `1`, koszt 0 (+55 PD) | pole zmienia się na `6`, koszt 55 | **różny** |
| Koszt talentu `-3` | pole przepisane na `0` | pole pokazuje `-3`, liczone `0` | taki sam |
| Koszt talentu `2.7`, `1e1` | pole przepisane na `2`, `1` | pole bez zmian, liczone `2`, `1` | taki sam |
| Puste pole puli PD | przy opuszczeniu pola wraca `155` | zostaje puste, pula = 0 | różny po opuszczeniu pola |
| Atrybut `0`, `-3`, pusty | `1` | `1` | taki sam |
| Atrybut `13` | `12` | `12` | taki sam |
| Umiejętność pusta, `-3` | `0` | `0` | taki sam |
| Umiejętność `13` | `8` | `8` | taki sam |
| Liczba `2.7` | `2` | `2` | taki sam |
| Zapis wykładniczy `1e1` (= 10) | czytany jako `1` | czytany jako `1` | taki sam (oba błędnie, w praktyce nieużywane) |

### 9.5 Edycja atrybutu z klawiatury (oba kreatory)

Kreatory poprawiają wartość pola przy **każdym** naciśnięciu klawisza. Gdy użytkownik zaznaczy liczbę
w polu atrybutu i usunie ją klawiszem Backspace, pole natychmiast dostaje `1` (w Zaawansowanym Kreatorze
pole `Szybkość` — `6`), a wpisana potem cyfra dopisuje się za nią:

| Kreator | Pole | Po Backspace | Po wpisaniu | Wynik |
| --- | --- | --- | --- | --- |
| oba | atrybut | `1` | `3` | `13` → **`12`**, PD −180 |
| Prosty | Szybkość | `1` | `8` | `18` → **`12`** |
| Zaawansowany | Szybkość | `6` | `8` | `68` → **`12`** |
| oba | umiejętność | `0` | `3` | `03` → `3` (bez problemu) |

Wpisanie liczby od razu na zaznaczoną wartość (bez Backspace) działa poprawnie. Problem nie zmienia
wzorów, ale łatwo przez niego wpisać inną wartość, niż się chciało (R5).

### 9.6 Szybkość w kosztach PD

Oba kreatory liczą Szybkość według tabeli atrybutów. Startowa Szybkość 6 kosztuje 55 PD, dlatego
domyślna pula wynosi `155` — zaraz po otwarciu arkusza `Pozostało PD` pokazuje `100`. Potwierdza to
instrukcja `HowToUse/pl.pdf`: przykład „Siostra Szpitalniczka” (Int 3, SW 3, Medycyna 1, Wiedza ogólna 1,
koszt archetypu 24 PD) prowadzi do `Pozostało PD = 76 = 100 − 24`, czyli 155 − 55 − 24.
Pierwotna wersja (`Old/Kalkulator_Org.html`) miała 7 atrybutów i pulę 100 — pula 155 pojawiła się
razem z polem Szybkości.

Zrzuty z podręcznika dołączone do promptu nie mówią, czy Szybkość kupuje się za PD. Jeżeli w podręczniku
Szybkość wynika wyłącznie z gatunku, obecny sposób jest poprawny tylko dla gatunków ze startową
Szybkością 6 — dla innych trzeba ręcznie poprawić pulę (R6). Na obliczenia w obu kreatorach wpływa to
identycznie.

---

## 10. Kalkulator PD (`KalkulatorXP.html`)

### 10.1 Jak liczy

```js
const attributeCosts = {0:0, 1:0, 2:4, 3:10, 4:20, 5:35, 6:55, 7:80, 8:110, 9:145, 10:185, 11:230, 12:280};
const skillCosts = {0:0, 1:2, 2:6, 3:12, 4:20, 5:30, 6:42, 7:56, 8:72};
function calculateRowCost(current, target, costs) {
  if (target <= current) return 0;
  return (costs[target] || 0) - (costs[current] || 0);
}
```

Koszt wiersza to różnica kosztów całkowitych, czyli suma kroków z kolumny „Narastający koszt w PD”.
Wartości są ograniczane do `0–12` (atrybuty) i `0–8` (umiejętności) i przepisywane do pól; suma to
4 wiersze atrybutów + 4 wiersze umiejętności.

### 10.2 Wyniki testów

| Test | Wynik |
| --- | --- |
| Wszystkie pary (aktualna, docelowa): 13 × 13 dla atrybutów i 9 × 9 dla umiejętności | **250 / 250 poprawnych**, porównane z sumą kroków z kolumny „Narastający koszt w PD” |
| Inteligencja 1→5 / 5→6 | 35 / 20 PD — zgodne z podręcznikiem |
| Oszukiwanie 0→4 / 4→5 | 20 / 10 PD — zgodne z podręcznikiem |
| Suma siedmiu wierszy (35 + 10 + 225 + 0 + 72 + 6 + 22) | 370 — poprawna |
| `Resetuj wartości` | suma 0 |
| Wpisy brzegowe (`""`, `-3`, `2.7`, `13`, `99`) | ograniczane jak w kreatorach; koszt liczony z poprawionych wartości |
| Edycja klawiaturą (Backspace, potem cyfra) | **poprawna** — pole dostaje `0`, a `07` czyta się jako `7` |

### 10.3 Uwagi

- Atrybut `0` (nie ma go w podręczniku) jest traktowany jak startowe `1`: koszt `0→N` = koszt `1→N`.
  Wynik jest poprawny, ale wartość `0` może mylić (pola startują od `0`).
- Obniżenie wartości (docelowa ≤ aktualna) kosztuje `0` — zgodnie z instrukcją, bez zwrotu PD.
- Tabela maksimów pokazuje Szybkość Vespidów jako `14`, a kreatory jako `14*` z przypisem o stałej
  Szybkości. Różnica wyłącznie w opisie, nie w obliczeniach.
- `1e1` czytane jako `1` (jak w kreatorach).

Wniosek: **obliczenia `KalkulatorXP.html` są poprawne.** Plik nie wymaga zmian.

---

## 11. Sekcja „Umiejętności” w Zaawansowanym Kreatorze

### 11.1 Przyczyna różnicy

| | Prosty (wzór) | Zaawansowany — przed |
| --- | --- | --- |
| Układ tabeli | automatyczny (brak `table-layout`) | `table-layout: fixed` z reguły `.table` |
| Kolumny przy oknie 1280 px | `421 / 119 / 394 / 119 px` | `263 / 263 / 263 / 263 px` |
| Nazwy umiejętności | wyśrodkowane, w jednym wierszu | do lewej; `Korzystanie z technologii (Int)`, `Mistrzostwo psioniczne (SW)` i `Umiejętności strzeleckie (Zr)` w dwóch wierszach |
| Zebra | nieparzyste wiersze danych (nagłówek w tym samym `tbody`) | parzyste wiersze danych (nagłówek w `thead`) |
| Minimum na telefonie | 520 px | 700 px |

### 11.2 Zmiana (`TworzeniePostaci_v2.html`, blok `<style>`)

- `.skills-table{table-layout:auto}`;
- usunięta reguła wyrównująca kolumny nazw umiejętności i talentów do lewej;
- zebra jak we wzorze: `tbody tr:nth-child(odd)` → `var(--zebra)`, `even` → `transparent`,
  `tbody tr:hover` → `var(--hover)` (dla tabel umiejętności i „Inne”);
- w media query `max-width: 760px` minimum tabel umiejętności i „Inne” 520 px zamiast 700 px.

### 11.3 Wynik

| Szerokość okna | Prosty | Zaawansowany — po |
| ---: | --- | --- |
| 1280 px | `421 / 119 / 394 / 119` | `421 / 119 / 394 / 119` |
| 1000 px | `369 / 104 / 346 / 105` (tabela 926) | `365 / 103 / 342 / 104` (tabela 914) |
| 800 px | `275 / 95 / 260 / 95` | `273 / 95 / 258 / 95` |
| 760 px i mniej | `166 / 95 / 163 / 95` (tabela 520) | `166 / 95 / 163 / 95` (tabela 520) |

Zrzut tabeli przy 1280 px różni się od wzoru o **20 pikseli na 558 620** (wygładzanie krawędzi pól).
Kolory zebry i podświetlenia — identyczne. W przedziale 761–1145 px cała tabela jest do 14 px węższa,
bo kontener v2 ma szerokość `min(1100px, 96vw)`, a wzór `min(1100px, 100%)` — proporcje kolumn są
takie same (R7).

---

## 12. Sekcja „Inne” w Zaawansowanym Kreatorze

### 12.1 Przyczyna różnicy

| | Prosty (wzór) | Zaawansowany — przed |
| --- | --- | --- |
| Wysokość pola nazwy | 46 px | 78 px (ogólna reguła `textarea`) |
| Font startowy | domyślny przeglądarki (Chromium 13,33 px), interlinia `normal` | 16 px, interlinia 1.25 |
| Zmniejszanie fontu | `adjustTalentFontSize`: 16 → 10 px, potem przewijanie | brak — po ~3 liniach od razu pasek |
| Łamanie wyrazów | tylko zbyt długich (`overflow-wrap: break-word`) | w dowolnym miejscu (`anywhere`) |
| Kolumny przy 1280 px (puste pola) | `267 / 259 / 267 / 260 px` | `263 / 263 / 263 / 263 px` |

### 12.2 Zmiana

- `TworzeniePostaci_v2.html`: `.talents-table textarea{height:46px;min-height:0;max-height:none;font-size:revert;line-height:revert;word-break:revert;overflow-wrap:revert}` —
  `revert` przywraca ustawienia przeglądarki, z których korzysta wzór;
- `TworzeniePostaci_v2-core.js`: kopia funkcji `adjustTalentFontSize` ze wzoru, klasa `talent-name`
  na polach nazw, wywołanie przy wpisywaniu oraz po każdej przebudowie tabeli (`Dodaj pola talentów`,
  `Usuń pola talentów`, wczytanie zapisu) dla pól z tekstem — inaczej po kliknięciu przycisku
  zmniejszony tekst wracałby do pełnego rozmiaru.

Tabela „Inne” celowo **zostaje przy stałym układzie** (cztery kolumny po 25%). Próba z układem
automatycznym pokazała, że w v2 — gdzie sekcja startuje z jednym wierszem — szerokość kolumny zależy
od fontu jedynego pola: zmniejszanie fontu zwężało kolumnę (do 228 px przy 1280 px) i tekst 71-znakowy
trafiał na pasek przewijania, a we wzorze się mieścił. We wzorze kolumnę „trzymają” pozostałe puste
pola (20 pól), dlatego tam tego efektu nie widać. Stały układ daje szerokości wzoru z pustymi polami
(±4 px) i nie zmienia ich podczas pisania.

### 12.3 Wynik — rozmiar fontu dla tych samych tekstów

| Okno | Tekst | Prosty | Zaawansowany — po |
| ---: | ---: | --- | --- |
| 1280 px | 2 i 13 znaków | 16 px | 16 px |
| 1280 px | 34 znaki | 11 px | 11 px |
| 1280 px | 71 znaków | 10 px, bez paska | 10 px, bez paska |
| 1280 px | 153 znaki | 10 px, pasek | 10 px, pasek |
| 1000 px | 71 znaków | 10 px, pasek | 10 px, pasek |
| 360 px | 13 znaków | 11 px | 11 px |
| 360 px | od 34 znaków | 10 px, pasek | 10 px, pasek |

Styl startowy pola (font, interlinia, łamanie, padding, ramka, wysokość, wyrównanie) — identyczny
w obu kreatorach. Po `Dodaj pola talentów`, `Usuń pola talentów` i wczytaniu zapisu zmniejszony font
zostaje zachowany. Pola w modalu `Cechy i zasady specjalne` (54 px) bez zmian.

Drobna różnica na korzyść v2: we wzorze kolumna z tekstem o foncie 16 px chwilowo się poszerza
(`302 / 248 / 255 / 248 px`), bo tabela ma układ automatyczny; w v2 kolumny stoją w miejscu.

---

## 13. Zmienione pliki

| Plik | Zmiana |
| --- | --- |
| `Kalkulator/TworzeniePostaci_v2-core.js` | `isLearningTreeValid` według podręcznika; `adjustTalentFontSize`; klasa `talent-name`; dopasowanie fontu przy wpisywaniu i po przebudowie tabeli; komentarze PL/EN. |
| `Kalkulator/TworzeniePostaci_v2.html` | Układ i zebra tabel „Umiejętności” i „Inne”, wysokość i font pola nazwy, minimum 520 px na telefonie; usunięte wyrównanie nazw do lewej; komentarze PL/EN. |
| `Kalkulator/docs/Documentation_v2.md` | Drzewo Nauki, sekcje „Umiejętności” i „Inne”, pole nazwy, przeliczanie, responsywność, checklisty (PL i EN). |
| `Kalkulator/docs/Documentation.md` | Opis Drzewa Nauki bez słowa „uproszczona”, zachowanie pola nazwy, zgodność obu kreatorów, aktualne wpisy o zaawansowanym kreatorze (PL i EN). |
| `Kalkulator/docs/README.md` | Zasada Drzewa Nauki prostym językiem, kiedy komunikat się pojawia i znika, dwa błędy naraz, pole nazwy w „Inne”, pula 155 a Szybkość, aktualny opis zaawansowanego kreatora (PL i EN). |
| `DetaleLayout.md` | Wygląd sekcji „Umiejętności” i „Inne” w obu kreatorach. |

`Kalkulator/TworzeniePostaci.html` i `Kalkulator/KalkulatorXP.html` — bez zmian.

---

## 14. Ryzyka

1. **Zapisane postacie v2** — postać, która wcześniej pokazywała błąd Drzewa Nauki, po wczytaniu może
   go już nie mieć. To oczekiwany skutek poprawnej reguły; dane zapisu się nie zmieniają.
2. **`revert` w CSS** — obsługują go przeglądarki od 2020 r. (Chrome/Edge 84, Firefox 67, Safari 9.1).
   W starszej przeglądarce deklaracje z `revert` zostaną pominięte: pole nadal będzie miało 46 px
   i zmniejszanie fontu, tylko font startowy będzie 16 px zamiast domyślnego.
3. **Pomiary w pikselach** wykonano w Chromium z fontem zastępczym (w kontenerze nie ma Consolasa).
   Na Windowsie liczby będą trochę inne, ale oba kreatory używają teraz tych samych reguł dla tych
   sekcji, więc pozostaną sobie równe.
4. **Pozostałe różnice** opisane w §8 i §9.4–9.5 nie zostały zmienione — wymagają decyzji (§15).

---

## 15. Rekomendacje i decyzje do podjęcia

| # | Rekomendacja | Pliki | Do decyzji |
| --- | --- | --- | --- |
| R1 | Ujednolicić pokazywanie dwóch błędów naraz. Zalecane: w Prostym Kreatorze pokazywać oba komunikaty jeden pod drugim, jak w Zaawansowanym — błąd Drzewa Nauki nie będzie wtedy „wyskakiwał” po zmianie puli PD. | `TworzeniePostaci.html` | który sposób ma obowiązywać |
| R2 | W Prostym Kreatorze puste pole `Szybkość` zamieniać na `6` (jak reset i Zaawansowany), a nie na `1`. | `TworzeniePostaci.html` | tak / nie |
| R3 | W Zaawansowanym Kreatorze przepisywać koszt talentu na liczoną wartość (`-3` → `0`), jak w Prostym, żeby pole pokazywało to, co trafia do PD. | `TworzeniePostaci_v2-core.js` | tak / nie |
| R4 | Ujednolicić puste pole puli PD: w obu kreatorach przywracać `155` przy opuszczeniu pola albo w obu zostawiać puste. | oba kreatory | który sposób |
| R5 | Nie nadpisywać pola atrybutu podczas pisania, gdy jest puste — poprawiać wartość dopiero przy opuszczeniu pola (`change`/`blur`). Usuwa efekt „Backspace, 3 → 12”. | oba kreatory | tak / nie |
| R6 | Sprawdzić w podręczniku, czy Szybkość kupuje się za PD. Jeżeli nie — rozważyć wyłączenie Szybkości z kosztów i pulę domyślną 100 (zmiana wymaga też aktualizacji instrukcji PDF). | oba kreatory, `HowToUse` | weryfikacja zasad |
| R7 | Kontener Zaawansowanego Kreatora `min(1100px, 100%)` zamiast `96vw`, jak we wzorze — tabele będą identyczne także przy szerokościach 761–1145 px. | `TworzeniePostaci_v2.html` | tak / nie |
| R8 | Opcjonalnie: przypis `14*` przy Szybkości Vespidów także w `KalkulatorXP.html`. | `KalkulatorXP.html` | tak / nie |
| R9 | Opcjonalnie: w Prostym Kreatorze dopasowywać font pól nazw po wczytaniu zapisu (dziś wczytany długi tekst nie jest zmniejszany), jak robi to już Zaawansowany. | `TworzeniePostaci.html` | tak / nie |

---

## 16. Następne kroki

1. Sprawdzić oba kreatory na docelowym komputerze (Windows, font Consolas): przykłady A i B, sekcje
   „Umiejętności” i „Inne” obok siebie.
2. Podjąć decyzje R1–R9; wybrane punkty to małe zmiany, które można wykonać w jednym zadaniu.
3. Przy R6 — jeżeli Szybkość ma zostać wyłączona z kosztów — zaplanować osobno, bo zmienia domyślną pulę,
   instrukcję PDF i zapisane postacie.

---

## 17. Załącznik — metoda testów

Wszystkie testy wykonano na lokalnym serwerze HTTP (katalog repozytorium) w Chromium sterowanym przez
Playwright, z zablokowanymi skryptami zewnętrznymi (Firebase, reCAPTCHA), które nie biorą udziału
w obliczeniach. Skrypty testowe powstały w katalogu tymczasowym sesji i nie są częścią repozytorium.

| Test | Opis |
| --- | --- |
| Przykłady | Kroki A, B i przykład Jordana wpisywane do pól jak przez użytkownika (zaznaczenie, wpis, zdarzenia `input`/`change`); odczyt `Pozostało PD` i komunikatu po każdym kroku. |
| BFS | Przeszukanie wszystkich kolejności zakupu (+1 do jednej umiejętności na krok, kontrola zasady w chwili zakupu) dla 3888 układów; porównanie z warunkiem dla stanu końcowego. |
| Porównanie funkcji | Nowa `isLearningTreeValid` (wycięta z pliku) i wierna kopia pętli `checkSkillTree` na 300 000 losowych układach 18 umiejętności i 6561 układach czterech umiejętności. |
| Test różnicowy | 3000 losowych postaci (8 atrybutów, 18 umiejętności, 2 koszty talentów, pula PD — w 30% przypadków mała) wpisanych do obu kreatorów; porównanie `Pozostało PD`, komunikatu PD i komunikatu Drzewa Nauki ze wzorcem. Wykonany przed poprawką i po niej. |
| Najtańsze układy | Pełne przeszukanie układów pozostałych 17 umiejętności dla jednej umiejętności na poziomie 2–6, dla dawnej reguły v2 (z commitu `883ca16`) i reguły z podręcznika. |
| Wpisy brzegowe | Wartości `""`, `0`, `-3`, `2.7`, `13`, `1e1` w polach atrybutu, Szybkości, umiejętności, kosztu talentu i puli, z odczytem pola, PD i komunikatu, także po utracie fokusu. |
| Klawiatura | Kliknięcie pola, Ctrl+A, Backspace, wpisanie cyfry. |
| KalkulatorXP | Wszystkie 250 par (aktualna, docelowa), przykłady z podręcznika, suma wielu wierszy, reset, wpisy brzegowe, klawiatura. |
| Układ | Pomiar szerokości kolumn, wysokości pól i stylów obliczonych przy oknach 320–1280 px; zrzuty tabel i porównanie pikselowe; kolory zebry i podświetlenia. |
| Pole nazwy | Wpisywanie tekstów o długości 2, 13, 34, 71 i 153 znaków; odczyt fontu, przewijania i kolumn; dodanie i usunięcie wierszy; `applyState` z długimi nazwami. |
