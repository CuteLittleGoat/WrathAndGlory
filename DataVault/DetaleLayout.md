# 🇵🇱 Detale layoutu DataVault (PL)

## Paleta i zakładki

DataVault używa ciemnego, terminalowego układu z zieloną paletą bazową. Zwykłe zakładki mają zielone tło, zielone obramowanie i zielony efekt aktywnej poświaty.

Specjalne grupy zakładek są oznaczone osobnymi kolorami:

- zakładki tworzenia postaci używają jasnego koloru `--code` (`#D2FAD2`), delikatnego jasnego tła, jasnego obramowania na hover/focus oraz jasnego aktywnego glow `rgba(210,250,210,...)`;
- zakładki zasad walki używają czerwieni `--red` (`#d74b4b`) dla tekstu, aktywnego obramowania i aktywnego glow;
- zakładki pojazdów używają stalowo-srebrnej palety `--steel` / `--steel-bright`, stalowego obramowania i stalowego aktywnego glow.

## Checkboxy grup specjalnych

Checkboxy w panelu filtrów używają natywnego `accent-color`:

- checkbox tworzenia postaci `#toggleCharacterTabs` ma jasny kolor `--code`, zgodny z jasnym tekstem komunikatu;
- checkbox zasad walki `#toggleCombatTabs` ma czerwony kolor `--red`, zgodny z czerwonym tekstem komunikatu;
- checkbox pojazdów pozostaje stalowo-szary dzięki `--steel`.

Końcowe reguły CSS dla tych elementów znajdują się po bazowych regułach `.checkboxRow input` i `.tab.active`, aby kaskada CSS nie przywracała zwykłego zielonego stylu.

# 🇬🇧 DataVault layout details (EN)

## Palette and tabs

DataVault uses a dark terminal-like layout with a green base palette. Standard tabs have a green background, green border, and green active glow.

Special tab groups use separate color coding:

- character-creation tabs use the bright `--code` color (`#D2FAD2`), a subtle bright background, a bright hover/focus border, and a bright active glow based on `rgba(210,250,210,...)`;
- combat-rules tabs use `--red` (`#d74b4b`) for text, active border, and active glow;
- vehicle tabs use the `--steel` / `--steel-bright` steel-silver palette, a steel border, and a steel active glow.

## Special-group checkboxes

The filter-panel checkboxes use native `accent-color`:

- the character-creation checkbox `#toggleCharacterTabs` uses bright `--code`, matching the bright message text;
- the combat-rules checkbox `#toggleCombatTabs` uses red `--red`, matching the red message text;
- the vehicle checkbox stays steel gray through `--steel`.

The final CSS rules for these elements are placed after the base `.checkboxRow input` and `.tab.active` rules so the CSS cascade does not restore the standard green style.
