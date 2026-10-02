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

    // ─── 4b. ABOUT DETAILS ANIMATIONS ───
    const diplomaGrade = document.getElementById('diploma-grade');
    if (diplomaGrade) {
        let gradeProxy = { val: 0 };
        ScrollTrigger.create({
            trigger: '.about-details',
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(gradeProxy, {
                    val: 100,
                    duration: 2.5,
                    ease: "power3.out",
                    onUpdate: function() {
                        diplomaGrade.innerText = Math.floor(gradeProxy.val);
                    },
                    onComplete: () => {
                        diplomaGrade.classList.add('max');
                    }
                });
            }
        });
    }

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
            { text: "portafolio@guest:~$ ./load_documents.sh", class: "t-msg", delay: 500 },
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

    // ─── 9. 3D HOLOGRAPHIC CARD LOGIC ───
    const cardWrapper = document.getElementById('cv-card-wrapper');
    const cvCard = document.getElementById('cv-card');
    const cvGlare = document.getElementById('cv-glare');

    if (cardWrapper && cvCard && !isMobile) {
        cardWrapper.addEventListener('mousemove', (e) => {
            const rect = cardWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation (max 15 degrees)
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            cvCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            if (cvGlare) {
                cvGlare.style.transform = `translate(${x}px, ${y}px)`;
                cvGlare.style.opacity = 0.4;
            }
        });

        cardWrapper.addEventListener('mouseleave', () => {
            cvCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
            if (cvGlare) cvGlare.style.opacity = 0;
        });
    }

    // ─── 10. DOWNLOAD CV LOGIC ───
    const cvCheckbox = document.getElementById('cv-download-checkbox');
    const cvLabel = document.getElementById('cv-download-label');

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

            // Reset UI after CSS animation finishes (7s)
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


    // ─── 11. IMMERSIVE SALERNO TELEPORTATION ───
    const salernoTrigger = document.getElementById('salerno-trigger');
    const salernoOverlay = document.getElementById('salerno-overlay');
    const earthContainer = document.getElementById('earth-container');
    const warpFlash = document.getElementById('warp-flash');
    const salernoContent = document.getElementById('salerno-content');
    const closeSalerno = document.getElementById('close-salerno');

    if (salernoTrigger && salernoOverlay) {
        let scene, camera, renderer, earthGroup, stars;
        let isTeleporting = false;
        let animId;

        function initEarth() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 100;

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            earthContainer.innerHTML = '';
            earthContainer.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);
            const pointLight = new THREE.PointLight(0xffffff, 1);
            pointLight.position.set(50, 50, 50);
            scene.add(pointLight);

            earthGroup = new THREE.Group();
            scene.add(earthGroup);

            // Techy wireframe globe
            const sphereGeo = new THREE.SphereGeometry(15, 32, 32);
            const sphereMat = new THREE.MeshBasicMaterial({ 
                color: 0x4ade80, 
                wireframe: true, 
                transparent: true, 
                opacity: 0.2 
            });
            const earth = new THREE.Mesh(sphereGeo, sphereMat);
            earthGroup.add(earth);
            
            // Pin for Italy/Salerno
            const pinGeo = new THREE.SphereGeometry(0.3, 16, 16);
            const pinMat = new THREE.MeshBasicMaterial({ color: 0xc8f135 });
            const pin = new THREE.Mesh(pinGeo, pinMat);
            
            const phi = (90 - 40.68) * (Math.PI / 180);
            const theta = (14.76 + 180) * (Math.PI / 180);
            pin.position.x = -(15 * Math.sin(phi) * Math.cos(theta));
            pin.position.z = (15 * Math.sin(phi) * Math.sin(theta));
            pin.position.y = 15 * Math.cos(phi);
            earthGroup.add(pin);

            // Stars
            const starGeo = new THREE.BufferGeometry();
            const starCount = 3000;
            const starArr = new Float32Array(starCount * 3);
            for(let i=0; i < starCount * 3; i++) {
                starArr[i] = (Math.random() - 0.5) * 400;
            }
            starGeo.setAttribute('position', new THREE.BufferAttribute(starArr, 3));
            const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8 });
            stars = new THREE.Points(starGeo, starMat);
            scene.add(stars);

            earthGroup.rotation.y = -Math.PI / 2;
        }

        salernoTrigger.addEventListener('click', () => {
            if (isTeleporting) return;
            isTeleporting = true;
            
            salernoOverlay.style.display = 'block';
            gsap.to(salernoOverlay, { opacity: 1, duration: 0.3 });
            salernoOverlay.style.pointerEvents = 'auto';

            initEarth();

            const animate = function () {
                animId = requestAnimationFrame(animate);
                stars.rotation.y -= 0.002;
                stars.rotation.x += 0.001;
                renderer.render(scene, camera);
            };
            animate();

            const tl = gsap.timeline();
            
            tl.to(earthGroup.rotation, { y: earthGroup.rotation.y - Math.PI * 4.5, x: 0.2, duration: 3.5, ease: "power2.inOut" }, 0)
              .to(camera.position, { z: 15.5, duration: 3.5, ease: "power2.in" }, 0)
              .to(warpFlash, { opacity: 1, duration: 0.15, ease: "power1.in" }, "-=0.2")
              .call(() => {
                  earthContainer.style.display = 'none';
                  salernoContent.style.display = 'block';
                  gsap.set(salernoContent, { opacity: 1 });
                  cancelAnimationFrame(animId);
              })
              .to(warpFlash, { opacity: 0, duration: 1.5, ease: "power2.out" })
              .call(() => {
                  isTeleporting = false;
              });
        });

        closeSalerno.addEventListener('click', () => {
            gsap.to(salernoOverlay, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    salernoOverlay.style.display = 'none';
                    salernoOverlay.style.pointerEvents = 'none';
                    salernoContent.style.display = 'none';
                    earthContainer.style.display = 'block';
                }
            });
        });
    }

}); // Keep closing bracket for document.addEventListener("DOMContentLoaded", () => {
