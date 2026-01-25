Dokumentacja: Prywatne audio na Cloudflare R2 + Worker (hasło + sesja)
Cel

Chcę hostować pliki audio w Cloudflare R2 bez publicznego dostępu i udostępniać je tylko po jednorazowym logowaniu hasłem.
Po poprawnym zalogowaniu użytkownik ma móc odtwarzać wiele plików bez ponownego wpisywania hasła przez określony czas (sesja).

Rozwiązanie działa tak:

Pliki są przechowywane w R2 w buckecie audiorpg.

Publicznie widoczny jest tylko Cloudflare Worker o nazwie audiorpg, dostępny pod adresem:
https://audiorpg.tarczynski-pawel.workers.dev/

Worker jest “bramką”: wymusza logowanie i dopiero potem pobiera pliki z R2 i zwraca je przeglądarce.

Bez zalogowania nie da się pobrać pliku z adresu /a/... (zostanie przekierowanie do /login).

A. Co zostało zrobione (stan obecny)
1) Utworzony bucket R2

Bucket: audiorpg

Bucket jest prywatny (domyślne ustawienie R2).

Do bucketa został wrzucony testowy plik o kluczu (ścieżce w R2):
test/test.txt

2) Utworzony Cloudflare Worker

Worker: audiorpg

Adres workera:
https://audiorpg.tarczynski-pawel.workers.dev/

3) Podpięcie R2 do Workera (binding)

W ustawieniach Workera dodano R2 binding:

Variable name: AUDIO_BUCKET

Bucket: audiorpg

To sprawia, że kod Workera ma dostęp do plików w R2 pod nazwą env.AUDIO_BUCKET.

4) Dodanie sekretów (Secrets)

W ustawieniach Workera dodano 2 sekrety (Type = Secret):

AUDIO_PASSWORD

To jest hasło, które użytkownik wpisuje na stronie /login.

SESSION_SECRET

To jest długi losowy klucz do podpisywania sesji (tokenów).

To NIE jest hasło dla użytkownika. Użytkownik tego nie zna.

5) Wgranie kodu Workera

Do Workera został wgrany kod, który:

udostępnia stronę logowania pod: /login

po wpisaniu hasła ustawia cookie sesyjne i pozwala wejść na zasoby /a/...

serwuje pliki z R2 spod ścieżki: /a/<klucz-obiektu-w-R2>

6) Test działania

Test przebiegł poprawnie:

Wejście na /login wyświetliło formularz hasła.

Po wpisaniu poprawnego hasła nastąpiło przejście na stronę główną.

Wejście na:
https://audiorpg.tarczynski-pawel.workers.dev/a/test/test.txt
zwróciło zawartość pliku.

To potwierdza, że:

logowanie działa,

sesja działa,

Worker potrafi pobierać obiekty z R2 i zwracać je po autoryzacji.

B. Jak działa URL do pliku (najważniejsze do AudioManifest.xlsx)

Pliki są w R2 identyfikowane przez klucz (key), np.:

test/test.txt

GrimdarkAudio/Ambience/intro.mp3 (przykład)

Worker udostępnia je przez:

https://audiorpg.tarczynski-pawel.workers.dev/a/<KLUCZ>

Czyli dla obiektu:

key = test/test.txt
adres jest:

/a/test/test.txt

C. Jak działa logowanie i ochrona (mechanizm)

Użytkownik wchodzi na dowolny plik:

/a/...

Jeśli nie ma ważnej sesji:

Worker robi przekierowanie (302) do:

/login

Użytkownik wpisuje hasło na /login.

Jeśli hasło zgadza się z AUDIO_PASSWORD, Worker:

tworzy token sesji ważny 24h

zapisuje go w przeglądarce jako cookie AUDSESS

przekierowuje użytkownika na /

Od tego momentu, dopóki cookie jest ważne:

każde wejście na /a/... działa bez pytania o hasło.

D. Co zrobić teraz, żeby wrzucić wszystkie pliki audio

Wejdź w Cloudflare → R2 → bucket audiorpg → Objects.

Wgraj pliki audio do struktury folderów, którą chcesz mieć w linkach.
Najważniejsze: klucze w R2 = ścieżki w URL.

Przykład:

W R2 wgrywam plik z kluczem: audio/ambience/hall.mp3

Otworzę go jako:
https://audiorpg.tarczynski-pawel.workers.dev/a/audio/ambience/hall.mp3

Uwaga: “foldery” w R2 są logiczne (to część nazwy obiektu). Trzymaj spójne nazwy, bo potem łatwo podmieniasz base URL w manifestach.

E. Najważniejsza część: jak sprawić, żeby aplikacja na GitHubie działała “jak chcesz”
E1) Co jest “oczekiwanym zachowaniem”

Chcę, żeby:

Aplikacja na GitHub Pages (np. https://…github.io/...) próbując odtwarzać dźwięk:

wymusiła logowanie (raz)

po zalogowaniu audio odtwarzało się normalnie

Linki do audio mają być chronione hasłem.

E2) Problem, który MUSISZ znać (cookies / third-party)

Twoja aplikacja jest na innej domenie (GitHub Pages), a audio jest na domenie workera (workers.dev).

To oznacza, że:

cookie sesyjne ustawione przez Workera może być traktowane jako third-party cookie, kiedy audio jest ładowane w tle z GitHub Pages.

część przeglądarek (szczególnie mobilnych / Safari, czasem Chrome z ustawieniami prywatności) może takie cookies blokować.

Objawy blokady cookies:

Ty się logujesz na /login, ale w aplikacji na GitHubie audio dalej “nie gra” albo dostaje przekierowanie na /login zamiast pliku.

W konsoli przeglądarki mogą być komunikaty o blokowaniu cookies / CORS / przekierowaniach.

E3) Jak uzyskać działanie “pytaj o hasło i potem gra” – 3 warianty (wybierz jeden)
Wariant 1 (NAJPROSTSZY, najpewniejszy bez domeny): otwieranie logowania w nowej karcie i potem odtwarzanie

To jest “minimalna zmiana” i często wystarcza w Chrome/Edge.

W aplikacji na GitHubie dodaj przycisk/link:
“Zaloguj do audio” → prowadzi do:
https://audiorpg.tarczynski-pawel.workers.dev/login

Użytkownik klika i loguje się w otwartej karcie (to jest first-party dla workera).

Następnie wraca do aplikacji i uruchamia audio.

Jeśli przeglądarka nie blokuje cookie w tym scenariuszu, audio zacznie działać.

Jeśli nadal nie działa → to znaczy, że przeglądarka blokuje third-party cookies w odtwarzaniu z innej domeny. Wtedy przejdź do Wariantu 2 albo 3.

Wariant 2 (PEWNY, bez domeny, ale wymaga zmiany w aplikacji): otwarzanie audio przez przekierowanie użytkownika na workers.dev

Jeśli chcesz mieć 100% pewności bez własnej domeny, musisz sprawić, by użytkownik korzystał z audio “w tej samej domenie” co worker.

Sposób:

zamiast odtwarzać audio jako zasób z GitHub Pages,

otwierasz odtwarzanie na workers.dev (np. nowa karta z playerem albo dedykowana strona workera).

Najprostsze:

Użytkownik loguje się na /login (workers.dev).

Twoja aplikacja na GitHubie przy kliknięciu “Odtwórz” otwiera nową kartę:
https://audiorpg.tarczynski-pawel.workers.dev/a/<key>

Plik audio otwiera się bez hasła (sesja jest first-party).

Minus: odtwarzanie jest “poza” Twoją aplikacją (oddzielna karta).

Wariant 3 (DOCZELOWY, najlepszy UX): własna domena i wszystko pod jedną domeną

To jest najlepsze rozwiązanie długoterminowo:

przenosisz aplikację na app.twojadomena.pl

audio na audio.twojadomena.pl

wtedy cookies/sesje działają dużo pewniej

można też użyć Cloudflare Access zamiast własnego hasła

To jednak wymaga posiadania domeny (płatnej).

F. Co MUSI być spełnione, żeby audio odtwarzało się w tagu <audio>

Jeśli Twoja aplikacja używa HTML <audio src="...">, to:

Worker musi zwracać poprawne nagłówki (robi to),

Range requests muszą działać (kod je obsługuje),

przeglądarka musi mieć dostęp do cookie sesji (tu jest kluczowy problem z GitHub Pages).

W przypadku problemów:

testuj najpierw ręcznie w tej samej domenie:
workers.dev/login → potem workers.dev/a/...

dopiero potem testuj z GitHub Pages.

G. Checklist: jak sprawdzić, czy “aplikacja na GitHubie” będzie działać

Otwórz w incognito:
https://audiorpg.tarczynski-pawel.workers.dev/login

Zaloguj się.

W tej samej karcie otwórz:
https://audiorpg.tarczynski-pawel.workers.dev/a/test/test.txt
→ ma działać.

Teraz przejdź do Twojej aplikacji na GitHub Pages.

Spróbuj odtworzyć plik audio z linku do workera:
https://audiorpg.tarczynski-pawel.workers.dev/a/...

Jeśli aplikacja nie odtwarza i przerzuca na /login lub dostajesz błędy:

oznacza to blokadę cookies / politykę przeglądarki

przejdź na Wariant 2 albo docelowo Wariant 3.

H. Najważniejsze praktyczne zalecenie na teraz

Żeby to działało bez frustracji:

Dodaj w aplikacji na GitHubie widoczny przycisk:
“Zaloguj do audio” → /login

Zawsze najpierw kliknij ten przycisk przed odpaleniem audio.

Jeśli na części urządzeń nadal nie działa:

wtedy audio trzeba odtwarzać bezpośrednio pod workers.dev (Wariant 2) albo przejść na własną domenę (Wariant 3).

Dane techniczne projektu (Twoje konkretne)

R2 bucket: audiorpg

Worker: audiorpg

Worker URL: https://audiorpg.tarczynski-pawel.workers.dev/

Logowanie: /login

Pliki (proxy): /a/<key>

Wylogowanie: /logout
