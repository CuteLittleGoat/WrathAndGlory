/* Loads the preserved test page and injects the isolated Firebase test integration. */
(function loadIntegratedTestPage() {
  'use strict';

  const BASE_FILE = './test-core.html';

  function replaceExactlyOnce(source, search, replacement, label) {
    const firstIndex = source.indexOf(search);
    if (firstIndex === -1) throw new Error(`${label}: nie znaleziono oczekiwanego fragmentu.`);
    if (source.indexOf(search, firstIndex + search.length) !== -1) {
      throw new Error(`${label}: znaleziono więcej niż jeden oczekiwany fragment.`);
    }
    return source.slice(0, firstIndex) + replacement + source.slice(firstIndex + search.length);
  }

  async function load() {
    const response = await fetch(BASE_FILE, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Nie udało się pobrać ${BASE_FILE}: HTTP ${response.status}.`);

    let html = await response.text();

    html = replaceExactlyOnce(
      html,
      '  <script src="./vendor/pdf-lib.min.js"></script>',
      [
        '  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>',
        '  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>',
        '  <script src="./config/firebase-config.js"></script>',
        '  <script src="./vendor/pdf-lib.min.js"></script>'
      ].join('\n'),
      'Biblioteki Firebase'
    );

    html = replaceExactlyOnce(
      html,
      '<div class="data-actions"><button type="button" id="saveButton">Zapisz lokalnie</button><button type="button" id="loadButton">Wczytaj lokalnie</button><button type="button" id="resetButton">Reset</button></div>',
      '<div class="data-actions"><button type="button" id="saveFirebaseButton">Zapisz w Firebase (test-v2)</button><button type="button" id="loadFirebaseButton">Wczytaj z Firebase (test-v2)</button><button type="button" id="saveButton">Zapisz lokalnie</button><button type="button" id="loadButton">Wczytaj lokalnie</button><button type="button" id="resetButton">Reset</button></div>',
      'Przyciski zapisu'
    );

    const closingScript = '</scr' + 'ipt>';
    const oldEnding = `${closingScript}\n</body>`;
    const newEnding = `${closingScript}\n<script src="./test-firebase.js">${closingScript}\n</body>`;
    html = replaceExactlyOnce(html, oldEnding, newEnding, 'Skrypt integracji testowej');

    document.open();
    document.write(html);
    document.close();
  }

  load().catch(error => {
    console.error('[test-loader] Failed:', error);
    document.body.innerHTML = `
      <main style="max-width:900px;margin:40px auto;padding:24px;background:#000;color:#ffd8d8;border:1px solid #d74b4b;font-family:Consolas,monospace;white-space:pre-wrap;">
        <h1 style="margin-top:0;">Błąd uruchamiania wersji testowej</h1>
        <p>${String(error.message || error).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character]))}</p>
        <p>Plik produkcyjny TworzeniePostaci.html nie został zmieniony.</p>
      </main>`;
  });
})();
