# Uzupełnienie analizy: porównanie `Analizy/AI.txt` vs `Analizy/UI.txt` po ostatniej poprawce (2026-04-10)

## Prompt użytkownika (oryginalny)
> Przeczytaj analizę: Analizy/2026-04-10_analiza_przyczyny_roznic_ui_vs_ai_datajson_uzupelnienie.md
>
> Po ostatniej poprawce wygenerowałem nowy plik data.json przez przycisk.
> Jego zawartość wgrałem jako tekst do Analizy/UI.txt
> Porównaj go z zawartością pliku Analizy/AI.txt
>
> Następnie uzupełnij analizę.
> Jeżeli oba pliki Analizy/AI.txt i Analizy/UI.txt są identyczne to uznajemy, że poprawka działa.
> Jeżeli jest różnica to sprawdź jaka to różnica i z czego wynika.

---

## Zakres wykonanej weryfikacji

Porównanie wykonano na 3 poziomach:
1. **Byte-to-byte** (hash/diff surowych plików),
2. **Tekstowo-liniowe** (diff linii),
3. **Semantyczne JSON** (parsowanie JSON i porównanie struktur danych po deserializacji).

---

## Wynik porównania

### 1) Porównanie byte-to-byte
- Pliki **nie są identyczne bajtowo** (różne sumy kontrolne).
- Pierwsza różnica pojawia się bardzo wcześnie w pliku, a łączna długość plików się różni.

### 2) Porównanie tekstowo-liniowe
- Klasyczny `diff` pokazuje różnice na wielu liniach.
- Z analizy różnic wynika jednak, że w sekcji `sheets.Bronie` zmienia się głównie **kolejność kluczy** w obiektach:
  - AI: `... "Zasięg", "Cechy"`
  - UI: `... "Cechy", "Zasięg"`
- Wykryto **129** takich różnic kolejności kluczy.

### 3) Porównanie semantyczne JSON (kluczowe)
- Po wczytaniu obu plików jako JSON i porównaniu obiektów: wynik to **pełna równość danych** (`ai == ui` → `True`).
- Porównanie kanoniczne (`sort_keys=True`) także potwierdza brak różnic merytorycznych.

---

## Wniosek końcowy

W kontekście działania poprawki generatora wynik jest **prawidłowy**:
- `Analizy/AI.txt` i `Analizy/UI.txt` są **identyczne semantycznie** (te same dane JSON),
- obserwowane różnice dotyczą wyłącznie reprezentacji tekstowej (serializacja: kolejność kluczy i format zapisu),
- nie ma różnic merytorycznych w wartościach pól.

**Decyzja wg kryterium funkcjonalnego:** poprawka działa.

---

## Dodatkowa uwaga praktyczna

Jeśli w procesie CI/CD lub walidacji wymagane jest porównanie 1:1 bajt w bajt, trzeba ujednolicić serializację (np. stała kolejność kluczy i jednakowe ustawienia `JSON.stringify`/formatowania), bo obecnie porównanie surowych plików może zgłaszać fałszywe alarmy mimo równoważnych danych.
