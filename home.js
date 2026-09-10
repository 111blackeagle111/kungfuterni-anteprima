const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
if (menuButton && menu) {
  menuButton.hidden = false;
  document.querySelector('.header').classList.add('nav-ready');
  function closeMenu() {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Apri menu');
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });
  window.matchMedia('(max-width:800px)').addEventListener('change', closeMenu);
}
const filters = document.querySelectorAll('[data-filter]');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('selected', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  document.querySelectorAll('[data-audience]').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && !card.dataset.audience.split(' ').includes(button.dataset.filter);
    if (!card.hidden) visible++;
  });
  document.querySelector('#filter-status').textContent = `${visible} corsi visualizzati`;
}));
const lessons = {
  "lun": [
    [
      "16:30 — 17:00",
      "Propedeutica marziale"
    ],
    [
      "17:00 — 18:00",
      "Kung Fu Kids"
    ],
    [
      "18:00 — 18:20",
      "Kids Sanda"
    ],
    [
      "18:30 — 20:00",
      "Sanda adulti"
    ],
    [
      "20:00 — 21:30",
      "Kung Fu adulti"
    ]
  ],
  "mer": [
    [
      "17:30 — 19:00",
      "Agonismo"
    ]
  ],
  "ven": [
    [
      "16:30 — 17:00",
      "Propedeutica marziale"
    ],
    [
      "17:00 — 18:00",
      "Kung Fu Kids"
    ],
    [
      "18:00 — 18:20",
      "Kids Sanda"
    ],
    [
      "18:30 — 20:00",
      "Sanda adulti"
    ],
    [
      "20:00 — 21:30",
      "Kung Fu adulti"
    ],
    [
      "20:15 — 21:15",
      "Taiji Chen"
    ]
  ],
  "sab": [
    [
      "15:00 — 19:00",
      "Allenamento libero / stage / personal"
    ]
  ]
};
const days = [...document.querySelectorAll('[data-day]')];
function selectDay(button) {
  days.forEach(day => { day.setAttribute('aria-selected', String(day === button)); day.tabIndex = day === button ? 0 : -1; });
  document.querySelector('#day-panel').setAttribute('aria-labelledby', button.id);
  const list = document.querySelector('.lessons');
  list.replaceChildren(...lessons[button.dataset.day].map(([time, title]) => {
    const li = document.createElement('li');
    const clock = document.createElement('time'); clock.textContent = time;
    const content = document.createElement('div');
    const strong = document.createElement('strong'); strong.textContent = title;
    const dot = document.createElement('span'); dot.className = 'lesson-dot';
    content.append(strong); li.append(clock,content,dot); return li;
  }));
}
days.forEach((button,index) => {
  button.addEventListener('click', () => selectDay(button));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index+1)%days.length;
    if (event.key === 'ArrowLeft') next = (index+days.length-1)%days.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = days.length-1;
    if (next !== undefined) { event.preventDefault(); selectDay(days[next]); days[next].focus(); }
  });
});
