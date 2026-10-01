/* ══════════════════════════════════════════════
   UMBERTO CIMMINO — CINEMATIC PORTFOLIO JS
   ══════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
    
    // ─── 1. LENIS SMOOTH SCROLL ───
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    gsap.registerPlugin(ScrollTrigger);

    // ─── 2. CUSTOM CURSOR ───
    const cursor = document.querySelector('.cursor');
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate(calc(-50% + ${cursorX}px), calc(-50% + ${cursorY}px))`;
        });

        const links = document.querySelectorAll('a, label, .p-tags span');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => cursor.classList.add('active'));
            link.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    } else {
        cursor.style.display = 'none';
    }

    // ─── 3. PRELOADER & HERO INTRO ───
    const counter = document.getElementById('counter');
    const loaderBar = document.getElementById('loader-bar');
    
    let progress = { val: 0 };
    gsap.to(progress, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
            counter.innerText = Math.floor(progress.val) + "%";
            loaderBar.style.width = progress.val + "%";
        },
        onComplete: () => {
            const tl = gsap.timeline();
            tl.to('.preloader', {
                yPercent: -100,
                duration: 1,
                ease: "power4.inOut",
                onComplete: () => {
                    document.body.classList.remove('loading');
                }
            }, "+=0.2")
            .from('.nav', {
                y: -50, opacity: 0, duration: 1, ease: "power3.out"
            }, "-=0.5")
            .from('.hero-title .line', {
                y: "120%",
                duration: 1.2,
                stagger: 0.1,
                ease: "power4.out"
            }, "-=0.8")
            .from('.hero-role .line, .hero-scroll .line', {
                y: "120%",
                duration: 1,
                stagger: 0.1,
                ease: "power3.out"
            }, "-=1.0");
        }
    });

    // ─── 4. SCRUB TEXT REVEAL (ABOUT) ───
    const scrubText = new SplitType('#about-text', { types: 'words' });
    
    gsap.fromTo(scrubText.words, 
        { opacity: 0.2 },
        {
            opacity: 1,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.about',
                start: 'top 70%',
                end: 'bottom 60%',
                scrub: true
            }
        }
    );

    // ─── 5. SKILLS MARQUEE ───
    gsap.to('.skills-marquee', {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: '.skills',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // ─── 6. PROJECT CARDS STACKING ───
    const cards = gsap.utils.toArray('.project-card');
    cards.forEach((card, index) => {
        // We skip the last card because it doesn't need to scale down
        if (index === cards.length - 1) return;
        
        gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            scrollTrigger: {
                trigger: cards[index + 1],
                start: "top 80%",
                end: "top 20%",
                scrub: true
            }
        });
    });

    // ─── 7. WIP BANNER MARQUEE ───
    gsap.to('.marquee-wip', {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: '.wip-banner-large',
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });

    // ─── 8. DOWNLOAD CV LOGIC ───
    const cvCheckbox = document.getElementById('cv-download-checkbox');
    const cvLabel    = document.getElementById('cv-download-label');
    if (cvCheckbox && cvLabel) {
        const CV_PATH = 'documenti/Umberto_Cimmino_CV.pdf';
        cvCheckbox.addEventListener('change', () => {
            if (!cvCheckbox.checked) return;

            // Trigger file download
            const a = document.createElement('a');
            a.href = CV_PATH;
            a.download = 'Umberto_Cimmino_CV.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Reset UI after CSS animation finishes (7s)
            setTimeout(() => {
                cvCheckbox.checked = false;
            }, 7000);
        });
    }

});
