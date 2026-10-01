/* ══════════════════════════════════════════════
   UMBERTO CIMMINO — PORTFOLIO v2
   GSAP + ScrollTrigger + Lenis
   ══════════════════════════════════════════════ */

// ── THEME CONFIG ──
const themes = {
  default: { accent:'#c8f135', rgb:'200,241,53', hover:'#d4f855', accent2:'#4ade80', rgb2:'74,222,128' },
  red:     { accent:'#ff3366', rgb:'255,51,102', hover:'#ff668c', accent2:'#ff8080', rgb2:'255,128,128' },
  purple:  { accent:'#b066ff', rgb:'176,102,255', hover:'#c999ff', accent2:'#d9b3ff', rgb2:'217,179,255' },
  blue:    { accent:'#00d4ff', rgb:'0,212,255', hover:'#4de4ff', accent2:'#80bfff', rgb2:'128,191,255' }
};

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {

  // ─── LENIS SMOOTH SCROLL ───
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
  });

  // Connect Lenis to GSAP ticker
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ─── GSAP REGISTER ───
  gsap.registerPlugin(ScrollTrigger);

  // ─── PREFERS REDUCED MOTION CHECK ───
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── SPLIT TEXT HELPER ───
  function splitTextIntoSpans(element) {
    const text = element.textContent;
    element.textContent = '';
    text.split('').forEach(char => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      if (char === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.textContent = char;
      }
      element.appendChild(span);
    });
    return element.querySelectorAll('span');
  }

  // ═══════════════════════════════════════
  // HERO ANIMATIONS
  // ═══════════════════════════════════════
  if (!prefersReduced) {
    // Split hero name lines into individual characters
    document.querySelectorAll('.hero-name-line').forEach(line => {
      const chars = splitTextIntoSpans(line);
      gsap.from(chars, {
        y: 120,
        opacity: 0,
        rotateX: -40,
        stagger: 0.03,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3,
      });
    });

    // Hero tag
    gsap.to('.hero-tag', {
      opacity: 1, y: 0, duration: 0.8, delay: 1.2, ease: 'power2.out',
    });
    gsap.set('.hero-tag', { y: 20 });

    // Hero description
    gsap.to('.hero-desc', {
      opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: 'power2.out',
    });
    gsap.set('.hero-desc', { y: 20 });

    // Hero CTA buttons
    gsap.to('.hero-cta', {
      opacity: 1, y: 0, duration: 0.8, delay: 1.7, ease: 'power2.out',
    });
    gsap.set('.hero-cta', { y: 20 });

    // Hero status badge
    gsap.to('.hero-status', {
      opacity: 1, y: 0, duration: 0.8, delay: 2.0, ease: 'power2.out',
    });
    gsap.set('.hero-status', { y: 15 });

    // Scroll hint
    gsap.to('.hero-scroll-hint', {
      opacity: 0.6, duration: 1, delay: 2.5, ease: 'power2.out',
    });

    // Hero parallax on scroll-out
    gsap.to('.hero-inner', {
      yPercent: 25,
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      }
    });

    // Hide scroll hint on scroll
    gsap.to('.hero-scroll-hint', {
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: '10% top',
        end: '30% top',
        scrub: true,
      }
    });
  }

  // ═══════════════════════════════════════
  // SECTION HEADERS (all sections)
  // ═══════════════════════════════════════
  if (!prefersReduced) {
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.to(header, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });
      gsap.set(header, { x: -60 });
    });
  } else {
    // Show immediately if reduced motion
    document.querySelectorAll('.section-header').forEach(h => h.style.opacity = '1');
  }

  // ═══════════════════════════════════════
  // ABOUT — Progressive text reveal
  // ═══════════════════════════════════════
  if (!prefersReduced) {
    gsap.utils.toArray('.reveal-line').forEach((line, i) => {
      gsap.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      });
      gsap.set(line, { y: 40 });
    });
  }

  // ═══════════════════════════════════════
  // SKILLS — Staggered card + tag reveal
  // ═══════════════════════════════════════
  if (!prefersReduced) {
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      });
      gsap.set(card, { y: 50 });

      // Animate tags inside each card with spring effect
      const tags = card.querySelectorAll('.tag');
      gsap.from(tags, {
        scale: 0,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }

  // ═══════════════════════════════════════
  // PROJECTS — Slide in from right with stagger
  // ═══════════════════════════════════════
  if (!prefersReduced) {
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        }
      });
      gsap.set(card, { x: 80, opacity: 0 });
    });
  }

  // ═══════════════════════════════════════
  // DOCUMENTS — WIP banner + card
  // ═══════════════════════════════════════
  if (!prefersReduced) {
    gsap.from('.wip-banner', {
      x: -40, opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: '#documents', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.doc-card', {
      y: 40, opacity: 0, duration: 0.8, delay: 0.15,
      scrollTrigger: { trigger: '#documents', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ═══════════════════════════════════════
  // CONTACT — Terminal slide in
  // ═══════════════════════════════════════
  if (!prefersReduced) {
    gsap.from('.contact-text', {
      y: 50, opacity: 0, duration: 0.9,
      scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    gsap.from('.contact-links', {
      y: 50, opacity: 0, duration: 0.9, delay: 0.2,
      scrollTrigger: { trigger: '#contact', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
  }

  // ═══════════════════════════════════════
  // NAVBAR
  // ═══════════════════════════════════════

  // Typing effect
  const typedEl = document.getElementById('nav-typed');
  if (typedEl) {
    const text = 'portfolio';
    let idx = 0;
    function typeChar() {
      if (idx < text.length) {
        typedEl.textContent += text.charAt(idx);
        idx++;
        setTimeout(typeChar, 120);
      }
    }
    setTimeout(typeChar, 800);
  }

  // Hide/show navbar on scroll
  let lastScroll = 0;
  const nav = document.getElementById('main-nav');
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 200) {
      if (scroll > lastScroll) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
    } else {
      nav.classList.remove('hidden');
    }
    lastScroll = scroll;
  });

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 300;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // Smooth scroll for nav links via Lenis
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: -72 });
    });
  });

  // ─── HAMBURGER MENU ───
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        const target = document.querySelector(link.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -72 });
      });
    });
  }

  // ═══════════════════════════════════════
  // THEME SWITCHER
  // ═══════════════════════════════════════
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.theme;
      const theme = themes[name];
      if (!theme) return;

      const root = document.documentElement;
      root.setAttribute('data-theme', name === 'default' ? '' : name);
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--accent-rgb', theme.rgb);
      root.style.setProperty('--accent-hover', theme.hover);
      root.style.setProperty('--accent2', theme.accent2);
      root.style.setProperty('--accent2-rgb', theme.rgb2);

      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ═══════════════════════════════════════
  // CUSTOM CURSOR
  // ═══════════════════════════════════════
  (function() {
    const dot   = document.getElementById('c-dot');
    const ring  = document.getElementById('c-ring');
    const trail = document.getElementById('c-trail');
    if (!dot || window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches) return;

    let mx = 0, my = 0, rx = 0, ry = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    gsap.ticker.add(() => {
      // Use lerp for smooth follow
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;

      dot.style.left   = mx + 'px';  dot.style.top  = my + 'px';
      ring.style.left  = rx + 'px';  ring.style.top = ry + 'px';
      trail.style.left = tx + 'px';  trail.style.top = ty + 'px';
    });

    const SEL = 'a,button,input,label,.project-card,.skill-card,.theme-btn,.btn,.t-link';
    function addHov(el) {
      el.addEventListener('mouseenter', () => { dot.classList.add('hov'); ring.classList.add('hov'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('hov'); ring.classList.remove('hov'); });
    }
    document.querySelectorAll(SEL).forEach(addHov);

    // Observe dynamically added elements
    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.matches && n.matches(SEL)) addHov(n);
          n.querySelectorAll && n.querySelectorAll(SEL).forEach(addHov);
        }
      }));
    }).observe(document.body, { childList: true, subtree: true });

    // Text cursor change
    document.addEventListener('mouseover', e => {
      const isTxt = ['P','SPAN','H1','H2','H3','LI','A'].includes(e.target.tagName);
      dot.classList.toggle('txt', isTxt);
      ring.classList.toggle('txt', isTxt);
    });

    document.addEventListener('mousedown', () => { dot.classList.add('clk'); ring.classList.add('clk'); });
    document.addEventListener('mouseup', () => { dot.classList.remove('clk'); ring.classList.remove('clk'); });

    document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; trail.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='1'; trail.style.opacity='1'; });
  })();

  // ═══════════════════════════════════════
  // CV DOWNLOAD LOGIC
  // ═══════════════════════════════════════
  const cvCheckbox = document.getElementById('cv-download-checkbox');
  if (cvCheckbox) {
    cvCheckbox.addEventListener('change', () => {
      if (!cvCheckbox.checked) return;

      const a = document.createElement('a');
      a.href = 'documenti/Umberto_Cimmino_CV.pdf';
      a.download = 'Umberto_Cimmino_CV.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => { cvCheckbox.checked = false; }, 7000);
    });
  }

}); // end DOMContentLoaded
