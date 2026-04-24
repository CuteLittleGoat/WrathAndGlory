# Analiza modyfikacji modułu DataVault — domyślne pierwsze zakładki

## Prompt użytkownika
> Przeprowadź analizę modyfikacji modułu DataVault.
> Chciałbym, żeby w widoku użytkownika domyślnie była wyświetlana zakładka "Bronie".
> W widoku admina domyślnie wyświetlaną zakładką ma być "Notatki".
>
> Zmiana ta ma dotyczyć tylko pierwszej zakładki jaka jest wyświetlana. Nic ma się nie zmieniać w funkcji "widok domyślny" itp.

## Zakres analizy
- Analiza dotyczy wyłącznie mechanizmu wyboru **pierwszej aktywnej zakładki** po inicjalizacji interfejsu.
- Bez zmian w logice przycisków i funkcji typu **„Widok Domyślny” / „Pełen Widok”**.

## Ustalenia techniczne
1. Za budowanie listy zakładek odpowiada `initUI()` w `DataVault/app.js`.
2. Obecnie pierwsza wybierana zakładka wynika z kolejności `visibleOrder` i fallbacku:
   - `const nextSheet = visibleOrder.includes(currentSheet) ? currentSheet : (visibleOrder[0] || visibleSheets[0]);`
3. To oznacza, że aplikacja domyślnie wybiera **pierwszą widoczną** zakładkę, a nie „preferowaną” per tryb użytkownika/admina.
4. Dla widoku admina z aktualnym `data.json` pierwszą zakładką i tak jest już `Notatki` (bo jest pierwsza w `sheetOrder`).
5. Dla widoku użytkownika pierwszą zakładką nie jest `Bronie`, tylko ta, która jako pierwsza przechodzi filtry widoczności (obecnie np. `Cechy`).

## Wniosek
Aby spełnić wymaganie użytkownika, wystarczy zmodyfikować **tylko etap wyznaczania `nextSheet` w `initUI()`**, przez dodanie preferencji startowej:
- `ADMIN_MODE === true` → preferuj `Notatki`,
- `ADMIN_MODE === false` → preferuj `Bronie`,
- jeżeli preferowana zakładka nie jest widoczna, użyj obecnego fallbacku (`visibleOrder[0] || visibleSheets[0]`).

## Uwagi ważne dla zgodności z wymaganiem
- Nie trzeba zmieniać logiki `applyDefaultViewForSheet`, `applyViewModeToAllSheets` ani konfiguracji `DEFAULT_VIEW_CONFIG`.
- Nie trzeba zmieniać działania przycisku „Widok Domyślny”.
- Zmiana ma dotyczyć wyłącznie **pierwszego wyboru aktywnej zakładki po inicjalizacji widoku**.
