// --- Klucze witryny App Check (reCAPTCHA Enterprise) / App Check site keys (reCAPTCHA Enterprise) ---
//
// PL: To jest JEDYNE miejsce w repozytorium, w którym zapisane są klucze witryny App Check.
//     Aplikacja korzysta z dwóch osobnych projektów Firebase, a klucz reCAPTCHA należy do
//     konkretnego projektu — dlatego klucze są tu spisane pod identyfikatorem projektu
//     (projectId), a nie pod nazwą modułu. Dzięki temu przy zmianie klucza albo domeny
//     poprawia się jeden plik, a nie pięć plików konfiguracyjnych poszczególnych modułów.
//
// EN: This is the ONLY place in the repository where App Check site keys are stored.
//     The application uses two separate Firebase projects and a reCAPTCHA key belongs to one
//     specific project — therefore keys are listed here by project id (projectId) rather than
//     by module name. Changing a key or a domain means editing one file, not five per-module
//     configuration files.
//
// PL: Klucz witryny NIE jest sekretem. Tak samo jak apiKey musi trafić do kodu strony,
//     żeby przeglądarka mogła w ogóle poprosić o znacznik App Check. W wariancie Enterprise
//     nie istnieje żaden "klucz tajny", więc nie ma czego pomylić.
// EN: A site key is NOT a secret. Like apiKey it must be present in the page source so the
//     browser can request an App Check token at all. The Enterprise variant has no "secret
//     key" counterpart, so there is nothing here that could be confused with one.
//
// PL: Oba klucze są wystawione dla domeny cutelittlegoat.github.io.
// EN: Both keys are issued for the cutelittlegoat.github.io domain.
window.WG_APPCHECK_SITE_KEYS = Object.freeze({
  // PL: DataVault, oba Kreatory Postaci, Infoczytnik / EN: DataVault, both character creators, Infoczytnik
  "wh40k-data-slate": "6LeRfrktAAAAADKbFXRt0B2MTepQauRANcx368i-",
  // PL: GeneratorNPC, moduł Audio / EN: GeneratorNPC, Audio module
  "audiorpg-2eb6f": "6LfSJ7ktAAAAAKPT65QJ8rFg6chosS7uPTuQqpRW"
});

// --- Odczyt klucza dla projektu / Site key lookup for a project ---
// PL: Zwraca pusty tekst, gdy projekt nie ma klucza. Wywołujący ma wtedy pominąć App Check
//     i uruchomić moduł tak jak dotąd — brak klucza nie może zatrzymać aplikacji.
// EN: Returns an empty string when a project has no key. The caller must then skip App Check
//     and start the module as before — a missing key must never stop the application.
window.WG_getAppCheckSiteKey = function (projectId) {
  const keys = window.WG_APPCHECK_SITE_KEYS || {};
  return keys[String(projectId || "")] || "";
};
