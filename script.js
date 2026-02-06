// Wait for DOM and GSAP to be ready
document.addEventListener("DOMContentLoaded", () => {
    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lenis smooth scroll (shared instance)
    // Spotlight section creates its own Lenis instance in spotlight.js
    // We'll let spotlight.js handle Lenis initialization if the section exists
    let lenisScroll = null;
    const spotlightSection = document.querySelector(".spotlight");
    
    if (typeof Lenis !== 'undefined') {
        // If Spotlight section exists, spotlight.js will create its own Lenis instance
        // Otherwise, create one for the rest of the page
        if (!spotlightSection) {
            lenisScroll = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false,
            });
            
            lenisScroll.on("scroll", ScrollTrigger.update);
            
            function raf(time) {
                lenisScroll.raf(time);
                requestAnimationFrame(raf);
            }
            
            requestAnimationFrame(raf);
        } else {
            // Spotlight section exists - spotlight.js will handle Lenis
            // Just ensure ScrollTrigger is refreshed
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
        }
        
        // Refresh ScrollTrigger after Lenis is ready
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        
        gsap.ticker.lagSmoothing(0);
    } else {
        console.warn('Lenis not available — falling back to native scrolling');
    }
    
    // Ensure body can scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // Navigation smooth scroll
    function initNavigation() {
        const navLinks = document.querySelectorAll('#main-nav .nav-link');
        const navElement = document.querySelector('#main-nav');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                
                // Check if it's an external HTML file link (not a hash/anchor)
                if (targetId && (targetId.endsWith('.html') || targetId.includes('/'))) {
                    // Allow normal navigation for HTML file links
                    // Don't prevent default - let browser navigate normally
                    return;
                }
                
                // For hash/anchor links, do smooth scroll
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = navElement?.offsetHeight || 80;
                    
                    // Try to use Lenis if available (either from main or spotlight)
                    let lenisInstance = lenisScroll;
                    if (!lenisInstance && typeof window.lenisInstance !== 'undefined') {
                        lenisInstance = window.lenisInstance;
                    }
                    
                    if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
                        // Use Lenis smooth scroll
                        lenisInstance.scrollTo(targetElement, {
                            offset: -navHeight, // Offset for fixed nav
                            duration: 1.5,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });
                    } else {
                        // Fallback to native smooth scroll with offset for fixed nav
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - navHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    initNavigation();

    // Cursor Effect
    function cursorEffect() {
        const page1Content = document.querySelector("#page1-content");
        const cursor = document.querySelector("#cursor");
        
        if (!page1Content || !cursor) return;

        page1Content.addEventListener("mousemove", function(dets){
            gsap.to(cursor, {
                x: dets.x,
                y: dets.y
            });
        });

        page1Content.addEventListener("mouseenter", function(){
            gsap.to(cursor, {
                scale: 1,
                opacity: 1
            });
        });

        page1Content.addEventListener("mouseleave", function(){
            gsap.to(cursor, {
                scale: 0,
                opacity: 0
            });
        });
    }
    cursorEffect();

    // Page 2 Animation
    function page2Animation() { 
        const textContent = document.querySelector("#text-content h1");
        if (!textContent) return;
        
        gsap.from("#text-content h1", {
            y: 120,
            stagger: 0.25,
            duration: 1,
            scrollTrigger: {
                trigger: "#page2",
                start: "top 60%",
                end: "top 40%",
                scrub: 2
            }
        });
    }
    page2Animation();

    // Sticky Cards Animation
    const cardContainers = document.querySelector('.card-container');
    const stickyHeader = document.querySelector('.sticky-header h1');
    const stickySection = document.querySelector('.sticky');

    let isGapAnimationCompleted = false;
    let isFlipAnimationCompleted = false;

    function initAnimations() {
       // Only run if sticky section exists
       if (!stickySection || !cardContainers || !stickyHeader) {
           return;
       }

       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());   

       const mm = gsap.matchMedia();

       mm.add("(max-width: 999px)", () => {
        document
        .querySelectorAll('.card, .card-container, .sticky-header h1')
        .forEach((el) => (el.style = ""));
        return{};
    });

    mm.add("(min-width: 1000px)", () => {
        ScrollTrigger.create({
            trigger: '.sticky',
            start: 'top top',
            end: `${window.innerHeight * 4}px`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
                const progress = self.progress;

                if (progress >= 0.1 && progress <= 0.25) {
                    const headerProgress = gsap.utils.mapRange(
                        0.1, 
                        0.25, 
                        0,
                        1,
                        progress
                    );
                    const yValue = gsap.utils.mapRange(0, 1, 40, 0, headerProgress);
                    const opacityValue = gsap.utils.mapRange(
                        0,
                        1,
                        0,
                        1,
                        headerProgress
                    );

                    gsap.set(stickyHeader, {
                        y: yValue,
                        opacity: opacityValue,
                    });
                } else if (progress < 0.1){
                    gsap.set(stickyHeader, {
                        y: 40,
                        opacity: 0,
                    });
                } else if (progress > 0.25) {
                    gsap.set(stickyHeader, {
                        y: 0,
                        opacity: 1,
                    })
                }

                if(progress <=0.25){
                    const widthPercent = gsap.utils.mapRange(
                        0,
                        0.25,
                        75,
                        60,
                        progress
                    );
                    gsap.set(cardContainers, { width: `${widthPercent}%` });
                } else {
                    gsap.set(cardContainers, { width: `60%` });
                }

                if (progress >= 0.35 && !isGapAnimationCompleted){
                    gsap.to(cardContainers,{
                        gap: "20px",
                        duration: 0.5,
                        ease : "power3.out",
                    })

                gsap.to(["#card-1", "#card-2", "#card-3"], {
                    borderRadius: "20px",
                    duration: 0.5,
                    ease : "power3.out",
                });
                
                isGapAnimationCompleted = true;
                } else if (progress < 0.35 && isGapAnimationCompleted){
                    gsap.to(cardContainers,{
                        gap: "0px",
                        duration: 0.5,
                        ease : "power3.out",
                    });

                    gsap.to("#card-1", {
                        borderRadius: "20px 0 0 20px",
                        duration: 0.5,
                        ease : "power3.out",
                    }); 

                     gsap.to("#card-2", {
                        borderRadius: " 0px",
                        duration: 0.5,
                        ease : "power3.out",
                    }); 

                    gsap.to("#card-3", {
                        borderRadius: "0 20px 20px 0",
                        duration: 0.5,
                        ease : "power3.out",
                    });

                    isGapAnimationCompleted = false;
                }

                if (progress >= 0.45 && !isFlipAnimationCompleted){
                    gsap.to(".card", {
                        rotationY: 180,
                        duration: 0.75,
                        ease: "power3.inOut",
                        stagger: 0.1,
                    });
                    gsap.to(["#card-1", "#card-3"], {
                        y:30,
                        rotationZ: (i) => [-15, 15][i],
                        duration: 0.75,
                        ease: "power3.inOut",
                    });
                    isFlipAnimationCompleted = true;
                } else if (progress < 0.7 && isFlipAnimationCompleted){
                    gsap.to(".card", {
                        rotationY: 0,
                        duration: 0.75,
                        ease: "power3.inOut",
                        stagger: 0.1,
                    });
                    gsap.to(["#card-1", "#card-3"], {
                        y:0,
                        rotationZ: 0,
                        duration: 0.75,
                        ease: "power3.inOut",
                    });
                    isFlipAnimationCompleted = false;
                }
            },
        });
     });
    }


    initAnimations();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initAnimations();
        }, 250);
    });

    // Marquee Cards Animation
    function initMarqueeAnimation() {
        // Simple SplitText alternative for character splitting
        function splitText(element, options = {}) {
            const charsClass = options.charsClass || 'char';
            const tag = options.tag || 'div';
            const text = element.textContent;
            const chars = [];
            
            element.innerHTML = '';
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const charEl = document.createElement(tag);
                charEl.className = charsClass;
                charEl.innerHTML = `<span>${char === ' ' ? '&nbsp;' : char}</span>`;
                element.appendChild(charEl);
                chars.push(charEl);
            }
            
            return { chars: chars };
        }

    const cards = gsap.utils.toArray(".m-card");
    if (cards.length === 0) return;
    
    const introCard = cards[0];

    const titles = gsap.utils.toArray(".m-card-title h1");
    titles.forEach ((title) =>{
        try {
            const split = splitText(title, {
                charsClass: "char",
                tag: "div",
            });
            // Set initial state for character animations
            if (split && split.chars) {
                split.chars.forEach((char) => {
                    const span = char.querySelector("span");
                    if (span) {
                        gsap.set(span, { x: "100%" });
                    }
                });
            }
        } catch (e) {
            console.warn("SplitText error:", e);
        }
    });       

    const cardImgWrapper = introCard.querySelector(".m-card-img");
    const cardImg = introCard.querySelector('.m-card-img img');
    if (cardImgWrapper && cardImg) {
        gsap.set(cardImgWrapper, { scale: 0.5, borderRadius: "400px"});
        gsap.set(cardImg, { scale: 1.5});
    }

    function animateContentIn(titleChars, description){
        gsap.to(titleChars, {x: "0%", duration:0.75, ease: "power4.out"});
        gsap.to(description,{
            x: 0,
            opacity: 1,
            duration: 0.75,
            delay: 0.1,
            ease: "power4.out",
        });
    }

    function animateContentOut(titleChars, description){
        gsap.to(titleChars, {x: "100%", duration:0.5, ease: "power4.out"});
        gsap.to(description,{
            x: "40px",
            opacity: 0,
            duration: 0.5,
            delay: 0.1,
            ease: "power4.out",
        });
    }
    
    const marquee = introCard.querySelector(".card-marquee .marquee");
    const titleChars = introCard.querySelectorAll(".char span");
    const description = introCard.querySelector(".m-card-description");

    if (cardImgWrapper && cardImg) {
        ScrollTrigger.create({
            trigger: introCard,
            start: "top top",
            end: "+=300vh",
            onUpdate: (self) => {
                const progress = self.progress;
                const imgScale = 0.5 + progress * 0.5;
                const borderRadius = 400 - progress * 375;
                const innerImagScale = 1.5 - progress * 0.5;

                gsap.set(cardImgWrapper,{
                    scale: imgScale,
                    borderRadius: borderRadius + "px",
                });
                gsap.set(cardImg, { scale: innerImagScale});

                if (marquee) {
                    if (imgScale > 0.5 && imgScale < 0.75){
                        const fadeProgress = (imgScale - 0.5) / (0.75 - 0.5);
                        gsap.set(marquee, {opacity : 1 - fadeProgress});
                    }else if (imgScale < 0.5){
                        gsap.set(marquee, {opacity:1});
                    }else if (imgScale > 0.75){
                        gsap.set(marquee, { opacity: 0});
                    }
                }
                
                if (titleChars.length > 0 && description) {
                    if (progress > 1 && !introCard.contentRevealed){
                        introCard.contentRevealed = true;
                        animateContentIn(titleChars, description);
                    }
                    if (progress < 1 && introCard.contentRevealed){
                        introCard.contentRevealed = false;
                        animateContentOut(titleChars, description);
                    }
                }
            },
        });
    }

            cards.forEach((card, index) => {
              const isLastCard = index === cards.length - 1;
               ScrollTrigger.create({
                 trigger: card,
                  start: "top top",
                end: isLastCard ? "+=100vh": "top top",
                endTrigger: isLastCard ? null : cards [cards.length - 1],
                 pin: true,
                 pinSpacing: isLastCard,
          });
        });

        cards.forEach((card, index) => {
          if (index < cards.length - 1) {
            const cardImgWrapper = card.querySelector(".m-card-img");
            ScrollTrigger.create({
              trigger: cards[index + 1],
              start: "top bottom",
              end: "top top",
              onUpdate: (self) => {
               const progress = self.progress;
               gsap.set(cardImgWrapper, {
                 scale: 1 - progress * 0.25,
                opacity: 1 - progress,
                });
              },
            });
        }       
        });

        cards.forEach((card, index) => {
          if (index > 0) {
            const cardImg = card.querySelector(".m-card-img img");
            const imgContainer = card.querySelector(".m-card-img");
            ScrollTrigger.create({
              trigger: card,
              start: "top bottom",
              end: "top top",
              onUpdate: (self) => {
                const progress = self.progress;
                gsap.set(cardImg, {scale: 2 - progress });
                gsap.set(imgContainer, {borderRadius: 150 - progress * 125 + "px"});
           },
        });
      }
   });

    cards.forEach((card, index) => {
      if (index === 0) return;

     const cardDescription = card.querySelector(".m-card-description");
     const cardTitleChars = card.querySelectorAll(".char span");

     ScrollTrigger.create({
     trigger: card,
     start: "top top",
     onEnter: () =>animateContentIn (cardTitleChars, cardDescription),
     onLeaveBack: () => animateContentOut (cardTitleChars, cardDescription),
});
});
        // Setup marquee animation if function exists
        if (typeof setupMarqueeAnimation === 'function') {
            setupMarqueeAnimation();
        }
    }
    
    // Initialize marquee animation
    initMarqueeAnimation();
    
    // Final refresh to ensure everything is set up correctly
    setTimeout(() => {
        ScrollTrigger.refresh();
        if (lenisScroll) {
            lenisScroll.resize();
        }
    }, 200);

    // ============================
    // Work Page Specific Scripts
    // (moved from work.html)
    // ============================

    // Navigation menu interaction and navbar effects for Work page
    function initWorkPageNav() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.addEventListener('click', () => {
                const contact = document.querySelector('a[href="contact.html"]');
                if (contact) contact.click();
            });
        }

        // Smooth scroll for hash links (e.g. #portfolio) on the same page
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Add scroll effect to navbar using ScrollTrigger (if available)
        const navbar = document.getElementById('main-nav');
        if (navbar && typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                start: "top -50",
                end: "max",
                onEnter: () => navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)',
                onLeaveBack: () => navbar.style.boxShadow = 'none'
            });
        }
    }

    // Initialize Work page nav / header behavior
    initWorkPageNav();

    // SVG transition animation for opening/closing the portfolio modal
    let portfolioTransitionController = null;
    function initPortfolioTransition() {
        const overlay = document.querySelector('.portfolio-transition-overlay');
        const path = overlay?.querySelector('.portfolio-transition-path');

        if (!overlay || !path || typeof gsap === 'undefined') return null;

        const start = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
        const end = "M 0 100 V 0 Q 50 0 100 0 V 100 z";

        const tl = gsap.timeline({ paused: true });

        tl.to(path, {
            attr: { d: start },
            ease: "power2.in",
            duration: 0.45
        }).to(path, {
            attr: { d: end },
            ease: "power2.out",
            duration: 0.45
        });

        function playOpen(onComplete) {
            overlay.classList.add('active');
            tl.eventCallback("onComplete", () => {
                if (typeof onComplete === 'function') onComplete();
            });
            tl.play(0);
        }

        function playClose(onComplete) {
            tl.eventCallback("onReverseComplete", () => {
                overlay.classList.remove('active');
                if (typeof onComplete === 'function') onComplete();
            });
            tl.reverse();
        }

        return { playOpen, playClose };
    }

    portfolioTransitionController = initPortfolioTransition();

    // Work page – portfolio cards scroll‑reveal animation
    function initPortfolioCardScrollReveal() {
        const portfolioSection = document.getElementById('portfolio');
        if (!portfolioSection || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const cards = portfolioSection.querySelectorAll('.portfolio-card');
        if (!cards.length) return;

        // Initial state
        gsap.set(cards, { opacity: 0, y: 50 });

        // Staggered reveal for a subtle cinematic entrance
        gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
                trigger: portfolioSection,
                start: 'top 75%',
                end: 'bottom 60%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    // Portfolio cards: open details in modal on click (with transition)
    function initPortfolioModal() {
        const cards = document.querySelectorAll('.portfolio-card');
        const modalBackdrop = document.getElementById('portfolio-modal');
        if (!cards.length || !modalBackdrop) return;

        const modalImage = modalBackdrop.querySelector('.portfolio-modal-image img');
        const modalTitle = modalBackdrop.querySelector('.portfolio-modal-title');
        const modalSubtitle = modalBackdrop.querySelector('.portfolio-modal-subtitle');
        const modalDescription = modalBackdrop.querySelector('.portfolio-modal-description');
        const modalDetails = modalBackdrop.querySelector('.portfolio-modal-details');
        const modalButton = modalBackdrop.querySelector('.portfolio-modal-button');
        const closeBtn = modalBackdrop.querySelector('.portfolio-modal-close');

        function openModalFromCard(card) {
            const img = card.querySelector('.card-image img');
            const content = card.querySelector('.card-content');

            const titleEl = content?.querySelector('.card-title');
            const subtitleEl = content?.querySelector('.card-subtitle');
            const descEl = content?.querySelector('.card-description');
            const detailsEl = content?.querySelector('.card-details');
            const buttonEl = content?.querySelector('.card-button');

            if (img && modalImage) {
                modalImage.src = img.getAttribute('src') || '';
                modalImage.alt = img.getAttribute('alt') || '';
            }

            if (modalTitle) modalTitle.textContent = titleEl?.textContent || '';
            if (modalSubtitle) modalSubtitle.textContent = subtitleEl?.textContent || '';
            if (modalDescription) modalDescription.textContent = descEl?.textContent || '';

            if (modalDetails) {
                modalDetails.innerHTML = detailsEl ? detailsEl.innerHTML : '';
            }

            if (modalButton) {
                if (buttonEl && buttonEl.getAttribute('href') && buttonEl.getAttribute('href') !== '#') {
                    modalButton.href = buttonEl.getAttribute('href');
                    modalButton.style.display = 'inline-flex';
                } else {
                    modalButton.href = '#';
                    modalButton.style.display = 'none';
                }
            }

            modalBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modalBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        }

        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent jumping for inner "#" links inside the card
                if (e.target.closest('a')) {
                    e.preventDefault();
                }

                const open = () => openModalFromCard(card);

                if (portfolioTransitionController) {
                    portfolioTransitionController.playOpen(open);
                } else {
                    open();
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();

                const finish = () => closeModal();
                if (portfolioTransitionController) {
                    portfolioTransitionController.playClose(finish);
                } else {
                    finish();
                }
            });
        }

        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                const finish = () => closeModal();
                if (portfolioTransitionController) {
                    portfolioTransitionController.playClose(finish);
                } else {
                    finish();
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
                const finish = () => closeModal();
                if (portfolioTransitionController) {
                    portfolioTransitionController.playClose(finish);
                } else {
                    finish();
                }
            }
        });
    }

    initPortfolioCardScrollReveal();
    initPortfolioModal();

    // Horizontal scroll portfolio section for Work page
    // Disabled: cards are now shown in a static grid without scroll animation
    // (kept here commented for reference if needed in future)
});
