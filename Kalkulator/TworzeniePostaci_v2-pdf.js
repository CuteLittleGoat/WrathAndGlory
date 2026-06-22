/* Eksport polskiej karty PDF ładowany dopiero na żądanie. / Polish PDF export loaded only on demand. */
(function installAdvancedCreatorPdfExport() {
  'use strict';

  const PDF_LIB_URL = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
  const FONTKIT_URL = 'https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js';
  const FONT_URL = 'https://cdn.jsdelivr.net/gh/notofonts/noto-fonts@main/hinted/ttf/NotoSans/NotoSans-Regular.ttf';
  const KEYWORDS_AREA = {
    page: 0,
    firstField: 'Słowa Kluczowe',
    secondField: 'Słowa Kluczowe 2',
    x: 275,
    secondY: 611,
    width: 140,
    height: 13,
    maxFont: 10,
    minFont: 4
  };
  let dependenciesPromise = null;

  const byId = id => document.getElementById(id);
  const compact = text => String(text || '').split('\n').map(line => line.trim()).filter(Boolean).join(' / ');
  const pad2 = value => String(value).padStart(2, '0');
  const fileName = () => {
    const date = new Date();
    return `PL-${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}-${pad2(date.getHours())}${pad2(date.getMinutes())}.pdf`;
  };

  const loadScript = src => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-pdf-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.pdfSrc = src;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Nie udało się załadować ${src}.`)), { once: true });
    document.head.appendChild(script);
  });

  async function ensureDependencies() {
    if (dependenciesPromise) return dependenciesPromise;
    dependenciesPromise = (async () => {
      if (!window.PDFLib) await loadScript(PDF_LIB_URL);
      if (!window.fontkit) await loadScript(FONTKIT_URL);
      if (!window.PDFLib || !window.fontkit) throw new Error('Biblioteki PDF nie zostały załadowane.');
    })();

    try {
      return await dependenciesPromise;
    } catch (error) {
      dependenciesPromise = null;
      throw error;
    }
  }

  function setLog(message, error = false) {
    const node = byId('pdfLogMessage');
    if (!node) return;
    node.textContent = message || 'No PDF messages.';
    node.classList.toggle('is-error', error);
  }

  async function embedFont(pdfDoc) {
    pdfDoc.registerFontkit(window.fontkit);
    const response = await fetch(FONT_URL);
    if (!response.ok) throw new Error('Nie udało się pobrać fontu Noto Sans.');
    return pdfDoc.embedFont(await response.arrayBuffer(), { subset: false });
  }

  function setText(form, name, value, font, warnings, skipBlank = true) {
    const text = String(value ?? '');
    if (skipBlank && !text.trim()) return;

    try {
      const field = form.getTextField(name);
      field.setText(text);
      try {
        field.setFontSize(text.length > 650 ? 6 : text.length > 420 ? 7 : text.length > 240 ? 8 : 10);
      } catch (_) {}
      try {
        field.updateAppearances(font);
      } catch (error) {
        warnings.push(`Nie udało się ustawić fontu pola ${name}: ${error.message}`);
      }
    } catch (_) {
      warnings.push(`Brak pola PDF: ${name}`);
    }
  }

  function setCheckbox(form, name, checked, warnings) {
    try {
      const field = form.getCheckBox(name);
      checked ? field.check() : field.uncheck();
      field.updateAppearances();
    } catch (_) {
      warnings.push(`Brak pola PDF: ${name}`);
    }
  }

  function removeTextField(form, name, font) {
    try {
      const field = form.getTextField(name);
      try {
        field.setText('');
        field.updateAppearances(font);
      } catch (_) {}
      try {
        form.removeField(field);
      } catch (_) {}
    } catch (_) {}
  }

  function wrap(text, font, size, width, prefix = '- ', hanging = '  ') {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let line = prefix;
    const measure = value => font.widthOfTextAtSize(value, size);
    const flush = () => {
      if (line.trim()) lines.push(line);
      line = hanging;
    };

    for (const word of words) {
      const candidate = line.trim() ? `${line} ${word}` : `${line}${word}`;
      if (measure(candidate) <= width) {
        line = candidate;
        continue;
      }
      if (line.trim()) flush();
      if (measure(`${hanging}${word}`) <= width) {
        line = `${hanging}${word}`;
        continue;
      }

      let chunk = '';
      for (const character of word) {
        if (chunk && measure(`${hanging}${chunk}${character}`) > width) {
          lines.push(`${hanging}${chunk}`);
          chunk = character;
        } else {
          chunk += character;
        }
      }
      line = `${hanging}${chunk}`;
    }

    if (line.trim()) lines.push(line);
    return lines;
  }

  function layout(entries, area, font) {
    const normalized = entries.map(compact).filter(Boolean);
    const gutter = 10;

    for (let columns = area.minColumns; columns <= area.maxColumns; columns += 1) {
      for (let size = area.maxFont; size >= area.minFont; size -= 1) {
        const colWidth = (area.width - gutter * (columns - 1)) / columns;
        const lineHeight = size * 1.18;
        const perColumn = Math.floor(area.height / lineHeight);
        const lines = normalized.flatMap(entry => wrap(entry, font, size, colWidth));
        if (lines.length <= perColumn * columns) {
          return { columns, size, colWidth, lineHeight, perColumn, lines, omitted: 0 };
        }
      }
    }

    const columns = area.maxColumns;
    const size = area.minFont;
    const colWidth = (area.width - gutter * (columns - 1)) / columns;
    const lineHeight = size * 1.18;
    const perColumn = Math.floor(area.height / lineHeight);
    const all = normalized.flatMap(entry => wrap(entry, font, size, colWidth));
    const capacity = perColumn * columns;
    return {
      columns,
      size,
      colWidth,
      lineHeight,
      perColumn,
      lines: all.slice(0, capacity),
      omitted: Math.max(0, all.length - capacity)
    };
  }

  function drawArea(pdfDoc, entries, area, font, warnings) {
    if (!entries.length) return;
    const page = pdfDoc.getPages()[area.page];
    if (!page) {
      warnings.push(`${area.label}: brak strony PDF.`);
      return;
    }

    const result = layout(entries, area, font);
    const gutter = 10;
    const color = window.PDFLib.rgb(0, 0, 0);
    result.lines.forEach((line, index) => {
      const column = Math.floor(index / result.perColumn);
      const row = index % result.perColumn;
      page.drawText(line, {
        x: area.x + column * (result.colWidth + gutter),
        y: area.y + area.height - result.size - row * result.lineHeight,
        size: result.size,
        font,
        color
      });
    });

    if (result.omitted) {
      warnings.push(`${area.label}: pominięto ${result.omitted} linii, ponieważ tekst nie mieści się w obszarze.`);
    }
  }

  function buildEntries(data) {
    const result = { abilities: [], notes: [], background: [] };
    data.talents.forEach(talent => {
      const entry = compact(talent.name);
      if (entry) result.abilities.push(entry);
    });
    data.rules.forEach(rule => {
      const entry = compact(rule.name);
      if (!entry) return;
      if (rule.type === 'backgroundBonus') result.background.push(entry);
      else if (rule.type === 'archetypeAbility' && rule.target === 'none') result.abilities.push(entry);
      else result.notes.push(entry);
    });
    return result;
  }

  function fitKeywords(text, font, warnings) {
    const normalized = compact(text).replace(/\s*\/\s*/g, ', ');
    if (!normalized) return { lines: [], fontSize: KEYWORDS_AREA.maxFont };

    for (let fontSize = KEYWORDS_AREA.maxFont; fontSize >= KEYWORDS_AREA.minFont; fontSize -= 1) {
      const lines = wrap(normalized, font, fontSize, KEYWORDS_AREA.width, '', '');
      if (lines.length <= 2) return { lines, fontSize };
    }

    const fontSize = KEYWORDS_AREA.minFont;
    const lines = wrap(normalized, font, fontSize, KEYWORDS_AREA.width, '', '');
    warnings.push('Słowa Kluczowe: tekst przekracza dwie linie. Nadmiar został pominięty.');
    return { lines: lines.slice(0, 2), fontSize };
  }

  function setKeywords(pdfDoc, form, text, font, warnings) {
    const fitted = fitKeywords(text, font, warnings);
    const page = pdfDoc.getPages()[KEYWORDS_AREA.page];

    try {
      const first = form.getTextField(KEYWORDS_AREA.firstField);
      first.setText(fitted.lines[0] || '');
      try { first.setFontSize(fitted.fontSize); } catch (_) {}
      first.updateAppearances(font);
    } catch (_) {
      warnings.push(`Brak pola PDF: ${KEYWORDS_AREA.firstField}`);
    }

    if (!fitted.lines[1] || !page) return;
    try {
      let second;
      try {
        second = form.getTextField(KEYWORDS_AREA.secondField);
      } catch (_) {
        second = form.createTextField(KEYWORDS_AREA.secondField);
        second.addToPage(page, {
          x: KEYWORDS_AREA.x,
          y: KEYWORDS_AREA.secondY,
          width: KEYWORDS_AREA.width,
          height: KEYWORDS_AREA.height,
          borderWidth: 0,
          textColor: window.PDFLib.rgb(0, 0, 0),
          font
        });
      }
      second.setText(fitted.lines[1]);
      try { second.setFontSize(fitted.fontSize); } catch (_) {}
      second.updateAppearances(font);
    } catch (error) {
      warnings.push(`Słowa Kluczowe: nie udało się utworzyć drugiego wiersza (${error.message}).`);
      page.drawText(fitted.lines[1], {
        x: KEYWORDS_AREA.x,
        y: KEYWORDS_AREA.secondY + 2,
        size: fitted.fontSize,
        font,
        color: window.PDFLib.rgb(0, 0, 0)
      });
    }
  }

  function fillStandard(pdfDoc, form, data, font, warnings) {
    const character = data.character;
    const values = data.values;
    setText(form, 'Poziom', character.gameTier, font, warnings, false);
    setText(form, 'Gatunek', character.speciesName, font, warnings);
    setText(form, 'Archetyp', character.archetypeName, font, warnings);
    setText(form, 'Frakcja', character.factionName, font, warnings);
    setKeywords(pdfDoc, form, character.keywords, font, warnings);
    setText(form, 'Rozmiar', character.size, font, warnings, false);
    setText(form, 'Szybkość', values.speed, font, warnings, false);

    ['S', 'Wt', 'Zr', 'I', 'SW', 'Int', 'Ogd'].forEach(key => {
      setText(form, key, data.attrs[key], font, warnings, false);
    });
    window.WNGCreatorV2.SKILLS.forEach(skill => {
      setText(form, skill.pdf, data.skills[skill.key], font, warnings, false);
      setText(form, skill.sum, data.skillTotals[skill.key], font, warnings, false);
    });

    [
      ['Upór', values.resolve],
      ['Odwaga', values.conviction],
      ['Obrona', values.defence],
      ['Bazowa Odporność', values.resilience],
      ['Maksymalna Żywotność', values.woundsMax],
      ['Odporność Psychiczna', values.shock],
      ['Determinacja', values.determination],
      ['Wpływy', values.influence],
      ['Majątek', values.wealth],
      ['Pasywna Czujność', values.passiveAwareness]
    ].forEach(([name, value]) => setText(form, name, value, font, warnings, false));

    Array.from({ length: 25 }, (_, index) => `Check Box ${index + 1}`).forEach((name, index) => {
      setCheckbox(form, name, index < values.corruption, warnings);
    });
    const levelMarks = Math.max(0, Math.min(4, Math.ceil((values.corruption - 5) / 5)));
    Array.from({ length: 5 }, (_, index) => `Check Box ${index + 26}`).forEach((name, index) => {
      setCheckbox(form, name, index < levelMarks, warnings);
    });
  }

  function openPreview() {
    const preview = window.open('', '_blank');
    if (preview) {
      preview.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Generowanie PDF…</title></head><body style="margin:24px;background:#000;color:#9cf09c;font-family:Consolas,monospace">Trwa rytuał transkrypcji danych dokumentu…</body></html>');
      preview.document.close();
    }
    return preview;
  }

  function createNamedPdf(bytes, name) {
    const options = { type: 'application/pdf' };
    return typeof File === 'function'
      ? new File([bytes], name, options)
      : new Blob([bytes], options);
  }

  function downloadPdf(url, name) {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.rel = 'noopener';
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function exportPdf() {
    const preview = openPreview();
    const warnings = [];
    const button = byId('exportCharacterPdfButton');
    button.disabled = true;

    try {
      await ensureDependencies();
      const response = await fetch('./pdf/pl.pdf', { cache: 'no-store' });
      if (!response.ok) throw new Error('Nie udało się pobrać ./pdf/pl.pdf.');

      const pdfDoc = await window.PDFLib.PDFDocument.load(await response.arrayBuffer());
      const font = await embedFont(pdfDoc);
      const form = pdfDoc.getForm();
      const data = window.WNGCreatorV2.getComputedData();
      const entries = buildEntries(data);

      fillStandard(pdfDoc, form, data, font, warnings);
      Array.from({ length: 8 }, (_, index) => `Zdolności i talenty ${index + 1}`).forEach(name => removeTextField(form, name, font));
      removeTextField(form, 'Notatki 1', font);
      removeTextField(form, 'Przeszłość', font);

      drawArea(pdfDoc, entries.abilities, {
        page: 1, x: 40, y: 578, width: 530, height: 118,
        minColumns: 2, maxColumns: 4, maxFont: 10, minFont: 5,
        label: 'Zdolności i Talenty'
      }, font, warnings);
      drawArea(pdfDoc, entries.notes, {
        page: 1, x: 25, y: 40, width: 410, height: 135,
        minColumns: 2, maxColumns: 4, maxFont: 10, minFont: 5,
        label: 'Notatki'
      }, font, warnings);
      drawArea(pdfDoc, entries.background, {
        page: 0, x: 467, y: 623, width: 109, height: 39,
        minColumns: 1, maxColumns: 3, maxFont: 8, minFont: 4,
        label: 'Przeszłość'
      }, font, warnings);

      const bytes = await pdfDoc.save({ updateFieldAppearances: false });
      const name = fileName();
      const pdfFile = createNamedPdf(bytes, name);
      const url = URL.createObjectURL(pdfFile);

      // Pobranie przez a[download] nadaje nazwę pliku niezależnie od technicznego identyfikatora blob URL.
      downloadPdf(url, name);

      if (preview && !preview.closed) {
        preview.document.title = name;
        preview.location.replace(url);
      } else {
        window.open(url, '_blank');
      }

      setTimeout(() => URL.revokeObjectURL(url), 300000);
      setLog(warnings.length ? warnings.join('\n') : `PDF został wygenerowany jako ${name}.`);
    } catch (error) {
      console.error('[TworzeniePostaci_v2 PDF]', error);
      setLog(error.stack || error.message, true);
      if (preview && !preview.closed) {
        preview.document.body.textContent = `Błąd generowania PDF: ${error.message || error}`;
      }
    } finally {
      button.disabled = false;
    }
  }

  function initialize() {
    byId('exportCharacterPdfButton')?.addEventListener('click', exportPdf);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
