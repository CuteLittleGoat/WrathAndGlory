# Detale layoutu modułu Infoczytnik

## Kolory i elementy wizualne
- Domyślny kolor logo w panelu GM (`GM_test.html`) oraz na ekranie odbiorcy (`Infoczytnik_test.html`) to złoty `#d4af37`.
- Kolor logo jest renderowany przez maskę CSS (`mask-image` / `-webkit-mask-image`) i zmienną `--logoPreviewColor` (podgląd GM) oraz `--logoColor` (ekran odbiorcy).

## Interakcja panelu koloru logo
- Pole tekstowe HEX i color picker dla logo startują z wartością `#d4af37`.
- Po wyłączeniu przełącznika `Logo` panel koloru logo jest wyszarzany i blokowany (`opacity` + `pointer-events`).

## Spójność między ekranami
- Ten sam kolor logo jest zapisywany w payloadzie jako `logoColor` i używany po stronie ekranu odbiorcy, aby wygląd był zgodny z podglądem GM.
