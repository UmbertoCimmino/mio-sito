document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (window.matchMedia("(pointer: fine)").matches && cursorDot) {
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let ringX = 0, ringY = 0;
        let trailX = 0, trailY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            dotX += (mouseX - dotX) * 0.2;
            dotY += (mouseY - dotY) * 0.2;
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;
            trailX += (mouseX - trailX) * 0.05;
            trailY += (mouseY - trailY) * 0.05;

            if (cursorDot) cursorDot.style.transform = `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))`;
            if (cursorRing) cursorRing.style.transform = `translate(calc(-50% + ${ringX}px), calc(-50% + ${ringY}px))`;
            if (cursorTrail) cursorTrail.style.transform = `translate(calc(-50% + ${trailX}px), calc(-50% + ${trailY}px))`;
        });
    }

    // 3. Theme Switcher
    const themeBtns = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;

    const rgbMap = {
        'theme-default': '200, 241, 53',
        'theme-blue': '53, 165, 241',
        'theme-purple': '165, 53, 241',
        'theme-red': '241, 53, 90'
    };

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            htmlElement.className = theme;
            
            // Update active state
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update accent-rgb for download-btn.css
            htmlElement.style.setProperty('--accent-rgb', rgbMap[theme]);
        });
    });

    // 4. Navbar Typing Effect
    const typedTextSpan = document.querySelector('.typed-text');
    const textToType = "portfolio";
    let typeIndex = 0;

    function typeEffect() {
        if (typeIndex < textToType.length) {
            typedTextSpan.textContent += textToType.charAt(typeIndex);
            typeIndex++;
            setTimeout(typeEffect, 150);
        }
    }
    setTimeout(typeEffect, 1000);

    // 5. Download CV Logic
    const cvCheckbox = document.getElementById('cv-download-checkbox');
    if (cvCheckbox) {
        cvCheckbox.addEventListener('change', () => {
            if (!cvCheckbox.checked) return;

            // Start download immediately
            const a = document.createElement('a');
            a.href = 'documenti/Umberto_Cimmino_CV.pdf';
            a.download = 'Umberto_Cimmino_CV.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Reset after animation
            setTimeout(() => {
                cvCheckbox.checked = false;
            }, 7000);
        });
    }

    // 6. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Simple manual split text for title
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            if (char === ' ') span.innerHTML = '&nbsp;';
            heroTitle.appendChild(span);
        });

        const chars = heroTitle.querySelectorAll('span');
        gsap.from(chars, {
            y: 100,
            opacity: 0,
            stagger: 0.05,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.5
        });
    }

    gsap.from('.hero-subtitle, .status-badge', {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        delay: 1.5,
        ease: "power2.out"
    });

    // Hero Parallax on Scroll
    gsap.to('.hero-container', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // About Reveal
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.from(text, {
            y: 50,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Skills Stagger
    gsap.utils.toArray('.skill-category').forEach((card, i) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Tags inside card
        const tags = card.querySelectorAll('.tag');
        gsap.from(tags, {
            scale: 0,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Projects Parallax Cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Documents Section
    gsap.from('.wip-banner', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: ".documents",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from('.download-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        scrollTrigger: {
            trigger: ".documents",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Contact Terminal Slide In
    gsap.from('.contact-terminal', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".contact",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                lenis.scrollTo(target);
            }
        });
    });
});
