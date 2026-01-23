# Dokumentacja modułu Audio

## Przegląd
Moduł **Audio** jest w przygotowaniu. Aktualnie działa jako statyczna strona informacyjna, ale docelowo będzie odtwarzać dźwięki na podstawie arkusza `AudioManifest.xlsx` oraz umożliwiać tworzenie grup i list „Ulubionych” bezpośrednio w interfejsie. Projekt zachowuje terminalowy, zielony styl wspólny dla pozostałych modułów.

## Struktura plików (obecnie)
- `Audio/index.html` – aktualna strona informacyjna (placeholder).
- `Audio/AudioManifest.xlsx` – arkusz źródłowy z listą dźwięków (kolumny: NazwaSampla, NazwaPliku, LinkDoFolderu).
- `Audio/docs/README.md` – instrukcja użytkownika (PL/EN) z planowanymi funkcjami.
- `Audio/docs/Documentation.md` – niniejszy opis.

## Planowana struktura plików (docelowo)
- `Audio/audiodata.json` – wygenerowany plik JSON z danymi audio z arkusza (`AudioManifest.xlsx`).
- `Audio/tools/convert-audio-manifest.*` – skrypt konwersji (np. Node/Python), który czyta arkusz i generuje `audiodata.json`.
- `Audio/assets/` – opcjonalny katalog na ikony i grafiki interfejsu.

> **Uwaga:** Nazwa pliku JSON jest **audiodata.json**, aby nie kolidować z `data.json` z modułu DataVault.

## Mechanizm danych — szczegółowy plan

### 1. Format wejściowy (Excel)
Arkusz `AudioManifest.xlsx` ma trzy kolumny:
- **NazwaSampla** – tekst widoczny na przycisku.
- **NazwaPliku** – nazwa pliku audio.
- **LinkDoFolderu** – ścieżka URL do katalogu z plikiem audio.

### 2. Format wyjściowy (JSON)
Przykładowa struktura planowanego `audiodata.json`:
```json
{
  "version": "1.0",
  "generatedAt": "2024-01-01T12:00:00Z",
  "items": [
    {
      "id": "lasgun-shoot",
      "label": "Lasgun Shoot",
      "filename": "lasgun_shoot.wav",
      "folderUrl": "https://example.com/audio/lasguns"
    }
  ]
}
```
- `id` – stabilny identyfikator (slug z `NazwaSampla`).
- `label` – tekst przycisku.
- `filename` – nazwa pliku audio.
- `folderUrl` – URL do folderu.

### 3. Budowanie linku do pliku
W aplikacji link do pliku audio powstaje przez:
```
fullUrl = folderUrl + "/" + filename
```
W przypadku duplikatów lub braków w danych należy wyświetlić czytelny komunikat błędu w panelu diagnostycznym.

### 4. Zasady mapowania
- Każdy wiersz arkusza staje się jednym wpisem w `items`.
- `NazwaSampla` jest unikatowa w obrębie aplikacji (jeśli nie, aplikacja zgłasza konflikt).
- `NazwaPliku` musi zawierać rozszerzenie (np. `.wav`, `.mp3`).

## Planowana logika front-end (szczegółowy opis funkcji)

### 1. Inicjalizacja aplikacji
- Po załadowaniu strony aplikacja pobiera `audiodata.json`.
- Dane są sortowane alfabetycznie po `label`.
- Tworzona jest mapa `samplesById` i `samplesByLabel`.

### 2. Główne funkcje (proponowane nazwy)
- `loadAudioData()`
  - Pobiera `audiodata.json`.
  - Waliduje strukturę i zwraca listę elementów.
- `buildAudioUrl(item)`
  - Zwraca pełny URL: `item.folderUrl + "/" + item.filename`.
- `renderSampleButton(item)`
  - Tworzy przycisk z etykietą `item.label`.
  - Obsługuje kliknięcie (odtwarzanie).
- `playSample(item)`
  - Tworzy/ponownie wykorzystuje obiekt `Audio`.
  - Odtwarza dźwięk, zatrzymując poprzedni jeśli potrzeba.
- `renderGroups()`
  - Rysuje listę grup i przypisanych dźwięków.
- `renderFavorites()`
  - Rysuje listy „Ulubionych” wraz z przyciskami.

### 3. Obsługa grup
Grupy są zarządzane w UI i zapisywane w konfiguracji użytkownika:
- `groups` – tablica obiektów:
  ```json
  {
    "id": "group-1",
    "name": "Odgłosy broni",
    "itemIds": ["lasgun-shoot", "bolter-shot"],
    "visible": true
  }
  ```
- Edycja grup:
  - Tworzenie nowej grupy.
  - Zmiana nazwy.
  - Dodawanie/wyjmowanie elementów.
  - Usuwanie grupy.
  - Zmiana widoczności (checkboxy).

### 4. Obsługa „Ulubionych”
„Ulubione” to lista list (multi-favorites):
```json
{
  "favoritesLists": [
    {
      "id": "fav-1",
      "name": "Combat",
      "itemIds": ["lasgun-shoot", "grenade-explosion"]
    }
  ]
}
```
- Możliwości:
  - Dodawanie pojedynczego elementu lub całej grupy.
  - Zmiana kolejności elementów (drag & drop lub przyciski góra/dół).
  - Zmiana nazwy listy.
  - Zmiana kolejności list.
  - Usuwanie list z potwierdzeniem.

### 5. Zapisywanie ustawień (synchronizacja między urządzeniami)
Wymagane jest przenoszenie konfiguracji między urządzeniami, więc zapis lokalny jest niewystarczający jako jedyne rozwiązanie. Planowane są warianty:
- **Firebase na osobnym koncie/projekcie**:
  - Przechowywanie konfiguracji użytkownika w Firestore/Realtime DB.
  - Proste logowanie (np. email+hasło lub link magiczny).
  - Integracja musi być izolowana i nie może blokować działania **Infoczytnika**.
- **Zewnętrzny plik konfiguracyjny** `audio-settings.json`:
  - Użytkownik wskazuje źródło (np. WebDAV, Google Drive, OneDrive, prywatne API).
  - Moduł odczytuje i zapisuje konfigurację w tym pliku.
- **Eksport/import** pliku JSON:
  - Ręczne przenoszenie konfiguracji między urządzeniami jako plan awaryjny.

Docelowy wybór rozwiązania będzie ustalony na etapie implementacji, przy zachowaniu kompatybilności z modułem **Infoczytnik**.

## Planowany układ interfejsu (layout)

### 1. Główne sekcje
- **Nagłówek**: tytuł modułu, krótki opis, wskaźnik liczby sampli.
- **Panel sterowania**:
  - pole wyszukiwania,
  - filtry,
  - przyciski „Dodaj grupę”, „Dodaj do ulubionych”.
- **Lista grup**:
  - po lewej stronie, z checkboxami widoczności.
- **Siatka/przyciskowa lista dźwięków**:
  - w centrum, duża liczba przycisków (przyjazna na 100+ elementów).
- **Panel „Ulubione”**:
  - po prawej stronie, osobny blok.

### 2. Nawigacja i ergonomia
- Przy dużej liczbie elementów włączona paginacja lub wirtualizacja listy.
- Szybkie filtrowanie przez pole wyszukiwania (np. `NazwaSampla`).
- Wyraźny stan odtwarzania (np. podświetlenie aktywnego przycisku).

### 3. Spójność wizualna
- Zachowany terminalowy styl:
  - kolory: `#16c60c`, `#0d7a07`, `#9cf09c`, `#031605`,
  - fonty monospace: "Consolas", "Fira Code", "Source Code Pro".
- Panel i przyciski o krawędziach z delikatnym glow.

## Aktualny stan kodu (`Audio/index.html`)
Plik `index.html` pozostaje placeholderem:
- Wyświetla tytuł „Strona w budowie”.
- Zawiera tylko statyczny HTML i CSS.
- Nie ma jeszcze JavaScriptu ani obsługi danych.

## Plan modyfikacji (kroki wdrożenia)
1. Dodać skrypt konwersji `AudioManifest.xlsx` → `audiodata.json`.
2. Zaimplementować loader `audiodata.json` w `Audio/index.html`.
3. Zbudować strukturę UI (nagłówek, listy, panel grup, ulubione).
4. Dodać obsługę odtwarzania dźwięku.
5. Dodać panel grupowania i zapisywanie konfiguracji.
6. Dodać panel „Ulubione” z pełną edycją list.

## Uruchamianie lokalne
Strona jest statyczna. Możesz ją otworzyć bez serwera lub uruchomić lokalny serwer:

```bash
python -m http.server 8000
```

Następnie otwórz `http://localhost:8000/Audio/index.html`.
