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

        const links = document.querySelectorAll('a, label, .p-tags span, .back-to-top');
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
    const bootText = document.getElementById('boot-text');
    
    const bootLines = [
        "Mounting core systems... <span class='ok'>[OK]</span>",
        "Loading CSS modules... <span class='ok'>[OK]</span>",
        "Initializing GSAP engine... <span class='ok'>[OK]</span>",
        "Resolving fonts... <span class='ok'>[OK]</span>",
        "Starting visual matrix... <span class='ok'>[OK]</span>"
    ];
    
    let bootIndex = 0;
    const bootInterval = setInterval(() => {
        if (bootIndex < bootLines.length && bootText) {
            const p = document.createElement('div');
            p.className = 'boot-line';
            p.innerHTML = `<span class="sys">SYS</span> ${bootLines[bootIndex]}`;
            bootText.appendChild(p);
            bootIndex++;
        }
    }, 300);

    let progress = { val: 0 };
    gsap.to(progress, {
        val: 100,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: function() {
            counter.innerText = Math.floor(progress.val) + "%";
            loaderBar.style.width = progress.val + "%";
        },
        onComplete: () => {
            clearInterval(bootInterval);
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
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (!isMobile) {
        const cards = gsap.utils.toArray('.project-card');
        cards.forEach((card, index) => {
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
    }

    // ─── 7. TERMINAL TYPING ANIMATION (DOCUMENTS) ───
    const terminalOutput = document.getElementById('t-output');
    if (terminalOutput) {
        const terminalLines = [
            { text: "guest@umberto:~$ ./load_documents.sh", class: "t-msg", delay: 500 },
            { text: "Loading modules...", class: "t-muted", delay: 400 },
            { text: "[WARN] Database connection slow...", class: "t-accent", delay: 800 },
            { text: "[ERROR] System msg: Sezione in fase di sviluppo.", class: "t-err", delay: 300 },
            { text: "[ERROR] Lavori in corso . . .", class: "t-err", delay: 200 }
        ];

        let terminalTriggered = false;

        ScrollTrigger.create({
            trigger: "#wip-terminal",
            start: "top 80%",
            onEnter: () => {
                if (terminalTriggered) return;
                terminalTriggered = true;
                
                let currentDelay = 0;
                terminalLines.forEach((line) => {
                    setTimeout(() => {
                        const p = document.createElement('div');
                        p.className = line.class;
                        p.textContent = line.text;
                        terminalOutput.appendChild(p);
                    }, currentDelay);
                    currentDelay += line.delay;
                });
            }
        });
    }

    // ─── 8. CONTACT TERMINAL ANIMATION ───
    const contactTerminal = document.getElementById('contact-terminal');
    const cmdText = document.getElementById('ct-cmd-text');
    const ctOutput = document.getElementById('ct-output');
    const ctLinks = gsap.utils.toArray('.ct-link');

    if (contactTerminal && cmdText && ctOutput) {
        const commandStr = "./get_contacts.sh";
        let contactTriggered = false;

        ScrollTrigger.create({
            trigger: contactTerminal,
            start: "top 80%",
            onEnter: () => {
                if (contactTriggered) return;
                contactTriggered = true;

                // 1. Type the command
                let i = 0;
                const typing = setInterval(() => {
                    cmdText.textContent += commandStr.charAt(i);
                    i++;
                    if (i >= commandStr.length) {
                        clearInterval(typing);
                        // 2. Show output after a tiny delay
                        setTimeout(() => {
                            document.getElementById('ct-cmd-cursor').style.display = 'none';
                            ctOutput.style.display = 'block';
                            
                            // 3. Animate social links appearing
                            gsap.to(ctLinks, {
                                y: 0,
                                opacity: 1,
                                duration: 0.5,
                                stagger: 0.2,
                                ease: "power2.out",
                                delay: 0.5
                            });

                        }, 500);
                    }
                }, 50);
            }
        });
    }

    // ─── 9. DOWNLOAD CV LOGIC ───
    const cvCheckbox = document.getElementById('cv-download-checkbox');
    const cvLabel    = document.getElementById('cv-download-label');
    if (cvCheckbox && cvLabel) {
        const CV_PATH = 'documenti/Umberto_Cimmino_CV.pdf';
        cvCheckbox.addEventListener('change', () => {
            if (!cvCheckbox.checked) return;

            const a = document.createElement('a');
            a.href = CV_PATH;
            a.download = 'Umberto_Cimmino_CV.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => {
                cvCheckbox.checked = false;
            }, 7000);
        });
    }

    // ─── 10. BACK TO TOP ───
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    }

});
