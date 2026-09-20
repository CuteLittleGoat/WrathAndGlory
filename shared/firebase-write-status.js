// --- Wspólny komunikat o nieudanym zapisie i odczycie Firestore / Shared failed-write and failed-read notice for Firestore ---
//
// PL: Moduł powstał po awarii z 20 września, w której ulubiony potwór zapisany w GeneratorNPC
//     trafił wyłącznie do pamięci przeglądarki, a po powrocie dostępu do bazy zniknął bez śladu.
//     Przyczyną nie był brak obsługi błędu, tylko to, że komunikat brzmiał jak informacja
//     („Używam pamięci lokalnej”) i mieścił się w jednej linijce tekstu w rogu panelu.
//     Ten plik trzyma w jednym miejscu trzy rzeczy: rozpoznanie przyczyny błędu Firestore,
//     teksty polskie i angielskie oraz sposób pokazania ich użytkownikowi. Dzięki temu
//     GeneratorNPC i moduł Audio mówią dokładnie to samo i poprawka tekstu wystarczy raz.
// EN: This module was written after the 20 September failure, where a favourite monster saved in
//     GeneratorNPC landed in browser storage only and vanished without a trace once database
//     access came back. The cause was not a missing error handler but a message that read like a
//     status note ("using local storage") and lived in a single line of text in a panel corner.
//     This file keeps three things in one place: recognising the cause of a Firestore error, the
//     Polish and English texts, and the way they are shown to the user. GeneratorNPC and the Audio
//     module therefore say exactly the same thing and a wording fix is needed only once.
//
// PL: Moduł nie zapisuje niczego do bazy i nie zna struktury danych żadnego modułu. Przyjmuje
//     obiekt błędu, informację, czy dane udało się odłożyć lokalnie, i pokazuje pasek.
// EN: The module never writes to the database and knows nothing about any module's data shape.
//     It takes an error object, the information whether data was stored locally, and shows a bar.

// --- Sytuacje, które trzeba rozróżnić / Situations that must be told apart ---
//
// PL: Rozdzielenie jest celowe: „nie zapisano nic” i „zapisano tylko tutaj” znaczą dla użytkownika
//     zupełnie co innego, a dotąd oba kończyły się tym samym zdaniem.
// EN: The split is deliberate: "nothing was saved" and "saved here only" mean completely different
//     things to the user, yet until now both ended with the same sentence.
export const WRITE_STATUS_SITUATIONS = {
  // Zapis nie powiódł się nigdzie / The write failed everywhere
  NOTHING_SAVED: "nothing-saved",
  // Zapis powiódł się wyłącznie w pamięci tej przeglądarki / The write succeeded in this browser's storage only
  LOCAL_ONLY: "local-only",
  // Nie udało się wczytać danych z bazy / Reading data from the database failed
  READ_FAILED: "read-failed",
  // Moduł świadomie pracuje bez bazy (brak konfiguracji) / The module intentionally runs without the database (no configuration)
  LOCAL_MODE: "local-mode",
  // Dane z bazy zastąpiły zmiany zapisane tylko na tym urządzeniu / Database data replaced changes saved on this device only
  LOCAL_OVERWRITTEN: "local-overwritten"
};

// --- Teksty PL/EN w jednym miejscu / PL and EN texts in one place ---
//
// PL: Słowniki obu modułów celowo NIE dostają kopii tych zdań. Skopiowany tekst rozjeżdża się
//     przy pierwszej poprawce, a moduły mają mówić jednym głosem.
// EN: The dictionaries of both modules deliberately do NOT get a copy of these sentences. Copied
//     text drifts apart at the first correction, and the modules must speak with one voice.
const TEXTS = {
  pl: {
    closeLabel: "Zamknij komunikat",
    codeLabel: "Kod błędu: {code}",
    modeShared: "Dane wspólne",
    modeSharedTitle: "Zmiany trafiają do bazy i widać je na innych urządzeniach.",
    modeLocal: "Tylko to urządzenie",
    modeLocalTitle: "Zmiany zostają w tej przeglądarce. Na innym komputerze ani telefonie ich nie będzie.",
    modeUnknown: "Sprawdzanie połączenia",
    modeUnknownTitle: "Moduł sprawdza połączenie z bazą.",
    situations: {
      "nothing-saved": "Zmiana nie została zapisana — ani w bazie, ani na tym urządzeniu.",
      "local-only": "Zapisano tylko na tym urządzeniu. Na innym komputerze ani telefonie tej zmiany nie będzie.",
      "read-failed": "Nie udało się wczytać danych z bazy.",
      "local-mode": "Moduł pracuje na pamięci tego urządzenia. Zmiany nie trafiają do bazy.",
      "local-overwritten": "Zmiany zapisane tylko na tym urządzeniu zostały właśnie zastąpione danymi z bazy."
    },
    causes: {
      // PL: Pierwszy podejrzany przy odmowie uprawnień — rozdz. 11a instrukcji App Check.
      // EN: The first suspect on a permission denial — chapter 11a of the App Check guide.
      // PL: Tekst jest celowo krótki. Pasek na telefonie nie może zająć pół ekranu, a to jest
      //     najdłuższy z komunikatów — patrz sprawdzenie szerokości 360 px w dokumentacji modułów.
      // EN: The text is deliberately short. On a phone the bar must not take half the screen, and
      //     this is the longest message — see the 360 px width check in the module documentation.
      "permission-denied":
        "Baza odrzuciła operację. Najczęstsza przyczyna to zablokowany adres google.com/recaptcha "
        + "— dodatek blokujący reklamy albo filtr sieci. Wyłącz blokowanie dla tej strony i odśwież "
        + "moduł. Jeżeli to nie pomoże, sprawdź uprawnienia bazy.",
      unauthenticated: "Sesja wygasła. Odśwież stronę i zaloguj się ponownie.",
      unavailable: "Brak połączenia z bazą. Gdy połączenie wróci, powtórz zmianę, żeby trafiła do bazy.",
      "deadline-exceeded": "Baza nie odpowiedziała na czas. Sprawdź połączenie i powtórz zmianę.",
      "resource-exhausted": "Przekroczony limit zapytań do bazy. Spróbuj ponownie za jakiś czas.",
      "failed-precondition": "Baza odrzuciła operację z powodu stanu dokumentu. Odśwież moduł i powtórz zmianę.",
      unknown: "Nieoczekiwany błąd bazy. Przy zgłoszeniu podaj kod błędu z tego komunikatu.",
      "no-config": "Ta kopia modułu nie ma konfiguracji bazy. To ustawienie, a nie awaria.",
      "init-failed": "Nie udało się uruchomić połączenia z bazą. Odśwież stronę.",
      "local-overwritten":
        "Baza nic o nich nie wiedziała, bo powstały w czasie, gdy nie było z nią łączności. "
        + "Jeżeli czegoś brakuje, dodaj to ponownie."
    },
    savedAtLabel: "Ostatnia zmiana lokalna: {date}"
  },
  en: {
    closeLabel: "Close message",
    codeLabel: "Error code: {code}",
    modeShared: "Shared data",
    modeSharedTitle: "Changes reach the database and are visible on other devices.",
    modeLocal: "This device only",
    modeLocalTitle: "Changes stay in this browser. They will not appear on another computer or phone.",
    modeUnknown: "Checking connection",
    modeUnknownTitle: "The module is checking the database connection.",
    situations: {
      "nothing-saved": "The change was not saved — neither in the database nor on this device.",
      "local-only": "Saved on this device only. The change will not appear on another computer or phone.",
      "read-failed": "Data could not be loaded from the database.",
      "local-mode": "The module runs on this device's storage. Changes do not reach the database.",
      "local-overwritten": "Changes saved on this device only have just been replaced by database data."
    },
    causes: {
      "permission-denied":
        "The database rejected the operation. The most common cause is a blocked google.com/recaptcha "
        + "address — an ad blocker or a network filter. Disable blocking for this page and reload the "
        + "module. If that does not help, check the database permissions.",
      unauthenticated: "The session has expired. Reload the page and sign in again.",
      unavailable: "No connection to the database. Once it is back, repeat the change so it reaches the database.",
      "deadline-exceeded": "The database did not answer in time. Check the connection and repeat the change.",
      "resource-exhausted": "The database request limit has been exceeded. Try again later.",
      "failed-precondition": "The database rejected the operation because of the document state. Reload the module and repeat the change.",
      unknown: "Unexpected database error. Quote the error code from this message when reporting it.",
      "no-config": "This copy of the module has no database configuration. That is a setting, not a failure.",
      "init-failed": "The database connection could not be started. Reload the page.",
      "local-overwritten":
        "The database never knew about them, because they were made while it was out of reach. "
        + "If something is missing, add it again."
    },
    savedAtLabel: "Last local change: {date}"
  }
};

// --- Kody Firestore, które mają własny, łagodniejszy ton / Firestore codes with their own, gentler tone ---
//
// PL: Chwilowy brak sieci zdarza się przy zwykłym korzystaniu i nie może wyglądać jak awaria bazy,
//     bo wtedy użytkownik przestanie czytać paski. Stąd osobny, żółty ton dla tych kodów.
// EN: A brief network outage happens during normal use and must not look like a database failure,
//     otherwise the user stops reading the bars altogether. Hence a separate amber tone for these codes.
const GENTLE_CODES = new Set(["unavailable", "deadline-exceeded"]);

// --- Prefiks znaczników zmian zapisanych tylko lokalnie / Prefix for the "saved locally only" markers ---
const LOCAL_ONLY_PREFIX = "wgLocalOnlyChange:";

// --- Podstawienie wartości w tekście / Value substitution in a text ---
const formatText = (template, vars = {}) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : ""));

// --- Wybór słownika z zabezpieczeniem na nieznany język / Dictionary lookup with a guard for an unknown language ---
const dictionary = (language) => TEXTS[language] || TEXTS.pl;

// --- Odczytanie kodu błędu z obiektu Firestore / Reading the error code from a Firestore object ---
//
// PL: SDK podaje kod w polu `code` w postaci „permission-denied” albo „firestore/permission-denied”,
//     zależnie od ścieżki, którą błąd wraca. Obie postaci sprowadzamy do jednej.
// EN: The SDK reports the code in the `code` field as "permission-denied" or
//     "firestore/permission-denied", depending on the path the error returns through. Both forms
//     are reduced to one.
export function readFirestoreErrorCode(error) {
  const raw = String(error?.code || "").toLowerCase();
  if (!raw) return "";
  const parts = raw.split("/");
  return parts[parts.length - 1];
}

// --- Rozpoznanie przyczyny i dobranie tekstu / Recognising the cause and picking the text ---
//
// PL: Zwracany obiekt jest jedynym źródłem tekstów także dla linii statusu w module, żeby ten sam
//     komunikat nie powstał drugi raz w słowniku modułu.
// EN: The returned object is the single source of texts for the module's status line as well, so the
//     same message is not written a second time in the module's own dictionary.
export function describeWriteProblem({ situation, error = null, language = "pl", cause = "" } = {}) {
  const t = dictionary(language);
  const code = cause || readFirestoreErrorCode(error) || (error ? "unknown" : "");
  const hint = t.causes[code] || t.causes.unknown;
  const title = t.situations[situation] || t.situations[WRITE_STATUS_SITUATIONS.NOTHING_SAVED];
  const gentle = GENTLE_CODES.has(code)
    || situation === WRITE_STATUS_SITUATIONS.LOCAL_ONLY
    || situation === WRITE_STATUS_SITUATIONS.LOCAL_MODE
    || situation === WRITE_STATUS_SITUATIONS.LOCAL_OVERWRITTEN;
  return {
    situation,
    code,
    title,
    hint,
    tone: gentle ? "warning" : "error",
    // PL: Jedno zdanie do miejsc, w których jest tylko jedna linia tekstu (np. linia statusu ulubionych).
    // EN: A single sentence for places with one line of text only (e.g. the favourites status line).
    message: `${title} ${hint}`.trim(),
    codeLabel: code && code !== "no-config" && code !== "init-failed"
      ? formatText(t.codeLabel, { code })
      : ""
  };
}

// --- Znacznik „mam zmiany tylko na tym urządzeniu” / The "I have changes on this device only" marker ---
//
// PL: Znacznik przeżywa zamknięcie karty, bo właśnie wtedy powstaje szkoda: moduł otwarty po
//     powrocie dostępu wczytuje bazę i zastępuje nią stan lokalny. Bez znacznika nie da się
//     powiedzieć użytkownikowi, że coś właśnie zostało zastąpione.
// EN: The marker survives closing the tab, because that is exactly when the damage happens: a module
//     opened after access is restored loads the database and replaces the local state with it.
//     Without the marker there is no way to tell the user that something has just been replaced.
export function markLocalOnlyChange(scopeKey) {
  if (!scopeKey) return;
  try {
    localStorage.setItem(LOCAL_ONLY_PREFIX + scopeKey, JSON.stringify({ at: new Date().toISOString() }));
  } catch (error) {
    console.warn("[WriteStatus] Nie udało się zapisać znacznika zmian lokalnych / Could not store the local-change marker:", error);
  }
}

// --- Odczytanie i skasowanie znacznika / Reading and clearing the marker ---
//
// PL: Odczyt kasuje znacznik, bo ostrzeżenie o zastąpieniu ma się pokazać raz, a nie przy każdym
//     otwarciu modułu. Dane lokalne zostają nietknięte w pamięci przeglądarki.
// EN: Reading clears the marker, because the overwrite warning must appear once, not on every module
//     start. The local data itself stays untouched in browser storage.
export function consumeLocalOnlyChange(scopeKey) {
  if (!scopeKey) return null;
  try {
    const raw = localStorage.getItem(LOCAL_ONLY_PREFIX + scopeKey);
    if (!raw) return null;
    localStorage.removeItem(LOCAL_ONLY_PREFIX + scopeKey);
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

// --- Skasowanie znacznika bez ostrzeżenia / Clearing the marker without a warning ---
//
// PL: Używane po udanym zapisie do bazy: skoro dane tam trafiły, nie ma czego zastępować.
// EN: Used after a successful database write: once the data is there, nothing is left to replace.
export function clearLocalOnlyChange(scopeKey) {
  if (!scopeKey) return;
  try {
    localStorage.removeItem(LOCAL_ONLY_PREFIX + scopeKey);
  } catch (error) {
    /* PL: Brak dostępu do pamięci nie może przerwać modułu. / EN: No storage access must not break the module. */
  }
}

// --- Data zmiany w postaci czytelnej dla człowieka / The change date in a human-readable form ---
const formatStamp = (value, language) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  try {
    return date.toLocaleString(language === "en" ? "en-GB" : "pl-PL");
  } catch (error) {
    return date.toISOString();
  }
};

// --- Budowa paska i znacznika trybu pracy / Building the bar and the working-mode badge ---
//
// PL: Pasek jest `position: fixed`, więc nie przesuwa zawartości modułu — to był warunek postawiony
//     w analizie, bo oba moduły mają gęsty układ i pasek w przepływie psułby widok na telefonie.
//     Znacznik trybu jest osobnym, małym elementem wstawianym tam, gdzie moduł wskaże: ma być
//     widoczny stale, a nie tylko w chwili błędu.
// EN: The bar is `position: fixed`, so it never shifts the module content — a condition set in the
//     analysis, because both modules have a dense layout and an in-flow bar would break the phone
//     view. The mode badge is a separate small element inserted wherever the module points: it must
//     stay visible all the time, not only at the moment of an error.
export function createFirebaseWriteStatus({
  mount = null,
  modeMount = null,
  language = "pl",
  scopeKey = "",
  moduleName = "module"
} = {}) {
  let currentLanguage = TEXTS[language] ? language : "pl";
  let currentMode = "unknown";

  const host = mount || document.body;

  // --- Pasek komunikatu / The message bar ---
  const bar = document.createElement("div");
  bar.className = "wgWriteStatus";
  bar.setAttribute("role", "status");
  bar.setAttribute("aria-live", "polite");
  bar.hidden = true;

  const body = document.createElement("div");
  body.className = "wgWriteStatus__body";

  const titleEl = document.createElement("strong");
  titleEl.className = "wgWriteStatus__title";

  const hintEl = document.createElement("span");
  hintEl.className = "wgWriteStatus__hint";

  const codeEl = document.createElement("span");
  codeEl.className = "wgWriteStatus__code";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "wgWriteStatus__close";
  closeButton.textContent = "×";

  body.append(titleEl, hintEl, codeEl);
  bar.append(body, closeButton);
  host.prepend(bar);

  // --- Znacznik trybu pracy / The working-mode badge ---
  const modeBadge = document.createElement("span");
  modeBadge.className = "wgWriteMode";
  modeBadge.dataset.mode = "unknown";
  if (modeMount) {
    modeMount.append(modeBadge);
  }

  // PL: Ostatni pokazany komunikat trzymamy, żeby zmiana języka przepisała pasek bez czekania na
  //     kolejny błąd — inaczej po przełączeniu języka pasek zostałby w poprzednim.
  // EN: The last shown message is kept so a language change rewrites the bar without waiting for the
  //     next error — otherwise the bar would stay in the previous language after switching.
  let lastReport = null;

  // --- Rezerwacja miejsca u góry strony / Reserving space at the top of the page ---
  //
  // PL: Pasek jest przyklejony do okna, więc sam z siebie zasłoniłby pierwszy element modułu —
  //     w GeneratorNPC przyciski „Reset” i „Generuj kartę”. Skrypt podaje jego wysokość do zmiennej
  //     CSS, a arkusz wspólny przesuwa o tyle zawartość strony. Gdy paska nie ma, wysokość wynosi
  //     zero i układ jest dokładnie taki jak przed wprowadzeniem paska.
  //     Wysokość zmienia się razem z zawijaniem tekstu, dlatego pilnuje jej ResizeObserver —
  //     przy obrocie telefonu komunikat potrafi urosnąć albo zmaleć o kilka wierszy.
  // EN: The bar is pinned to the window, so on its own it would cover the module's first element —
  //     in GeneratorNPC the "Reset" and "Generate card" buttons. The script publishes its height to
  //     a CSS variable and the shared stylesheet pushes the page content down by that much. With no
  //     bar the height is zero and the layout is exactly what it was before the bar existed.
  //     The height changes as the text wraps, so a ResizeObserver watches it — on a phone rotation
  //     the message can grow or shrink by a few lines.
  const publishBarHeight = () => {
    const height = bar.hidden ? 0 : Math.ceil(bar.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--wg-write-status-height", `${height}px`);
  };

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(publishBarHeight).observe(bar);
  } else {
    window.addEventListener("resize", publishBarHeight);
  }

  const renderMode = () => {
    const t = dictionary(currentLanguage);
    const labels = {
      shared: [t.modeShared, t.modeSharedTitle],
      local: [t.modeLocal, t.modeLocalTitle],
      unknown: [t.modeUnknown, t.modeUnknownTitle]
    };
    const [label, description] = labels[currentMode] || labels.unknown;
    modeBadge.dataset.mode = currentMode;
    modeBadge.textContent = label;
    modeBadge.title = description;
  };

  const renderBar = () => {
    if (!lastReport) {
      bar.hidden = true;
      bar.classList.remove("is-visible");
      publishBarHeight();
      return;
    }
    // PL: Teksty składamy od nowa przy każdym pokazaniu, bo język mógł się zmienić.
    // EN: The texts are composed anew on every show, because the language may have changed.
    const report = describeWriteProblem({
      situation: lastReport.situation,
      error: lastReport.error,
      cause: lastReport.cause,
      language: currentLanguage
    });
    const t = dictionary(currentLanguage);
    titleEl.textContent = report.title;
    hintEl.textContent = lastReport.extraHint
      ? `${report.hint} ${formatText(t.savedAtLabel, { date: lastReport.extraHint })}`
      : report.hint;
    codeEl.textContent = report.codeLabel;
    bar.dataset.tone = report.tone;
    bar.dataset.situation = report.situation;
    closeButton.setAttribute("aria-label", t.closeLabel);
    closeButton.title = t.closeLabel;
    bar.hidden = false;
    bar.classList.add("is-visible");
    publishBarHeight();
  };

  const show = (situation, { error = null, cause = "", extraHint = "" } = {}) => {
    lastReport = { situation, error, cause, extraHint };
    renderBar();
    return describeWriteProblem({ situation, error, cause, language: currentLanguage });
  };

  const hide = () => {
    lastReport = null;
    renderBar();
  };

  closeButton.addEventListener("click", hide);

  renderMode();
  renderBar();

  return {
    // --- Elementy, gdyby moduł chciał je przenieść / The elements, should the module want to move them ---
    barElement: bar,
    modeElement: modeBadge,

    // --- Przełączenie języka bez czekania na kolejny błąd / Language switch without waiting for the next error ---
    setLanguage(lang) {
      currentLanguage = TEXTS[lang] ? lang : "pl";
      renderMode();
      renderBar();
    },

    // --- Stały znacznik trybu pracy / The permanent working-mode badge ---
    setMode(mode) {
      const next = mode === "shared" || mode === "local" ? mode : "unknown";
      if (next === currentMode) return;
      currentMode = next;
      renderMode();
    },

    // --- Udany zapis do bazy: pasek znika, tryb wraca na „dane wspólne” / Successful database write: the bar disappears, mode returns to "shared" ---
    reportSaveSuccess() {
      clearLocalOnlyChange(scopeKey);
      currentMode = "shared";
      renderMode();
      hide();
    },

    // --- Nieudany zapis / A failed write ---
    //
    // PL: `savedLocally` rozstrzyga między dwoma zupełnie różnymi komunikatami, dlatego moduł musi
    //     podać prawdę: czy zapis lokalny naprawdę się udał.
    // EN: `savedLocally` decides between two completely different messages, so the module must state
    //     the truth: whether the local write really succeeded.
    reportSaveError(error, { savedLocally = false } = {}) {
      console.warn(`[WriteStatus][${moduleName}] Nieudany zapis / Failed write:`, error);
      if (savedLocally) {
        markLocalOnlyChange(scopeKey);
      }
      currentMode = "local";
      renderMode();
      return show(
        savedLocally ? WRITE_STATUS_SITUATIONS.LOCAL_ONLY : WRITE_STATUS_SITUATIONS.NOTHING_SAVED,
        { error }
      );
    },

    // --- Nieudany odczyt / A failed read ---
    reportReadError(error) {
      console.warn(`[WriteStatus][${moduleName}] Nieudany odczyt / Failed read:`, error);
      currentMode = "local";
      renderMode();
      return show(WRITE_STATUS_SITUATIONS.READ_FAILED, { error });
    },

    // --- Praca bez bazy z powodu konfiguracji albo nieudanego startu / Running without the database due to configuration or a failed start ---
    reportLocalMode(cause = "no-config") {
      currentMode = "local";
      renderMode();
      return show(WRITE_STATUS_SITUATIONS.LOCAL_MODE, { cause });
    },

    // --- Ostrzeżenie o zastąpieniu zmian lokalnych danymi z bazy / Warning that local changes were replaced by database data ---
    //
    // PL: Wywoływane po udanym wczytaniu danych z bazy, gdy istnieje znacznik zmian lokalnych.
    //     To jest ten moment, w którym 20 września zniknął ulubiony potwór — od teraz nie znika
    //     po cichu. Scalanie danych celowo nie jest tu robione: oba moduły zapisują cały dokument
    //     naraz, więc scalanie nadpisałoby pracę z drugiego urządzenia (wariant W3 analizy).
    // EN: Called after data is successfully loaded from the database while a local-change marker
    //     exists. This is the moment when the favourite monster vanished on 20 September — from now
    //     on it does not vanish silently. Merging is deliberately not done here: both modules write
    //     the whole document at once, so merging would overwrite work done on the other device
    //     (variant W3 of the analysis).
    warnLocalOverwritten() {
      const pending = consumeLocalOnlyChange(scopeKey);
      if (!pending) return null;
      return show(WRITE_STATUS_SITUATIONS.LOCAL_OVERWRITTEN, {
        cause: "local-overwritten",
        extraHint: formatStamp(pending.at, currentLanguage)
      });
    },

    // --- Odnotowanie zmiany, która trafiła wyłącznie do pamięci tego urządzenia / Noting a change that reached this device's storage only ---
    //
    // PL: Wywoływane przy każdym zapisie lokalnym wykonanym mimo skonfigurowanej bazy — także
    //     wtedy, gdy moduł zszedł na pamięć lokalną wcześniej i zapis już nie próbuje bazy.
    //     Bez tego kolejne zmiany z czasu awarii nie zostawiałyby po sobie znacznika i zniknęłyby
    //     bez ostrzeżenia przy następnym otwarciu modułu.
    // EN: Called on every local write performed despite a configured database — including when the
    //     module fell back to local storage earlier and the write no longer even tries the database.
    //     Without it, further changes made during an outage would leave no marker and would vanish
    //     without a warning the next time the module is opened.
    noteLocalOnlyChange() {
      markLocalOnlyChange(scopeKey);
    },

    // --- Ręczne schowanie paska / Hiding the bar by hand ---
    clear: hide
  };
}
