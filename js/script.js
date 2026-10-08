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

    // ─── 7. CONTACT TERMINAL ANIMATION ───
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

    // ─── 8. BACK TO TOP ───
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        });
    }




    // ─── 9. LOCATION EXPLORER ───
    const salernoTrigger = document.getElementById('salerno-trigger');
    const salernoOverlay = document.getElementById('salerno-overlay');
    const salernoMapElement = document.getElementById('salerno-map');
    const mapCursor = document.getElementById('map-cursor');
    const mapCursorLabel = document.getElementById('map-cursor-label');
    const mapStatus = document.getElementById('map-status');
    const mapStatusText = document.getElementById('map-status-text');
    const salernoContent = document.getElementById('salerno-content');
    const cityStory = document.getElementById('city-story');
    const campusView = document.getElementById('campus-view');
    const campusMapElement = document.getElementById('campus-map-canvas');
    const campusInfo = document.getElementById('campus-info');
    const closeSalerno = document.getElementById('close-salerno');

    if (salernoTrigger && salernoOverlay && salernoMapElement && closeSalerno) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let map = null;
        let markers = [];
        let transitionInProgress = false;
        let introInProgress = false;
        let selectedDestination = false;
        let mapReady = false;
        let mapFailed = false;
        let activeTransition = null;
        let mapLoadTimeout = null;
        let mapLibraryPromise = null;
        let mapOpenGeneration = 0;
        let campusMap = null;
        let campusMapReady = false;
        let initializeCampusMap = () => {};
        const getCampaniaOverview = () => {
            const width = salernoMapElement?.clientWidth || window.innerWidth;
            return {
                center: [14.53, 40.75],
                zoom: width < 600 ? 6.9 : width < 1000 ? 7.2 : 7.5,
                pitch: 12,
                bearing: -5
            };
        };

        const destinations = [
            { id: 'napoli', label: 'NAPOLI', coordinates: [14.2681, 40.8518], zoom: 12.1, type: 'city' },
            { id: 'scafati', label: 'SCAFATI', coordinates: [14.525, 40.75], zoom: 13.2, type: 'stop' },
            { id: 'salerno', label: 'SALERNO', coordinates: [14.7681, 40.6824], zoom: 12.2, type: 'city' },
            { id: 'unisa', label: 'UNISA · FISCIANO', coordinates: [14.7907, 40.7721], zoom: 15.3, type: 'campus' }
        ];

        const cityData = {
            napoli: {
                name: 'Napoli', kicker: 'CAMPANIA · CITTÀ E INNOVAZIONE',
                lead: 'Una città universitaria e produttiva dove ricerca, cultura e impresa si incontrano. Il suo ecosistema offre opportunità in ambito digitale, creativo e scientifico, con una forte rete di atenei e centri di ricerca.',
                cards: [
                    ['01 / RICERCA', 'Università e competenze', 'Atenei, centri di ricerca e migliaia di studenti alimentano una comunità di competenze e collaborazioni.', 'PIANO URBANISTICO · COMUNE DI NAPOLI', 'https://static-www.comune.napoli.it/wp-content/uploads/2026/06/1050L_007_001-signed.pdf'],
                    ['02 / TECNOLOGIE', 'Sperimentare nuove idee', 'La Casa delle Tecnologie Emergenti Infiniti Mondi sostiene ricerca, sperimentazione e sviluppo di progetti nei settori creativi e digitali.', 'INFINITI MONDI · COMUNE DI NAPOLI', 'https://www.comune.napoli.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/55434/UT/systemPrint'],
                    ['03 / OPPORTUNITÀ', 'Imprese e trasferimento', 'Programmi e partenariati avvicinano startup, imprese, università e investitori: un terreno concreto per progetti e nuove professionalità.', 'INNOVATION ROADSHOW · COMUNE DI NAPOLI', 'https://www.comune.napoli.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/51853']
                ]
            },
            salerno: {
                name: 'Salerno', kicker: 'CAMPANIA · CITTÀ E INNOVAZIONE',
                lead: 'Una città di dimensione raccolta, con il campus di Fisciano vicino e una rete accademica che dialoga con il sistema produttivo. Ricerca applicata e qualità della vita convivono tra città, costa e territorio.',
                cards: [
                    ['01 / UNIVERSITÀ', 'Un campus connesso al territorio', 'UNISA promuove il dialogo tra università, istituzioni e imprese attraverso iniziative di trasferimento tecnologico e collaborazione.', 'INNOVATION DAYS · UNISA', 'https://www.unisa.it/unisa-rescue-page/dettaglio/id/529/module/87/row/12515/innovation-days-costruire-il-futuro-tra-innovazione-ed-eccellenza-industriale'],
                    ['02 / RICERCA', 'Dalla conoscenza ai progetti', 'L’Ateneo sostiene la valorizzazione della ricerca, gli spin-off accademici e le collaborazioni con enti e imprese.', 'SPIN-OFF · UNISA', 'https://web.unisa.it/terza-missione/trasferimento-tecnologico/spin-off/presentazione'],
                    ['03 / OPPORTUNITÀ', 'Un ecosistema in crescita', 'La vicinanza tra costa, servizi urbani e campus crea occasioni per incontrare competenze, ricerca e nuove iniziative imprenditoriali.', 'CAMPUS E MAPPE · UNISA', 'https://web.unisa.it/vivere-il-campus/campus/sedi-e-mappe']
                ]
            }
        };

        const campusData = {
            F: { departments: 'Informatica · Farmacia (DIFARMA)', url: 'https://www.di.unisa.it/home/contatti', source: 'Dipartimento di Informatica · UNISA', note: 'Il blocco F è il polo di Informatica: ospita uffici, aule e laboratori per didattica e ricerca. Nell’area sono presenti anche attività di Farmacia.' },
            F1: { departments: 'Polo di Informatica', url: 'https://www.di.unisa.it/home/contatti', source: 'Dipartimento di Informatica · UNISA', note: 'Parte dell’area F dedicata a Informatica, con spazi per lezioni, attività di laboratorio e ricerca.' },
            F2: { departments: 'Matematica · Informatica', url: 'https://corsi.unisa.it/matematica/strutture-didattiche', source: 'Strutture didattiche di Matematica · UNISA', note: 'F2 ospita le strutture didattiche di Matematica e attività didattiche di Informatica: aule e spazi per lo studio delle discipline scientifiche.' },
            F3: { departments: 'Polo di Informatica', url: 'https://www.di.unisa.it/home/contatti', source: 'Dipartimento di Informatica · UNISA', note: 'Parte del polo F, dedicato alla didattica e alla ricerca informatica.' },
            F4: { departments: 'Polo di Informatica', url: 'https://www.di.unisa.it/home/contatti', source: 'Dipartimento di Informatica · UNISA', note: 'Parte del polo F, dedicato alla didattica e alla ricerca informatica.' },
            'F4A': { departments: 'Polo di Informatica', url: 'https://www.di.unisa.it/home/contatti', source: 'Dipartimento di Informatica · UNISA', note: 'Parte del polo F, dedicato alla didattica e alla ricerca informatica.' },
            E: { departments: 'Ingegneria Industriale · Civile · dell’Informazione', url: 'https://docenti.unisa.it/004308/home', source: 'Dipartimento di Ingegneria Industriale · UNISA', note: 'Il blocco E riunisce attività didattiche e di laboratorio di DIIN, DICIV e DIEM: un polo dedicato alle discipline ingegneristiche.' },
            E1: { departments: 'Polo di Ingegneria', url: 'https://docenti.unisa.it/005745/home', source: 'Dipartimento di Ingegneria Civile · UNISA', note: 'Parte del polo E, con spazi per didattica, laboratori e attività dei dipartimenti di Ingegneria.' },
            E2: { departments: 'Polo di Ingegneria', url: 'https://docenti.unisa.it/004308/home', source: 'Dipartimento di Ingegneria Industriale · UNISA', note: 'Parte del polo E, con spazi per didattica, laboratori e attività dei dipartimenti di Ingegneria.' },
            D: { departments: 'Scienze Economiche e Statistiche · Patrimonio Culturale', url: 'https://docenti.unisa.it/005764/home', source: 'Dipartimento DISPAC · UNISA', note: 'Il blocco D ospita attività di DISES e DISPAC: economia e statistica insieme a storia, arte e valorizzazione del patrimonio culturale.' },
            D1: { departments: 'Polo DISES · DISPAC', url: 'https://docenti.unisa.it/005764/home', source: 'Dipartimento DISPAC · UNISA', note: 'Parte del polo D, dedicato alle scienze economiche e statistiche e agli studi sul patrimonio culturale.' },
            D2: { departments: 'Polo DISES · DISPAC', url: 'https://docenti.unisa.it/005764/home', source: 'Dipartimento DISPAC · UNISA', note: 'Parte del polo D, dedicato alle scienze economiche e statistiche e agli studi sul patrimonio culturale.' },
            D3: { departments: 'Polo DISES · DISPAC', url: 'https://docenti.unisa.it/005764/home', source: 'Dipartimento DISPAC · UNISA', note: 'Parte del polo D, dedicato alle scienze economiche e statistiche e agli studi sul patrimonio culturale.' },
            C: { departments: 'Scienze Giuridiche · Studi Umanistici', url: 'https://www.dsg.unisa.it/home/contatti', source: 'Dipartimento di Scienze Giuridiche · UNISA', note: 'Il blocco C è il polo della Scuola di Giurisprudenza e di attività umanistiche: aule, studi e spazi per la didattica.' },
            C1: { departments: 'Polo di Giurisprudenza e Studi Umanistici', url: 'https://www.dsg.unisa.it/home/contatti', source: 'Dipartimento di Scienze Giuridiche · UNISA', note: 'Parte dell’area C, con spazi per insegnamento e attività accademiche delle discipline giuridiche e umanistiche.' },
            C2: { departments: 'Polo di Giurisprudenza e Studi Umanistici', url: 'https://www.dsg.unisa.it/home/contatti', source: 'Dipartimento di Scienze Giuridiche · UNISA', note: 'Parte dell’area C, con spazi per insegnamento e attività accademiche delle discipline giuridiche e umanistiche.' },
            B: { departments: 'Scienze Umane · Filosofia · Formazione', url: 'https://www.disuff.unisa.it/dipartimento/presentazione', source: 'Dipartimento DISUFF · UNISA', note: 'Il blocco B è dedicato alle scienze umane e della formazione: didattica e ricerca in ambito pedagogico, filosofico, psicologico e sociale.' },
            B1: { departments: 'Polo DISUFF · Studi Umanistici', url: 'https://www.disuff.unisa.it/dipartimento/presentazione', source: 'Dipartimento DISUFF · UNISA', note: 'Parte dell’area B, che raccoglie attività di formazione, scienze umane e discipline umanistiche.' },
            B2: { departments: 'Polo DISUFF · Studi Umanistici', url: 'https://www.disuff.unisa.it/dipartimento/presentazione', source: 'Dipartimento DISUFF · UNISA', note: 'Parte dell’area B, che raccoglie attività di formazione, scienze umane e discipline umanistiche.' }
        };

        const setMapStatus = (message, hidden = false) => {
            mapStatusText.textContent = message;
            mapStatus.hidden = hidden;
        };

        const loadMapLibrary = () => {
            if (window.maplibregl) return Promise.resolve();
            if (mapLibraryPromise) return mapLibraryPromise;
            mapLibraryPromise = new Promise((resolve, reject) => {
                const stylesheet = document.createElement('link');
                stylesheet.rel = 'stylesheet';
                stylesheet.href = 'https://unpkg.com/maplibre-gl@5.6.0/dist/maplibre-gl.css';
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/maplibre-gl@5.6.0/dist/maplibre-gl.js';
                Promise.all([
                    new Promise((loaded, failed) => { stylesheet.onload = loaded; stylesheet.onerror = failed; }),
                    new Promise((loaded, failed) => { script.onload = loaded; script.onerror = failed; })
                ]).then(resolve, reject);
                document.head.append(stylesheet, script);
            }).catch((error) => {
                mapLibraryPromise = null;
                throw error;
            });
            return mapLibraryPromise;
        };

        const showCityStory = (destination) => {
            const data = cityData[destination.id];
            if (!data || !cityStory) return;
            cityStory.innerHTML = `<div class="city-story-inner"><span class="city-story-kicker">${data.kicker}</span><h1>${data.name}</h1><p class="city-story-lead">${data.lead}</p><div class="city-story-grid">${data.cards.map(([index,title,copy,source,url]) => `<article class="city-story-card"><span>${index}</span><h2>${title}</h2><p>${copy}</p><a class="city-story-source" href="${url}" target="_blank" rel="noopener">${source} ↗</a></article>`).join('')}</div></div>`;
            mapCursor.classList.remove('is-visible');
            if (cursor) cursor.style.opacity = '1';
            cityStory.style.display = 'block';
            gsap.fromTo(cityStory, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: prefersReducedMotion.matches ? 0.01 : 0.45, ease: 'power2.out' });
        };

        const layoutDestinationMarkers = () => {
            if (!map || !markers.length) return;
            const mapWidth = map.getContainer().clientWidth;
            const mapHeight = map.getContainer().clientHeight;
            const placed = [];
            const preferences = {
                napoli: ['nw', 'w', 'sw', 'n', 'ne', 's', 'e', 'se'],
                unisa: ['ne', 'n', 'e', 'nw', 'se', 's', 'w', 'sw'],
                scafati: ['se', 'e', 's', 'ne', 'sw', 'n', 'w', 'nw'],
                salerno: ['sw', 's', 'w', 'se', 'nw', 'e', 'n', 'ne']
            };
            const directions = {
                nw: (w, h) => [-w - 20, -h - 22], ne: (_w, h) => [20, -h - 22],
                se: () => [20, 22], sw: (w) => [-w - 20, 22],
                n: (w, h) => [-w / 2, -h - 26], s: (w) => [-w / 2, 26],
                e: (_w, h) => [26, -h / 2], w: (w, h) => [-w - 26, -h / 2]
            };
            const overlaps = (a, b) => a.x < b.x + b.w + 10 && a.x + a.w + 10 > b.x && a.y < b.y + b.h + 10 && a.y + a.h + 10 > b.y;
            const ordered = ['napoli', 'unisa', 'scafati', 'salerno'];

            ordered.forEach((id) => {
                const marker = markers.find((item) => item.getElement().dataset.destination === id);
                if (!marker) return;
                const element = marker.getElement();
                const label = element.querySelector('.salerno-marker-label');
                const point = map.project(marker.getLngLat());
                if (point.x < -20 || point.y < -20 || point.x > mapWidth + 20 || point.y > mapHeight + 20) {
                    element.classList.add('is-outside');
                    return;
                }
                element.classList.remove('is-outside');
                const width = label.offsetWidth;
                const height = label.offsetHeight;
                let best = null;
                preferences[id].forEach((direction, preferenceIndex) => {
                    const [dx, dy] = directions[direction](width, height);
                    const rect = { x: point.x + dx, y: point.y + dy, w: width, h: height };
                    const overflow = Math.max(0, 8 - rect.x) + Math.max(0, 8 - rect.y) + Math.max(0, rect.x + rect.w - (mapWidth - 8)) + Math.max(0, rect.y + rect.h - (mapHeight - 8));
                    const overlap = placed.reduce((sum, other) => sum + (overlaps(rect, other) ? 1 : 0), 0);
                    const centerX = dx + width / 2;
                    const centerY = dy + height / 2;
                    const score = overlap * 100000 + overflow * 1000 + Math.hypot(centerX, centerY) + preferenceIndex * 14;
                    if (!best || score < best.score) best = { score, rect, dx, dy, centerX, centerY };
                });
                label.style.left = `${best.dx}px`;
                label.style.top = `${best.dy}px`;
                const centerDistance = Math.hypot(best.centerX, best.centerY);
                const edgeDistance = Math.min(width / 2 / (Math.abs(best.centerX) / centerDistance || Infinity), height / 2 / (Math.abs(best.centerY) / centerDistance || Infinity));
                element.style.setProperty('--leader-length', `${Math.max(0, centerDistance - edgeDistance)}px`);
                element.style.setProperty('--leader-angle', `${Math.atan2(best.centerY, best.centerX)}rad`);
                placed.push(best.rect);
            });
        };

        const showCampus = () => {
            if (!campusView) return;
            mapCursor.classList.remove('is-visible');
            campusView.style.display = 'block';
            if (salernoMapElement) salernoMapElement.style.opacity = '0';
            gsap.fromTo(campusView, { opacity: 0 }, { opacity: 1, duration: prefersReducedMotion.matches ? 0.01 : 0.45 });
            if (campusMap) requestAnimationFrame(() => campusMap.resize());
            else initializeCampusMap();
        };

        const returnToLocations = () => {
            selectedDestination = false;
            if (cityStory) cityStory.style.display = 'none';
            if (campusView) campusView.style.display = 'none';
            if (salernoMapElement) salernoMapElement.style.opacity = '1';
            closeSalerno.innerHTML = '<span class="t-char">&lt;</span> BACK';
            if (map) map.easeTo({ ...getCampaniaOverview(), duration: prefersReducedMotion.matches ? 0 : 750 });
        };

        const closeOverlay = () => {
            mapOpenGeneration += 1;
            if (activeTransition) activeTransition();
            activeTransition = null;
            mapCursor.classList.remove('is-visible', 'is-dragging', 'is-action');
            window.clearTimeout(mapLoadTimeout);
            if (map) {
                map.remove();
                map = null;
                markers = [];
            }
            if (campusMap) {
                campusMap.remove();
                campusMap = null;
                campusMapReady = false;
            }
            mapReady = false;
            transitionInProgress = false;
            introInProgress = false;
            selectedDestination = false;
            if (salernoContent) salernoContent.style.display = 'none';
            if (cityStory) cityStory.style.display = 'none';
            if (campusView) campusView.style.display = 'none';
            salernoMapElement.style.opacity = '1';
            gsap.to(salernoOverlay, {
                opacity: 0,
                duration: prefersReducedMotion.matches ? 0.01 : 0.45,
                onComplete: () => {
                    salernoOverlay.style.display = 'none';
                    salernoOverlay.style.pointerEvents = 'none';
                    salernoMapElement.replaceChildren();
                    document.body.classList.remove('map-open');
                    if (cursor) {
                        cursor.style.opacity = '';
                        cursor.style.zIndex = '';
                    }
                }
            });
        };

        const showDestinationMarkers = () => {
            if (markers.length) return;
            destinations.forEach((destination) => {
                const markerButton = document.createElement('button');
                markerButton.type = 'button';
                markerButton.className = 'salerno-map-marker';
                markerButton.dataset.destination = destination.id;
                markerButton.setAttribute('aria-label', `Zoom su ${destination.label}`);
                markerButton.innerHTML = `<span class="salerno-pin-dot" aria-hidden="true"></span><span class="salerno-marker-leader" aria-hidden="true"></span><span class="salerno-marker-label">${destination.label}</span>`;
                markerButton.addEventListener('click', () => selectDestination(destination));
                markers.push(new maplibregl.Marker({ element: markerButton, anchor: 'center' }).setLngLat(destination.coordinates).addTo(map));
            });
            layoutDestinationMarkers();
            requestAnimationFrame(() => markers.forEach((marker) => marker.getElement().classList.add('is-visible')));
        };

        const selectDestination = async (destination) => {
            if (!map || transitionInProgress) return;
            selectedDestination = true;
            transitionInProgress = true;
            setMapStatus(`ZOOM · ${destination.label}`);
            mapCursor.classList.remove('is-visible');
            closeSalerno.innerHTML = '<span class="t-char">&lt;</span> MAP';
            const reduced = prefersReducedMotion.matches;
            const done = await new Promise((resolve) => {
                const finish = () => { map.off('moveend', finish); activeTransition = null; resolve(true); };
                activeTransition = () => { map.off('moveend', finish); activeTransition = null; resolve(false); };
                map.once('moveend', finish);
                map.flyTo({ center: destination.coordinates, zoom: destination.zoom, pitch: destination.type === 'campus' ? 40 : 28, bearing: destination.id === 'napoli' ? -14 : 0, duration: reduced ? 0 : 1900, curve: 1.35, speed: 0.9, essential: true });
            });
            transitionInProgress = false;
            if (!done) return;
            setMapStatus('', true);
            if (destination.type === 'city') showCityStory(destination);
            else if (destination.type === 'campus') showCampus();
            else setMapStatus('SCAFATI · ESPLORA LA MAPPA', false);
        };

        const initializeMap = () => {
            if (map || mapFailed) return;
            setMapStatus('CARICAMENTO MAPPA');
            if (!window.maplibregl) {
                mapFailed = true;
                setMapStatus('LIBRERIA MAPPA NON DISPONIBILE');
                return;
            }
            try {
                map = new maplibregl.Map({
                    container: salernoMapElement,
                    style: 'https://tiles.openfreemap.org/styles/dark',
                    center: [8, 25],
                    zoom: 1.45,
                    pitch: 0,
                    projection: { type: 'globe' },
                    interactive: true,
                    attributionControl: false,
                    fadeDuration: 0,
                    maxTileCacheSize: 24,
                    pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5)
                });
                map.once('load', () => {
                    window.clearTimeout(mapLoadTimeout);
                    mapReady = true;
                    map.setProjection({ type: 'globe' });
                    map.resize();
                    const boundaryStyle = {
                        id: 'location-boundaries-highlight',
                        type: 'line',
                        source: 'openmaptiles',
                        'source-layer': 'boundary',
                        filter: ['all', ['==', ['get', 'admin_level'], 8], ['in', ['get', 'name'], ['literal', ['Napoli', 'Scafati', 'Salerno', 'Fisciano']]]],
                        paint: {
                            'line-color': '#c8f135',
                            'line-width': ['interpolate', ['linear'], ['zoom'], 6, 1.5, 11, 3.5],
                            'line-opacity': 0.9,
                            'line-blur': 0.4
                        }
                    };
                    if (map.getStyle().sources.openmaptiles) {
                        const firstLabelLayer = map.getStyle().layers.find((layer) => layer.type === 'symbol')?.id;
                        map.addLayer(boundaryStyle, firstLabelLayer);
                    }
                    map.dragPan.enable();
                    map.on('moveend', layoutDestinationMarkers);
                    map.on('resize', layoutDestinationMarkers);
                    map.scrollZoom.disable();
                    map.touchZoomRotate.enable();
                    map.on('dragstart', () => { mapCursor.classList.add('is-dragging'); mapCursorLabel.textContent = 'MOVING MAP'; });
                    map.on('dragend', () => mapCursor.classList.remove('is-dragging'));
                    introInProgress = true;
                    setMapStatus('ZOOM · CAMPANIA');
                    const finishIntro = () => {
                        if (!introInProgress) return;
                        introInProgress = false;
                        showDestinationMarkers();
                        setMapStatus('', true);
                    };
                    if (prefersReducedMotion.matches) {
                        map.jumpTo(getCampaniaOverview());
                        finishIntro();
                    } else {
                        map.once('moveend', finishIntro);
                        map.flyTo({
                            ...getCampaniaOverview(),
                            duration: 2500,
                            curve: 1.35,
                            speed: 0.8,
                            essential: true
                        });
                    }
                });
                mapLoadTimeout = window.setTimeout(() => {
                    if (!mapReady) {
                        mapFailed = true;
                        setMapStatus('MAPPA NON DISPONIBILE — CHIUDI E RIPROVA');
                    }
                }, 15000);
                map.on('error', (event) => console.warn('Errore di caricamento della mappa.', event.error));
            } catch (error) {
                mapFailed = true;
                setMapStatus('MAPPA NON DISPONIBILE — RIPROVA PIÙ TARDI');
                console.error('Impossibile inizializzare la mappa di Salerno.', error);
            }
        };

        const openMap = () => {
            const requestGeneration = ++mapOpenGeneration;
            if (mapFailed) {
                mapFailed = false;
                mapReady = false;
                if (map) map.remove();
                map = null;
            }
            document.body.classList.add('map-open');
            if (cursor) cursor.style.zIndex = '100001';
            salernoOverlay.style.display = 'block';
            salernoOverlay.style.pointerEvents = 'auto';
            gsap.to(salernoOverlay, { opacity: 1, duration: prefersReducedMotion.matches ? 0.01 : 0.35 });
            loadMapLibrary().then(() => {
                if (requestGeneration === mapOpenGeneration && salernoOverlay.style.display === 'block') initializeMap();
            }).catch(() => {
                if (requestGeneration !== mapOpenGeneration) return;
                mapFailed = true;
                setMapStatus('MAPPA NON DISPONIBILE — RIPROVA PIÙ TARDI');
            });
        };

        salernoOverlay.addEventListener('pointermove', (event) => {
            const overMap = salernoMapElement.contains(event.target);
            if (!overMap) {
                mapCursor.classList.remove('is-visible', 'is-action');
                if (cursor) cursor.style.opacity = '1';
                return;
            }
            if (!mapReady || introInProgress || transitionInProgress || !window.matchMedia('(pointer: fine)').matches) {
                mapCursor.classList.remove('is-visible', 'is-action');
                if (cursor) cursor.style.opacity = '1';
                return;
            }

            const markerTarget = event.target.closest?.('.salerno-map-marker');
            mapCursor.style.left = `${event.clientX}px`;
            mapCursor.style.top = `${event.clientY}px`;
            mapCursor.classList.add('is-visible');
            mapCursor.classList.toggle('is-action', Boolean(markerTarget));
            mapCursorLabel.textContent = mapCursor.classList.contains('is-dragging')
                ? 'MOVING MAP'
                : markerTarget ? 'ZOOM IN' : 'DRAG TO EXPLORE';
            if (cursor) cursor.style.opacity = '0';
        });

        salernoTrigger.addEventListener('click', openMap);
        closeSalerno.addEventListener('click', () => {
            if (selectedDestination || (cityStory && cityStory.style.display === 'block') || (campusView && campusView.style.display === 'block')) returnToLocations();
            else closeOverlay();
        });

        if (campusMapElement && campusInfo) {
            const referenceToLngLat = (x, y) => [14.79067 + (x - 827) * 0.00000661, 40.7729 - (y - 552) * 0.00000485];
            const campusPoints = [
                ['F',535,215],['F3',577,60],['F4A',598,121],['F2',658,184],['F4',355,317],['F1',520,379],
                ['E1',730,540],['E',827,552],['E2',962,701],['D3',840,820],['D',939,826],['D1',1069,872],['D2',935,950],
                ['C2',1186,821],['C',1172,880],['C1',1303,1024],['B2',1155,1156],['B',1265,1160],['B1',1256,1278]
            ];
            const footprints = [
                ['F',[[366,-40],[491,-39],[666,327],[600,355],[536,449]]],['F',[[532,26],[584,8],[615,67],[557,96]]],['F',[[557,88],[612,67],[649,130],[588,161]]],['F',[[620,153],[675,128],[715,192],[654,226]]],['F',[[307,290],[373,265],[410,337],[341,374]]],['F',[[472,353],[536,326],[578,399],[507,432]]],
                ['E',[[687,400],[756,363],[1007,754],[946,792],[855,649]]],['E',[[675,580],[742,532],[789,602],[718,646]]],['E',[[925,708],[988,674],[1015,752],[947,790]]],
                ['D',[[782,827],[841,797],[886,867],[822,908]]],['D',[[879,785],[934,758],[1015,924],[956,958]]],['D',[[1026,858],[1084,831],[1120,902],[1067,934]]],['D',[[882,944],[936,910],[982,985],[924,1025]]],
                ['C',[[1017,724],[1088,688],[1288,1078],[1215,1114],[1139,963]]],['C',[[1162,788],[1209,765],[1240,820],[1194,847]]],['C',[[1140,853],[1188,828],[1224,890],[1172,922]]],['C',[[1277,997],[1333,971],[1362,1055],[1300,1096]]],
                ['B',[[1085,1148],[1164,1107],[1221,1214],[1145,1256]]],['B',[[1204,1108],[1300,1066],[1361,1184],[1260,1229]]],['B',[[1205,1250],[1270,1210],[1339,1318],[1253,1368]]]
            ];
            const fillColors = { F:'#e5d64c', E:'#4298ed', D:'#c9a77d', C:'#69ce83', B:'#f3a45f' };
            const showBuildingInfo = (code, button) => {
                const data = campusData[code];
                if (!data) return;
                campusInfo.hidden = false;
                campusMapElement.querySelectorAll('.campus-pin').forEach((pin) => pin.classList.toggle('is-selected', pin === button));
                campusInfo.innerHTML = `<span class="campus-info-hint">EDIFICIO ${code}</span><h2>${data.departments}</h2><p>${data.note}</p><a href="${data.url}" target="_blank" rel="noopener">${data.source} ↗</a>`;
            };
            initializeCampusMap = () => {
                if (campusMap || !window.maplibregl) return;
                campusMap = new maplibregl.Map({
                    container: campusMapElement,
                    style: 'https://tiles.openfreemap.org/styles/dark',
                    center: [14.79108, 40.77224],
                    zoom: window.matchMedia('(max-width: 700px)').matches ? 16.3 : 17.2,
                    pitch: 0, bearing: 0, attributionControl: false,
                    dragPan: true, scrollZoom: true, touchZoomRotate: true,
                    fadeDuration: 0,
                    maxTileCacheSize: 20,
                    pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5)
                });
                campusMap.once('load', () => {
                    campusMapReady = true;
                    campusMap.addSource('campus-footprints', { type:'geojson', data:{ type:'FeatureCollection', features:footprints.map(([family,points]) => ({ type:'Feature', properties:{ family }, geometry:{ type:'Polygon', coordinates:[[...points,points[0]].map(([x,y])=>referenceToLngLat(x,y))] } })) } });
                    campusMap.addLayer({ id:'campus-footprints-fill', type:'fill', source:'campus-footprints', paint:{ 'fill-color':['match',['get','family'],'F',fillColors.F,'E',fillColors.E,'D',fillColors.D,'C',fillColors.C,'B',fillColors.B,'#ffffff'], 'fill-opacity':0.48 } });
                    campusMap.addLayer({ id:'campus-footprints-line', type:'line', source:'campus-footprints', paint:{ 'line-color':['match',['get','family'],'F',fillColors.F,'E',fillColors.E,'D',fillColors.D,'C',fillColors.C,'B',fillColors.B,'#ffffff'], 'line-width':2, 'line-opacity':0.95 } });
                    campusMap.on('mouseenter','campus-footprints-fill',()=>{campusMap.getCanvas().style.cursor='pointer';});
                    campusMap.on('mouseleave','campus-footprints-fill',()=>{campusMap.getCanvas().style.cursor='';});
                    campusPoints.forEach(([code,x,y]) => {
                        const button = document.createElement('button');
                        button.type='button'; button.className='campus-pin'; button.textContent=code;
                        button.setAttribute('aria-label',`Edificio ${code}`);
                        button.addEventListener('click',(event)=>{event.stopPropagation();showBuildingInfo(code,button);});
                        new maplibregl.Marker({element:button,anchor:'center'}).setLngLat(referenceToLngLat(x,y)).addTo(campusMap);
                    });
                });
                document.getElementById('campus-zoom-in')?.addEventListener('click',()=>campusMap?.zoomIn());
                document.getElementById('campus-zoom-out')?.addEventListener('click',()=>campusMap?.zoomOut());
                document.getElementById('campus-reset')?.addEventListener('click',()=>campusMap?.easeTo({center:[14.79108,40.77224],zoom:window.matchMedia('(max-width: 700px)').matches?16.3:17.2,pitch:0,bearing:0,duration:500}));
            };
        }
    }

}); // DOMContentLoaded end
