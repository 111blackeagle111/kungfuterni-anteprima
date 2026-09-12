(() => {
  const full = document.querySelector('#news-current');
  const home = document.querySelector('[data-news-home]');
  if (!full && !home) return;
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function safeURL(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function dateLabel(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
    const date = new Date(value + 'T12:00:00');
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('it-IT', {day:'numeric', month:'long', year:'numeric'});
  }
  fetch('data/news.json', {cache:'no-cache'})
    .then(response => { if (!response.ok) throw new Error('News unavailable'); return response.json(); })
    .then(data => {
      if (!Array.isArray(data)) throw new Error('Invalid news data');
      const seen = new Set();
      const entries = data.filter(entry => {
        if (!entry || entry.published !== true || typeof entry.title !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || seen.has(entry.id)) return false;
        seen.add(entry.id); return true;
      }).sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));
      if (full) {
        const sections = entries.map(entry => {
          const section = element('section', '', 'cms-news-entry'); section.id = entry.id;
          section.append(element('p', [entry.category, dateLabel(entry.date || '')].filter(Boolean).join(' · '), 'eyebrow'));
          section.append(element('h2', entry.title));
          if (entry.location) section.append(element('p', entry.location));
          for (const paragraph of String(entry.body || '').split(/\n\s*\n/)) if (paragraph.trim()) section.append(element('p', paragraph));
          const imageURL = safeURL(entry.image);
          if (imageURL) {
            const a = element('a'); a.href = imageURL; a.target = '_blank'; a.rel = 'noopener';
            const image = element('img'); image.src = imageURL; image.alt = entry.title; image.loading = 'lazy'; image.className = 'cms-news-image'; a.append(image); section.append(a);
          }
          const linkURL = safeURL(entry.link);
          if (linkURL) { const a = element('a', 'Scopri di più', 'text-link'); a.href = linkURL; section.append(a); }
          return section;
        });
        full.replaceChildren(...(sections.length ? sections : [element('p', 'Non ci sono nuove notizie o eventi pubblicati.') ]));
        // Preserve direct links from the home and older shared links after loading.
        const target = document.getElementById(location.hash.slice(1));
        if (target && full.contains(target)) target.scrollIntoView();
      }
      if (home) {
        const cards = entries.slice(0,3).map(entry => {
          const card = element('a', '', 'news-card'); card.href = 'news-e-rassegna-stampa.html#' + entry.id;
          card.append(element('span', [entry.category, dateLabel(entry.date || '')].filter(Boolean).join(' · '), 'eyebrow'),element('h3',entry.title),element('p',entry.summary || ''),element('span','Leggi la notizia','news-action'));
          return card;
        });
        const archive = element('a','Archivio e rassegna stampa','news-card'); archive.href = 'news-e-rassegna-stampa.html#archivio';
        home.replaceChildren(...cards,archive);
      }
    })
    .catch(() => {
      // Keep existing information visible if the content request fails.
      const notice = element('p', 'Aggiornamenti momentaneamente non disponibili. Riprova tra poco.', 'news-load-notice');
      (full || home).prepend(notice);
    });
})();
