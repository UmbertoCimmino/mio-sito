// Dizionario dei temi cromatici configurati in RGB
const siteThemes = {
  'red': { accent: '#ff3366', rgb: '255, 51, 102', hover: '#ff668c', accent2: '#ff8080', rgb2: '255, 128, 128' },
  'purple': { accent: '#b066ff', rgb: '176, 102, 255', hover: '#c999ff', accent2: '#d9b3ff', rgb2: '217, 179, 255' },
  'blue': { accent: '#00d4ff', rgb: '0, 212, 255', hover: '#4de4ff', accent2: '#80bfff', rgb2: '128, 191, 255' },
  'default': { accent: '#c8f135', rgb: '200, 241, 53', hover: '#d4f855', accent2: '#4ade80', rgb2: '74, 222, 128' }
};

const cmdInput  = document.getElementById('nav-cmd');
const dropdown  = document.getElementById('nav-dropdown');
const ddLabel   = document.getElementById('dd-label');
const ddList    = document.getElementById('dd-list');
let allOpts     = [...ddList.querySelectorAll('.dd-option')];

let kbdIdx = -1;
let typingTimeout; // Variabile per controllare l'animazione di scrittura

function resizeInput() {
  const ghost = document.createElement('span');
  ghost.style.cssText = 'font:400 13px/1 "Space Mono",monospace;letter-spacing:0.05em;visibility:hidden;position:absolute;white-space:pre;top:-999px';
  ghost.textContent = cmdInput.value || cmdInput.placeholder || 'x';
  document.body.appendChild(ghost);
  cmdInput.style.width = (ghost.offsetWidth + 16) + 'px';
  document.body.removeChild(ghost);
}

resizeInput();

/* ── ANIMAZIONE DI SCRITTURA INIZIALE ── */
document.addEventListener('DOMContentLoaded', () => {
  const textToType = "portfolio";
  let charIndex = 0;
  
  // Svuota l'input all'avvio
  cmdInput.value = "";
  resizeInput();

  function typeChar() {
    if (charIndex < textToType.length) {
      cmdInput.value += textToType.charAt(charIndex);
      resizeInput();
      charIndex++;
      typingTimeout = setTimeout(typeChar, 120);
    }
  }

  // Aspetta mezzo secondo prima di iniziare
  typingTimeout = setTimeout(typeChar, 600);
});

function openDropdown()  { dropdown.classList.add('open'); }
function closeDropdown() { dropdown.classList.remove('open'); kbdIdx = -1; syncActive(); }

function visibleOpts() { return allOpts.filter(o => o.style.display !== 'none'); }

function syncActive() {
  allOpts.forEach(o => o.classList.remove('active'));
  const vis = visibleOpts();
  if (kbdIdx >= 0 && vis[kbdIdx]) vis[kbdIdx].classList.add('active');
}

function scrollActiveIntoView() {
  const vis = visibleOpts();
  if (kbdIdx >= 0 && vis[kbdIdx]) vis[kbdIdx].scrollIntoView({ block: 'nearest' });
}

// ── ESECUZIONE AZIONE FINALE ──
function executeAction(target) {
  if (target.startsWith('theme-')) {
    const colorName = target.replace('theme-', ''); 
    const theme = siteThemes[colorName];
    
    // Cambia le variabili root CSS al volo
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--accent-rgb', theme.rgb);
      root.style.setProperty('--accent-hover', theme.hover);
      root.style.setProperty('--accent2', theme.accent2);
      root.style.setProperty('--accent2-rgb', theme.rgb2);
    }
  } else {
    // Scorre alla sezione
    const el = document.getElementById(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
  
  cmdInput.value = '';
  resizeInput();
  closeDropdown();
  cmdInput.blur();
}

// ── SMISTAMENTO (Autocompilazione vs Esecuzione) ──
function handleSelection(opt) {
  if (opt.dataset.fill) {
    cmdInput.value = opt.dataset.fill;
    resizeInput();
    updateList(cmdInput.value);
    cmdInput.focus();
  } else if (opt.dataset.target) {
    executeAction(opt.dataset.target);
  }
}

// ── LOGICA DI RICERCA GERARCHICA DEL TERMINALE ──
function updateList(raw) {
  const prev = ddList.querySelector('.dd-nomatch');
  if (prev) prev.remove();

  const rawVal = raw.toLowerCase().trimStart();
  let matches = 0;

  allOpts.forEach(o => o.style.display = 'none');

  if (rawVal.startsWith('set color')) {
    const search = rawVal.replace(/^set\s+color\s*/, '').trim();
    document.querySelectorAll('.opt-theme').forEach(opt => {
      const aliases = opt.dataset.aliases.split(',');
      if (search === '' || aliases.some(a => a.startsWith(search))) {
        opt.style.display = ''; matches++;
      }
    });
    ddLabel.textContent = 'scegli un colore';
    
  } else if (rawVal.startsWith('set')) {
    const search = rawVal.replace(/^set\s*/, '').trim();
    document.querySelectorAll('.opt-cmd-set').forEach(opt => {
      if (search === '' || 'color'.startsWith(search)) {
        opt.style.display = ''; matches++;
      }
    });
    ddLabel.textContent = 'sotto-comandi disponibili';
    
  } else {
    const search = rawVal.replace(/^(cd\s*\/?|\/)/, '').trim();
    
    document.querySelectorAll('.opt-section').forEach(opt => {
      const aliases = opt.dataset.aliases.split(',');
      if (search === '' || aliases.some(a => a.startsWith(search))) {
        opt.style.display = ''; matches++;
      }
    });
    
    const cmdRoot = document.querySelector('.opt-cmd-root');
    if (search === '' || 'set'.startsWith(search)) {
      cmdRoot.style.display = ''; matches++;
    }
    
    ddLabel.textContent = 'sezioni e comandi';
  }

  if (matches === 0) {
    ddLabel.style.display = 'none';
    const nm = document.createElement('div');
    nm.className = 'dd-nomatch';
    nm.textContent = `nessun comando trovato`;
    ddList.appendChild(nm);
  } else {
    ddLabel.style.display = '';
  }

  kbdIdx = -1;
  syncActive();
  openDropdown();
}

cmdInput.addEventListener('focus', () => {
  clearTimeout(typingTimeout);
  if (cmdInput.value === 'portfolio') cmdInput.select();
  updateList(cmdInput.value);
});

cmdInput.addEventListener('input', e => {
  clearTimeout(typingTimeout);
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
    if (vis.length > 0) handleSelection(vis[0]); 
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (kbdIdx >= 0 && vis[kbdIdx]) {
      handleSelection(vis[kbdIdx]);
    } else if (vis.length === 1) {
      handleSelection(vis[0]);
    } else {
      const v = cmdInput.value.toLowerCase().trim();
      let exactMatch = vis.find(o => {
        if (o.dataset.fill) return o.dataset.fill.trim() === v;
        if (o.dataset.aliases) return o.dataset.aliases.split(',').includes(v.replace(/^set\s+color\s*/, ''));
        return false;
      });
      if (exactMatch) handleSelection(exactMatch);
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
  if (opt) handleSelection(opt);
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

/* ── ACTIVE NAV LINK & SCROLL INDICATOR ── */
const pageSections = document.querySelectorAll('section[id], #hero');
const navLinks     = document.querySelectorAll('.nav-links a');
const secIndicator = document.getElementById('section-indicator');
let scrollTimeout;

window.addEventListener('scroll', () => {
  let current = '';
  pageSections.forEach(sec => {
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

  if (secIndicator && window.innerWidth > 768) {
    const sectionName = current === 'hero' ? 'index' : current;
    secIndicator.textContent = `/${sectionName}`;
    secIndicator.classList.add('visible');
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      secIndicator.classList.remove('visible');
    }, 1200);
  }
}, { passive: true });

window.dispatchEvent(new Event('scroll'));

/* ── EVITA SOVRAPPOSIZIONE DEL BADGE COL FOOTER (Solo Desktop) ── */
const badgeWrap = document.getElementById('badge-wrap');
const footerElement = document.getElementById('footer');

window.addEventListener('scroll', () => {
  if (window.innerWidth <= 768) {
    if (badgeWrap) badgeWrap.style.transform = '';
    return;
  }
  
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

/* ── CURSORE CUSTOM ANIMATO ── */
(function () {
  const dot   = document.getElementById('c-dot');
  const ring  = document.getElementById('c-ring');
  const trail = document.getElementById('c-trail');

  if (!dot || window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    tx += (mx - tx) * 0.06;
    ty += (my - ty) * 0.06;

    ring.style.left  = rx + 'px';
    ring.style.top   = ry + 'px';
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';

    requestAnimationFrame(loop);
  })();

  const SEL = 'a,button,input,label,.project-card,.skill-card,.dd-option,.btn,.t-gh-link,.status-badge,.theme-btn';
  function addHov(el) {
    el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
  }
  document.querySelectorAll(SEL).forEach(addHov);

  new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) {
        if (n.matches && n.matches(SEL)) addHov(n);
        n.querySelectorAll && n.querySelectorAll(SEL).forEach(addHov);
      }
    }));
  }).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('mouseover', e => {
    const isTxt = ['P','SPAN','H1','H2','H3','LI'].includes(e.target.tagName);
    dot.classList.toggle('txt', isTxt);
    ring.classList.toggle('txt', isTxt);
  });

  document.addEventListener('mousedown', () => { dot.classList.add('clk'); ring.classList.add('clk'); });
  document.addEventListener('mouseup',   () => { dot.classList.remove('clk'); ring.classList.remove('clk'); });

  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; trail.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; trail.style.opacity='1'; });
})();

/* ── FEEDBACK SONORO (TASTI E CLICK) ── */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTickSound() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.04);

  gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); 
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.04);
}

document.addEventListener('keydown', (e) => {
  if (!e.repeat && !['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
    playTickSound();
  }
});

document.addEventListener('mousedown', (e) => {
  if (e.target.closest('a, button, .dd-option, input, .project-card, .t-gh-link, .theme-btn')) {
    playTickSound();
  }
});

/* ── MOBILE THEME SWITCHER LOGIC ── */
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const themeName = e.target.dataset.theme;
    const theme = siteThemes[themeName];
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--accent-rgb', theme.rgb);
      root.style.setProperty('--accent-hover', theme.hover);
      root.style.setProperty('--accent2', theme.accent2);
      root.style.setProperty('--accent2-rgb', theme.rgb2);
      playTickSound();
    }
  });
});
