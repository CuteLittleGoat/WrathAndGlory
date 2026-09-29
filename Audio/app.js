// ==========================================================================================
// Plik logiki modułu Audio / Audio module logic file
// ------------------------------------------------------------------------------------------
// PL: Jeden moduł ES obsługuje oba tryby: panel admina (?admin=1) i widok użytkownika.
//     Kolejność sekcji: stałe → tłumaczenia → narzędzia → stan → model ustawień → zapis →
//     bramka i sesja → odtwarzanie → manifesty → drzewo folderów → rysowanie panelu admina →
//     rysowanie widoku użytkownika → generator manifestów XLSX → obsługa zdarzeń → start.
// EN: One ES module serves both modes: the admin panel (?admin=1) and the user view.
//     Section order: constants → translations → helpers → state → settings model → saving →
//     gate and session → playback → manifests → folder tree → admin panel drawing →
//     user view drawing → XLSX manifest builder → event handling → start-up.
// ==========================================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { activateAppCheck } from "../shared/firebase-app-check.js";
// --- Wspólna obsługa komunikatów o nieudanym zapisie / Shared handling of failed-write messages ---
// PL: Ten sam moduł obsługuje GeneratorNPC, więc oba moduły mówią o awarii bazy jednym głosem.
// EN: The same module serves GeneratorNPC, so both modules speak about a database failure with one voice.
import { createFirebaseWriteStatus } from "../shared/firebase-write-status.js";

// ==========================================================================================
// --- Stałe / Constants ---
// ==========================================================================================

const ADMIN_MODE = new URLSearchParams(location.search).get("admin") === "1";

// Klucze pamięci przeglądarki i dokument bazy / Browser storage keys and the database document
const AUDIO_SETTINGS_STORAGE_KEY = "audio.settings";
// Najstarszy klucz ustawień — nowa wersja go nie czyta, tylko usuwa / The oldest settings key — the new version never reads it, it only removes it
const AUDIO_LEGACY_STORAGE_KEY = "audio.favorites";
const AUDIO_SETTINGS_COLLECTION = "audio";
const AUDIO_SETTINGS_DOC_ID = "favorites";
// Stan interfejsu admina tylko dla tej przeglądarki / Admin interface state for this browser only
const ADMIN_UI_STORAGE_KEY = "audio.admin.ui";
const ADMIN_FILTERS_STORAGE_KEY = "audio.admin.filters";

// --- Model ustawień / Settings model ---
// PL: Jedyny format, który zna ta wersja modułu. Dokument w innym formacie jest traktowany jak pusty.
// EN: The only format this module version knows. A document in any other format is treated as empty.
const SETTINGS_SCHEMA_VERSION = 2;
const MAIN_LIST_ID = "main";
const ALIAS_MAX_LENGTH = 80;
const LIST_NAME_MAX_LENGTH = 60;

// --- Interfejs / Interface ---
const CATALOG_PAGE_SIZE = 200;
const SELECT_ALL_CONFIRM_THRESHOLD = 50;
const SEARCH_DEBOUNCE_MS = 150;
const VOLUME_RESET_DOUBLE_CLICK_MS = 450;
// Ścieżka zastępcza dla dźwięków bez folderu / Fallback path for sounds without a folder
const NO_FOLDER_PATH = "__no_folder__";
// Szerokości podglądu (null = pełna szerokość) / Preview widths (null = full width)
const PREVIEW_DEVICE_WIDTHS = { desktop: null, tablet: 820, phone: 390 };
// Biblioteka przeciągania, ładowana na żądanie tylko w panelu admina / Drag library, loaded on demand in the admin panel only
const SORTABLE_URL = "https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js";

// --- Tagi z nazw folderów / Tags from folder names ---
// PL: Dopiski techniczne wycinane z nazw folderów przy budowaniu tagów. Lista jest potrzebna
//     wyłącznie generatorowi manifestów.
// EN: Technical suffixes stripped from folder names while building tags. The list is needed
//     by the manifest builder only.
const TAG_IGNORE_FRAGMENTS = [
  "SoundPad",
  "SoundPad Patreon Version",
  "_Siege_SoundPad",
  "Patreon"
];
const TAG_IGNORE_SEGMENTS = ["AudioRPG"];

// --- Konfiguracja bramki dostępowej / Access gateway configuration ---
// MIEJSCE ZMIANY ADRESU BRAMKI / GATEWAY ADDRESS CHANGE POINT
// Bramka to Cloudflare Worker, który wydaje manifest warstwy chronionej i podpisane,
// wygasające adresy plików. Kod bramki: Audio/worker/audio-gate.js
// The gateway is a Cloudflare Worker serving the protected manifest and signed,
// expiring file URLs. Gateway source: Audio/worker/audio-gate.js
const AUDIO_GATE_BASE = "https://audio-gate.tarczynski-pawel.workers.dev";
// Manifest warstwy publicznej leży w tym repozytorium — te pliki są jawne celowo
// The public tier manifest lives in this repository: those files are public on purpose
const PUBLIC_MANIFEST_URL = "AudioManifest.json";
// Nazwa manifestu warstwy chronionej, oczekiwana przez bramkę w repozytorium prywatnym
// Protected tier manifest name, expected by the gateway in the private repository
const PROTECTED_MANIFEST_FILENAME = "audio-manifest.json";
// Klucz sesji w localStorage / Session key in localStorage
const AUDIO_SESSION_STORAGE_KEY = "audio.session";
// Klucz pominięcia bramki w sessionStorage / Gate skip key in sessionStorage
const AUDIO_GATE_SKIPPED_KEY = "audio.gateSkipped";

// ==========================================================================================
// --- Tłumaczenia / Translations ---
// ==========================================================================================
// --- MIEJSCE ROZSZERZENIA JĘZYKÓW / LANGUAGE EXTENSION POINT ---
// PL: Dodając język, dopisz komplet kluczy. Teksty statyczne mają w HTML atrybut data-i18n
//     (albo data-i18n-placeholder / -title / -aria-label), a teksty dynamiczne biorą się z t().
// EN: When adding a language, add the full key set. Static texts carry a data-i18n attribute in
//     the HTML (or data-i18n-placeholder / -title / -aria-label), dynamic texts come from t().
const translations = {
  pl: {
    languageSelect: "Wersja językowa",
    adminTitle: "Audio — panel admina",
    adminSubtitle: "Przygotowanie list dźwięków, aliasów i widoku użytkownika.",
    unlockLibrary: "Odblokuj archiwum",
    toolsMenu: "Narzędzia",
    reloadManifest: "Wczytaj manifest ponownie",
    buildManifests: "Zbuduj manifesty z XLSX",
    exportSettings: "Eksportuj ustawienia (JSON)",
    reloadLocal: "Wczytaj ponownie z pamięci urządzenia",
    clearAllAliases: "Wyczyść aliasy we wszystkich listach",
    adminTabsLabel: "Sekcje panelu",
    tabCatalog: "Katalog",
    tabLists: "Listy",
    tabPreview: "Podgląd",
    foldersTitle: "Foldery",
    foldersExpand: "Rozwiń panel folderów",
    foldersCollapse: "Zwiń panel folderów",
    foldersClose: "Zamknij panel folderów",
    treeSearchLabel: "Szukaj folderu",
    treeSearchPlaceholder: "Wpisz fragment nazwy...",
    treeSelectAll: "Zaznacz wszystko",
    treeClearAll: "Odznacz wszystko",
    treeExpandAll: "Rozwiń wszystko",
    treeCollapseAll: "Zwiń wszystko",
    treeSelectMatches: "Zaznacz pasujące",
    treeClearMatches: "Odznacz pasujące",
    treeOnlyMatches: "Tylko pasujące",
    treeEmpty: "Brak folderów — manifest nie jest jeszcze wczytany.",
    treeNoMatches: "Żaden folder nie zawiera wpisanej frazy.",
    treeNoFolder: "(bez folderu)",
    treeOnly: "tylko",
    treeOnlyTitle: "Pokaż w katalogu tylko ten folder",
    treeExpandNode: "Rozwiń folder",
    treeCollapseNode: "Zwiń folder",
    treeCheckLabel: "Pokazuj w katalogu: {name}",
    treeSearchActive: "Filtr folderów jest aktywny: {text}",
    foldersFilterActive: "Katalog pokazuje dźwięki z {visible} z {total} folderów",
    catalogTitle: "Katalog dźwięków",
    targetList: "Lista docelowa",
    catalogSearchLabel: "Szukaj dźwięku",
    catalogSearchPlaceholder: "Nazwa, plik, folder albo alias...",
    catalogSearchActive: "Wyszukiwanie w katalogu jest aktywne: {text}",
    scopeLabel: "Pokaż",
    scopeAll: "wszystkie",
    scopeOutside: "spoza listy docelowej",
    scopeInside: "z listy docelowej",
    tierLabel: "Warstwa",
    tierAll: "wszystkie",
    tierPublic: "demo",
    tierProtected: "archiwum",
    selectAllResults: "Zaznacz wszystkie wyniki",
    confirmSelectAll: "Zaznaczyć wszystkie wyniki ({count} dźwięków)?",
    catalogSummary: "Wyniki: {shown} z {total}",
    catalogFolders: "Foldery: {visible} z {total}",
    catalogLoading: "Wczytywanie manifestu...",
    catalogEmptyManifest: "Manifest nie zawiera dźwięków.",
    catalogNoResults: "Brak wyników dla ustawionych filtrów.",
    catalogMore: "Pokaż kolejne {count}",
    tierChipPublic: "demo",
    tierChipProtected: "archiwum",
    membersNone: "Dźwięk nie jest na żadnej liście.",
    membersTitle: "Na listach: {lists}",
    aliasShort: "alias: {alias}",
    selectItem: "Zaznacz: {name}",
    addToTarget: "Dodaj do listy „{name}”",
    removeFromTarget: "Jest na liście „{name}” — kliknij, aby usunąć",
    confirmRemoveWithAlias: "Usunąć „{name}” z listy „{list}”? Alias „{alias}” zostanie usunięty razem z wpisem.",
    bulkCount: "Zaznaczone: {count}",
    bulkAdd: "Dodaj do „{name}”",
    bulkClear: "Odznacz",
    playTitle: "Odsłuchaj",
    stopTitle: "Zatrzymaj",
    listsTitle: "Listy",
    addList: "+ Nowa lista",
    listsStatus: "Listy: {count}",
    mainListDefault: "Widok główny",
    mainListBadge: "lista główna",
    untitledList: "Lista bez nazwy",
    newListName: "Nowa lista",
    copySuffix: "(kopia)",
    moveUp: "Przesuń w górę",
    moveDown: "Przesuń w dół",
    moveTop: "Przesuń na początek",
    moveBottom: "Przesuń na koniec",
    dragHandle: "Przeciągnij, aby zmienić kolejność",
    renameList: "Zmień nazwę listy",
    renameHint: "Enter — zapisz, Esc — anuluj",
    duplicateList: "Duplikuj listę",
    deleteList: "Usuń listę",
    confirmDeleteList: "Usunąć listę „{name}”? Dźwięków na liście: {count}, w tym z aliasem: {aliases}.",
    clearListAliases: "Wyczyść aliasy tej listy",
    confirmClearListAliases: "Wyczyścić wszystkie aliasy na liście „{name}”?",
    confirmClearAllAliases: "Wyczyścić aliasy na wszystkich listach?",
    editorCount: "Dźwięków na liście: {count}",
    editorSearchLabel: "Szukaj na liście",
    editorSearchPlaceholder: "Nazwa albo alias...",
    editorSearchActive: "Wyszukiwanie na liście jest aktywne: {text}",
    editorReorderLocked: "Przy aktywnym wyszukiwaniu kolejności nie można zmieniać — wyczyść pole, aby przesuwać dźwięki.",
    editorEmpty: "Lista jest pusta. Dodaj dźwięki z katalogu przyciskiem +.",
    editorNoMatches: "Na tej liście nic nie pasuje do wpisanej frazy.",
    aliasPlaceholder: "Alias na tej liście (opcjonalny)",
    aliasLabel: "Alias dźwięku {name} na tej liście",
    onOtherLists: "Na innych listach: {lists}",
    noAlias: "bez aliasu",
    removeEntry: "Usuń z listy",
    missingEntry: "(brak w manifeście)",
    previewTitle: "Podgląd widoku użytkownika",
    previewDevices: "Szerokość podglądu",
    deviceDesktop: "Komputer",
    deviceTablet: "Tablet",
    devicePhone: "Telefon",
    previewFollow: "podąża za edytowaną listą",
    previewOpen: "Otwórz prawdziwy widok",
    previewHide: "Zwiń podgląd",
    previewShow: "Rozwiń podgląd",
    noticeArchiveLocked: "Archiwum zablokowane — dźwięki z archiwum są widoczne na listach jako „(brak w manifeście)”. Nie zostaną usunięte.",
    noticeLegacy: "Zapisane listy są w starym formacie i zostały pominięte. Pierwsza zmiana zapisze ustawienia w nowym formacie.",
    noticeClose: "Zamknij komunikat",
    uvBrand: "Audio",
    uvTabsLabel: "Listy dźwięków",
    stopAll: "Zatrzymaj wszystko",
    uvEmptyList: "Na tej liście nie ma jeszcze dźwięków.",
    tileLoading: "wczytywanie…",
    tilePlayLabel: "Odtwórz: {name}",
    tileStopLabel: "Zatrzymaj: {name}",
    tileUnlockLabel: "Odblokuj archiwum, aby odtworzyć: {name}",
    volumeLabel: "Głośność: {name}",
    volumeResetTitle: "Kliknij dwa razy, aby przywrócić 100%",
    buttonLoop: "Loop",
    loopLabel: "Pętla: {name}",
    tabPlaying: "Na tej liście gra dźwięk",
    exportFileName: "audio-ustawienia",
    manifestLoading: "Manifest: wczytywanie...",
    manifestMissing: "Manifest: brak danych",
    manifestError: "Manifest: błąd wczytywania",
    manifestReady: "Manifest: {count} pozycji",
    manifestPublicError: "Manifest: błąd listy publicznej",
    firebaseWaiting: "Firebase: oczekiwanie",
    firebaseConnected: "Firebase: połączono",
    firebaseLocal: "Firebase: lokalne ustawienia",
    firebaseMissing: "Firebase: brak konfiguracji",
    manifestFetchError: "Nie udało się pobrać manifestu.",
    manifestNoData: "Manifest nie zawiera danych.",
    alertMissingAudio: "Brak linku do pliku audio w manifeście.",
    alertPlaybackFailed: "Nie udało się odtworzyć dźwięku. Bramka nie wydała pliku.",
    accessTitle: "Dostęp do danych z klauzulą tajności K.O.Z.A.",
    accessDescription: "Dane są zapieczętowane protokołami Ducha Maszyny. Wprowadź Litanię Dostępu, aby rozpocząć Rytuał Uwierzytelnienia.",
    accessPasswordLabel: "Litania Dostępu",
    accessUnlockButton: "Rozpocznij Rytuał",
    accessSkipButton: "Pomiń",
    accessWorking: "Trwa Rytuał Uwierzytelnienia...",
    accessEmpty: "Rozgniewany Duch Maszyny odpowiada: Litania Dostępu nie została wypowiedziana.",
    accessRejected: "Rozgniewany Duch Maszyny odpowiada: Litania Dostępu została odrzucona.",
    accessSilent: "Brak połączenia z bramką dostępu. Sprawdź internet oraz adres bramki w stałej AUDIO_GATE_BASE.",
    accessExpired: "Sesja wygasła. Podaj hasło ponownie.",
    accessManifestMissing: "Bramka nie znalazła manifestu archiwum (HTTP {status}). Sprawdź, czy plik audio-manifest.json leży w katalogu głównym prywatnego repozytorium AudioRPG.",
    accessLoginStatus: "Bramka dostępu odpowiedziała nieoczekiwanym kodem HTTP {status}. Bramka działa, ale odrzuciła żądanie logowania.",
    accessGateStatus: "Bramka dostępu odpowiedziała kodem HTTP {status} przy pobieraniu manifestu archiwum.",
    publicManifestMissing: "Nie udało się wczytać listy publicznej (HTTP {status}). Sprawdź, czy plik {file} leży w folderze Audio. Jeżeli plik tam jest, odśwież stronę z pominięciem pamięci podręcznej (Ctrl+F5).",
    accessMissingItem: "Ten dźwięk nie należy do warstwy publicznej. Odblokuj archiwum, aby go wczytać.",
    libraryDemoOnly: "Archiwum: zablokowane",
    libraryUnlocked: "Archiwum: odblokowane",
    libraryError: "Archiwum: błąd wczytywania",
    builderIdle: "Generator: gotowy",
    builderWorking: "Generator: przetwarzanie pliku",
    builderReady: "Generator: {publicCount} publicznych / {protectedCount} chronionych",
    builderError: "Generator: błąd",
    builderErrorLibrary: "Nie udało się wczytać biblioteki JSZip z sieci CDN. Sprawdź połączenie z internetem i spróbuj ponownie.",
    builderErrorRead: "Nie udało się odczytać pliku XLSX. Upewnij się, że wskazany plik jest poprawnym skoroszytem programu Excel.",
    builderErrorNoSheet: "Plik XLSX nie zawiera arkusza z danymi.",
    builderErrorMissingColumns: "Brak wymaganych kolumn: {columns}. Arkusz musi zawierać kolumny NazwaSampla, NazwaPliku oraz LinkDoFolderu.",
    builderErrorDuplicateColumns: "Kolumny występujące więcej niż raz: {columns}. Każda wymagana kolumna może wystąpić w arkuszu tylko jeden raz.",
    builderErrorNoRows: "Arkusz nie zawiera żadnego wiersza z danymi.",
    builderErrorNoPaths: "Wariantów warstwy chronionej bez ścieżki w repozytorium AudioRPG: {count}. Sprawdź kolumnę LinkDoFolderu.",
    builderDone: "Zbudowano manifesty. Pozycje publiczne: {publicCount}, pozycje chronione: {protectedCount}.\n\nPrzeglądarka zapisała dwa pliki w katalogu pobierania:\n• {publicFile} — skopiuj do folderu Audio w repozytorium WrathAndGlory,\n• {protectedFile} — skopiuj do katalogu głównego prywatnego repozytorium AudioRPG."
  },
  en: {
    languageSelect: "Language version",
    adminTitle: "Audio — admin panel",
    adminSubtitle: "Preparing sound lists, aliases and the user view.",
    unlockLibrary: "Unlock archive",
    toolsMenu: "Tools",
    reloadManifest: "Reload manifest",
    buildManifests: "Build manifests from XLSX",
    exportSettings: "Export settings (JSON)",
    reloadLocal: "Reload from this device's storage",
    clearAllAliases: "Clear aliases on all lists",
    adminTabsLabel: "Panel sections",
    tabCatalog: "Catalogue",
    tabLists: "Lists",
    tabPreview: "Preview",
    foldersTitle: "Folders",
    foldersExpand: "Expand the folder panel",
    foldersCollapse: "Collapse the folder panel",
    foldersClose: "Close the folder panel",
    treeSearchLabel: "Search folders",
    treeSearchPlaceholder: "Type part of a name...",
    treeSelectAll: "Select all",
    treeClearAll: "Clear all",
    treeExpandAll: "Expand all",
    treeCollapseAll: "Collapse all",
    treeSelectMatches: "Select matches",
    treeClearMatches: "Clear matches",
    treeOnlyMatches: "Matches only",
    treeEmpty: "No folders — the manifest has not loaded yet.",
    treeNoMatches: "No folder contains the typed phrase.",
    treeNoFolder: "(no folder)",
    treeOnly: "only",
    treeOnlyTitle: "Show only this folder in the catalogue",
    treeExpandNode: "Expand folder",
    treeCollapseNode: "Collapse folder",
    treeCheckLabel: "Show in catalogue: {name}",
    treeSearchActive: "The folder filter is active: {text}",
    foldersFilterActive: "The catalogue shows sounds from {visible} of {total} folders",
    catalogTitle: "Sound catalogue",
    targetList: "Target list",
    catalogSearchLabel: "Search sounds",
    catalogSearchPlaceholder: "Name, file, folder or alias...",
    catalogSearchActive: "The catalogue search is active: {text}",
    scopeLabel: "Show",
    scopeAll: "all",
    scopeOutside: "not on the target list",
    scopeInside: "on the target list",
    tierLabel: "Tier",
    tierAll: "all",
    tierPublic: "demo",
    tierProtected: "archive",
    selectAllResults: "Select all results",
    confirmSelectAll: "Select all results ({count} sounds)?",
    catalogSummary: "Results: {shown} of {total}",
    catalogFolders: "Folders: {visible} of {total}",
    catalogLoading: "Loading the manifest...",
    catalogEmptyManifest: "The manifest contains no sounds.",
    catalogNoResults: "No results for the current filters.",
    catalogMore: "Show {count} more",
    tierChipPublic: "demo",
    tierChipProtected: "archive",
    membersNone: "The sound is not on any list.",
    membersTitle: "On lists: {lists}",
    aliasShort: "alias: {alias}",
    selectItem: "Select: {name}",
    addToTarget: "Add to list \"{name}\"",
    removeFromTarget: "On list \"{name}\" — click to remove",
    confirmRemoveWithAlias: "Remove \"{name}\" from list \"{list}\"? The alias \"{alias}\" will be removed with the entry.",
    bulkCount: "Selected: {count}",
    bulkAdd: "Add to \"{name}\"",
    bulkClear: "Clear selection",
    playTitle: "Preview",
    stopTitle: "Stop",
    listsTitle: "Lists",
    addList: "+ New list",
    listsStatus: "Lists: {count}",
    mainListDefault: "Main view",
    mainListBadge: "main list",
    untitledList: "Untitled list",
    newListName: "New list",
    copySuffix: "(copy)",
    moveUp: "Move up",
    moveDown: "Move down",
    moveTop: "Move to top",
    moveBottom: "Move to bottom",
    dragHandle: "Drag to reorder",
    renameList: "Rename list",
    renameHint: "Enter — save, Esc — cancel",
    duplicateList: "Duplicate list",
    deleteList: "Delete list",
    confirmDeleteList: "Delete list \"{name}\"? Sounds on the list: {count}, with an alias: {aliases}.",
    clearListAliases: "Clear this list's aliases",
    confirmClearListAliases: "Clear all aliases on list \"{name}\"?",
    confirmClearAllAliases: "Clear aliases on all lists?",
    editorCount: "Sounds on the list: {count}",
    editorSearchLabel: "Search this list",
    editorSearchPlaceholder: "Name or alias...",
    editorSearchActive: "The list search is active: {text}",
    editorReorderLocked: "The order cannot change while searching — clear the field to move sounds.",
    editorEmpty: "The list is empty. Add sounds from the catalogue with the + button.",
    editorNoMatches: "Nothing on this list matches the typed phrase.",
    aliasPlaceholder: "Alias on this list (optional)",
    aliasLabel: "Alias of {name} on this list",
    onOtherLists: "On other lists: {lists}",
    noAlias: "no alias",
    removeEntry: "Remove from list",
    missingEntry: "(missing in manifest)",
    previewTitle: "User view preview",
    previewDevices: "Preview width",
    deviceDesktop: "Desktop",
    deviceTablet: "Tablet",
    devicePhone: "Phone",
    previewFollow: "follows the edited list",
    previewOpen: "Open the real view",
    previewHide: "Collapse preview",
    previewShow: "Expand preview",
    noticeArchiveLocked: "The archive is locked — archive sounds appear on lists as \"(missing in manifest)\". They will not be removed.",
    noticeLegacy: "The saved lists use the old format and were skipped. The first change will save the settings in the new format.",
    noticeClose: "Close notice",
    uvBrand: "Audio",
    uvTabsLabel: "Sound lists",
    stopAll: "Stop all",
    uvEmptyList: "There are no sounds on this list yet.",
    tileLoading: "loading…",
    tilePlayLabel: "Play: {name}",
    tileStopLabel: "Stop: {name}",
    tileUnlockLabel: "Unlock the archive to play: {name}",
    volumeLabel: "Volume: {name}",
    volumeResetTitle: "Click twice to restore 100%",
    buttonLoop: "Loop",
    loopLabel: "Loop: {name}",
    tabPlaying: "A sound is playing on this list",
    exportFileName: "audio-settings",
    manifestLoading: "Manifest: loading...",
    manifestMissing: "Manifest: no data",
    manifestError: "Manifest: failed to load",
    manifestReady: "Manifest: {count} items",
    manifestPublicError: "Manifest: public list error",
    firebaseWaiting: "Firebase: waiting",
    firebaseConnected: "Firebase: connected",
    firebaseLocal: "Firebase: local settings",
    firebaseMissing: "Firebase: missing configuration",
    manifestFetchError: "Failed to fetch the manifest.",
    manifestNoData: "The manifest contains no data.",
    alertMissingAudio: "Missing audio file link in the manifest.",
    alertPlaybackFailed: "Could not play the sound. The gateway did not return the file.",
    accessTitle: "Access to data classified under the K.O.Z.A. seal",
    accessDescription: "The data is sealed by Machine Spirit protocols. Recite the Litany of Access to begin the Rite of Authentication.",
    accessPasswordLabel: "Litany of Access",
    accessUnlockButton: "Begin the Rite",
    accessSkipButton: "Skip",
    accessWorking: "The Rite of Authentication is under way...",
    accessEmpty: "The angered Machine Spirit replies: the Litany of Access has not been recited.",
    accessRejected: "The angered Machine Spirit replies: the Litany of Access was rejected.",
    accessSilent: "Cannot reach the access gateway. Check your connection and the gateway address in the AUDIO_GATE_BASE constant.",
    accessExpired: "Session expired. Enter the password again.",
    accessManifestMissing: "The gateway could not find the archive manifest (HTTP {status}). Check that audio-manifest.json sits in the root of the private AudioRPG repository.",
    accessLoginStatus: "The access gateway answered with an unexpected HTTP {status}. The gateway is running but rejected the login request.",
    accessGateStatus: "The access gateway answered with HTTP {status} while fetching the archive manifest.",
    publicManifestMissing: "Could not load the public list (HTTP {status}). Check that {file} sits in the Audio folder. If it does, reload the page bypassing the cache (Ctrl+F5).",
    accessMissingItem: "This sound is not part of the public tier. Unlock the archive to load it.",
    libraryDemoOnly: "Archive: locked",
    libraryUnlocked: "Archive: unlocked",
    libraryError: "Archive: load error",
    builderIdle: "Builder: ready",
    builderWorking: "Builder: processing file",
    builderReady: "Builder: {publicCount} public / {protectedCount} protected",
    builderError: "Builder: error",
    builderErrorLibrary: "Could not load the JSZip library from the CDN. Check your internet connection and try again.",
    builderErrorRead: "Could not read the XLSX file. Make sure the selected file is a valid Excel workbook.",
    builderErrorNoSheet: "The XLSX file contains no data sheet.",
    builderErrorMissingColumns: "Missing required columns: {columns}. The sheet must contain NazwaSampla, NazwaPliku and LinkDoFolderu.",
    builderErrorDuplicateColumns: "Columns present more than once: {columns}. Each required column may appear in the sheet only once.",
    builderErrorNoRows: "The sheet contains no data rows.",
    builderErrorNoPaths: "Protected tier variants without a path in the AudioRPG repository: {count}. Check the LinkDoFolderu column.",
    builderDone: "Manifests built. Public items: {publicCount}, protected items: {protectedCount}.\n\nThe browser saved two files in your downloads folder:\n• {publicFile} — copy it into the Audio folder of the WrathAndGlory repository,\n• {protectedFile} — copy it into the root of the private AudioRPG repository."
  }
};

let currentLanguage = "pl";

// --- Wstawienie zmiennych do szablonu tekstu / Filling variables into a text template ---
const formatText = (template, vars = {}) =>
  String(template).replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : ""));

// --- Tekst w bieżącym języku; brakujący klucz spada na polski / Text in the current language; a missing key falls back to Polish ---
const t = (key, vars) => {
  const dictionary = translations[currentLanguage] || translations.pl;
  const template = dictionary[key] ?? translations.pl[key] ?? key;
  return vars ? formatText(template, vars) : template;
};

// ==========================================================================================
// --- Narzędzia / Helpers ---
// ==========================================================================================

// --- Zamiana znaków specjalnych przed wstawieniem do HTML / Escaping special characters before inserting into HTML ---
// PL: Każdy tekst z danych (nazwa, alias, nazwa listy, plik, folder) przechodzi tędy. Dokument
//     ustawień jest zapisywalny dla każdego, więc bez tego alias mógłby wstrzyknąć skrypt.
// EN: Every text coming from data (name, alias, list name, file, folder) goes through here. The
//     settings document is writable by anyone, so without this an alias could inject a script.
const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// --- Składanie tekstu do porównań filtra / Folding text for filter comparisons ---
// PL: Ta sama reguła co foldPolish() w DataVault/app.js: małe litery, bez znaków diakrytycznych
//     (NFD + usunięcie U+0300–U+036F) i „ł” → „l”, bo „ł” nie rozkłada się w Unicode. Dzięki temu
//     „MELTA”, „melta” i „mElTa” dają ten sam wynik. Reguła jest pisana dla języka polskiego.
// EN: The same rule as foldPolish() in DataVault/app.js: lower case, no diacritics (NFD + stripping
//     U+0300–U+036F) and "ł" → "l", because "ł" does not decompose in Unicode. Thanks to this
//     "MELTA", "melta" and "mElTa" give the same result. The rule is written for Polish.
const foldPolish = (text) =>
  String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ł/g, "l");

// PL: Fraza w postaci porównywanej. Filtrowanie i niebieski sygnał czytają tę samą wartość,
//     więc sama spacja niczego nie zapala i niczego nie zawęża.
// EN: The phrase in its compared form. Filtering and the blue signal read the same value, so a
//     lone space neither lights anything up nor narrows anything.
const toNeedle = (text) => foldPolish(text).trim();

// --- Wyróżnienie pasującego fragmentu / Highlighting the matching fragment ---
// PL: Składa tekst znak po znaku i pamięta, z którego znaku oryginału powstał każdy znak złożony,
//     żeby wyróżnić właściwy fragment także przy polskich znakach.
// EN: Folds the text character by character and remembers which original character produced each
//     folded one, so the right fragment is highlighted even with Polish diacritics.
const highlightMatch = (text, needle) => {
  const source = String(text ?? "");
  if (!needle) {
    return escapeHtml(source);
  }
  let folded = "";
  const origin = [];
  for (let index = 0; index < source.length; index += 1) {
    const piece = foldPolish(source[index]);
    for (let offset = 0; offset < piece.length; offset += 1) {
      folded += piece[offset];
      origin.push(index);
    }
  }
  const at = folded.indexOf(needle);
  if (at < 0) {
    return escapeHtml(source);
  }
  const start = origin[at];
  const end = origin[at + needle.length - 1] + 1;
  return `${escapeHtml(source.slice(0, start))}<mark>${escapeHtml(source.slice(start, end))}</mark>${escapeHtml(source.slice(end))}`;
};

// --- Opóźnienie reakcji na wpisywanie / Delaying the reaction to typing ---
const debounce = (fn, wait) => {
  let timer = null;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), wait);
  };
};

// --- Bezpieczny dostęp do pamięci przeglądarki / Safe access to browser storage ---
// PL: Pamięć może być niedostępna (okno prywatne, zablokowane dane witryny) — wtedy moduł
//     działa dalej, tylko bez zapamiętywania.
// EN: Storage may be unavailable (private window, blocked site data) — the module then keeps
//     working, just without remembering anything.
const getStorage = (kind) => {
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch (error) {
    return null;
  }
};

const readStoredJson = (kind, key) => {
  try {
    const raw = getStorage(kind)?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

const writeStoredJson = (kind, key, value) => {
  try {
    getStorage(kind)?.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Brak pamięci nie może blokować pracy / Missing storage must not block work
  }
};

// --- Przycięcie tekstu do długości / Trimming text to a length ---
const clampText = (value, max) => String(value ?? "").trim().slice(0, max);

// --- Nazwa i alias w jednym napisie: „Nazwa (alias) (N)” / Name and alias in one label: "Name (alias) (N)" ---
const buildTitleText = (label, alias, groupCount) =>
  `${label}${alias ? ` (${alias})` : ""}${groupCount > 1 ? ` (${groupCount})` : ""}`;

const buildTitleHtml = (label, alias, groupCount) =>
  `${escapeHtml(label)}${alias ? ` <span class="sample-alias">(${escapeHtml(alias)})</span>` : ""}${
    groupCount > 1 ? ` <span class="group-count">(${groupCount})</span>` : ""
  }`;

// --- Czy zdarzenie klawiatury pochodzi z pola do pisania / Whether a keyboard event comes from a typing field ---
const isTypingTarget = (target) =>
  Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));

// ==========================================================================================
// --- Odwołania do elementów strony / Page element references ---
// ==========================================================================================

const $ = (id) => document.getElementById(id);
const dom = {
  languageSelect: $("languageSelect"),
  manifestStatus: $("manifestStatus"),
  firebaseStatus: $("firebaseStatus"),
  listsStatus: $("listsStatus"),
  libraryStatus: $("libraryStatus"),
  builderStatus: $("builderStatus"),
  unlockLibrary: $("unlockLibrary"),
  toolsMenuButton: $("toolsMenuButton"),
  toolsMenuList: $("toolsMenuList"),
  reloadManifest: $("reloadManifest"),
  buildManifests: $("buildManifests"),
  exportSettings: $("exportSettings"),
  reloadLocal: $("reloadLocal"),
  clearAllAliases: $("clearAllAliases"),
  adminNotices: $("adminNotices"),
  adminTabs: $("adminTabs"),
  workbench: $("workbench"),
  foldersPanel: $("foldersPanel"),
  foldersExpand: $("foldersExpand"),
  foldersCollapse: $("foldersCollapse"),
  foldersClose: $("foldersClose"),
  foldersTitle: $("foldersTitle"),
  foldersTitleDot: $("foldersTitleDot"),
  foldersRailDot: $("foldersRailDot"),
  drawerBackdrop: $("drawerBackdrop"),
  treeSearch: $("treeSearch"),
  treeSearchLabel: $("treeSearchLabel"),
  treeSelectAll: $("treeSelectAll"),
  treeClearAll: $("treeClearAll"),
  treeExpandAll: $("treeExpandAll"),
  treeCollapseAll: $("treeCollapseAll"),
  treeMatchActions: $("treeMatchActions"),
  treeSelectMatches: $("treeSelectMatches"),
  treeClearMatches: $("treeClearMatches"),
  treeOnlyMatches: $("treeOnlyMatches"),
  folderTree: $("folderTree"),
  openFolders: $("openFolders"),
  openFoldersDot: $("openFoldersDot"),
  targetList: $("targetList"),
  catalogSearch: $("catalogSearch"),
  catalogSearchLabel: $("catalogSearchLabel"),
  catalogScope: $("catalogScope"),
  catalogTier: $("catalogTier"),
  selectAllResults: $("selectAllResults"),
  catalogSummary: $("catalogSummary"),
  catalogList: $("catalogList"),
  catalogMore: $("catalogMore"),
  bulkBar: $("bulkBar"),
  bulkCount: $("bulkCount"),
  bulkAdd: $("bulkAdd"),
  bulkClear: $("bulkClear"),
  addList: $("addList"),
  listsList: $("listsList"),
  editorHead: $("editorHead"),
  editorSearch: $("editorSearch"),
  editorSearchLabel: $("editorSearchLabel"),
  editorHint: $("editorHint"),
  editorEntries: $("editorEntries"),
  previewDevices: $("previewDevices"),
  previewFollow: $("previewFollow"),
  previewOpen: $("previewOpen"),
  previewToggle: $("previewToggle"),
  previewFrame: $("previewFrame"),
  previewView: $("previewView"),
  userView: $("userView"),
  aliasSuggestions: $("aliasSuggestions"),
  accessGate: $("accessGate"),
  accessPassword: $("accessPassword"),
  accessError: $("accessError"),
  accessForm: $("accessForm"),
  accessSubmit: $("accessSubmit"),
  accessSkip: $("accessSkip")
};

// ==========================================================================================
// --- Stan modułu / Module state ---
// ==========================================================================================

// --- Pusta lista główna i puste ustawienia / An empty main list and empty settings ---
const createMainList = () => ({ id: MAIN_LIST_ID, kind: "main", name: "", entries: [] });
const createEmptySettings = () => ({ playlists: [createMainList()] });

const state = {
  // Dźwięki z obu manifestów / Sounds from both manifests
  items: [],
  itemsById: new Map(),
  manifestReady: false,
  // Czy próba wczytania manifestów już się odbyła / Whether a manifest load attempt has happened
  manifestAttempted: false,
  // Ustawienia: listy z wpisami i aliasami / Settings: lists with entries and aliases
  settings: createEmptySettings(),
  // Indeks przynależności dźwięku do list / Index of which lists a sound is on
  membership: new Map(),
  // Czy odczytane dane były w starym formacie / Whether the read data used the old format
  legacyDetected: false,
  legacyNoticeDismissed: false,
  archiveNoticeDismissed: false,
  // Firebase
  firestore: null,
  favoritesDoc: null,
  usingFirestore: false,
  firebaseConfigMissing: false,
  firebaseStarted: false,
  // Token sesji bramki / Gateway session token
  session: null,
  // Czy warstwa chroniona została wczytana / Whether the protected tier is loaded
  libraryUnlocked: false,
  // Powód, dla którego archiwum się nie wczytało / Why the archive failed to load
  libraryError: null,
  // Powód, dla którego nie wczytała się warstwa publiczna / Why the public tier failed to load
  publicError: null,
  // Stan generatora manifestów w panelu admina / Manifest builder state in the admin panel
  builder: { status: "idle", publicCount: 0, protectedCount: 0, message: "" },
  // --- Panel admina / Admin panel ---
  editedListId: MAIN_LIST_ID,
  // Lista edytowana zapamiętana z poprzedniej wizyty — czeka, aż dane z bazy ją przyniosą
  // The edited list remembered from the previous visit — waits until database data brings it
  restoredEditedListId: null,
  renamingListId: null,
  folderTree: { roots: [], index: new Map() },
  excludedPaths: new Set(),
  expandedPaths: null,
  treeSearch: "",
  catalogSearch: "",
  catalogScope: "all",
  catalogTier: "all",
  catalogLimit: CATALOG_PAGE_SIZE,
  catalogResults: [],
  selectedItemIds: new Set(),
  lastSelectedIndex: -1,
  expandedMembers: new Set(),
  editorSearch: "",
  foldersCollapsed: false,
  foldersOpen: false,
  adminTab: "catalog",
  previewDevice: "desktop",
  previewFollow: true,
  previewCollapsed: false,
  previewListId: MAIN_LIST_ID,
  toolsMenuOpen: false,
  // --- Widok użytkownika / User view ---
  userListId: MAIN_LIST_ID
};

// --- Pasek i znacznik trybu pracy z danymi / The data working-mode bar and badge ---
// PL: Obiekt powstaje raz, zaraz po wczytaniu skryptu, żeby był gotowy zanim pierwszy zapis
//     albo odczyt zdąży się nie powieść. `scopeKey` wskazuje klucz pamięci lokalnej modułu —
//     po nim wspólny moduł rozpoznaje, że na tym urządzeniu leżą zmiany, których baza nie zna.
// EN: The object is created once, right after the script loads, so it is ready before the first
//     write or read can fail. `scopeKey` points at the module's local storage key — the shared
//     module uses it to recognise that this device holds changes the database never received.
const writeStatus = createFirebaseWriteStatus({
  mount: document.body,
  modeMount: $("writeStatusMode"),
  language: currentLanguage,
  scopeKey: AUDIO_SETTINGS_STORAGE_KEY,
  moduleName: "Audio"
});

// ==========================================================================================
// --- Model ustawień: listy, wpisy, aliasy / Settings model: lists, entries, aliases ---
// ==========================================================================================

// --- Rozpoznanie danych w starym formacie / Recognising data in the old format ---
// PL: Stary format miał pola favorites, mainView, aliases (albo same lists w dokumencie).
//     Nie jest przenoszony — służy tylko do pokazania informacji w panelu admina.
// EN: The old format had favorites, mainView, aliases fields (or bare lists in the document).
//     It is not carried over — it only drives a notice in the admin panel.
const isLegacySettings = (raw) =>
  Boolean(raw && typeof raw === "object" && (raw.favorites || raw.mainView || raw.aliases || Array.isArray(raw.lists)));

// --- Normalizacja wpisów listy / Normalising list entries ---
// PL: Usuwa wpisy bez identyfikatora i duplikaty (zostaje pierwszy), przycina aliasy.
//     Wpisów spoza bieżącego manifestu NIE usuwa — przy zablokowanym archiwum wszystkie
//     dźwięki chronione są „nieobecne”, a ich wpisy i aliasy muszą przetrwać.
// EN: Drops entries without an id and duplicates (the first one stays), trims aliases.
//     It does NOT drop entries missing from the current manifest — with the archive locked all
//     protected sounds are "missing", and their entries and aliases must survive.
const normalizeEntries = (entries) => {
  const seen = new Set();
  const result = [];
  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    const itemId = String(entry?.itemId ?? "").trim();
    if (!itemId || seen.has(itemId)) {
      return;
    }
    seen.add(itemId);
    result.push({ itemId, alias: clampText(entry?.alias, ALIAS_MAX_LENGTH) });
  });
  return result;
};

// --- Normalizacja całych ustawień / Normalising the whole settings object ---
// PL: Pilnuje reguł modelu: dokładnie jedna lista główna na pozycji 0, unikalne identyfikatory
//     list, poprawne wpisy. Dokument w innym formacie niż wersja 2 daje puste ustawienia.
// EN: Enforces the model rules: exactly one main list at position 0, unique list ids, valid
//     entries. A document in any format other than version 2 yields empty settings.
const normalizeSettingsV2 = (raw) => {
  if (!raw || raw.schemaVersion !== SETTINGS_SCHEMA_VERSION || !Array.isArray(raw.playlists)) {
    return { settings: createEmptySettings(), legacy: isLegacySettings(raw) };
  }
  let main = null;
  const lists = [];
  const usedIds = new Set([MAIN_LIST_ID]);
  raw.playlists.forEach((list, index) => {
    if (!list || typeof list !== "object") {
      return;
    }
    const isMain = list.kind === "main" || list.id === MAIN_LIST_ID;
    if (isMain) {
      if (!main) {
        main = {
          id: MAIN_LIST_ID,
          kind: "main",
          name: clampText(list.name, LIST_NAME_MAX_LENGTH),
          entries: normalizeEntries(list.entries)
        };
      }
      return;
    }
    let id = String(list.id ?? "").trim() || `list-${index + 1}`;
    while (usedIds.has(id)) {
      id = `${id}-${index + 1}`;
    }
    usedIds.add(id);
    lists.push({
      id,
      kind: "list",
      name: clampText(list.name, LIST_NAME_MAX_LENGTH),
      entries: normalizeEntries(list.entries)
    });
  });
  return { settings: { playlists: [main || createMainList(), ...lists] }, legacy: false };
};

// --- Postać ustawień do zapisu / Settings in their saved form ---
const serializeSettings = () => ({
  schemaVersion: SETTINGS_SCHEMA_VERSION,
  playlists: state.settings.playlists.map((list) => ({
    id: list.id,
    kind: list.kind,
    name: list.name,
    entries: list.entries.map((entry) => ({ itemId: entry.itemId, alias: entry.alias }))
  }))
});

// --- Dostęp do list / Access to lists ---
const getLists = () => state.settings.playlists;
const getList = (listId) => state.settings.playlists.find((list) => list.id === listId) || null;
const getMainList = () => state.settings.playlists[0];
const getEditedList = () => getList(state.editedListId) || getMainList();

// PL: Pusta nazwa listy głównej oznacza nazwę domyślną w bieżącym języku; nazwy pozostałych
//     list są danymi użytkownika i nie są tłumaczone.
// EN: An empty main list name means the default name in the current language; the other list
//     names are user data and are not translated.
const getListName = (list) => {
  if (!list) {
    return "";
  }
  if (list.kind === "main") {
    return list.name || t("mainListDefault");
  }
  return list.name || t("untitledList");
};

// --- Indeks przynależności: dźwięk → listy i aliasy / Membership index: sound → lists and aliases ---
const buildMembershipIndex = () => {
  const index = new Map();
  state.settings.playlists.forEach((list) => {
    list.entries.forEach((entry) => {
      if (!index.has(entry.itemId)) {
        index.set(entry.itemId, []);
      }
      index.get(entry.itemId).push({ listId: list.id, alias: entry.alias });
    });
  });
  return index;
};

// --- Nowa lista na końcu / A new list at the end ---
const createList = () => {
  const id = crypto.randomUUID();
  state.settings.playlists.push({
    id,
    kind: "list",
    name: clampText(t("newListName"), LIST_NAME_MAX_LENGTH),
    entries: []
  });
  return id;
};

// --- Kopia listy z wpisami i aliasami, wstawiona zaraz po oryginale / A copy of a list with entries and aliases, inserted right after the original ---
const duplicateList = (listId) => {
  const index = state.settings.playlists.findIndex((list) => list.id === listId);
  if (index < 0) {
    return null;
  }
  const source = state.settings.playlists[index];
  const id = crypto.randomUUID();
  const copy = {
    id,
    kind: "list",
    name: clampText(`${getListName(source)} ${t("copySuffix")}`, LIST_NAME_MAX_LENGTH),
    entries: source.entries.map((entry) => ({ itemId: entry.itemId, alias: entry.alias }))
  };
  state.settings.playlists.splice(Math.max(1, index + 1), 0, copy);
  return id;
};

// --- Przesunięcie listy na pozycję; lista główna zawsze zostaje pierwsza / Moving a list to a position; the main list always stays first ---
const moveListTo = (listId, targetIndex) => {
  const lists = state.settings.playlists;
  const from = lists.findIndex((list) => list.id === listId);
  if (from <= 0) {
    return false;
  }
  const to = Math.max(1, Math.min(lists.length - 1, targetIndex));
  if (to === from) {
    return false;
  }
  const [moved] = lists.splice(from, 1);
  lists.splice(to, 0, moved);
  return true;
};

// --- Dodanie dźwięków na koniec listy (bez duplikatów) / Adding sounds to the end of a list (no duplicates) ---
const addEntries = (listId, itemIds) => {
  const list = getList(listId);
  if (!list) {
    return 0;
  }
  const present = new Set(list.entries.map((entry) => entry.itemId));
  let added = 0;
  itemIds.forEach((itemId) => {
    if (!itemId || present.has(itemId)) {
      return;
    }
    present.add(itemId);
    list.entries.push({ itemId, alias: "" });
    added += 1;
  });
  return added;
};

// --- Usunięcie wpisu razem z jego aliasem / Removing an entry together with its alias ---
const removeEntry = (listId, itemId) => {
  const list = getList(listId);
  if (!list) {
    return false;
  }
  const before = list.entries.length;
  list.entries = list.entries.filter((entry) => entry.itemId !== itemId);
  return list.entries.length !== before;
};

// --- Przesunięcie wpisu; alias wędruje razem z nim / Moving an entry; the alias travels with it ---
const moveEntry = (listId, fromIndex, toIndex) => {
  const list = getList(listId);
  if (!list) {
    return false;
  }
  const last = list.entries.length - 1;
  const to = Math.max(0, Math.min(last, toIndex));
  if (fromIndex < 0 || fromIndex > last || to === fromIndex) {
    return false;
  }
  const [moved] = list.entries.splice(fromIndex, 1);
  list.entries.splice(to, 0, moved);
  return true;
};

// --- Alias wpisu na danej liście / An entry's alias on a given list ---
const setEntryAlias = (listId, itemId, alias) => {
  const entry = getList(listId)?.entries.find((candidate) => candidate.itemId === itemId);
  if (!entry) {
    return false;
  }
  const next = clampText(alias, ALIAS_MAX_LENGTH);
  if (next === entry.alias) {
    return false;
  }
  entry.alias = next;
  return true;
};

// --- Porządki po każdej zmianie ustawień / Housekeeping after every settings change ---
// PL: Odświeża indeks przynależności, pilnuje, żeby wybrane listy nadal istniały, i zatrzymuje
//     dźwięki, których kafelki zniknęły razem z wpisem albo listą.
// EN: Refreshes the membership index, makes sure the selected lists still exist, and stops sounds
//     whose tiles disappeared together with their entry or list.
const onSettingsChanged = () => {
  state.membership = buildMembershipIndex();
  if (state.restoredEditedListId && getList(state.restoredEditedListId)) {
    state.editedListId = state.restoredEditedListId;
    state.restoredEditedListId = null;
  }
  if (!getList(state.editedListId)) {
    state.editedListId = MAIN_LIST_ID;
  }
  if (!getList(state.previewListId)) {
    state.previewListId = MAIN_LIST_ID;
  }
  if (!getList(state.userListId)) {
    state.userListId = MAIN_LIST_ID;
  }
  if (state.renamingListId && !getList(state.renamingListId)) {
    state.renamingListId = null;
  }
  pruneOrphanPlayers();
};

// --- Podmiana ustawień w module / Replacing the settings in the module ---
const applySettings = (settings, legacy) => {
  state.settings = settings;
  state.legacyDetected = Boolean(legacy);
  onSettingsChanged();
};

// ==========================================================================================
// --- Zapis i odczyt ustawień / Saving and loading settings ---
// ==========================================================================================

// --- Zapis ustawień do pamięci tej przeglądarki / Saving settings to this browser's storage ---
// PL: Ta sama ścieżka służy dwóm sytuacjom: pracy bez bazy oraz ratowaniu danych po odmowie
//     zapisu do bazy. Zwracana wartość mówi prawdę o wyniku — wspólny pasek rozstrzyga na jej
//     podstawie między „zapisano tylko tutaj” a „nie zapisano nic”.
// EN: The same path serves two situations: running without the database, and rescuing data after
//     the database refused the write. The return value states the truth about the outcome — the
//     shared bar uses it to choose between "saved here only" and "nothing was saved".
const saveSettingsLocal = () => {
  try {
    const storage = getStorage("local");
    if (!storage) {
      return false;
    }
    storage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(serializeSettings()));
    return true;
  } catch (error) {
    console.error("[Audio] Nie udało się zapisać ustawień lokalnie / Could not save settings locally:", error);
    return false;
  }
};

// --- Udany zapis kończy informację o starym formacie / A successful save ends the old-format notice ---
const markSettingsSaved = () => {
  if (state.legacyDetected) {
    state.legacyDetected = false;
    renderNotices();
  }
};

// --- Zapis ustawień: najpierw baza, a gdy odmówi — pamięć tego urządzenia / Saving settings: the database first, and this device's storage when it refuses ---
// PL: Funkcja NIE odrzuca obietnicy. Każdy błąd jest obsłużony tutaj: moduł schodzi na pamięć
//     lokalną (state.usingFirestore = false), pokazuje pasek i zwraca wynik.
// EN: The function does NOT reject. Every error is handled here: the module falls back to local
//     storage (state.usingFirestore = false), shows the bar and returns the outcome.
const saveSettings = async () => {
  const payload = { ...serializeSettings(), updatedAt: serverTimestamp() };
  if (state.usingFirestore && state.favoritesDoc) {
    try {
      await setDoc(state.favoritesDoc, payload);
      writeStatus.reportSaveSuccess();
      markSettingsSaved();
      return { ok: true, target: "firestore" };
    } catch (error) {
      state.usingFirestore = false;
      const savedLocally = saveSettingsLocal();
      writeStatus.reportSaveError(error, { savedLocally });
      renderStatus();
      return { ok: false, target: savedLocally ? "local" : "none", error };
    }
  }
  const savedLocally = saveSettingsLocal();
  if (!savedLocally) {
    writeStatus.reportSaveError(null, { savedLocally: false });
  } else {
    markSettingsSaved();
    if (state.favoritesDoc) {
      // PL: Baza jest skonfigurowana, a mimo to zapis poszedł tylko tutaj — znacznik przeżyje
      //     zamknięcie karty i pozwoli ostrzec użytkownika, zanim dane z bazy zastąpią te zmiany.
      // EN: The database is configured, yet the write went here only — the marker survives closing
      //     the tab and makes it possible to warn the user before database data replaces the changes.
      writeStatus.noteLocalOnlyChange();
    }
  }
  return { ok: savedLocally, target: savedLocally ? "local" : "none" };
};

// --- Zapis wraz z odświeżeniem widoku / Saving together with a view refresh ---
// PL: Widok rysuje się PRZED zapisem, bo stan modułu jest już zmieniony. Przy braku sieci obietnica
//     z setDoc może się w ogóle nie rozstrzygnąć, a interfejs i tak musi pokazać aktualny stan.
// EN: The view is drawn BEFORE saving, because the module state has already changed. With no
//     network the setDoc promise may never settle, yet the interface must show the current state.
const persistAndRender = async () => {
  onSettingsChanged();
  renderAll();
  try {
    return await saveSettings();
  } catch (error) {
    console.error("[Audio] Nieoczekiwany błąd zapisu ustawień / Unexpected settings save error:", error);
    return { ok: false, target: "none", error };
  }
};

// --- Odczyt ustawień z pamięci tej przeglądarki / Loading settings from this browser's storage ---
// PL: Najstarszy klucz audio.favorites jest tylko usuwany; dane w innym formacie niż wersja 2
//     są pomijane (czysty start).
// EN: The oldest audio.favorites key is only removed; data in any format other than version 2 is
//     skipped (clean start).
const loadSettingsLocal = () => {
  try {
    getStorage("local")?.removeItem(AUDIO_LEGACY_STORAGE_KEY);
  } catch (error) {
    // Brak pamięci nie może blokować startu / Missing storage must not block start-up
  }
  const parsed = readStoredJson("local", AUDIO_SETTINGS_STORAGE_KEY);
  const { settings, legacy } = normalizeSettingsV2(parsed);
  applySettings(settings, legacy);
};

// --- Uruchomienie Firebase i nasłuchu ustawień / Starting Firebase and the settings listener ---
const initFirebase = () => {
  // --- WAŻNE: Brak poprawnej konfiguracji oznacza pracę lokalną; dla niezależnych grup konieczne jest użycie osobnego firebase-config.js. / IMPORTANT: Missing config means local mode; independent groups must use their own firebase-config.js. ---
  if (!window.firebaseConfig || !window.firebaseConfig.apiKey) {
    state.firebaseConfigMissing = true;
    state.firebaseStarted = true;
    // PL: Brak konfiguracji to ustawienie tej kopii modułu, nie awaria.
    // EN: A missing configuration is a setting of this module copy, not a failure.
    writeStatus.reportLocalMode("no-config");
    loadSettingsLocal();
    renderAll();
    return;
  }
  // PL: Awaria Firebase nie może zatrzymać całego modułu — manifesty i tak mają się wczytać.
  // EN: A Firebase failure must not stop the whole module — the manifests must load anyway.
  let db;
  try {
    const app = initializeApp(window.firebaseConfig);
    // --- App Check przed pierwszym użyciem Firestore / App Check before Firestore is first used ---
    // PL: Wywołanie nie jest krytyczne: gdy reCAPTCHA się nie załaduje, moduł pracuje dalej.
    // EN: The call is not critical: when reCAPTCHA fails to load the module keeps working.
    activateAppCheck(app);
    db = getFirestore(app);
  } catch (error) {
    console.error(error);
    state.usingFirestore = false;
    state.firebaseStarted = true;
    writeStatus.reportLocalMode("init-failed");
    loadSettingsLocal();
    renderAll();
    return;
  }
  state.firestore = db;
  state.favoritesDoc = doc(db, AUDIO_SETTINGS_COLLECTION, AUDIO_SETTINGS_DOC_ID);
  state.usingFirestore = true;
  state.firebaseStarted = true;

  try {
    onSnapshot(
      state.favoritesDoc,
      (snapshot) => {
        if (!snapshot.exists()) {
          // PL: Brak dokumentu — powstaje dokument domyślny w nowym formacie.
          // EN: No document — a default document in the new format is created.
          applySettings(createEmptySettings(), false);
          persistAndRender();
          return;
        }
        const { settings, legacy } = normalizeSettingsV2(snapshot.data());
        applySettings(settings, legacy);
        // PL: Dane z bazy właśnie zastąpiły stan modułu. Jeżeli na tym urządzeniu leżą zmiany
        //     zapisane w czasie awarii, to jest moment, w którym trzeba o tym powiedzieć.
        // EN: Database data has just replaced the module state. If this device holds changes saved
        //     during an outage, this is the moment to say so out loud.
        writeStatus.warnLocalOverwritten();
        renderAll();
      },
      // --- Trzeci argument: obsługa błędu nasłuchu / The third argument: the listener error handler ---
      (error) => {
        console.error(error);
        state.usingFirestore = false;
        writeStatus.reportReadError(error);
        loadSettingsLocal();
        renderAll();
      }
    );
  } catch (error) {
    // Nasłuch Firestore nie wystartował — pracujemy na ustawieniach lokalnych
    // The Firestore listener did not start: fall back to local settings
    console.error(error);
    state.usingFirestore = false;
    writeStatus.reportReadError(error);
    loadSettingsLocal();
    renderAll();
  }
};

// ==========================================================================================
// --- Bramka dostępu i sesja / Access gate and session ---
// ==========================================================================================

// --- Ważność sesji / Session validity ---
// PL: Sesja jest bezterminowa, tak samo jak w module DataVault: bramka wydaje token bez pola
//     `exp`. Starsze tokeny 30-dniowe nadal mają `exp` i nadal wygasają.
// EN: The session never expires, exactly like in DataVault: the gateway issues a token without an
//     `exp` field. Older 30-day tokens still carry `exp` and still expire.
const isSessionUsable = (session) => {
  if (!session?.token) {
    return false;
  }
  if (session.exp === undefined || session.exp === null || session.exp === "") {
    return true;
  }
  return Number(session.exp) * 1000 > Date.now();
};

const loadSession = () => {
  try {
    const raw = getStorage("local")?.getItem(AUDIO_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!isSessionUsable(parsed)) {
      getStorage("local")?.removeItem(AUDIO_SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
};

const storeSession = (session) => {
  state.session = session;
  try {
    if (session) {
      getStorage("local")?.setItem(AUDIO_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      getStorage("local")?.removeItem(AUDIO_SESSION_STORAGE_KEY);
    }
  } catch (error) {
    // Brak localStorage nie może psuć odtwarzania / Missing localStorage must not break playback
  }
};

const hasValidSession = () => isSessionUsable(state.session);

// --- Pamięć podpisanych adresów / Signed URL cache ---
// PL: Bramka wyrównuje wygaśnięcie do pełnej godziny, więc w obrębie godziny zwraca ten sam adres.
// EN: The gateway aligns expiry to a full hour, so it returns the same URL within an hour.
const signedUrlCache = new Map();

const requestSignedUrl = async (path) => {
  const cached = signedUrlCache.get(path);
  if (cached && cached.exp * 1000 > Date.now() + 5000) {
    return cached.url;
  }
  const response = await fetch(`${AUDIO_GATE_BASE}/sign?p=${encodeURIComponent(path)}`, {
    headers: { Authorization: `Bearer ${state.session?.token || ""}` }
  });
  if (response.status === 401) {
    // Token przestał być ważny — czyścimy sesję i prosimy o hasło
    // The token is no longer valid: clear the session and ask for the password again
    storeSession(null);
    state.libraryUnlocked = false;
    throw new Error("gate_unauthorized");
  }
  if (!response.ok) {
    throw new Error("gate_error");
  }
  const data = await response.json();
  signedUrlCache.set(path, { url: data.url, exp: Number(data.exp) });
  return data.url;
};

// --- Wyznaczenie adresu do odtworzenia / Resolving the URL to play ---
// PL: Warstwa publiczna ma gotowy adres w manifeście. Warstwa chroniona wymaga podpisu.
// EN: The public tier carries a ready URL. The protected tier needs a signature.
const resolveVariantUrl = async (item, variant) => {
  if (!variant) {
    return "";
  }
  if (item?.access === "public") {
    return variant.url || "";
  }
  if (!variant.path) {
    return "";
  }
  return requestSignedUrl(variant.path);
};

// --- Okno bramki / Gate window ---
// PL: Układ i komunikaty są wspólne z modułem DataVault (shared/access-gate.css). Celowo własne
//     okno, a nie natywne okienko przeglądarki, które pojawiałoby się przy każdym pliku.
// EN: Layout and wording are shared with the DataVault module (shared/access-gate.css). Deliberately
//     a custom dialog rather than the browser's native prompt, which would appear for every file.
const showAccessGate = (message = "") => {
  if (!dom.accessGate) {
    return;
  }
  dom.accessError.textContent = message;
  dom.accessPassword.value = "";
  dom.accessGate.hidden = false;
  dom.accessPassword.focus();
};

const hideAccessGate = () => {
  if (!dom.accessGate) {
    return;
  }
  dom.accessGate.hidden = true;
  dom.accessError.textContent = "";
  dom.accessPassword.value = "";
};

// --- Pominięcie bramki / Skipping the gate ---
// PL: Decyzja żyje w sessionStorage: w nowej karcie bramka wraca, ale w obrębie tej samej wizyty
//     nie pojawia się po każdym kliknięciu.
// EN: The decision lives in sessionStorage: the gate returns in a new tab, but within the same
//     visit it does not come back after every click.
const isGateSkipped = () => {
  try {
    return getStorage("session")?.getItem(AUDIO_GATE_SKIPPED_KEY) === "1";
  } catch (error) {
    return false;
  }
};

const markGateSkipped = () => {
  try {
    getStorage("session")?.setItem(AUDIO_GATE_SKIPPED_KEY, "1");
  } catch (error) {
    // Brak sessionStorage nie może blokować zamknięcia bramki / Missing sessionStorage must not block closing the gate
  }
};

const skipAccessGate = () => {
  markGateSkipped();
  hideAccessGate();
};

// Bramka pokazuje się sama, gdy nie ma ważnej sesji i użytkownik jej jeszcze nie pominął.
// The gate shows itself when there is no valid session and the user has not skipped it yet.
const maybeShowAccessGate = () => {
  if (hasValidSession() || isGateSkipped()) {
    return;
  }
  showAccessGate(state.libraryError || "");
};

// --- Wymiana Litanii Dostępu na token sesji / Exchanging the Litany of Access for a session token ---
// PL: Dwa rozłączne kroki: samo logowanie (błąd = problem z bramką) i wczytanie list (błąd =
//     problem z manifestami). Dzięki temu komunikat wskazuje warstwę, która naprawdę zawiodła.
// EN: Two separate steps: the login itself (an error = a gateway problem) and loading the lists
//     (an error = a manifest problem). The message therefore names the layer that really failed.
const submitAccessLitany = async () => {
  const password = dom.accessPassword.value || "";
  if (!password) {
    dom.accessError.textContent = t("accessEmpty");
    return;
  }
  dom.accessSubmit.disabled = true;
  dom.accessSubmit.textContent = t("accessWorking");
  dom.accessError.textContent = "";
  try {
    // KROK 1: samo logowanie / STEP 1: the login itself
    let data = null;
    try {
      const response = await fetch(`${AUDIO_GATE_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (response.status === 401) {
        dom.accessError.textContent = t("accessRejected");
        return;
      }
      if (!response.ok) {
        dom.accessError.textContent = t("accessLoginStatus", { status: String(response.status) });
        return;
      }
      data = await response.json();
    } catch (networkError) {
      console.error(networkError);
      dom.accessError.textContent = t("accessSilent");
      return;
    }

    // PL: Bramka bezterminowa zwraca `exp: null`; nie zamieniamy tego na 0, bo zero znaczyłoby
    //     „wygasł w 1970 roku”.
    // EN: The unlimited gateway returns `exp: null`; we must not coerce that to 0, which would read
    //     as "expired in 1970".
    storeSession({
      token: data.token,
      exp: data.exp === null || data.exp === undefined ? null : Number(data.exp)
    });
    // KROK 2: wczytanie list / STEP 2: loading the lists
    try {
      await loadManifests();
    } catch (manifestError) {
      console.error(manifestError);
      renderStatus();
      dom.accessError.textContent =
        state.publicError || state.libraryError || manifestError?.message || t("manifestNoData");
      return;
    }
    renderStatus();
    // PL: Hasło było poprawne, ale któraś lista się nie wczytała — okno zostaje z powodem.
    // EN: The password was correct but a list still failed to load — the window stays with the reason.
    const loadProblem = state.libraryError || state.publicError;
    if (loadProblem) {
      dom.accessError.textContent = loadProblem;
      return;
    }
    hideAccessGate();
  } finally {
    dom.accessSubmit.disabled = false;
    dom.accessSubmit.textContent = t("accessUnlockButton");
  }
};

// PL: Przycisk tylko otwiera bramkę; kasuje znacznik pominięcia, żeby bramka wróciła.
// EN: The button only opens the gate; it clears the skip marker so the gate comes back.
const handleUnlockClick = (message = "") => {
  try {
    getStorage("session")?.removeItem(AUDIO_GATE_SKIPPED_KEY);
  } catch (error) {
    // Brak sessionStorage nie może blokować otwarcia bramki / Missing sessionStorage must not block opening the gate
  }
  showAccessGate(message || state.libraryError || "");
};

// ==========================================================================================
// --- Odtwarzanie / Playback ---
// ==========================================================================================
// PL: Odtwarzacze są przypisane do STAŁEGO klucza „kontekst|lista|dźwięk”, a nie do elementu
//     strony. Dzięki temu przerysowanie widoku (zmiana z bazy, zmiana zakładki, zmiana języka)
//     nie „gubi” grającego dźwięku: nowy kafelek z tym samym kluczem od razu dostaje jego stan
//     i da się go zatrzymać. Konteksty: user (widok użytkownika), prev (podgląd), cat (katalog),
//     ed (edytor listy).
// EN: Players are bound to a STABLE "context|list|sound" key rather than to a page element. A
//     redraw (database change, tab change, language change) therefore never "loses" a playing
//     sound: the new tile with the same key gets its state right away and can be stopped.
//     Contexts: user (user view), prev (preview), cat (catalogue), ed (list editor).

const PLAY_ICON = "▶";
const STOP_ICON = "■";
const LOADING_ICON = "…";
const LOCK_ICON = "🔒";

// Grające dźwięki / Playing sounds
const players = new Map();
// Dźwięki w trakcie startu (podpis bramki, pobranie) z informacją, czy mają grać w pętli
// Sounds being started (gateway signature, download), with whether they should loop
const loadingKeys = new Map();
// Poziomy głośności ustawione w tej sesji (bez zapisu między odświeżeniami)
// Volume levels set in this session (not kept between reloads)
const volumes = new Map();
// Ostatnie kliknięcia w wartość głośności — do wykrycia podwójnego kliknięcia
// Last clicks on the volume value — to detect a double click
const volumeClicks = new Map();
let audioContext = null;

const makeKey = (context, listId, itemId) => `${context}|${listId}|${itemId}`;

// --- Licznik pokoleń chroni przed wyścigiem przy asynchronicznym starcie ---
// --- Generation counter guards against races during asynchronous start ---
// PL: Adres warstwy chronionej przychodzi z bramki, więc między kliknięciem a startem mija chwila.
//     Gdyby w międzyczasie kliknięto coś innego, stare żądanie nie może już przejąć kafelka.
// EN: Protected URLs come from the gateway, so a moment passes between the click and the start.
//     If something else is clicked meanwhile, the stale request must not win.
const playbackGeneration = new Map();

const bumpGeneration = (key) => {
  const next = (playbackGeneration.get(key) || 0) + 1;
  playbackGeneration.set(key, next);
  return next;
};

// --- Klucz wariantu: adres dla warstwy publicznej, ścieżka dla chronionej ---
// --- Variant key: URL for the public tier, repository path for the protected one ---
const getVariantKey = (variant) => variant?.url || variant?.path || "";

// --- Losowanie wariantu z ochroną przed natychmiastową powtórką w pętli / Variant picker with protection against immediate repeats in loop mode ---
const pickRandomVariant = (item, previousKey = "") => {
  if (!item?.variants?.length) {
    return null;
  }
  if (item.variants.length === 1) {
    return item.variants[0] || null;
  }
  let selected = null;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const index = Math.floor(Math.random() * item.variants.length);
    selected = item.variants[index] || null;
    const key = getVariantKey(selected);
    if (key && key !== previousKey) {
      return selected;
    }
  }
  const fallback = item.variants.find(
    (variant) => getVariantKey(variant) && getVariantKey(variant) !== previousKey
  );
  return fallback || selected;
};

const getAudioContext = () => {
  if (audioContext) {
    return audioContext;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return null;
  }
  audioContext = new AudioCtx();
  return audioContext;
};

// --- Głośność: suwak -100..100 → wzmocnienie 0..2 / Volume: slider -100..100 → gain 0..2 ---
const volumeToGain = (value) => (Math.max(-100, Math.min(100, value)) + 100) / 100;
const volumeToPercent = (value) => Math.round(volumeToGain(value) * 100);
const getVolumeValue = (key) => volumes.get(key) ?? 0;

// PL: iPhone i iPad ignorują audio.volume, dlatego głośność idzie przez GainNode Web Audio;
//     audio.volume zostaje tylko dla przeglądarek bez AudioContext.
// EN: iPhone and iPad ignore audio.volume, so volume goes through a Web Audio GainNode;
//     audio.volume remains only for browsers without AudioContext.
const applyPlayerVolume = (player, value) => {
  if (!player) {
    return;
  }
  const gain = volumeToGain(value);
  if (player.gainNode) {
    player.gainNode.gain.value = gain;
    return;
  }
  player.audio.volume = Math.max(0, Math.min(1, gain));
};

// --- Pasek postępu kafelka / Tile progress bar ---
const updateProgressBar = (bar, audio) => {
  const fill = bar?.firstElementChild;
  if (!fill) {
    return;
  }
  const duration = audio?.duration;
  if (Number.isFinite(duration) && duration > 0) {
    bar.classList.remove("is-indeterminate");
    fill.style.width = `${Math.min(100, (audio.currentTime / duration) * 100)}%`;
  } else {
    bar.classList.add("is-indeterminate");
    fill.style.width = "";
  }
};

// --- Przeniesienie stanu odtwarzania na element strony / Applying playback state to a page element ---
// PL: Kafelek widoku użytkownika dostaje data-state, ikonę, stan Loop, pasek i głośność; przycisk
//     odsłuchu w katalogu i edytorze — ikonę i klasę.
// EN: A user view tile gets data-state, the icon, the Loop state, the bar and the volume; the
//     preview button in the catalogue and editor gets the icon and a class.
const syncPlaybackElement = (element) => {
  const key = element.dataset.key;
  const player = players.get(key);
  const loading = loadingKeys.get(key);
  const active = Boolean(player || loading);
  if (element.classList.contains("tile")) {
    if (element.dataset.state === "missing") {
      return;
    }
    element.dataset.state = loading ? "loading" : player ? "playing" : "idle";
    const icon = element.querySelector(".tile-icon");
    if (icon) {
      icon.textContent = loading ? LOADING_ICON : player ? STOP_ICON : PLAY_ICON;
    }
    const playButton = element.querySelector(".tile-play");
    if (playButton) {
      playButton.setAttribute("aria-pressed", String(active));
      playButton.setAttribute("aria-label", t(active ? "tileStopLabel" : "tilePlayLabel", { name: playButton.title }));
    }
    const loopButton = element.querySelector(".loop-btn");
    if (loopButton) {
      const looping = Boolean(player?.loop || loading?.loop);
      loopButton.classList.toggle("is-looping", looping);
      loopButton.setAttribute("aria-pressed", String(looping));
    }
    const bar = element.querySelector(".tile-progress");
    if (bar) {
      if (player) {
        updateProgressBar(bar, player.audio);
      } else {
        bar.classList.remove("is-indeterminate");
        if (bar.firstElementChild) {
          bar.firstElementChild.style.width = "0%";
        }
      }
    }
    syncVolumeElements(element, key);
    return;
  }
  element.classList.toggle("is-playing", Boolean(player));
  element.classList.toggle("is-loading", Boolean(loading));
  element.textContent = loading ? LOADING_ICON : player ? STOP_ICON : PLAY_ICON;
  element.setAttribute("aria-pressed", String(active));
  element.title = t(active ? "stopTitle" : "playTitle");
};

// --- Suwak i wartość głośności kafelka / A tile's volume slider and value ---
const syncVolumeElements = (tile, key) => {
  const value = getVolumeValue(key);
  const percent = `${volumeToPercent(value)}%`;
  const slider = tile.querySelector(".volume-slider");
  if (slider) {
    if (Number(slider.value) !== value) {
      slider.value = String(value);
    }
    slider.setAttribute("aria-valuetext", percent);
  }
  const output = tile.querySelector(".tile-volume");
  if (output) {
    output.textContent = percent;
  }
};

const findKeyElements = (key) => document.querySelectorAll(`[data-key="${CSS.escape(key)}"]`);
const syncPlaybackKey = (key) => findKeyElements(key).forEach(syncPlaybackElement);
const syncPlaybackIn = (root) => root?.querySelectorAll("[data-key]").forEach(syncPlaybackElement);

// --- Blokada wygaszania ekranu, gdy coś gra (D14) / Screen wake lock while something plays (D14) ---
// PL: Blokada jest zakładana tylko wtedy, gdy gra co najmniej jeden dźwięk, i zwalniana, gdy nic
//     nie gra. Po powrocie do karty jest zakładana ponownie. Przeglądarka bez tej funkcji ją pomija.
// EN: The lock is taken only while at least one sound plays and released when nothing plays. It is
//     taken again after returning to the tab. A browser without the feature simply skips it.
let wakeLock = null;
let wakeLockPending = false;

const updateWakeLock = () => {
  const wanted = players.size > 0 && document.visibilityState === "visible";
  if (wanted && !wakeLock && !wakeLockPending && navigator.wakeLock?.request) {
    wakeLockPending = true;
    navigator.wakeLock
      .request("screen")
      .then((lock) => {
        wakeLockPending = false;
        wakeLock = lock;
        lock.addEventListener("release", () => {
          if (wakeLock === lock) {
            wakeLock = null;
          }
        });
        if (players.size === 0) {
          wakeLock = null;
          lock.release().catch(() => {});
        }
      })
      .catch(() => {
        wakeLockPending = false;
      });
    return;
  }
  if (!wanted && wakeLock) {
    const lock = wakeLock;
    wakeLock = null;
    lock.release().catch(() => {});
  }
};

// --- Wskaźniki zbiorcze: „Zatrzymaj wszystko”, kropki na zakładkach, blokada ekranu / Summary indicators: "Stop all", tab dots, wake lock ---
const updatePlaybackIndicators = () => {
  const activeKeys = [...players.keys(), ...loadingKeys.keys()];
  const count = activeKeys.length;
  document.querySelectorAll(".stop-all").forEach((button) => {
    button.disabled = count === 0;
    button.classList.toggle("is-active", count > 0);
    const counter = button.querySelector(".stop-all__count");
    if (counter) {
      counter.textContent = `(${count})`;
    }
    button.setAttribute("aria-label", `${t("stopAll")} (${count})`);
  });
  document.querySelectorAll(".uv").forEach((view) => {
    const context = view.dataset.ctx;
    view.querySelectorAll(".uv-tab").forEach((tab) => {
      const prefix = `${context}|${tab.dataset.listId}|`;
      const playing = activeKeys.some((key) => key.startsWith(prefix));
      tab.classList.toggle("has-playing", playing);
      // PL: Dymek podaje pełną nazwę (długie nazwy są ucinane) i informację, że na liście coś gra.
      // EN: The tooltip gives the full name (long names are cut) and says that something plays on the list.
      const name = getListName(getList(tab.dataset.listId));
      tab.title = playing ? `${name} — ${t("tabPlaying")}` : name;
    });
  });
  updateWakeLock();
};

const refreshKey = (key) => {
  syncPlaybackKey(key);
  updatePlaybackIndicators();
};

// --- Zatrzymanie jednego dźwięku / Stopping one sound ---
const stopPlayback = (key) => {
  const entry = players.get(key);
  if (entry) {
    entry.audio.pause();
    try {
      entry.audio.currentTime = 0;
    } catch (error) {
      // Element bez wczytanych danych nie przyjmuje zmiany czasu / An element without data rejects a time change
    }
    players.delete(key);
  }
  loadingKeys.delete(key);
  // Unieważniamy ewentualny start czekający na podpis / Cancel any start still awaiting a signature
  bumpGeneration(key);
  refreshKey(key);
};

// --- Zatrzymanie wszystkich dźwięków (D11) / Stopping every sound (D11) ---
const stopAllPlayback = () => {
  [...players.keys(), ...loadingKeys.keys()].forEach((key) => stopPlayback(key));
};

// --- Zatrzymanie dźwięków, których wpis albo lista zniknęły / Stopping sounds whose entry or list disappeared ---
const pruneOrphanPlayers = () => {
  [...players.keys(), ...loadingKeys.keys()].forEach((key) => {
    const [context, listId, itemId] = key.split("|");
    if (context === "cat") {
      return;
    }
    const list = getList(listId);
    if (!list || !list.entries.some((entry) => entry.itemId === itemId)) {
      stopPlayback(key);
    }
  });
};

// --- Start odtwarzania: zwykłe Play i Loop / Playback start: plain Play and Loop ---
// PL: Po zakończeniu pliku w pętli powstaje nowy element Audio z kolejnym losowym wariantem.
//     Przy kolejnym okrążeniu nie ma stanu „wczytywanie”, żeby kafelek nie migał.
// EN: When a looping file ends, a new Audio element with another random variant is created.
//     The next lap has no "loading" state, so the tile does not flicker.
const startPlayback = async (key, item, options = {}) => {
  const generation = bumpGeneration(key);
  const previous = players.get(key);
  const variant = pickRandomVariant(item, options.previousKey || previous?.lastKey || "");
  if (!variant) {
    alert(t("alertMissingAudio"));
    return;
  }
  if (!previous) {
    loadingKeys.set(key, { loop: Boolean(options.loop) });
    refreshKey(key);
  }

  let fullUrl = "";
  try {
    fullUrl = await resolveVariantUrl(item, variant);
  } catch (error) {
    if (playbackGeneration.get(key) !== generation) {
      return;
    }
    stopPlayback(key);
    if (error?.message === "gate_unauthorized") {
      renderStatus();
      showAccessGate(t("accessExpired"));
      return;
    }
    alert(t("alertPlaybackFailed"));
    return;
  }

  // Ktoś w międzyczasie kliknął coś innego na tym kafelku / Something else took this tile meanwhile
  if (playbackGeneration.get(key) !== generation) {
    return;
  }
  if (!fullUrl) {
    loadingKeys.delete(key);
    refreshKey(key);
    alert(t("alertMissingAudio"));
    return;
  }

  if (previous?.audio && !previous.audio.ended) {
    previous.audio.pause();
    try {
      previous.audio.currentTime = 0;
    } catch (error) {
      // Element bez wczytanych danych nie przyjmuje zmiany czasu / An element without data rejects a time change
    }
  }

  const audio = new Audio();
  // KRYTYCZNE: crossOrigin musi być ustawione PRZED przypisaniem src. Bez tego
  // createMediaElementSource „skazi” graf Web Audio i dźwięk z bramki będzie cichy.
  // CRITICAL: crossOrigin must be set BEFORE assigning src. Without it,
  // createMediaElementSource taints the Web Audio graph and gateway audio plays silent.
  if (item?.access !== "public") {
    audio.crossOrigin = "anonymous";
  }
  audio.src = fullUrl;

  const context = getAudioContext();
  let gainNode = null;
  if (context) {
    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }
    const source = context.createMediaElementSource(audio);
    gainNode = context.createGain();
    source.connect(gainNode);
    gainNode.connect(context.destination);
  }
  const pending = loadingKeys.get(key);
  const player = {
    item,
    audio,
    gainNode,
    loop: Boolean(pending ? pending.loop : options.loop ?? previous?.loop),
    lastKey: getVariantKey(variant)
  };
  applyPlayerVolume(player, getVolumeValue(key));
  players.set(key, player);
  loadingKeys.delete(key);
  refreshKey(key);

  audio.addEventListener("timeupdate", () => {
    if (players.get(key)?.audio !== audio) {
      return;
    }
    findKeyElements(key).forEach((element) => {
      const bar = element.querySelector?.(".tile-progress");
      if (bar) {
        updateProgressBar(bar, audio);
      }
    });
  });
  audio.addEventListener("ended", () => {
    const current = players.get(key);
    if (current?.audio !== audio) {
      return;
    }
    if (current.loop) {
      // Kolejne okrążenie pętli pobiera świeży podpis, jeżeli poprzedni zdążył wygasnąć
      // The next loop iteration fetches a fresh signature if the previous one expired
      startPlayback(key, current.item, { loop: true, previousKey: current.lastKey }).catch((error) => console.error(error));
      return;
    }
    stopPlayback(key);
  });
  audio.addEventListener("error", () => {
    if (players.get(key)?.audio !== audio) {
      return;
    }
    alert(t("alertPlaybackFailed"));
    stopPlayback(key);
  });
  audio.play().catch(() => {
    if (players.get(key)?.audio !== audio) {
      return;
    }
    alert(t("alertPlaybackFailed"));
    stopPlayback(key);
  });
};

// --- Przełączenie odtwarzania / Toggling playback ---
// PL: Wpis spoza manifestu przy zablokowanym archiwum to prawie zawsze dźwięk chroniony, więc
//     zamiast milczeć otwieramy bramkę z wyjaśnieniem.
// EN: An entry missing from the manifest while the archive is locked is almost always a protected
//     sound, so instead of doing nothing we open the gate with an explanation.
const togglePlayback = (key, itemId) => {
  const item = state.itemsById.get(itemId);
  if (!item) {
    if (!state.libraryUnlocked) {
      handleUnlockClick(t("accessMissingItem"));
    }
    return;
  }
  if (players.has(key) || loadingKeys.has(key)) {
    stopPlayback(key);
    return;
  }
  startPlayback(key, item).catch((error) => console.error(error));
};

// --- Przycisk Loop: start pętli, przełączenie trwającego Play w pętlę albo zatrzymanie pętli / The Loop button: start a loop, turn a running Play into a loop, or stop the loop ---
const toggleLoop = (key, itemId) => {
  const item = state.itemsById.get(itemId);
  if (!item) {
    return;
  }
  const entry = players.get(key);
  if (entry?.loop) {
    stopPlayback(key);
    return;
  }
  if (entry) {
    entry.loop = true;
    refreshKey(key);
    return;
  }
  const pending = loadingKeys.get(key);
  if (pending) {
    pending.loop = !pending.loop;
    refreshKey(key);
    return;
  }
  startPlayback(key, item, { loop: true }).catch((error) => console.error(error));
};

// --- Zmiana głośności kafelka / Changing a tile's volume ---
const setVolume = (key, value) => {
  const clamped = Math.max(-100, Math.min(100, Number(value) || 0));
  volumes.set(key, clamped);
  applyPlayerVolume(players.get(key), clamped);
  findKeyElements(key).forEach((element) => {
    if (element.classList.contains("tile")) {
      syncVolumeElements(element, key);
    }
  });
};

// --- Podwójne kliknięcie wartości głośności przywraca 100% / A double click on the volume value restores 100% ---
// PL: Własne wykrywanie dwóch kliknięć zamiast zdarzenia dblclick, które na części ekranów
//     dotykowych nie przychodzi.
// EN: Own two-click detection instead of the dblclick event, which some touch screens never send.
const handleVolumeValueClick = (key) => {
  const now = Date.now();
  const last = volumeClicks.get(key) || 0;
  if (now - last < VOLUME_RESET_DOUBLE_CLICK_MS) {
    volumeClicks.delete(key);
    setVolume(key, 0);
    return;
  }
  volumeClicks.set(key, now);
};

// ==========================================================================================
// --- Tagi, identyfikatory i adresy (wspólne z generatorem) / Tags, ids and URLs (shared with the builder) ---
// ==========================================================================================
// PL: Te funkcje są używane przez generator manifestów. Identyfikatory `id` muszą powstawać
//     dokładnie tą logiką, bo listy w bazie wskazują dźwięki właśnie po `id` — nie zmieniać bez
//     porównania wyników generatora.
// EN: These functions are used by the manifest builder. The `id` values must come from exactly
//     this logic, because lists in the database point at sounds by `id` — do not change them
//     without comparing the builder's output.

const slugify = (value, index) => {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
  return base || `sample-${index}`;
};

const normalizeUrl = (folderUrl, filename) => {
  const folder = String(folderUrl || "").trim().replace(/\/+$/, "");
  const file = String(filename || "").trim().replace(/^\/+/, "");
  if (!folder || !file) {
    return "";
  }
  return `${folder}/${file}`;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const cleanTagSegment = (segment) => {
  let cleaned = String(segment || "");
  try {
    cleaned = decodeURIComponent(cleaned);
  } catch (error) {
    cleaned = String(segment || "");
  }
  cleaned = cleaned.trim();
  TAG_IGNORE_FRAGMENTS.forEach((fragment) => {
    const regex = new RegExp(escapeRegExp(fragment), "gi");
    cleaned = cleaned.replace(regex, "");
  });
  cleaned = cleaned.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned;
};

const extractTags = (folderUrl) => {
  let path = String(folderUrl || "").trim().replace(/\\/g, "/");
  if (!path) {
    return [];
  }
  try {
    if (path.includes("://")) {
      path = new URL(path).pathname;
    }
  } catch (error) {
    path = String(folderUrl || "").trim().replace(/\\/g, "/");
  }
  const segments = path
    .split("/")
    .filter(Boolean)
    .filter((segment) => !TAG_IGNORE_SEGMENTS.includes(segment));
  return segments
    .map(cleanTagSegment)
    .filter(Boolean);
};

const getGroupingBaseLabel = (label) => {
  const trimmed = String(label || "").trim();
  if (!trimmed) {
    return { baseLabel: "", changed: false };
  }
  const suffixMatch = trimmed.match(/^(.*?)(?:\s*(\d+))$/);
  if (suffixMatch && suffixMatch[1].trim()) {
    const base = suffixMatch[1].trim();
    return { baseLabel: base, changed: base !== trimmed };
  }
  return { baseLabel: trimmed, changed: false };
};

// ==========================================================================================
// --- Manifesty / Manifests ---
// ==========================================================================================
// PL: Warstwa publiczna (demo) leży w tym repozytorium jako gotowy JSON i działa bez logowania.
//     Warstwa chroniona przychodzi z bramki i wymaga ważnej sesji. Oba manifesty są już
//     pogrupowane i mają wyliczone identyfikatory — generuje je przycisk „Zbuduj manifesty z XLSX”.
// EN: The public (demo) tier is a ready JSON in this repository and works without login. The
//     protected tier comes from the gateway and needs a valid session. Both manifests arrive
//     pre-grouped with ids — they are produced by the "Build manifests from XLSX" button.

const fetchDemoManifest = async () => {
  const response = await fetch(PUBLIC_MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) {
    // PL: Kod HTTP jedzie razem z błędem, bo to on mówi, co się stało.
    // EN: The HTTP status travels with the error because it names the cause.
    const error = new Error("public_manifest_unavailable");
    error.detail = String(response.status);
    throw error;
  }
  const data = await response.json();
  return Array.isArray(data?.items) ? data.items : [];
};

const fetchProtectedManifest = async () => {
  const response = await fetch(`${AUDIO_GATE_BASE}/manifest`, {
    headers: { Authorization: `Bearer ${state.session?.token || ""}` }
  });
  if (response.status === 401) {
    storeSession(null);
    throw new Error("gate_unauthorized");
  }
  if (!response.ok) {
    // PL: Brak manifestu w repozytorium to inna naprawa niż awaria bramki, więc je rozróżniamy.
    // EN: A missing manifest needs a different fix than a gateway failure, so we tell them apart.
    let detail = "";
    try {
      const payload = await response.json();
      detail = payload?.error === "manifest_unavailable" ? String(payload.status || "") : "";
      if (payload?.error === "manifest_unavailable") {
        const error = new Error("manifest_unavailable");
        error.detail = detail;
        throw error;
      }
    } catch (parseError) {
      if (parseError?.message === "manifest_unavailable") {
        throw parseError;
      }
    }
    const error = new Error("gate_error");
    error.detail = String(response.status);
    throw error;
  }
  const data = await response.json();
  return Array.isArray(data?.items) ? data.items : [];
};

// --- Złożenie obu warstw w jedną listę / Merging both tiers into one list ---
// PL: Kolejność sortowania odpowiada generatorowi. Każdy dźwięk dostaje najgłębszą ścieżkę
//     folderu (do drzewa) i tekst do wyszukiwania, liczony raz.
// EN: The sort order matches the builder. Each sound gets its deepest folder path (for the tree)
//     and a search text, computed once.
const applyItems = (items) => {
  state.items = items
    .slice()
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((item) => {
      const tags = Array.isArray(item.tags) ? item.tags : [];
      const tagPaths = Array.isArray(item.tagPaths) ? item.tagPaths : [];
      return {
        ...item,
        tags,
        tagPaths,
        folderPath: tagPaths.length ? tagPaths[tagPaths.length - 1] : NO_FOLDER_PATH,
        searchText: foldPolish([item.label, item.filename, ...tags].join(" | "))
      };
    });
  state.itemsById = new Map(state.items.map((item) => [item.id, item]));
  state.folderTree = buildFolderTree(state.items);
  if (!state.expandedPaths) {
    state.expandedPaths = new Set(state.folderTree.roots.map((node) => node.path));
  }
};

const loadManifests = async () => {
  if (dom.manifestStatus) {
    dom.manifestStatus.textContent = t("manifestLoading");
  }
  // PL: Warstwa publiczna nie może przewrócić całego wczytywania.
  // EN: The public tier must not take the whole load down.
  let demoItems = [];
  state.publicError = null;
  try {
    demoItems = await fetchDemoManifest();
  } catch (error) {
    console.error(error);
    state.publicError = error?.message === "public_manifest_unavailable"
      ? t("publicManifestMissing", { status: error.detail || "?", file: PUBLIC_MANIFEST_URL })
      : t("manifestFetchError");
  }

  let protectedItems = [];
  state.libraryUnlocked = false;
  state.libraryError = null;

  if (hasValidSession()) {
    try {
      protectedItems = await fetchProtectedManifest();
      state.libraryUnlocked = true;
    } catch (error) {
      // PL: Brak warstwy chronionej nie może zablokować warstwy demo, ale musi być widoczny.
      // EN: Losing the protected tier must not take the demo tier down, but it must be visible.
      console.error(error);
      if (error?.message === "gate_unauthorized") {
        state.libraryError = t("accessExpired");
      } else if (error?.message === "manifest_unavailable") {
        state.libraryError = t("accessManifestMissing", { status: error.detail || "?" });
      } else if (error?.message === "gate_error") {
        state.libraryError = t("accessGateStatus", { status: error.detail || "?" });
      } else {
        state.libraryError = t("accessSilent");
      }
    }
  }

  state.manifestAttempted = true;
  const items = demoItems.concat(protectedItems);
  if (!items.length) {
    // Jeżeli znamy powód, podajemy go zamiast ogólnego „brak danych” / When the reason is known, report it
    const reason = state.publicError || state.libraryError;
    renderAll();
    throw new Error(reason || t("manifestNoData"));
  }
  applyItems(items);
  state.manifestReady = true;
  signedUrlCache.clear();
  renderAll();
};

// ==========================================================================================
// --- Drzewo folderów (tagi) / Folder tree (tags) ---
// ==========================================================================================
// PL: Węzeł drzewa to folder ze ścieżki tagPaths. Zaznaczenie jest pamiętane dla dźwięków leżących
//     BEZPOŚREDNIO w folderze (zbiór wykluczonych ścieżek), a dźwięk jest widoczny w katalogu, gdy
//     jego najgłębszy folder nie jest wykluczony. Dzięki temu zaznaczenie podfolderu działa także
//     przy odznaczonym rodzicu, a folder z własnymi dźwiękami i podfolderami jest obsłużony poprawnie.
// EN: A tree node is a folder from the tagPaths path. Selection is kept for sounds lying DIRECTLY in
//     a folder (a set of excluded paths), and a sound is visible in the catalogue when its deepest
//     folder is not excluded. Selecting a subfolder therefore works even with the parent cleared, and
//     a folder with both its own sounds and subfolders is handled correctly.

const buildFolderTree = (items) => {
  const index = new Map();
  const roots = [];
  const ensureNode = (path, name, depth, parent) => {
    if (index.has(path)) {
      return index.get(path);
    }
    const node = { path, name, depth, parent, children: [], ownCount: 0, totalCount: 0 };
    index.set(path, node);
    (parent ? parent.children : roots).push(node);
    return node;
  };
  items.forEach((item) => {
    if (!item.tagPaths.length) {
      const node = ensureNode(NO_FOLDER_PATH, null, 0, null);
      node.ownCount += 1;
      node.totalCount += 1;
      return;
    }
    let parent = null;
    item.tagPaths.forEach((path, depth) => {
      const name = item.tags[depth] ?? String(path).split(" / ").pop();
      const node = ensureNode(path, name, depth, parent);
      node.totalCount += 1;
      parent = node;
    });
    parent.ownCount += 1;
  });
  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      if (a.path === NO_FOLDER_PATH) return 1;
      if (b.path === NO_FOLDER_PATH) return -1;
      return String(a.name).localeCompare(String(b.name));
    });
    nodes.forEach((node) => sortNodes(node.children));
  };
  sortNodes(roots);
  return { roots, index };
};

const getNodeName = (node) => (node.path === NO_FOLDER_PATH ? t("treeNoFolder") : node.name);

const getSubtreePaths = (node) => {
  const paths = [node.path];
  node.children.forEach((child) => paths.push(...getSubtreePaths(child)));
  return paths;
};

// --- Stan węzłów liczony od liści w górę / Node states computed from the leaves up ---
// PL: "all" = folder i całe poddrzewo widoczne, "none" = nic, "some" = stan mieszany.
// EN: "all" = folder and its whole subtree visible, "none" = nothing, "some" = mixed state.
const computeTreeStats = () => {
  const stats = new Map();
  const visit = (node) => {
    const states = [];
    let visible = 0;
    if (node.ownCount > 0) {
      const on = !state.excludedPaths.has(node.path);
      states.push(on ? "all" : "none");
      if (on) {
        visible += node.ownCount;
      }
    }
    node.children.forEach((child) => {
      const childStats = visit(child);
      states.push(childStats.state);
      visible += childStats.visible;
    });
    const nodeState = states.every((value) => value === "all")
      ? "all"
      : states.every((value) => value === "none")
        ? "none"
        : "some";
    const entry = { state: nodeState, visible, total: node.totalCount };
    stats.set(node.path, entry);
    return entry;
  };
  state.folderTree.roots.forEach(visit);
  return stats;
};

// --- Liczba folderów z własnymi dźwiękami: widoczne / wszystkie / Folders with own sounds: visible / all ---
const getFolderFilterCounts = () => {
  let total = 0;
  let visible = 0;
  state.folderTree.index.forEach((node) => {
    if (node.ownCount > 0) {
      total += 1;
      if (!state.excludedPaths.has(node.path)) {
        visible += 1;
      }
    }
  });
  return { total, visible, active: visible < total };
};

// --- Wyszukiwanie w drzewie: pasujące foldery, ich przodkowie i potomkowie / Tree search: matching folders, their ancestors and descendants ---
const getTreeSearch = () => {
  const needle = toNeedle(state.treeSearch);
  if (!needle) {
    return null;
  }
  const matches = [];
  const visible = new Set();
  const forced = new Set();
  state.folderTree.index.forEach((node) => {
    if (foldPolish(getNodeName(node)).includes(needle)) {
      matches.push(node);
    }
  });
  matches.forEach((node) => {
    getSubtreePaths(node).forEach((path) => visible.add(path));
    let parent = node.parent;
    while (parent) {
      visible.add(parent.path);
      forced.add(parent.path);
      parent = parent.parent;
    }
  });
  return { needle, matches, visible, forced };
};

// --- Ustawienie widoczności całego poddrzewa / Setting the visibility of a whole subtree ---
const setSubtreeIncluded = (node, include) => {
  getSubtreePaths(node).forEach((path) => {
    if (include) {
      state.excludedPaths.delete(path);
    } else {
      state.excludedPaths.add(path);
    }
  });
};

const excludeAllFolders = () => {
  state.excludedPaths = new Set();
  state.folderTree.index.forEach((node) => {
    if (node.ownCount > 0) {
      state.excludedPaths.add(node.path);
    }
  });
};

// --- Zmiana filtra folderów: drzewo, katalog i zapis stanu / A folder filter change: tree, catalogue and stored state ---
const onFolderFilterChanged = () => {
  state.catalogLimit = CATALOG_PAGE_SIZE;
  saveAdminFilters();
  renderTree();
  renderCatalog();
};

// ==========================================================================================
// --- Stan interfejsu admina w pamięci przeglądarki / Admin interface state in browser storage ---
// ==========================================================================================
// PL: Układ (zwinięcie paneli, rozwinięte foldery, lista edytowana, podgląd, zakładka) zostaje na
//     tym urządzeniu w localStorage; filtry — w sessionStorage, jak Filtr Globalny w DataVault.
//     Głośność kafelków nie jest zapisywana nigdzie (decyzja D13).
// EN: The layout (collapsed panels, expanded folders, edited list, preview, tab) stays on this
//     device in localStorage; filters go to sessionStorage, like the Global Filter in DataVault.
//     Tile volume is not stored anywhere (decision D13).

const saveAdminUi = () => {
  if (!ADMIN_MODE) {
    return;
  }
  writeStoredJson("local", ADMIN_UI_STORAGE_KEY, {
    foldersCollapsed: state.foldersCollapsed,
    expandedPaths: state.expandedPaths ? [...state.expandedPaths] : null,
    editedListId: state.restoredEditedListId || state.editedListId,
    previewDevice: state.previewDevice,
    previewFollow: state.previewFollow,
    previewCollapsed: state.previewCollapsed,
    adminTab: state.adminTab
  });
};

const saveAdminFilters = () => {
  if (!ADMIN_MODE) {
    return;
  }
  writeStoredJson("session", ADMIN_FILTERS_STORAGE_KEY, {
    excludedPaths: [...state.excludedPaths],
    treeSearch: state.treeSearch,
    catalogSearch: state.catalogSearch,
    catalogScope: state.catalogScope,
    catalogTier: state.catalogTier
  });
};

const restoreAdminState = () => {
  if (!ADMIN_MODE) {
    return;
  }
  const ui = readStoredJson("local", ADMIN_UI_STORAGE_KEY) || {};
  state.foldersCollapsed = Boolean(ui.foldersCollapsed);
  state.expandedPaths = Array.isArray(ui.expandedPaths) ? new Set(ui.expandedPaths) : null;
  state.restoredEditedListId = typeof ui.editedListId === "string" ? ui.editedListId : null;
  state.previewDevice = PREVIEW_DEVICE_WIDTHS[ui.previewDevice] !== undefined ? ui.previewDevice : "desktop";
  state.previewFollow = ui.previewFollow !== false;
  state.previewCollapsed = Boolean(ui.previewCollapsed);
  state.adminTab = ["catalog", "lists", "preview"].includes(ui.adminTab) ? ui.adminTab : "catalog";
  const filters = readStoredJson("session", ADMIN_FILTERS_STORAGE_KEY) || {};
  state.excludedPaths = new Set(Array.isArray(filters.excludedPaths) ? filters.excludedPaths : []);
  state.treeSearch = String(filters.treeSearch || "");
  state.catalogSearch = String(filters.catalogSearch || "");
  state.catalogScope = ["all", "outside", "inside"].includes(filters.catalogScope) ? filters.catalogScope : "all";
  state.catalogTier = ["all", "public", "protected"].includes(filters.catalogTier) ? filters.catalogTier : "all";
  dom.treeSearch.value = state.treeSearch;
  dom.catalogSearch.value = state.catalogSearch;
  dom.catalogScope.value = state.catalogScope;
  dom.catalogTier.value = state.catalogTier;
};

// ==========================================================================================
// --- Rysowanie: wspólne / Drawing: shared ---
// ==========================================================================================

// --- Zachowanie fokusu i wpisywanego tekstu przy przerysowaniu / Keeping focus and typed text across a redraw ---
// PL: Zmiana przychodząca z bazy nie może skasować tekstu wpisywanego właśnie w pole aliasu albo
//     nazwy, ani wyrzucić fokusu z przycisku, którym ktoś przesuwa wpis klawiaturą.
// EN: A change arriving from the database must not erase text being typed into an alias or name
//     field, nor throw focus off a button someone uses to move an entry with the keyboard.
const withPreservedFocus = (container, render) => {
  const active = document.activeElement;
  const focusKey = active && container?.contains(active) ? active.dataset.focusKey : null;
  const snapshot = focusKey && active.tagName === "INPUT" && active.type === "text"
    ? { value: active.value, start: active.selectionStart, end: active.selectionEnd }
    : null;
  render();
  if (!focusKey) {
    return;
  }
  const next = container.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`);
  if (!next || next.disabled) {
    return;
  }
  if (snapshot) {
    next.value = snapshot.value;
  }
  next.focus({ preventScroll: true });
  if (snapshot) {
    try {
      next.setSelectionRange(snapshot.start, snapshot.end);
    } catch (error) {
      // Nie każde pole przyjmuje zaznaczenie / Not every field accepts a selection
    }
  }
};

// --- Pastylki statusów i przyciski zależne od stanu / Status pills and state-dependent buttons ---
const renderStatus = () => {
  // PL: Awaria warstwy publicznej musi być widoczna nawet wtedy, gdy archiwum wczytało się poprawnie.
  // EN: A public tier failure must stay visible even when the archive loaded fine.
  if (state.publicError) {
    dom.manifestStatus.textContent = t("manifestPublicError");
    dom.manifestStatus.title = state.publicError;
  } else {
    dom.manifestStatus.textContent = state.manifestReady
      ? t("manifestReady", { count: state.items.length })
      : t("manifestMissing");
    dom.manifestStatus.title = "";
  }
  dom.manifestStatus.classList.toggle("is-error", Boolean(state.publicError));

  if (!state.firebaseStarted) {
    dom.firebaseStatus.textContent = t("firebaseWaiting");
  } else if (state.firebaseConfigMissing) {
    dom.firebaseStatus.textContent = t("firebaseMissing");
  } else {
    dom.firebaseStatus.textContent = state.usingFirestore ? t("firebaseConnected") : t("firebaseLocal");
  }
  // PL: Pastylki są widoczne tylko w panelu admina, dlatego tryb pracy z danymi ma własny znacznik
  //     widoczny w obu trybach modułu.
  // EN: The pills are visible in the admin panel only, so the data working mode has its own badge,
  //     visible in both modes of the module.
  if (state.firebaseStarted) {
    writeStatus.setMode(state.usingFirestore ? "shared" : "local");
  }
  dom.listsStatus.textContent = t("listsStatus", { count: getLists().length });

  // PL: Trzy stany archiwum: odblokowane, zablokowane (stan poprawny, zielony) i błąd (czerwony).
  // EN: Three archive states: unlocked, locked (a healthy, green state) and error (red).
  if (state.libraryError) {
    dom.libraryStatus.textContent = t("libraryError");
    dom.libraryStatus.title = state.libraryError;
  } else {
    dom.libraryStatus.textContent = state.libraryUnlocked ? t("libraryUnlocked") : t("libraryDemoOnly");
    dom.libraryStatus.title = "";
  }
  dom.libraryStatus.classList.toggle("is-error", Boolean(state.libraryError));
  // PL: Przycisk służy wyłącznie do odblokowania, więc po odblokowaniu znika.
  // EN: The button only unlocks, so it disappears once the archive is unlocked.
  dom.unlockLibrary.hidden = state.libraryUnlocked;
  dom.reloadLocal.hidden = state.usingFirestore;

  const builder = state.builder;
  if (builder.status === "working") {
    dom.builderStatus.textContent = t("builderWorking");
    dom.builderStatus.title = "";
  } else if (builder.status === "error") {
    dom.builderStatus.textContent = t("builderError");
    dom.builderStatus.title = builder.message || "";
  } else if (builder.status === "ready") {
    dom.builderStatus.textContent = t("builderReady", {
      publicCount: builder.publicCount,
      protectedCount: builder.protectedCount
    });
    dom.builderStatus.title = "";
  } else {
    dom.builderStatus.textContent = t("builderIdle");
    dom.builderStatus.title = "";
  }
  // Czerwień tylko przy błędzie / Red only on error
  dom.builderStatus.classList.toggle("is-error", builder.status === "error");
};

// --- Całość widoku / The whole view ---
const renderAll = () => {
  renderStatus();
  if (ADMIN_MODE) {
    renderNotices();
    renderLayoutState();
    renderTree();
    renderTargetSelect();
    renderCatalog();
    renderLists();
    renderEditor();
    renderPreview();
  } else {
    renderUserView(dom.userView, "user");
  }
  updatePlaybackIndicators();
};

// ==========================================================================================
// --- Rysowanie: panel admina / Drawing: admin panel ---
// ==========================================================================================

// --- Komunikaty pod nagłówkiem / Notices below the header ---
const renderNotices = () => {
  if (!ADMIN_MODE) {
    return;
  }
  const notices = [];
  if (state.legacyDetected && !state.legacyNoticeDismissed) {
    notices.push({ id: "legacy", text: t("noticeLegacy") });
  }
  if (state.manifestAttempted && !state.libraryUnlocked && !state.archiveNoticeDismissed) {
    notices.push({ id: "archive", text: t("noticeArchiveLocked") });
  }
  dom.adminNotices.innerHTML = notices
    .map(
      (notice) => `
        <div class="notice" data-notice="${notice.id}">
          <p>${escapeHtml(notice.text)}</p>
          <button class="icon-btn" type="button" data-action="notice-close" aria-label="${escapeHtml(t("noticeClose"))}" title="${escapeHtml(t("noticeClose"))}">✕</button>
        </div>`
    )
    .join("");
};

// --- Szerokości podglądu dostępne w bieżącym oknie / Preview widths available in the current window ---
// PL: Przełącznik pokazuje tylko szerokości węższe od okna; na telefonie zostaje sama pełna szerokość.
// EN: The switch shows only widths narrower than the window; on a phone only the full width remains.
const getAvailableDevices = () => ({
  desktop: true,
  tablet: window.innerWidth > PREVIEW_DEVICE_WIDTHS.tablet + 40,
  phone: window.innerWidth > PREVIEW_DEVICE_WIDTHS.phone + 40
});

// --- Układ panelu: zakładki, szuflada, szyna, podgląd / Panel layout: tabs, drawer, rail, preview ---
const renderLayoutState = () => {
  if (!ADMIN_MODE) {
    return;
  }
  document.body.dataset.adminTab = state.adminTab;
  dom.adminTabs.querySelectorAll(".admin-tab").forEach((button) => {
    const active = button.dataset.tab === state.adminTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const wide = window.matchMedia("(min-width: 1280px)").matches;
  if (wide && state.foldersOpen) {
    state.foldersOpen = false;
  }
  dom.workbench.classList.toggle("is-folders-collapsed", wide && state.foldersCollapsed);
  dom.foldersPanel.classList.toggle("is-collapsed", state.foldersCollapsed);
  dom.foldersPanel.classList.toggle("is-drawer-open", state.foldersOpen);
  dom.drawerBackdrop.hidden = !state.foldersOpen;

  const devices = getAvailableDevices();
  if (!devices[state.previewDevice]) {
    state.previewDevice = "desktop";
  }
  dom.previewDevices.querySelectorAll(".seg-btn").forEach((button) => {
    button.hidden = !devices[button.dataset.device];
    const active = button.dataset.device === state.previewDevice;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  dom.previewFrame.dataset.device = state.previewDevice;
  dom.previewFrame.hidden = state.previewCollapsed;
  dom.previewToggle.textContent = t(state.previewCollapsed ? "previewShow" : "previewHide");
  dom.previewToggle.setAttribute("aria-expanded", String(!state.previewCollapsed));
  dom.previewFollow.checked = state.previewFollow;
};

// --- Drzewo folderów / Folder tree ---
const renderTree = () => {
  if (!ADMIN_MODE) {
    return;
  }
  const search = getTreeSearch();
  const counts = getFolderFilterCounts();

  // PL: Niebieskie sygnały: etykieta wyszukiwania i nagłówek panelu (z kropkami na szynie i przycisku).
  // EN: Blue signals: the search label and the panel title (with dots on the rail and button).
  dom.treeSearchLabel.classList.toggle("field-label--active", Boolean(search));
  dom.treeSearchLabel.title = search ? t("treeSearchActive", { text: state.treeSearch.trim() }) : "";
  dom.foldersTitle.classList.toggle("is-filter-on", counts.active);
  dom.foldersTitle.title = counts.active ? t("foldersFilterActive", counts) : "";
  [dom.foldersTitleDot, dom.foldersRailDot, dom.openFoldersDot].forEach((dot) => {
    dot.hidden = !counts.active;
  });
  dom.treeMatchActions.hidden = !search;

  if (!state.folderTree.roots.length) {
    dom.folderTree.innerHTML = `<p class="empty-state">${escapeHtml(t("treeEmpty"))}</p>`;
    return;
  }
  if (search && !search.matches.length) {
    dom.folderTree.innerHTML = `<p class="empty-state">${escapeHtml(t("treeNoMatches"))}</p>`;
    return;
  }

  const stats = computeTreeStats();
  const rows = [];
  const walk = (nodes) => {
    nodes.forEach((node) => {
      if (search && !search.visible.has(node.path)) {
        return;
      }
      const expanded = search
        ? search.forced.has(node.path) || state.expandedPaths.has(node.path)
        : state.expandedPaths.has(node.path);
      rows.push({ node, expanded });
      if (node.children.length && expanded) {
        walk(node.children);
      }
    });
  };
  walk(state.folderTree.roots);

  withPreservedFocus(dom.folderTree, () => {
    dom.folderTree.innerHTML = rows
      .map(({ node, expanded }) => {
        const nodeStats = stats.get(node.path) || { state: "all", visible: 0, total: 0 };
        const name = getNodeName(node);
        const path = escapeHtml(node.path);
        const count = nodeStats.visible === nodeStats.total ? `(${nodeStats.total})` : `(${nodeStats.visible}/${nodeStats.total})`;
        const toggle = node.children.length
          ? `<button class="tree-toggle" type="button" data-action="tree-toggle" data-focus-key="tree-toggle:${path}" aria-expanded="${expanded}" aria-label="${escapeHtml(t(expanded ? "treeCollapseNode" : "treeExpandNode"))}">${expanded ? "▾" : "▸"}</button>`
          : `<span class="tree-toggle tree-toggle--leaf" aria-hidden="true"></span>`;
        return `
          <div class="tree-row" role="treeitem" aria-level="${node.depth + 1}" style="--depth:${node.depth}" data-path="${path}">
            ${toggle}
            <label class="tree-label">
              <input class="tree-check" type="checkbox" data-action="tree-check" data-state="${nodeStats.state}" data-focus-key="tree-check:${path}" ${nodeStats.state === "all" ? "checked" : ""} aria-label="${escapeHtml(t("treeCheckLabel", { name }))}">
              <span class="tree-name" title="${escapeHtml(name)}">${highlightMatch(name, search?.needle || "")}</span>
            </label>
            <span class="tree-count">${count}</span>
            <button class="tree-only" type="button" data-action="tree-only" title="${escapeHtml(t("treeOnlyTitle"))}">${escapeHtml(t("treeOnly"))}</button>
          </div>`;
      })
      .join("");
    // PL: Stanu częściowego nie da się ustawić w HTML — tylko właściwością indeterminate.
    // EN: The mixed state cannot be set in HTML — only through the indeterminate property.
    dom.folderTree.querySelectorAll('.tree-check[data-state="some"]').forEach((checkbox) => {
      checkbox.indeterminate = true;
    });
  });
};

// --- Wybór listy docelowej w nagłówku katalogu / Target list picker in the catalogue header ---
const renderTargetSelect = () => {
  if (!ADMIN_MODE) {
    return;
  }
  dom.targetList.innerHTML = getLists()
    .map((list) => `<option value="${escapeHtml(list.id)}">${escapeHtml(getListName(list))}</option>`)
    .join("");
  dom.targetList.value = getEditedList().id;
};

// --- Wyniki katalogu po wszystkich filtrach / Catalogue results after every filter ---
const getCatalogResults = (targetIds) => {
  const needle = toNeedle(state.catalogSearch);
  return state.items.filter((item) => {
    if (state.excludedPaths.has(item.folderPath)) {
      return false;
    }
    if (state.catalogTier !== "all" && item.access !== state.catalogTier) {
      return false;
    }
    if (state.catalogScope === "outside" && targetIds.has(item.id)) {
      return false;
    }
    if (state.catalogScope === "inside" && !targetIds.has(item.id)) {
      return false;
    }
    if (needle && !item.searchText.includes(needle)) {
      // PL: Szukamy też w aliasach nadanych na listach. / EN: Aliases given on lists are searched too.
      const aliases = (state.membership.get(item.id) || []).map((member) => member.alias).join(" | ");
      if (!foldPolish(aliases).includes(needle)) {
        return false;
      }
    }
    return true;
  });
};

// --- Opis przynależności do list (dymek i rozwinięta linia) / Membership description (tooltip and expanded line) ---
const describeMembership = (itemId) => {
  const members = state.membership.get(itemId) || [];
  if (!members.length) {
    return t("membersNone");
  }
  const lists = members
    .map((member) => {
      const name = getListName(getList(member.listId));
      return member.alias ? `${name} (${t("aliasShort", { alias: member.alias })})` : name;
    })
    .join(", ");
  return t("membersTitle", { lists });
};

// --- Katalog dźwięków / Sound catalogue ---
const renderCatalog = () => {
  if (!ADMIN_MODE) {
    return;
  }
  const target = getEditedList();
  const targetName = getListName(target);
  const targetIds = new Set(target.entries.map((entry) => entry.itemId));
  const results = getCatalogResults(targetIds);
  state.catalogResults = results;
  const needle = toNeedle(state.catalogSearch);
  const counts = getFolderFilterCounts();

  dom.catalogSearchLabel.classList.toggle("field-label--active", Boolean(needle));
  dom.catalogSearchLabel.title = needle ? t("catalogSearchActive", { text: state.catalogSearch.trim() }) : "";
  const foldersPart = `<span class="${counts.active ? "is-filter-on" : ""}" title="${escapeHtml(counts.active ? t("foldersFilterActive", counts) : "")}">${escapeHtml(t("catalogFolders", counts))}</span>`;
  dom.catalogSummary.innerHTML = `${foldersPart} · ${escapeHtml(t("catalogSummary", { shown: results.length, total: state.items.length }))}`;

  let html = "";
  if (!state.items.length) {
    html = `<p class="empty-state">${escapeHtml(t(state.manifestAttempted ? "catalogEmptyManifest" : "catalogLoading"))}</p>`;
  } else if (!results.length) {
    html = `<p class="empty-state">${escapeHtml(t("catalogNoResults"))}</p>`;
  } else {
    html = results
      .slice(0, state.catalogLimit)
      .map((item, index) => {
        const id = escapeHtml(item.id);
        const members = state.membership.get(item.id) || [];
        const inTarget = targetIds.has(item.id);
        const selected = state.selectedItemIds.has(item.id);
        const path = item.tags.slice(1).join(" › ");
        const meta = [path, item.filename].filter(Boolean).join(" · ");
        const membership = describeMembership(item.id);
        const expanded = state.expandedMembers.has(item.id) && members.length;
        return `
          <div class="cat-row ${selected ? "is-selected" : ""} ${inTarget ? "is-member" : ""}" data-item-id="${id}" data-index="${index}">
            <input class="cat-check" type="checkbox" data-action="cat-select" data-focus-key="cat-check:${id}" ${selected ? "checked" : ""} aria-label="${escapeHtml(t("selectItem", { name: item.label }))}">
            <button class="play-btn" type="button" data-action="cat-play" data-key="${escapeHtml(makeKey("cat", "", item.id))}" aria-pressed="false" title="${escapeHtml(t("playTitle"))}">${PLAY_ICON}</button>
            <div class="cat-main">
              <span class="cat-title" title="${escapeHtml(item.label)}">${buildTitleHtml(item.label, "", item.groupCount)}</span>
              <span class="cat-meta" title="${escapeHtml(item.tags.join(" / "))}">${escapeHtml(meta)}</span>
            </div>
            <span class="chip chip--tier ${item.access === "public" ? "chip--demo" : "chip--archive"}">${escapeHtml(t(item.access === "public" ? "tierChipPublic" : "tierChipProtected"))}</span>
            <button class="chip chip--members" type="button" data-action="cat-members" data-focus-key="cat-members:${id}" title="${escapeHtml(membership)}" aria-label="${escapeHtml(membership)}" aria-expanded="${Boolean(expanded)}" ${members.length ? "" : "disabled"}>${members.length}</button>
            <button class="add-btn ${inTarget ? "is-on" : ""}" type="button" data-action="cat-toggle" data-focus-key="cat-toggle:${id}" aria-pressed="${inTarget}" title="${escapeHtml(t(inTarget ? "removeFromTarget" : "addToTarget", { name: targetName }))}">${inTarget ? "✓" : "+"}</button>
            ${expanded ? `<p class="cat-members">${escapeHtml(membership)}</p>` : ""}
          </div>`;
      })
      .join("");
  }
  withPreservedFocus(dom.catalogList, () => {
    dom.catalogList.innerHTML = html;
  });
  syncPlaybackIn(dom.catalogList);

  const remaining = results.length - Math.min(results.length, state.catalogLimit);
  dom.catalogMore.hidden = remaining <= 0;
  dom.catalogMore.textContent = t("catalogMore", { count: Math.min(CATALOG_PAGE_SIZE, remaining) });

  const selectedCount = state.selectedItemIds.size;
  dom.bulkBar.hidden = selectedCount === 0;
  dom.bulkCount.textContent = t("bulkCount", { count: selectedCount });
  dom.bulkAdd.textContent = t("bulkAdd", { name: targetName });
  dom.selectAllResults.disabled = !results.length;
};

// --- Panel list / Lists panel ---
const renderLists = () => {
  if (!ADMIN_MODE) {
    return;
  }
  const lists = getLists();
  const editedId = getEditedList().id;
  withPreservedFocus(dom.listsList, () => {
    dom.listsList.innerHTML = lists
      .map((list, index) => {
        const id = escapeHtml(list.id);
        const isMain = list.kind === "main";
        const name = escapeHtml(getListName(list));
        return `
          <div class="list-row ${isMain ? "is-main" : ""} ${list.id === editedId ? "is-active" : ""}" data-list-id="${id}">
            ${isMain
              ? `<span class="list-pin" aria-hidden="true">📌</span>`
              : `<span class="drag-handle" title="${escapeHtml(t("dragHandle"))}" aria-hidden="true">⠿</span>`}
            <button class="list-name" type="button" data-action="select-list" data-focus-key="list:${id}" aria-current="${list.id === editedId}" title="${name}">${name}</button>
            ${isMain ? `<span class="list-badge">${escapeHtml(t("mainListBadge"))}</span>` : ""}
            <span class="list-count">${list.entries.length}</span>
            ${isMain
              ? ""
              : `<button class="icon-btn" type="button" data-action="list-up" data-focus-key="list-up:${id}" title="${escapeHtml(t("moveUp"))}" aria-label="${escapeHtml(t("moveUp"))}" ${index <= 1 ? "disabled" : ""}>▲</button>
                 <button class="icon-btn" type="button" data-action="list-down" data-focus-key="list-down:${id}" title="${escapeHtml(t("moveDown"))}" aria-label="${escapeHtml(t("moveDown"))}" ${index === lists.length - 1 ? "disabled" : ""}>▼</button>`}
          </div>`;
      })
      .join("");
  });
};

// --- Czy wpis pasuje do frazy wyszukiwania na liście / Whether an entry matches the list search phrase ---
const entryMatches = (entry, needle) => {
  if (!needle) {
    return true;
  }
  const item = state.itemsById.get(entry.itemId);
  const text = item
    ? [item.label, entry.alias, item.filename].join(" | ")
    : [entry.alias, entry.itemId].join(" | ");
  return foldPolish(text).includes(needle);
};

// --- Edytor listy / List editor ---
const renderEditor = () => {
  if (!ADMIN_MODE) {
    return;
  }
  const list = getEditedList();
  const isMain = list.kind === "main";
  const name = getListName(list);
  const renaming = state.renamingListId === list.id;
  const aliasCount = list.entries.filter((entry) => entry.alias).length;
  const needle = toNeedle(state.editorSearch);
  const locked = Boolean(needle);

  withPreservedFocus(dom.editorHead, () => {
    dom.editorHead.innerHTML = `
      <div class="editor__title-row">
        ${renaming
          ? `<input class="text-input rename-input" type="text" maxlength="${LIST_NAME_MAX_LENGTH}" value="${escapeHtml(list.name)}" placeholder="${escapeHtml(isMain ? t("mainListDefault") : name)}" data-focus-key="rename:${escapeHtml(list.id)}" aria-label="${escapeHtml(t("renameList"))}" title="${escapeHtml(t("renameHint"))}">`
          : `<h3 class="editor__title">${isMain ? `<small>${escapeHtml(t("mainListBadge"))}</small>` : ""}${escapeHtml(name)}</h3>`}
        <button class="icon-btn" type="button" data-action="rename-start" title="${escapeHtml(t("renameList"))}" aria-label="${escapeHtml(t("renameList"))}">✎</button>
        <button class="icon-btn" type="button" data-action="duplicate" title="${escapeHtml(t("duplicateList"))}" aria-label="${escapeHtml(t("duplicateList"))}">⧉</button>
        ${isMain ? "" : `<button class="icon-btn icon-btn--danger" type="button" data-action="delete-list" title="${escapeHtml(t("deleteList"))}" aria-label="${escapeHtml(t("deleteList"))}">🗑</button>`}
      </div>
      <div class="editor__meta">
        <span>${escapeHtml(t("editorCount", { count: list.entries.length }))}</span>
        <button class="btn btn-small" type="button" data-action="clear-list-aliases" ${aliasCount ? "" : "disabled"}>${escapeHtml(t("clearListAliases"))}</button>
      </div>`;
  });

  dom.editorSearchLabel.classList.toggle("field-label--active", locked);
  dom.editorSearchLabel.title = locked ? t("editorSearchActive", { text: state.editorSearch.trim() }) : "";
  dom.editorHint.hidden = !locked || !list.entries.length;

  let html = "";
  const visible = list.entries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entryMatches(entry, needle));
  if (!list.entries.length) {
    html = `<p class="empty-state">${escapeHtml(t("editorEmpty"))}</p>`;
  } else if (!visible.length) {
    html = `<p class="empty-state">${escapeHtml(t("editorNoMatches"))}</p>`;
  } else {
    const last = list.entries.length - 1;
    html = visible
      .map(({ entry, index }) => {
        const item = state.itemsById.get(entry.itemId);
        const id = escapeHtml(entry.itemId);
        const label = item ? item.label : entry.itemId;
        const title = item
          ? `${highlightMatch(item.label, needle)}${item.groupCount > 1 ? ` <span class="group-count">(${item.groupCount})</span>` : ""}`
          : `${escapeHtml(t("missingEntry"))} <code>${escapeHtml(entry.itemId)}</code>`;
        const path = item ? item.tags.slice(1).join(" › ") : "";
        const others = (state.membership.get(entry.itemId) || []).filter((member) => member.listId !== list.id);
        const othersText = others
          .map((member) => `${getListName(getList(member.listId))}: ${member.alias || t("noAlias")}`)
          .join(" · ");
        const disableUp = locked || index === 0 ? "disabled" : "";
        const disableDown = locked || index === last ? "disabled" : "";
        return `
          <div class="entry ${item ? "" : "is-missing"}" data-item-id="${id}" data-index="${index}">
            <div class="entry__top">
              <span class="drag-handle ${locked ? "is-disabled" : ""}" title="${escapeHtml(t("dragHandle"))}" aria-hidden="true">⠿</span>
              <span class="entry__pos">${index + 1}.</span>
              <button class="play-btn" type="button" data-action="entry-play" data-key="${escapeHtml(makeKey("ed", list.id, entry.itemId))}" aria-pressed="false" title="${escapeHtml(t("playTitle"))}">${PLAY_ICON}</button>
              <div class="entry__name">
                <span class="entry__title">${title}</span>
                ${path ? `<span class="entry__path">${escapeHtml(path)}</span>` : ""}
              </div>
            </div>
            <div class="entry__row">
              <input class="text-input alias-input" type="text" maxlength="${ALIAS_MAX_LENGTH}" value="${escapeHtml(entry.alias)}" data-original="${escapeHtml(entry.alias)}" data-focus-key="alias:${id}" placeholder="${escapeHtml(t("aliasPlaceholder"))}" aria-label="${escapeHtml(t("aliasLabel", { name: label }))}" list="aliasSuggestions" autocomplete="off">
              <div class="entry__actions">
                <button class="icon-btn" type="button" data-action="entry-top" data-focus-key="entry-top:${id}" title="${escapeHtml(t("moveTop"))}" aria-label="${escapeHtml(t("moveTop"))}" ${disableUp}>⤒</button>
                <button class="icon-btn" type="button" data-action="entry-up" data-focus-key="entry-up:${id}" title="${escapeHtml(t("moveUp"))}" aria-label="${escapeHtml(t("moveUp"))}" ${disableUp}>▲</button>
                <button class="icon-btn" type="button" data-action="entry-down" data-focus-key="entry-down:${id}" title="${escapeHtml(t("moveDown"))}" aria-label="${escapeHtml(t("moveDown"))}" ${disableDown}>▼</button>
                <button class="icon-btn" type="button" data-action="entry-bottom" data-focus-key="entry-bottom:${id}" title="${escapeHtml(t("moveBottom"))}" aria-label="${escapeHtml(t("moveBottom"))}" ${disableDown}>⤓</button>
                <button class="icon-btn icon-btn--danger" type="button" data-action="entry-remove" title="${escapeHtml(t("removeEntry"))}" aria-label="${escapeHtml(t("removeEntry"))}">✕</button>
              </div>
            </div>
            ${others.length ? `<p class="entry__others">${escapeHtml(t("onOtherLists", { lists: othersText }))}</p>` : ""}
          </div>`;
      })
      .join("");
  }
  withPreservedFocus(dom.editorEntries, () => {
    dom.editorEntries.innerHTML = html;
  });
  syncPlaybackIn(dom.editorEntries);
  if (entriesSortable) {
    entriesSortable.option("disabled", locked);
  }
};

// --- Podgląd widoku użytkownika / User view preview ---
const getPreviewListId = () => (state.previewFollow ? getEditedList().id : state.previewListId);

const renderPreview = () => {
  if (!ADMIN_MODE) {
    return;
  }
  if (state.previewCollapsed) {
    dom.previewView.innerHTML = "";
    return;
  }
  renderUserView(dom.previewView, "prev");
};

// ==========================================================================================
// --- Rysowanie: widok użytkownika (także podgląd) / Drawing: user view (also the preview) ---
// ==========================================================================================

// --- Kafelek dźwięku / Sound tile ---
// PL: Dwie strefy: przycisk odtwarzania na całą górną część kafelka (ikona, nazwa, alias, (N), tag)
//     i strefa sterowania (suwak z wartością, Loop). Przesuwanie suwaka nigdy nie uruchamia dźwięku.
// EN: Two zones: a play button covering the whole upper part of the tile (icon, name, alias, (N),
//     tag) and a control zone (slider with value, Loop). Moving the slider never starts a sound.
const renderTile = (context, listId, entry) => {
  const item = state.itemsById.get(entry.itemId);
  const key = escapeHtml(makeKey(context, listId, entry.itemId));
  const itemId = escapeHtml(entry.itemId);
  if (!item) {
    const name = entry.alias || entry.itemId;
    return `
      <article class="tile" data-key="${key}" data-item-id="${itemId}" data-state="missing">
        <button class="tile-play" type="button" data-action="uv-play" title="${escapeHtml(name)}" aria-label="${escapeHtml(t("tileUnlockLabel", { name }))}">
          <span class="tile-icon" aria-hidden="true">${LOCK_ICON}</span>
          <span class="tile-title">${escapeHtml(name)}</span>
          <span class="tile-status">${escapeHtml(t("missingEntry"))}</span>
        </button>
      </article>`;
  }
  const titleText = buildTitleText(item.label, entry.alias, item.groupCount);
  const value = getVolumeValue(makeKey(context, listId, entry.itemId));
  const percent = volumeToPercent(value);
  return `
    <article class="tile" data-key="${key}" data-item-id="${itemId}" data-state="idle">
      <button class="tile-play" type="button" data-action="uv-play" aria-pressed="false" title="${escapeHtml(titleText)}" aria-label="${escapeHtml(t("tilePlayLabel", { name: titleText }))}">
        <span class="tile-icon" aria-hidden="true">${PLAY_ICON}</span>
        <span class="tile-title">${buildTitleHtml(item.label, entry.alias, item.groupCount)}</span>
        ${item.tag2 ? `<span class="tile-tag">${escapeHtml(item.tag2)}</span>` : ""}
        <span class="tile-status">${escapeHtml(t("tileLoading"))}</span>
      </button>
      <div class="tile-progress" aria-hidden="true"><span></span></div>
      <div class="tile-controls">
        <input class="volume-slider" type="range" min="-100" max="100" step="1" value="${value}" data-action="uv-volume" aria-label="${escapeHtml(t("volumeLabel", { name: titleText }))}" aria-valuetext="${percent}%">
        <button class="tile-volume" type="button" data-action="uv-volume-reset" title="${escapeHtml(t("volumeResetTitle"))}">${percent}%</button>
        <button class="btn loop-btn" type="button" data-action="uv-loop" aria-pressed="false" aria-label="${escapeHtml(t("loopLabel", { name: titleText }))}">⟳ ${escapeHtml(t("buttonLoop"))}</button>
      </div>
    </article>`;
};

// --- Cały widok użytkownika: pasek z zakładkami i siatka kafelków / The whole user view: tab bar and tile grid ---
// PL: Ta sama funkcja rysuje prawdziwy widok (context = "user") i podgląd w panelu admina
//     (context = "prev"), więc oba wyglądają identycznie.
// EN: The same function draws the real view (context = "user") and the admin panel preview
//     (context = "prev"), so both look identical.
const renderUserView = (root, context) => {
  if (!root) {
    return;
  }
  const lists = getLists();
  const requestedId = context === "prev" ? getPreviewListId() : state.userListId;
  const active = getList(requestedId) || lists[0];
  if (context === "user") {
    state.userListId = active.id;
  }
  const previousTabs = root.querySelector(".uv-tabs");
  const previousScroll = previousTabs ? previousTabs.scrollLeft : 0;

  const tabs = lists
    .map((list) => {
      const selected = list.id === active.id;
      return `<button class="uv-tab ${selected ? "is-active" : ""}" type="button" role="tab" aria-selected="${selected}" data-action="uv-select" data-list-id="${escapeHtml(list.id)}">${escapeHtml(getListName(list))}</button>`;
    })
    .join("");
  const unlock = context === "user" && !state.libraryUnlocked
    ? `<button class="btn unlock-btn" type="button" data-action="uv-unlock" title="${escapeHtml(t("unlockLibrary"))}" aria-label="${escapeHtml(t("unlockLibrary"))}"><span aria-hidden="true">${LOCK_ICON}</span><span class="unlock-btn__label">${escapeHtml(t("unlockLibrary"))}</span></button>`
    : "";
  const body = active.entries.length
    ? `<div class="uv-grid">${active.entries.map((entry) => renderTile(context, active.id, entry)).join("")}</div>`
    : `<p class="uv-empty">${escapeHtml(t("uvEmptyList"))}</p>`;

  root.innerHTML = `
    <div class="uv" data-ctx="${context}">
      <div class="uv-bar">
        <span class="uv-brand">${escapeHtml(t("uvBrand"))}</span>
        <div class="uv-tabs" role="tablist" aria-label="${escapeHtml(t("uvTabsLabel"))}">${tabs}</div>
        <div class="uv-actions">
          <button class="btn stop-all" type="button" data-action="uv-stop-all" title="${escapeHtml(t("stopAll"))}" disabled><span aria-hidden="true">■</span><span class="stop-all__label">${escapeHtml(t("stopAll"))}</span><span class="stop-all__count">(0)</span></button>
          ${unlock}
        </div>
      </div>
      ${body}
    </div>`;

  // PL: Przewijamy pasek zakładek tylko w poziomie, żeby aktywna zakładka była widoczna — bez
  //     przewijania całej strony (ważne w podglądzie na dole panelu admina).
  // EN: Only the tab bar scrolls horizontally so the active tab is visible — the whole page never
  //     scrolls (important for the preview at the bottom of the admin panel).
  const tabsElement = root.querySelector(".uv-tabs");
  const activeTab = root.querySelector(".uv-tab.is-active");
  if (tabsElement) {
    tabsElement.scrollLeft = previousScroll;
    if (activeTab) {
      const left = activeTab.offsetLeft - tabsElement.offsetLeft;
      const right = left + activeTab.offsetWidth;
      if (left < tabsElement.scrollLeft || right > tabsElement.scrollLeft + tabsElement.clientWidth) {
        tabsElement.scrollLeft = Math.max(0, left - 8);
      }
    }
  }
  syncPlaybackIn(root);
};

// --- Wybór listy w widoku użytkownika albo w podglądzie / Choosing a list in the user view or the preview ---
const selectViewList = (context, listId) => {
  if (!getList(listId)) {
    return;
  }
  if (context === "user") {
    state.userListId = listId;
    renderUserView(dom.userView, "user");
    updatePlaybackIndicators();
    return;
  }
  if (state.previewFollow) {
    setEditedList(listId);
    return;
  }
  state.previewListId = listId;
  renderPreview();
  updatePlaybackIndicators();
};

// ==========================================================================================
// --- Działania w panelu admina / Admin panel actions ---
// ==========================================================================================

// --- Zmiana listy edytowanej (a więc i docelowej) / Changing the edited (and therefore target) list ---
const setEditedList = (listId) => {
  if (!getList(listId)) {
    return;
  }
  const changed = state.editedListId !== listId;
  state.editedListId = listId;
  // PL: Świadomy wybór listy kończy czekanie na listę z poprzedniej wizyty.
  // EN: A deliberate list choice ends the wait for the list from the previous visit.
  state.restoredEditedListId = null;
  if (changed) {
    state.renamingListId = null;
    state.editorSearch = "";
    dom.editorSearch.value = "";
  }
  saveAdminUi();
  renderTargetSelect();
  renderCatalog();
  renderLists();
  renderEditor();
  renderPreview();
  updatePlaybackIndicators();
};

// --- Zmiana nazwy listy w miejscu / Renaming a list in place ---
const startRename = (listId) => {
  if (!getList(listId)) {
    return;
  }
  state.renamingListId = listId;
  renderEditor();
  const input = dom.editorHead.querySelector(".rename-input");
  if (input) {
    input.focus();
    input.select();
  }
};

// PL: Pusta nazwa listy ulubionych przywraca poprzednią; pusta nazwa listy głównej oznacza
//     nazwę domyślną w bieżącym języku.
// EN: An empty favourites list name restores the previous one; an empty main list name means the
//     default name in the current language.
const commitRename = () => {
  const listId = state.renamingListId;
  if (!listId) {
    return;
  }
  const input = dom.editorHead.querySelector(".rename-input");
  const value = clampText(input ? input.value : "", LIST_NAME_MAX_LENGTH);
  state.renamingListId = null;
  const list = getList(listId);
  if (!list || (list.kind === "list" && !value) || value === list.name) {
    renderEditor();
    return;
  }
  list.name = value;
  persistAndRender();
};

const cancelRename = () => {
  state.renamingListId = null;
  renderEditor();
};

// --- Usunięcie listy z potwierdzeniem / Deleting a list with confirmation ---
const deleteList = (listId) => {
  const list = getList(listId);
  if (!list || list.kind === "main") {
    return;
  }
  const aliases = list.entries.filter((entry) => entry.alias).length;
  if (!confirm(t("confirmDeleteList", { name: getListName(list), count: list.entries.length, aliases }))) {
    return;
  }
  state.settings.playlists = state.settings.playlists.filter((candidate) => candidate.id !== listId);
  state.editedListId = MAIN_LIST_ID;
  state.restoredEditedListId = null;
  saveAdminUi();
  persistAndRender();
};

// --- Dodanie albo usunięcie dźwięku z listy docelowej / Adding or removing a sound on the target list ---
const toggleInTarget = (itemId) => {
  const list = getEditedList();
  const entry = list.entries.find((candidate) => candidate.itemId === itemId);
  if (entry) {
    const item = state.itemsById.get(itemId);
    if (entry.alias && !confirm(t("confirmRemoveWithAlias", { name: item?.label || itemId, list: getListName(list), alias: entry.alias }))) {
      return;
    }
    removeEntry(list.id, itemId);
  } else {
    addEntries(list.id, [itemId]);
  }
  persistAndRender();
};

// --- Zaznaczanie wierszy katalogu, także zakresem z Shift / Selecting catalogue rows, also as a Shift range ---
const handleCatalogSelection = (itemId, index, checked, useRange) => {
  if (useRange && state.lastSelectedIndex >= 0) {
    const from = Math.min(state.lastSelectedIndex, index);
    const to = Math.max(state.lastSelectedIndex, index);
    state.catalogResults.slice(from, to + 1).forEach((item) => {
      if (checked) {
        state.selectedItemIds.add(item.id);
      } else {
        state.selectedItemIds.delete(item.id);
      }
    });
  } else if (checked) {
    state.selectedItemIds.add(itemId);
  } else {
    state.selectedItemIds.delete(itemId);
  }
  state.lastSelectedIndex = index;
  renderCatalog();
};

// --- Eksport ustawień do pliku JSON (D10) / Exporting settings to a JSON file (D10) ---
// PL: Plik zawiera listy, kolejność i aliasy — bez tokenu sesji i bez żadnych sekretów.
// EN: The file holds lists, order and aliases — without the session token or any secrets.
const exportSettings = () => {
  const date = new Date().toISOString().slice(0, 10);
  downloadJsonFile(`${t("exportFileName")}-${date}.json`, { ...serializeSettings(), exportedAt: new Date().toISOString() }, true);
};

// --- Menu „Narzędzia” / "Tools" menu ---
const setToolsMenu = (open) => {
  state.toolsMenuOpen = open;
  dom.toolsMenuList.hidden = !open;
  dom.toolsMenuButton.setAttribute("aria-expanded", String(open));
};

// --- Szuflada folderów / Folder drawer ---
const setFoldersDrawer = (open) => {
  state.foldersOpen = open;
  renderLayoutState();
  if (open) {
    dom.treeSearch.focus();
  }
};

// --- Biblioteka przeciągania (D7) / Drag library (D7) ---
// PL: Ładowana na żądanie, tak jak JSZip. Gdy się nie wczyta, zostają strzałki — panel działa dalej.
// EN: Loaded on demand, just like JSZip. When it fails to load the arrows remain — the panel keeps working.
let sortablePromise = null;
let listsSortable = null;
let entriesSortable = null;

const ensureSortable = () => {
  if (window.Sortable) {
    return Promise.resolve(window.Sortable);
  }
  if (sortablePromise) {
    return sortablePromise;
  }
  sortablePromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SORTABLE_URL;
    script.onload = () => (window.Sortable ? resolve(window.Sortable) : reject(new Error("sortable_missing")));
    script.onerror = () => reject(new Error("sortable_missing"));
    document.head.appendChild(script);
  }).catch((error) => {
    sortablePromise = null;
    throw error;
  });
  return sortablePromise;
};

const initSortables = () => {
  ensureSortable()
    .then((Sortable) => {
      if (!listsSortable) {
        listsSortable = Sortable.create(dom.listsList, {
          handle: ".drag-handle",
          draggable: ".list-row",
          animation: 150,
          // PL: Nic nie może stanąć przed listą główną. / EN: Nothing may land before the main list.
          onMove: (event) => !(event.related?.classList.contains("is-main") && !event.willInsertAfter),
          onEnd: (event) => {
            const listId = event.item?.dataset.listId;
            if (!listId || event.oldIndex === event.newIndex) {
              return;
            }
            if (moveListTo(listId, event.newIndex)) {
              persistAndRender();
            } else {
              renderLists();
            }
          }
        });
      }
      if (!entriesSortable) {
        entriesSortable = Sortable.create(dom.editorEntries, {
          handle: ".drag-handle",
          draggable: ".entry",
          animation: 150,
          disabled: Boolean(toNeedle(state.editorSearch)),
          onEnd: (event) => {
            if (event.oldIndex === event.newIndex) {
              return;
            }
            if (moveEntry(getEditedList().id, event.oldIndex, event.newIndex)) {
              persistAndRender();
            } else {
              renderEditor();
            }
          }
        });
      }
    })
    .catch((error) => {
      console.warn("[Audio] Przeciąganie niedostępne, zostają strzałki / Dragging unavailable, arrows remain:", error);
    });
};

// ==========================================================================================
// --- Generator manifestów z pliku XLSX / Manifest builder from an XLSX file ---
// ==========================================================================================
// PL: Przebieg jest taki sam jak w module DataVault: przycisk w panelu admina otwiera systemowe
//     okno wyboru pliku, a przeglądarka zapisuje gotowe pliki JSON w katalogu pobierania. Nic nie
//     jest wysyłane na żaden serwer. Generator używa tych samych funkcji slugify /
//     getGroupingBaseLabel / extractTags / normalizeUrl co reszta modułu, więc identyfikatory
//     nie mogą się rozjechać z zapisanymi listami.
// EN: The flow mirrors the DataVault module: a button in the admin panel opens the system file
//     picker and the browser saves the finished JSON files into the downloads folder. Nothing is
//     uploaded anywhere. The builder reuses the same slugify / getGroupingBaseLabel / extractTags /
//     normalizeUrl functions as the rest of the module, so ids cannot drift from saved lists.

// Kolumny wymagane w arkuszu / Columns required in the sheet
const BUILDER_REQUIRED_COLUMNS = ["NazwaSampla", "NazwaPliku", "LinkDoFolderu"];
// Fragment adresu rozpoznający warstwę publiczną / URL fragment identifying the public tier
const BUILDER_PUBLIC_PREFIX = "/AudioExample/";
// Fragment adresu rozpoznający warstwę chronioną / URL fragment identifying the protected tier
const BUILDER_PROTECTED_PREFIX = "/AudioRPG/";
// Adres biblioteki do rozpakowania XLSX; ten sam, którego używa DataVault
// XLSX unzip library address; the same one DataVault uses
const BUILDER_JSZIP_URL = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
const XLSX_MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const XLSX_REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

// --- Doładowanie biblioteki JSZip na żądanie / Loading JSZip on demand ---
// PL: Biblioteka jest potrzebna tylko przy budowaniu manifestów, więc nie ładuje się w widoku użytkownika.
// EN: The library is needed only when building manifests, so it never loads in the user view.
let jsZipPromise = null;
const ensureJSZip = () => {
  if (window.JSZip) {
    return Promise.resolve(window.JSZip);
  }
  if (jsZipPromise) {
    return jsZipPromise;
  }
  jsZipPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = BUILDER_JSZIP_URL;
    script.onload = () => {
      if (window.JSZip) {
        resolve(window.JSZip);
      } else {
        reject(new Error("builder_library"));
      }
    };
    script.onerror = () => reject(new Error("builder_library"));
    document.head.appendChild(script);
  }).catch((error) => {
    // Nieudana próba nie może zablokować kolejnych / A failed attempt must not block later ones
    jsZipPromise = null;
    throw error;
  });
  return jsZipPromise;
};

// --- Wybór lokalnego pliku XLSX / Selecting a local XLSX file ---
const pickLocalWorkbookFile = () =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";
    input.style.display = "none";
    input.addEventListener(
      "change",
      async () => {
        const file = input.files && input.files[0];
        input.remove();
        if (!file) {
          resolve(null);
          return;
        }
        resolve({ name: file.name, buffer: await file.arrayBuffer() });
      },
      { once: true }
    );
    // PL: Zamknięcie okna krzyżykiem nie wywołuje change w starszych przeglądarkach — nasłuchujemy też cancel.
    // EN: Closing the dialog with the X does not fire change in older browsers — we also listen for cancel.
    input.addEventListener(
      "cancel",
      () => {
        input.remove();
        resolve(null);
      },
      { once: true }
    );
    document.body.appendChild(input);
    input.click();
  });

// --- Minimalny czytnik XLSX / Minimal XLSX reader ---
// PL: Czytamy wyłącznie nagłówek i wartości tekstowe; formatowanie i formuły są nieistotne.
// EN: We read only the header row and text values; formatting and formulas are irrelevant.
const columnRefToIndex = (ref) => {
  let index = 0;
  for (const character of ref) {
    if (!/[A-Za-z]/.test(character)) {
      break;
    }
    index = index * 26 + (character.toUpperCase().charCodeAt(0) - 64);
  }
  return index - 1;
};

const readXlsxSheet = async (arrayBuffer) => {
  const JSZipLib = await ensureJSZip();
  let zip = null;
  try {
    zip = await JSZipLib.loadAsync(arrayBuffer);
  } catch (error) {
    throw new Error("builder_read");
  }
  const parseXml = (text) => new DOMParser().parseFromString(text, "application/xml");
  const nodes = (root, tag) => Array.from(root.getElementsByTagNameNS(XLSX_MAIN_NS, tag));

  // Tabela wspólnych tekstów: w XLSX komórki tekstowe trzymają tylko indeks do tej tabeli.
  // Shared string table: text cells in XLSX store only an index into this table.
  const sharedStrings = [];
  const sharedFile = zip.file("xl/sharedStrings.xml");
  if (sharedFile) {
    const sharedXml = parseXml(await sharedFile.async("string"));
    for (const si of nodes(sharedXml, "si")) {
      sharedStrings.push(nodes(si, "t").map((node) => node.textContent || "").join(""));
    }
  }

  const workbookFile = zip.file("xl/workbook.xml");
  const relsFile = zip.file("xl/_rels/workbook.xml.rels");
  if (!workbookFile || !relsFile) {
    throw new Error("builder_read");
  }
  const workbookXml = parseXml(await workbookFile.async("string"));
  const relsXml = parseXml(await relsFile.async("string"));

  const relationById = new Map();
  for (const relation of Array.from(relsXml.getElementsByTagName("Relationship"))) {
    relationById.set(relation.getAttribute("Id"), relation.getAttribute("Target"));
  }

  // Bierzemy pierwszy arkusz skoroszytu / We take the workbook's first sheet
  const sheetNode = nodes(workbookXml, "sheet")[0];
  if (!sheetNode) {
    throw new Error("builder_no_sheet");
  }
  const relationId =
    sheetNode.getAttributeNS(XLSX_REL_NS, "id") || sheetNode.getAttribute("r:id");
  const target = relationById.get(relationId);
  const sheetFile = target
    ? zip.file(target.startsWith("/") ? target.slice(1) : `xl/${target.replace(/^\.\//, "")}`)
    : null;
  if (!sheetFile) {
    throw new Error("builder_no_sheet");
  }

  const sheetXml = parseXml(await sheetFile.async("string"));
  const rows = [];
  let widestRow = 0;
  for (const rowNode of nodes(sheetXml, "row")) {
    const cells = new Map();
    for (const cellNode of nodes(rowNode, "c")) {
      const reference = cellNode.getAttribute("r") || "";
      const match = reference.match(/^([A-Za-z]+)/);
      const columnIndex = match ? columnRefToIndex(match[1]) : cells.size;
      const cellType = cellNode.getAttribute("t");
      let value = "";
      if (cellType === "inlineStr") {
        value = nodes(cellNode, "t").map((node) => node.textContent || "").join("");
      } else {
        const valueNode = nodes(cellNode, "v")[0];
        const raw = valueNode ? valueNode.textContent || "" : "";
        if (cellType === "s") {
          const index = Number(raw);
          value = Number.isNaN(index) ? "" : sharedStrings[index] || "";
        } else {
          value = raw;
        }
      }
      cells.set(columnIndex, value);
      widestRow = Math.max(widestRow, columnIndex + 1);
    }
    rows.push(cells);
  }

  const asArray = (cells) =>
    Array.from({ length: widestRow }, (_, index) => String(cells.get(index) ?? "").trim());
  const header = rows.length ? asArray(rows[0]) : [];
  return { header, rows: rows.slice(1).map(asArray) };
};

// --- Sprawdzenie nagłówka arkusza / Validating the sheet header ---
// PL: Brak wymaganej kolumny to błąd, powtórzona wymagana kolumna to błąd, nadmiarowe są pomijane.
// EN: A missing required column is an error, a repeated one is an error, extra columns are ignored.
const resolveRequiredColumns = (header) => {
  const missing = [];
  const duplicated = [];
  const indexByColumn = new Map();
  BUILDER_REQUIRED_COLUMNS.forEach((column) => {
    const positions = [];
    header.forEach((cell, index) => {
      if (cell === column) {
        positions.push(index);
      }
    });
    if (!positions.length) {
      missing.push(column);
      return;
    }
    if (positions.length > 1) {
      duplicated.push(column);
      return;
    }
    indexByColumn.set(column, positions[0]);
  });
  if (missing.length) {
    const error = new Error("builder_missing_columns");
    error.columns = missing;
    throw error;
  }
  if (duplicated.length) {
    const error = new Error("builder_duplicate_columns");
    error.columns = duplicated;
    throw error;
  }
  return indexByColumn;
};

// --- Ścieżka w repozytorium prywatnym / Path inside the private repository ---
// Z pełnego adresu https://host/AudioRPG/PrivateFolder/... zostaje PrivateFolder/...
// A full https://host/AudioRPG/PrivateFolder/... URL becomes PrivateFolder/...
const toProtectedRepoPath = (folderUrl, filename) => {
  const full = normalizeUrl(folderUrl, filename);
  const index = full.indexOf(BUILDER_PROTECTED_PREFIX);
  if (index === -1) {
    return "";
  }
  try {
    return decodeURIComponent(full.slice(index + BUILDER_PROTECTED_PREFIX.length));
  } catch (error) {
    return full.slice(index + BUILDER_PROTECTED_PREFIX.length);
  }
};

// --- Złożenie wierszy w pozycje manifestu / Folding rows into manifest items ---
// PL: Dźwięki różniące się wyłącznie numerem na końcu nazwy (w tym samym folderze) tworzą jedną
//     pozycję z wieloma wariantami. Przy kolizji identyfikatora dopisywany jest numer wiersza.
// EN: Sounds differing only by a trailing number (in the same folder) become one item with several
//     variants. On an id collision the row number is appended.
const buildManifestItems = (rows) => {
  const entries = [];
  const groupedCounts = new Map();

  rows.forEach((row, index) => {
    const label = String(row.label || "").trim();
    if (!label) {
      return;
    }
    const filename = String(row.filename || "").trim();
    const folderUrl = String(row.folderUrl || "").trim();
    const grouping = getGroupingBaseLabel(label);
    const baseLabel = grouping.baseLabel || label;
    entries.push({
      label,
      baseLabel,
      isGroupCandidate: grouping.changed,
      filename,
      folderUrl,
      fullUrl: normalizeUrl(folderUrl, filename),
      repoPath: toProtectedRepoPath(folderUrl, filename),
      rowIndex: index + 1
    });
    if (grouping.changed) {
      const key = `${folderUrl}||${baseLabel}`;
      groupedCounts.set(key, (groupedCounts.get(key) || 0) + 1);
    }
  });

  const groupMap = new Map();
  const usedIds = new Set();

  entries.forEach((entry) => {
    const groupKeyBase = `${entry.folderUrl}||${entry.baseLabel}`;
    const groupSize = groupedCounts.get(groupKeyBase) || 0;
    const shouldGroup = entry.isGroupCandidate && groupSize > 1;
    const groupKey = shouldGroup
      ? groupKeyBase
      : `${entry.folderUrl}||${entry.label}||${entry.filename}||${entry.rowIndex}`;

    if (!groupMap.has(groupKey)) {
      const tags = extractTags(entry.folderUrl);
      let id = slugify(shouldGroup ? entry.baseLabel : entry.label, entry.rowIndex);
      if (usedIds.has(id)) {
        id = `${id}-${entry.rowIndex}`;
      }
      usedIds.add(id);
      groupMap.set(groupKey, {
        id,
        label: shouldGroup ? entry.baseLabel : entry.label,
        groupCount: shouldGroup ? groupSize : 0,
        filename: entry.filename,
        access: entry.folderUrl.includes(BUILDER_PUBLIC_PREFIX) ? "public" : "protected",
        tags,
        tag2: tags[1] || "",
        tagPaths: tags.map((_, index) => tags.slice(0, index + 1).join(" / ")),
        variants: []
      });
    }

    groupMap.get(groupKey).variants.push({
      filename: entry.filename,
      fullUrl: entry.fullUrl,
      path: entry.repoPath
    });
  });

  return Array.from(groupMap.values()).map((item) => {
    if (item.variants.length > 1) {
      const first = item.variants[0]?.filename || "";
      item.filename = `${first} (+${item.variants.length - 1})`;
    }
    return item;
  });
};

// --- Zapis pliku JSON na dysku / Saving a JSON file to disk ---
// PL: Używany przez generator manifestów i przez eksport ustawień.
// EN: Used by the manifest builder and by the settings export.
const downloadJsonFile = (filename, payload, pretty) => {
  const text = pretty ? JSON.stringify(payload, null, 2) : JSON.stringify(payload);
  const blob = new Blob([`${text}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const setBuilderState = (status, extra = {}) => {
  state.builder = { status, publicCount: 0, protectedCount: 0, message: "", ...extra };
  renderStatus();
};

// --- Obsługa przycisku „Zbuduj manifesty z XLSX” / "Build manifests from XLSX" button ---
const handleBuildManifests = async () => {
  const selection = await pickLocalWorkbookFile();
  if (!selection) {
    // Rezygnacja z wyboru pliku nie jest błędem / Cancelling the file picker is not an error
    return;
  }
  setBuilderState("working");
  try {
    const sheet = await readXlsxSheet(selection.buffer);
    const columnIndex = resolveRequiredColumns(sheet.header);
    const labelColumn = columnIndex.get("NazwaSampla");
    const filenameColumn = columnIndex.get("NazwaPliku");
    const folderColumn = columnIndex.get("LinkDoFolderu");

    // Kolumny spoza listy wymaganych są pomijane / Columns outside the required list are ignored
    const rows = sheet.rows
      .map((cells) => ({
        label: cells[labelColumn] || "",
        filename: cells[filenameColumn] || "",
        folderUrl: cells[folderColumn] || ""
      }))
      .filter((row) => row.label || row.filename || row.folderUrl);

    if (!rows.length) {
      throw new Error("builder_no_rows");
    }

    // Kolejność sortowania musi odpowiadać modułowi / The sort order must match the module
    const items = buildManifestItems(rows).sort((a, b) => a.label.localeCompare(b.label));

    const publicItems = items
      .filter((item) => item.access === "public")
      .map(({ id, label, groupCount, filename, tags, tag2, tagPaths, variants }) => ({
        id,
        label,
        groupCount,
        filename,
        access: "public",
        tags,
        tag2,
        tagPaths,
        variants: variants.map((variant) => ({
          filename: variant.filename,
          url: variant.fullUrl
        }))
      }));

    const protectedItems = items
      .filter((item) => item.access === "protected")
      .map(({ id, label, groupCount, filename, tags, tag2, tagPaths, variants }) => ({
        id,
        label,
        groupCount,
        filename,
        access: "protected",
        tags,
        tag2,
        tagPaths,
        variants: variants.map((variant) => ({
          filename: variant.filename,
          path: variant.path
        }))
      }));

    // PL: Wariant chroniony bez ścieżki byłby dźwiękiem nie do odtworzenia — zatrzymujemy się tutaj.
    // EN: A protected variant without a path would be an unplayable sound — we stop here.
    const withoutPath = protectedItems.reduce(
      (total, item) => total + item.variants.filter((variant) => !variant.path).length,
      0
    );
    if (withoutPath) {
      const error = new Error("builder_no_paths");
      error.count = withoutPath;
      throw error;
    }

    downloadJsonFile(
      PUBLIC_MANIFEST_URL,
      { version: 1, access: "public", items: publicItems },
      true
    );
    // Krótka przerwa: część przeglądarek pomija drugie pobranie uruchomione w tej samej chwili.
    // A short pause: some browsers drop a second download started in the same instant.
    window.setTimeout(() => {
      downloadJsonFile(
        PROTECTED_MANIFEST_FILENAME,
        { version: 1, access: "protected", items: protectedItems },
        false
      );
    }, 150);

    setBuilderState("ready", {
      publicCount: publicItems.length,
      protectedCount: protectedItems.length
    });
    alert(
      t("builderDone", {
        publicCount: publicItems.length,
        protectedCount: protectedItems.length,
        publicFile: PUBLIC_MANIFEST_URL,
        protectedFile: PROTECTED_MANIFEST_FILENAME
      })
    );
  } catch (error) {
    console.error(error);
    let message = t("builderErrorRead");
    if (error?.message === "builder_library") {
      message = t("builderErrorLibrary");
    } else if (error?.message === "builder_no_sheet") {
      message = t("builderErrorNoSheet");
    } else if (error?.message === "builder_missing_columns") {
      message = t("builderErrorMissingColumns", { columns: (error.columns || []).join(", ") });
    } else if (error?.message === "builder_duplicate_columns") {
      message = t("builderErrorDuplicateColumns", { columns: (error.columns || []).join(", ") });
    } else if (error?.message === "builder_no_rows") {
      message = t("builderErrorNoRows");
    } else if (error?.message === "builder_no_paths") {
      message = t("builderErrorNoPaths", { count: error.count || 0 });
    }
    setBuilderState("error", { message });
    alert(message);
  }
};

// ==========================================================================================
// --- Języki / Languages ---
// ==========================================================================================

// --- Zmiana języka: teksty statyczne z atrybutów data-i18n i przerysowanie reszty / Language change: static texts from data-i18n attributes and a redraw of the rest ---
const applyLanguage = (language) => {
  currentLanguage = translations[language] ? language : "pl";
  document.documentElement.lang = currentLanguage;
  dom.languageSelect.value = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => {
    element.title = t(element.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  // PL: Wspólny pasek ma własne teksty, więc przepisuje się sam — razem z bieżącym komunikatem.
  // EN: The shared bar keeps its own texts, so it rewrites itself — together with the current message.
  writeStatus.setLanguage(currentLanguage);
  renderAll();
};

// ==========================================================================================
// --- Obsługa zdarzeń / Event handling ---
// ==========================================================================================

// --- Widok użytkownika i podgląd: jedna obsługa dla obu / User view and preview: one handler for both ---
const bindUserViewEvents = (root, context) => {
  if (!root) {
    return;
  }
  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target || !root.contains(target)) {
      return;
    }
    const action = target.dataset.action;
    if (action === "uv-select") {
      selectViewList(context, target.dataset.listId);
      return;
    }
    if (action === "uv-stop-all") {
      stopAllPlayback();
      return;
    }
    if (action === "uv-unlock") {
      handleUnlockClick();
      return;
    }
    const tile = target.closest(".tile");
    if (!tile) {
      return;
    }
    if (action === "uv-play") {
      togglePlayback(tile.dataset.key, tile.dataset.itemId);
    } else if (action === "uv-loop") {
      toggleLoop(tile.dataset.key, tile.dataset.itemId);
    } else if (action === "uv-volume-reset") {
      handleVolumeValueClick(tile.dataset.key);
    }
  });
  root.addEventListener("input", (event) => {
    const slider = event.target.closest('input[data-action="uv-volume"]');
    const tile = slider?.closest(".tile");
    if (tile) {
      setVolume(tile.dataset.key, slider.value);
    }
  });
};

// --- Zdarzenia panelu admina / Admin panel events ---
const bindAdminEvents = () => {
  // Menu „Narzędzia” / "Tools" menu
  dom.toolsMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setToolsMenu(!state.toolsMenuOpen);
  });
  dom.toolsMenuList.addEventListener("click", () => setToolsMenu(false));
  document.addEventListener("click", (event) => {
    if (state.toolsMenuOpen && !event.target.closest("#toolsMenu")) {
      setToolsMenu(false);
    }
  });
  dom.reloadManifest.addEventListener("click", () => {
    loadManifests().catch((error) => {
      alert(error.message);
      dom.manifestStatus.textContent = t("manifestError");
    });
  });
  dom.buildManifests.addEventListener("click", () => {
    handleBuildManifests().catch((error) => console.error(error));
  });
  dom.exportSettings.addEventListener("click", exportSettings);
  dom.reloadLocal.addEventListener("click", () => {
    loadSettingsLocal();
    renderAll();
  });
  dom.clearAllAliases.addEventListener("click", () => {
    if (!confirm(t("confirmClearAllAliases"))) {
      return;
    }
    getLists().forEach((list) => list.entries.forEach((entry) => {
      entry.alias = "";
    }));
    persistAndRender();
  });
  dom.unlockLibrary.addEventListener("click", () => handleUnlockClick());

  // Komunikaty / Notices
  dom.adminNotices.addEventListener("click", (event) => {
    const button = event.target.closest('[data-action="notice-close"]');
    const notice = button?.closest(".notice");
    if (!notice) {
      return;
    }
    if (notice.dataset.notice === "legacy") {
      state.legacyNoticeDismissed = true;
    } else {
      state.archiveNoticeDismissed = true;
    }
    renderNotices();
  });

  // Zakładki na węższych ekranach / Tabs on narrower screens
  dom.adminTabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".admin-tab");
    if (!tab) {
      return;
    }
    state.adminTab = tab.dataset.tab;
    saveAdminUi();
    renderLayoutState();
  });

  // Panel folderów / Folder panel
  dom.foldersCollapse.addEventListener("click", () => {
    state.foldersCollapsed = true;
    saveAdminUi();
    renderLayoutState();
  });
  dom.foldersExpand.addEventListener("click", () => {
    state.foldersCollapsed = false;
    saveAdminUi();
    renderLayoutState();
  });
  dom.openFolders.addEventListener("click", () => setFoldersDrawer(true));
  dom.foldersClose.addEventListener("click", () => setFoldersDrawer(false));
  dom.drawerBackdrop.addEventListener("click", () => setFoldersDrawer(false));

  dom.treeSearch.addEventListener("input", debounce(() => {
    state.treeSearch = dom.treeSearch.value;
    saveAdminFilters();
    renderTree();
  }, SEARCH_DEBOUNCE_MS));
  dom.treeSelectAll.addEventListener("click", () => {
    state.excludedPaths = new Set();
    onFolderFilterChanged();
  });
  dom.treeClearAll.addEventListener("click", () => {
    excludeAllFolders();
    onFolderFilterChanged();
  });
  dom.treeExpandAll.addEventListener("click", () => {
    state.expandedPaths = new Set();
    state.folderTree.index.forEach((node) => {
      if (node.children.length) {
        state.expandedPaths.add(node.path);
      }
    });
    saveAdminUi();
    renderTree();
  });
  dom.treeCollapseAll.addEventListener("click", () => {
    state.expandedPaths = new Set();
    saveAdminUi();
    renderTree();
  });
  const applyToMatches = (mode) => {
    const search = getTreeSearch();
    if (!search) {
      return;
    }
    if (mode === "only") {
      excludeAllFolders();
    }
    search.matches.forEach((node) => setSubtreeIncluded(node, mode !== "clear"));
    onFolderFilterChanged();
  };
  dom.treeSelectMatches.addEventListener("click", () => applyToMatches("select"));
  dom.treeClearMatches.addEventListener("click", () => applyToMatches("clear"));
  dom.treeOnlyMatches.addEventListener("click", () => applyToMatches("only"));
  dom.folderTree.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    const row = target?.closest(".tree-row");
    const node = row ? state.folderTree.index.get(row.dataset.path) : null;
    if (!node) {
      return;
    }
    if (target.dataset.action === "tree-toggle") {
      if (state.expandedPaths.has(node.path)) {
        state.expandedPaths.delete(node.path);
      } else {
        state.expandedPaths.add(node.path);
      }
      saveAdminUi();
      renderTree();
    } else if (target.dataset.action === "tree-only") {
      excludeAllFolders();
      setSubtreeIncluded(node, true);
      onFolderFilterChanged();
    }
  });
  dom.folderTree.addEventListener("change", (event) => {
    const checkbox = event.target.closest('input[data-action="tree-check"]');
    const row = checkbox?.closest(".tree-row");
    const node = row ? state.folderTree.index.get(row.dataset.path) : null;
    if (!node) {
      return;
    }
    // PL: Stan „all” wyłącza całe poddrzewo, każdy inny (także mieszany) — włącza je w całości.
    // EN: The "all" state turns the whole subtree off, any other (mixed included) turns it fully on.
    setSubtreeIncluded(node, checkbox.dataset.state !== "all");
    onFolderFilterChanged();
  });

  // Katalog / Catalogue
  dom.targetList.addEventListener("change", () => setEditedList(dom.targetList.value));
  dom.catalogSearch.addEventListener("input", debounce(() => {
    state.catalogSearch = dom.catalogSearch.value;
    state.catalogLimit = CATALOG_PAGE_SIZE;
    saveAdminFilters();
    renderCatalog();
  }, SEARCH_DEBOUNCE_MS));
  dom.catalogScope.addEventListener("change", () => {
    state.catalogScope = dom.catalogScope.value;
    state.catalogLimit = CATALOG_PAGE_SIZE;
    saveAdminFilters();
    renderCatalog();
  });
  dom.catalogTier.addEventListener("change", () => {
    state.catalogTier = dom.catalogTier.value;
    state.catalogLimit = CATALOG_PAGE_SIZE;
    saveAdminFilters();
    renderCatalog();
  });
  dom.catalogMore.addEventListener("click", () => {
    state.catalogLimit += CATALOG_PAGE_SIZE;
    renderCatalog();
  });
  dom.selectAllResults.addEventListener("click", () => {
    const results = state.catalogResults;
    if (!results.length) {
      return;
    }
    if (results.length > SELECT_ALL_CONFIRM_THRESHOLD && !confirm(t("confirmSelectAll", { count: results.length }))) {
      return;
    }
    results.forEach((item) => state.selectedItemIds.add(item.id));
    renderCatalog();
  });
  dom.bulkAdd.addEventListener("click", () => {
    const ids = state.items.filter((item) => state.selectedItemIds.has(item.id)).map((item) => item.id);
    state.selectedItemIds.clear();
    state.lastSelectedIndex = -1;
    addEntries(getEditedList().id, ids);
    persistAndRender();
  });
  dom.bulkClear.addEventListener("click", () => {
    state.selectedItemIds.clear();
    state.lastSelectedIndex = -1;
    renderCatalog();
  });
  dom.catalogList.addEventListener("click", (event) => {
    const row = event.target.closest(".cat-row");
    if (!row) {
      return;
    }
    const itemId = row.dataset.itemId;
    const index = Number(row.dataset.index);
    const target = event.target.closest("[data-action]");
    const action = target?.dataset.action;
    if (action === "cat-select") {
      handleCatalogSelection(itemId, index, target.checked, event.shiftKey);
      return;
    }
    if (action === "cat-play") {
      togglePlayback(makeKey("cat", "", itemId), itemId);
      return;
    }
    if (action === "cat-toggle") {
      toggleInTarget(itemId);
      return;
    }
    if (action === "cat-members") {
      if (state.expandedMembers.has(itemId)) {
        state.expandedMembers.delete(itemId);
      } else {
        state.expandedMembers.add(itemId);
      }
      renderCatalog();
      return;
    }
    // PL: Ctrl / Cmd + kliknięcie w nazwę przełącza zaznaczenie wiersza. / EN: Ctrl / Cmd + click on the name toggles the row selection.
    if ((event.ctrlKey || event.metaKey) && event.target.closest(".cat-main")) {
      handleCatalogSelection(itemId, index, !state.selectedItemIds.has(itemId), false);
    }
  });

  // Panel list / Lists panel
  dom.addList.addEventListener("click", () => {
    const listId = createList();
    state.editedListId = listId;
    state.restoredEditedListId = null;
    saveAdminUi();
    persistAndRender();
    startRename(listId);
  });
  dom.listsList.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    const row = target?.closest(".list-row");
    if (!row) {
      return;
    }
    const listId = row.dataset.listId;
    const index = getLists().findIndex((list) => list.id === listId);
    if (target.dataset.action === "select-list") {
      setEditedList(listId);
      if (window.matchMedia("(max-width: 1023px)").matches) {
        dom.editorHead.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    } else if (target.dataset.action === "list-up" && moveListTo(listId, index - 1)) {
      persistAndRender();
    } else if (target.dataset.action === "list-down" && moveListTo(listId, index + 1)) {
      persistAndRender();
    }
  });
  dom.listsList.addEventListener("dblclick", (event) => {
    const row = event.target.closest(".list-name")?.closest(".list-row");
    if (!row) {
      return;
    }
    setEditedList(row.dataset.listId);
    startRename(row.dataset.listId);
  });

  // Edytor: nagłówek / Editor: header
  dom.editorHead.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }
    const list = getEditedList();
    const action = target.dataset.action;
    if (action === "rename-start") {
      startRename(list.id);
    } else if (action === "duplicate") {
      const copyId = duplicateList(list.id);
      if (copyId) {
        state.editedListId = copyId;
        state.restoredEditedListId = null;
        saveAdminUi();
        persistAndRender();
      }
    } else if (action === "delete-list") {
      deleteList(list.id);
    } else if (action === "clear-list-aliases") {
      if (!confirm(t("confirmClearListAliases", { name: getListName(list) }))) {
        return;
      }
      list.entries.forEach((entry) => {
        entry.alias = "";
      });
      persistAndRender();
    }
  });
  dom.editorHead.addEventListener("keydown", (event) => {
    if (!event.target.classList.contains("rename-input")) {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      commitRename();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      cancelRename();
    }
  });
  dom.editorHead.addEventListener("focusout", (event) => {
    if (event.target.classList?.contains("rename-input")) {
      commitRename();
    }
  });

  // Edytor: wpisy / Editor: entries
  dom.editorSearch.addEventListener("input", debounce(() => {
    state.editorSearch = dom.editorSearch.value;
    renderEditor();
  }, 100));
  dom.editorEntries.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    const entryElement = target?.closest(".entry");
    if (!entryElement) {
      return;
    }
    const list = getEditedList();
    const itemId = entryElement.dataset.itemId;
    const index = Number(entryElement.dataset.index);
    const last = list.entries.length - 1;
    const moves = { "entry-top": 0, "entry-up": index - 1, "entry-down": index + 1, "entry-bottom": last };
    const action = target.dataset.action;
    if (action === "entry-play") {
      togglePlayback(makeKey("ed", list.id, itemId), itemId);
    } else if (action in moves) {
      if (moveEntry(list.id, index, moves[action])) {
        persistAndRender();
      }
    } else if (action === "entry-remove") {
      if (removeEntry(list.id, itemId)) {
        persistAndRender();
      }
    }
  });
  dom.editorEntries.addEventListener("change", (event) => {
    const input = event.target.closest(".alias-input");
    const entryElement = input?.closest(".entry");
    if (!entryElement) {
      return;
    }
    if (setEntryAlias(getEditedList().id, entryElement.dataset.itemId, input.value)) {
      persistAndRender();
    }
  });
  dom.editorEntries.addEventListener("keydown", (event) => {
    const input = event.target.closest?.(".alias-input");
    if (!input) {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur();
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      input.value = input.dataset.original || "";
      input.blur();
    }
  });
  // PL: Podpowiedzi aliasu: aliasy tego dźwięku z innych list, budowane przy wejściu w pole.
  // EN: Alias suggestions: this sound's aliases from other lists, built when the field gets focus.
  dom.editorEntries.addEventListener("focusin", (event) => {
    const input = event.target.closest?.(".alias-input");
    const entryElement = input?.closest(".entry");
    if (!entryElement) {
      return;
    }
    const listId = getEditedList().id;
    const suggestions = [...new Set(
      (state.membership.get(entryElement.dataset.itemId) || [])
        .filter((member) => member.listId !== listId && member.alias)
        .map((member) => member.alias)
    )];
    dom.aliasSuggestions.innerHTML = suggestions.map((alias) => `<option value="${escapeHtml(alias)}"></option>`).join("");
  });

  // Podgląd / Preview
  dom.previewDevices.addEventListener("click", (event) => {
    const button = event.target.closest(".seg-btn");
    if (!button) {
      return;
    }
    state.previewDevice = button.dataset.device;
    saveAdminUi();
    renderLayoutState();
  });
  dom.previewFollow.addEventListener("change", () => {
    state.previewFollow = dom.previewFollow.checked;
    if (!state.previewFollow) {
      state.previewListId = getEditedList().id;
    }
    saveAdminUi();
    renderPreview();
    updatePlaybackIndicators();
  });
  dom.previewToggle.addEventListener("click", () => {
    state.previewCollapsed = !state.previewCollapsed;
    saveAdminUi();
    renderLayoutState();
    renderPreview();
    updatePlaybackIndicators();
  });

  // PL: Zmiana szerokości okna przełącza szufladę, szynę i dostępne szerokości podglądu.
  // EN: A window width change switches the drawer, the rail and the available preview widths.
  window.addEventListener("resize", debounce(() => {
    renderLayoutState();
  }, 120));
};

// --- Zdarzenia wspólne / Shared events ---
const bindSharedEvents = () => {
  bindUserViewEvents(dom.userView, "user");
  bindUserViewEvents(dom.previewView, "prev");

  dom.languageSelect.addEventListener("change", (event) => applyLanguage(event.target.value));
  dom.accessSkip.addEventListener("click", skipAccessGate);
  dom.accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitAccessLitany().catch((error) => console.error(error));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      // PL: Escape działa jak „Pomiń”, inaczej bramka wracałaby po każdym renderze.
      // EN: Escape behaves like "Skip", otherwise the gate would return on every render.
      if (dom.accessGate && !dom.accessGate.hidden) {
        skipAccessGate();
        return;
      }
      if (ADMIN_MODE && state.toolsMenuOpen) {
        setToolsMenu(false);
        dom.toolsMenuButton.focus();
        return;
      }
      if (ADMIN_MODE && state.foldersOpen) {
        setFoldersDrawer(false);
      }
      return;
    }
    // PL: „/” przenosi kursor do wyszukiwarki katalogu (tylko w panelu admina, poza polami tekstowymi).
    // EN: "/" moves the cursor to the catalogue search (admin panel only, outside text fields).
    if (ADMIN_MODE && event.key === "/" && !isTypingTarget(event.target) && dom.accessGate.hidden) {
      event.preventDefault();
      if (window.matchMedia("(max-width: 1023px)").matches && state.adminTab !== "catalog") {
        state.adminTab = "catalog";
        saveAdminUi();
        renderLayoutState();
      }
      dom.catalogSearch.focus();
    }
  });

  document.addEventListener("visibilitychange", updateWakeLock);
};

// ==========================================================================================
// --- Start modułu / Module start-up ---
// ==========================================================================================

// --- Tryb widoku: usunięcie części drugiego trybu / View mode: removing the other mode's parts ---
const setModeVisibility = () => {
  document.body.classList.toggle("admin-mode", ADMIN_MODE);
  document.body.classList.toggle("user-mode", !ADMIN_MODE);
  const selector = ADMIN_MODE ? ".user-only" : ".admin-only";
  document.querySelectorAll(selector).forEach((element) => element.remove());
};

setModeVisibility();
// Sesja z poprzedniej wizyty pozwala pominąć pytanie o hasło / A stored session skips the password prompt
state.session = loadSession();
restoreAdminState();
bindSharedEvents();
if (ADMIN_MODE) {
  bindAdminEvents();
  initSortables();
}
loadSettingsLocal();
applyLanguage(currentLanguage);
// PL: Start Firebase jest odizolowany od wczytywania manifestów: nawet gdyby zawiódł, dźwięki mają się wczytać.
// EN: Firebase start-up is isolated from manifest loading: even if it failed, the sounds must still load.
try {
  initFirebase();
} catch (error) {
  console.error(error);
}
renderStatus();
loadManifests()
  .catch((error) => {
    dom.manifestStatus.textContent = t("manifestError");
    console.error(error);
  })
  // PL: Bramka otwiera się dopiero po wczytaniu manifestów: przy ważnej sesji w ogóle się nie
  //     pokazuje, a przy nieudanym wczytaniu od razu niesie powód błędu.
  // EN: The gate opens only after the manifests load: with a valid session it never shows at all,
  //     and after a failed load it carries the reason straight away.
  .finally(() => {
    maybeShowAccessGate();
  });
