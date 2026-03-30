/* ── NAV COMMAND TERMINAL & LOGO ── */
const cmdInput  = document.getElementById('nav-cmd');
const dropdown  = document.getElementById('nav-dropdown');
const ddLabel   = document.getElementById('dd-label');
const ddList    = document.getElementById('dd-list');
const allOpts   = [...ddList.querySelectorAll('.dd-option')];

let kbdIdx = -1;

function resizeInput() {
  const ghost = document.createElement('span');
  ghost.style.cssText = 'font:400 13px/1 "Space Mono",monospace;letter-spacing:0.05em;visibility:hidden;position:absolute;white-space:pre;top:-999px';
  ghost.textContent = cmdInput.value || cmdInput.placeholder || 'x';
  document.body.appendChild(ghost);
  cmdInput.style.width = (ghost.offsetWidth + 16) + 'px';
  document.body.removeChild(ghost);
}

resizeInput();

function normalize(s) {
  return s.replace(/^(cd\s*\/?|\/)/i, '').trim().toLowerCase();
}

function openDropdown()  { dropdown.classList.add('open'); }
function closeDropdown() { dropdown.classList.remove('open'); kbdIdx = -1; syncActive(); }

function visibleOpts() {
  return allOpts.filter(o => o.style.display !== 'none');
}

function syncActive() {
  allOpts.forEach((o, i) => o.classList.toggle('active', i === kbdIdx));
}

function scrollActiveIntoView() {
  const v = visibleOpts();
  if (kbdIdx >= 0 && v[kbdIdx]) v[kbdIdx].scrollIntoView({ block: 'nearest' });
}

function navigateTo(target) {
  const el = document.getElementById(target);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  cmdInput.value = '';
  resizeInput();
  closeDropdown();
  cmdInput.blur();
}

function updateList(raw) {
  const val = normalize(raw);
  const prev = ddList.querySelector('.dd-nomatch');
  if (prev) prev.remove();

  if (val === '') {
    allOpts.forEach(o => o.style.display = '');
    ddLabel.textContent = 'sezioni disponibili';
    ddLabel.style.display = '';
    openDropdown();
    return;
  }

  let matches = 0;
  allOpts.forEach(opt => {
    const aliases = opt.dataset.aliases.split(',');
    const hit = aliases.some(a => a.startsWith(val));
    opt.style.display = hit ? '' : 'none';
    if (hit) matches++;
  });

  if (matches === 0) {
    allOpts.forEach(o => o.style.display = 'none');
    ddLabel.style.display = 'none';
    const nm = document.createElement('div');
    nm.className = 'dd-nomatch';
    nm.textContent = `nessuna sezione per "${val}"`;
    ddList.appendChild(nm);
  } else {
    ddLabel.textContent = 'suggerimenti';
    ddLabel.style.display = '';
  }

  kbdIdx = -1;
  syncActive();
  openDropdown();
}

cmdInput.addEventListener('focus', () => {
  if (cmdInput.value === 'portfolio') cmdInput.select();
  updateList(cmdInput.value);
});

cmdInput.addEventListener('input', e => {
  resizeInput();
  updateList(e.target.value);
});

cmdInput.addEventListener('keydown', e => {
  const vis = visibleOpts();

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    kbdIdx = Math.min(kbdIdx + 1, vis.length - 1);
    syncActive(); scrollActiveIntoView();

  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    kbdIdx = Math.max(kbdIdx - 1, 0);
    syncActive(); scrollActiveIntoView();

  } else if (e.key === 'Tab') {
    e.preventDefault();
    if (vis.length > 0) {
      cmdInput.value = vis[0].dataset.target;
      resizeInput();
      updateList(cmdInput.value);
    }

  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (kbdIdx >= 0 && vis[kbdIdx]) {
      navigateTo(vis[kbdIdx].dataset.target);
    } else if (vis.length === 1) {
      navigateTo(vis[0].dataset.target);
    } else {
      const v = normalize(cmdInput.value);
      const found = allOpts.find(o => o.dataset.aliases.split(',').includes(v));
      if (found) navigateTo(found.dataset.target);
    }

  } else if (e.key === 'Escape') {
    cmdInput.value = 'portfolio';
    resizeInput();
    closeDropdown();
    cmdInput.blur();
  }
});

ddList.addEventListener('click', e => {
  const opt = e.target.closest('.dd-option');
  if (opt) navigateTo(opt.dataset.target);
});

document.addEventListener('click', e => {
  if (!e.target.closest('#nav-cmd-wrap')) {
    if (cmdInput.value.trim() === '') {
      cmdInput.value = 'portfolio';
      resizeInput();
    }
    closeDropdown();
  }
});

/* ── CURSORE GLOWING SULLA NAVBAR ── */
const mainNav = document.getElementById('main-nav');

mainNav.addEventListener('mousemove', (e) => {
  const rect = mainNav.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  mainNav.style.setProperty('--mouse-x', `${x}px`);
  mainNav.style.setProperty('--mouse-y', `${y}px`);
});

/* ── FADE IN E SLIDE IN ON SCROLL ── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.children ?? [])];
    const delay = siblings.indexOf(entry.target) * 120;
    setTimeout(() => entry.target.classList.add('visible'), delay);
    fadeObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-side').forEach(el => fadeObs.observe(el));

/* ── ACTIVE NAV LINK ON SCROLL (Gestione Dinamica Highlighting) ── */
const pageSections = document.querySelectorAll('section[id], #hero');
const navLinks     = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  pageSections.forEach(sec => {
    // Calcolo per far accendere la categoria poco prima che la sezione raggiunga la cima
    const sectionTop = sec.offsetTop;
    if (window.scrollY >= sectionTop - 300) {
      current = sec.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}, { passive: true });

// Scateniamo l'evento scroll al caricamento per evidenziare subito la prima voce
window.dispatchEvent(new Event('scroll'));

/* ── EVITA SOVRAPPOSIZIONE DEL BADGE COL FOOTER ── */
const badgeWrap = document.getElementById('badge-wrap');
const footerElement = document.getElementById('footer');

window.addEventListener('scroll', () => {
  if (!badgeWrap || !footerElement) return;
  const footerRect = footerElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  const overlap = viewportHeight - footerRect.top;
  
  if (overlap > 0) {
    badgeWrap.style.transform = `translateY(-${overlap}px)`;
  } else {
    badgeWrap.style.transform = 'translateY(0)';
  }
}, { passive: true });