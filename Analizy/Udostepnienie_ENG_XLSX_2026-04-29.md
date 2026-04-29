# Analiza: wersja do udostępnienia z angielskim `Repozytorium.xlsx`

## Prompt użytkownika (kontekst)

> Przeczytaj plik:
> Analizy/Udostepnienie.md
>
> Przygotowuję się do zrobienia nowego pliku Repozytorium.xlsx z przykładowymi danymi.
> Plik jednak będzie przygotowany po angielsku. Nazwy zakładek, kolumn itd. będą po angielsku.
> W wersji do udostępnienia trzeba będzie jeszcze zmodyfikować jedną rzecz.
> W wersji polskiej są warunki na "str." itp. W wersji angielskiej będzie to "page" albo "p.".
> Przeprowadź analizę czy przygotowanie wersji do udostępnienia z zakładkami po angielsku będzie skomplikowane.

---

## Krótka odpowiedź

Nie, to **nie powinno być bardzo skomplikowane**, ale będzie wymagało **jednej kontrolowanej warstwy mapowania** nazw kolumn/zakładek oraz **normalizacji skrótów stron** (`str.` → `page`/`p.`) w miejscach parsowania.

Poziom trudności: **niski do średniego** (głównie prace porządkujące i testy danych wejściowych), pod warunkiem że:
1. zdefiniujesz stabilny słownik nazw EN,
2. dołożysz aliasy dla PL/EN na czas przejściowy,
3. przetestujesz parser na przykładowych rekordach z `p.` i `page`.

---

## Co dokładnie może się „wysypać” przy przejściu na EN

Na podstawie kontekstu z `Analizy/Udostepnienie.md` i mechaniki DataVault:

1. **Nazwy zakładek arkusza**
   - Jeżeli kod odwołuje się do konkretnych nazw sheetów (literalnie), zmiana nazw PL→EN zerwie odczyt.
   - Rozwiązanie: mapa aliasów `sheetAlias = { "Postacie": "Characters", ... }` albo konfiguracja nazw w jednym miejscu.

2. **Nazwy kolumn**
   - Jeśli parser oczekuje dokładnych nagłówków PL, angielskie kolumny nie przejdą walidacji.
   - Rozwiązanie: mapowanie nagłówków do kluczy kanonicznych, np.
     - `Strona` / `Page` / `P.` / `Str.` → `pageRef`
     - `Nazwa` / `Name` → `name`

3. **Warunki tekstowe typu `str.`**
   - Najbardziej czuły punkt: regexy i warunki parsera, które wykrywają tylko `str.`.
   - Wersja EN wymaga dopuszczenia `page`, `p.`, a najlepiej obu języków równolegle.

4. **Spójność danych między modułami**
   - Część modułów współdzieli dane (`DataVault` i `GeneratorNPC`), więc format wyjścia `data.json` musi zostać zgodny z obecnym API danych.
   - Dobra praktyka: zmieniasz wejście XLSX, ale **nie zmieniasz kontraktu JSON** (kluczy używanych przez frontend).

---

## Ocena skomplikowania

### Technicznie
- **Niski/średni**: jeśli logika parsowania jest skupiona w kilku funkcjach.
- **Średni/wysoki**: jeśli odwołania do nazw kolumn/sheetów są porozrzucane po wielu plikach i warunkach.

### Organizacyjnie
- **Niski**: jeśli przygotujesz 1 wzorzec EN i trzymasz się go w każdym kolejnym pliku wsadowym.
- **Średni**: jeśli równolegle będą krążyć różne warianty (częściowo PL, częściowo EN, różne skróty stron).

Wniosek: to bardziej zadanie **standaryzacji wejścia** niż trudna przebudowa logiki.

---

## Rekomendowany model wdrożenia (bez ryzyka regresji)

1. **Wprowadź słownik nagłówków i aliasów** (PL+EN)
   - Jedno źródło prawdy: mapowanie nagłówków z arkusza do kluczy wewnętrznych.

2. **Znormalizuj referencje stron**
   - Funkcja normalizująca powinna obsługiwać: `str.`, `s.`, `page`, `p.` (różna wielkość liter, odstępy).
   - Przykład efektu: każdy zapis trafia do formatu kanonicznego `p. <numer>` lub `page <numer>` (jeden wybrany standard runtime).

3. **Utrzymaj niezmienny format `data.json`**
   - Niezależnie od języka XLSX, wyjściowy JSON powinien mieć te same klucze co dotąd.

4. **Dodaj walidację wejścia z czytelnym komunikatem**
   - Jeśli brakuje krytycznej kolumny, komunikat ma wskazać akceptowane aliasy (PL/EN).

5. **Test próbki danych**
   - Minimum: rekordy z `str. 12`, `page 12`, `p. 12`, mieszane wielkości liter i dodatkowe spacje.

---

## Odpowiedź na kluczowe pytanie

Przygotowanie wersji do udostępnienia z zakładkami i kolumnami po angielsku jest **jak najbardziej wykonalne i raczej nieskomplikowane**, o ile potraktujesz to jako:
- dodanie mapowania nazw,
- dopuszczenie aliasów `str.` / `page` / `p.`,
- zachowanie zgodnego formatu wyjściowego JSON.

Największym realnym ryzykiem nie jest sama zmiana języka, tylko brak standaryzacji i testu normalizacji pól stron.

---

## Minimalna checklista przed publikacją

- [ ] arkusz EN ma ustalone, stałe nazwy zakładek,
- [ ] parser rozpoznaje aliasy kolumn PL i EN,
- [ ] parser rozpoznaje `str.`, `page`, `p.`,
- [ ] `data.json` ma ten sam kontrakt co wcześniej,
- [ ] test odczytu działa dla przykładowych danych EN,
- [ ] dokumentacja modułu do publikacji opisuje wymagany format XLSX (EN).
