# Analiza modyfikacji modułu Infoczytnik – podgląd tła

## Prompt użytkownika
> Przeprowadź analizę modyfikacji modułu Infoczytnik.
>
> Przygotowałem screeny widoku z Panelu GM:
> Analizy/01.jpg
> Analizy/02.jpg
> Analizy/03.jpg
> Analizy/04.jpg
>
> Trzeba zmodyfikować sposób wyświetlania podglądu wybranego pliku tła.
> Obecnie w okienku podglądu jest wyświetlany tylko fragment.
> To jest niewystarczające, ponieważ mogą być dwa pliki tła różniące się np. jednym detalem w górnej części obrazka.
> Zaproponuj kilka rozwiązań, żeby podgląd był użyteczniejszy.
>
> Plik z analizą nazwij "Podgląd.md"

## Kontekst problemu (na podstawie screenów 01–04)
W panelu GM mini-podgląd pokazuje tylko wycinek tła (obszar z tekstem komunikatu), a nie cały obraz. Przy wyborze teł o podobnej stylistyce taki podgląd utrudnia porównanie, ponieważ:
- nie widać górnej i dolnej części grafiki,
- nie widać pełnego układu ramek/ornamentów,
- detale różnicujące warianty mogą być poza aktualnym wycinkiem.

## Cele UX dla nowego podglądu
1. Użytkownik ma szybko odróżnić podobne tła.
2. Podgląd ma nadal pokazywać „realny wygląd” wiadomości (tekst, fillery, logo).
3. Zmiana nie może znacząco obniżyć czytelności panelu i wydajności.

---

## Proponowane rozwiązania

### 1) Tryb przełączany: „Wycinek / Całość” (rekomendowane jako baza)
**Opis:**
- Dodać prosty przełącznik przy podglądzie: `Podgląd: [Wycinek] [Całość]`.
- `Wycinek` = obecne zachowanie (pixel-perfect względem okna gracza).
- `Całość` = cały obraz tła skalowany do rozmiaru ramki podglądu (`contain`).

**Zalety:**
- Minimalna ingerencja w obecny workflow.
- Użytkownik ma oba tryby: weryfikacja detali + kontrola finalnego kadru.
- Niskie ryzyko regresji.

**Wady:**
- W trybie „Całość” realny obszar tekstu jest mniejszy i mniej czytelny.

**Wniosek:**
Najbardziej praktyczny pierwszy krok do wdrożenia.

---

### 2) Podgląd podzielony (split preview): „Cały obraz + podgląd finalny”
**Opis:**
- Pokazać dwa boksy obok siebie (lub jeden pod drugim):
  - **A. Pełne tło** – miniatura całego obrazka.
  - **B. Finalny kadr** – obecny wycinek z naniesioną treścią.
- W wariancie rozszerzonym: na miniaturze „Całość” nałożyć ramkę pokazującą obszar kadrowania finalnego widoku.

**Zalety:**
- Najlepsza informacyjnie forma (pełna orientacja + finalny efekt).
- Bardzo dobre porównywanie podobnych wariantów.

**Wady:**
- Zajmuje więcej miejsca w panelu.
- Wymaga dopracowania responsywności.

**Wniosek:**
Docelowo najlepszy UX, jeśli panel ma wystarczającą przestrzeń.

---

### 3) Lupa/powiększenie na hover nad miniaturą „Całość”
**Opis:**
- Gdy użytkownik najedzie na miniaturę całego tła, pojawia się lupa (zoom x2/x3).
- Można dodać skrót klawiaturowy (np. Alt) uruchamiający tryb precyzyjnego porównania detali.

**Zalety:**
- Umożliwia sprawdzanie drobnych różnic (np. detali w górnej części).
- Nie wymaga stałego zwiększania rozmiaru podglądu.

**Wady:**
- Dodatkowa złożoność implementacji.
- Część użytkowników może nie odkryć funkcji bez podpowiedzi UI.

**Wniosek:**
Dobry „upgrade” po wdrożeniu trybu Całość.

---

### 4) Szybki podgląd pełnoekranowy / modal „Porównaj tła”
**Opis:**
- Przycisk „Powiększ” otwiera modal z dużym podglądem całego tła.
- Opcjonalnie: nawigacja strzałkami po tłach i tryb „przed/po” (A/B).

**Zalety:**
- Bardzo wygodne porównanie przy dużej liczbie podobnych teł.
- Najlepsza widoczność szczegółów.

**Wady:**
- Większy koszt implementacji.
- Przerywa pracę w formularzu (wejście/wyjście z modala).

**Wniosek:**
Warto jako funkcja premium, ale niekonieczna na pierwszy etap.

---

### 5) Pasek miniatur wszystkich teł pod selektorem
**Opis:**
- Pod polem wyboru tła pokazać miniatury całych obrazów (filmstrip).
- Kliknięcie miniatury wybiera tło i odświeża główny podgląd.

**Zalety:**
- Błyskawiczne skanowanie wizualne wariantów.
- Ogranicza „przeklikiwanie” listy rozwijanej.

**Wady:**
- Potrzebna optymalizacja obrazów (lazy loading, cache).
- Wymaga miejsca i przewijania przy wielu tłach.

**Wniosek:**
Świetne przy większej bibliotece teł.

---

## Rekomendacja wdrożenia etapami

### Etap 1 (szybki, niski koszt)
- Wdrożyć **przełącznik „Wycinek/Całość”**.
- Zapamiętywać wybór trybu (np. localStorage), żeby GM nie przełączał za każdym razem.

### Etap 2 (największy zysk UX)
- Dodać **split preview** (cały obraz + finalny kadr).
- Na miniaturze „Całość” dodać prostokąt obszaru kadrowania.

### Etap 3 (opcja zaawansowana)
- Dodać **lupę** albo **modal porównawczy A/B**, jeśli nadal występują problemy z odróżnianiem bardzo podobnych teł.

## Kryteria akceptacji (proponowane)
1. Użytkownik może zobaczyć cały plik tła bez opuszczania panelu GM.
2. Użytkownik może nadal sprawdzić finalny wygląd wiadomości na tle (tekst + fillery + elementy dodatkowe).
3. Różnice w górnej części dwóch podobnych teł są możliwe do zauważenia w max 2 interakcjach.
4. Przełączanie teł i podglądów nie powoduje zauważalnych opóźnień UI.

## Podsumowanie
Najlepszym kompromisem jest rozpoczęcie od trybu **„Wycinek/Całość”**, a następnie przejście do **split preview**. To zapewnia szybkie wdrożenie i jednocześnie realnie rozwiązuje problem niewidocznych detali poza obecnym kadrem.
