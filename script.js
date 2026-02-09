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

    // Setup mobile cards vertical scroll with left/right slide animations
    function setupMobileCardsScroll() {
        const cardsContainer = document.querySelector(".m-cards");
        const cards = document.querySelectorAll(".m-card");
        
        if (!cardsContainer || cards.length === 0 || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        // Kill any existing ScrollTriggers for m-cards
        ScrollTrigger.getAll().forEach(trigger => {
            const triggerElement = trigger.vars && trigger.vars.trigger;
            if (triggerElement && triggerElement.closest && triggerElement.closest('.m-cards')) {
                trigger.kill();
            }
        });
        
        // Reset all GSAP transforms and set initial states
        cards.forEach((card, index) => {
            // Clear all transforms
            gsap.set(card, { clearProps: "all" });
            const imgWrapper = card.querySelector(".m-card-img");
            const img = card.querySelector(".m-card-img img");
            const cardContent = card.querySelector(".m-card-content");
            const cardTitle = card.querySelector(".m-card-title");
            const cardDescription = card.querySelector(".m-card-description");
            
            if (imgWrapper) gsap.set(imgWrapper, { clearProps: "all" });
            if (img) gsap.set(img, { clearProps: "all" });
            if (cardContent) gsap.set(cardContent, { clearProps: "all" });
            if (cardTitle) gsap.set(cardTitle, { clearProps: "all" });
            if (cardDescription) gsap.set(cardDescription, { clearProps: "all" });
            
            // Set initial position - alternate left/right
            const isEven = index % 2 === 0;
            const xOffset = isEven ? -100 : 100; // Even index = left, Odd index = right
            
            gsap.set(card, {
                x: xOffset + "%",
                opacity: 0
            });
            
            // Animate card sliding in from left or right
            ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                end: "top 20%",
                onEnter: () => {
                    gsap.to(card, {
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out"
                    });
                },
                onLeaveBack: () => {
                    gsap.to(card, {
                        x: xOffset + "%",
                        opacity: 0,
                        duration: 0.6,
                        ease: "power3.in"
                    });
                }
            });
        });
    }

    // Marquee Cards Animation
    function initMarqueeAnimation() {
        // Skip animations on tablet and mobile (<= 1024px)
        if (window.innerWidth <= 1024) {
            // Setup simple horizontal scroll for mobile/tablet
            setupMobileCardsScroll();
            return;
        }

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
    
    // Handle resize for m-cards
    let mCardsResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(mCardsResizeTimer);
        mCardsResizeTimer = setTimeout(() => {
            // Kill all m-cards related ScrollTriggers
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.getAll().forEach(trigger => {
                    const triggerElement = trigger.vars && trigger.vars.trigger;
                    if (triggerElement && triggerElement.closest && triggerElement.closest('.m-cards')) {
                        trigger.kill();
                    }
                });
            }
            // Reinitialize
            initMarqueeAnimation();
            ScrollTrigger.refresh();
        }, 250);
    });
    
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

    // Portfolio cards: open details in modal on click (with transition)
    function initPortfolioModal() {
        const cards = document.querySelectorAll('.portfolio-card');
        const modalBackdrop = document.getElementById('portfolio-modal');
        if (!cards.length || !modalBackdrop) return;

        const modalImage = modalBackdrop.querySelector('.portfolio-modal-image img');
        const heroMainImg = modalBackdrop.querySelector('.hero-main-img');
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

            if (img) {
                const targetImg = heroMainImg || modalImage;
                if (targetImg) {
                    targetImg.src = img.getAttribute('src') || '';
                    targetImg.alt = img.getAttribute('alt') || '';
                }
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
            // Hide navbar when modal opens
            const mainNav = document.getElementById('main-nav');
            if (mainNav) {
                mainNav.classList.add('modal-open');
            }
        }

        function closeModal() {
            modalBackdrop.classList.remove('open');
            document.body.style.overflow = '';
            // Show navbar when modal closes
            const mainNav = document.getElementById('main-nav');
            if (mainNav) {
                mainNav.classList.remove('modal-open');
            }
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

    initPortfolioModal();

    // Portfolio Modal Image Navigation for Mobile
    function initPortfolioImageNav() {
        const modalBackdrop = document.getElementById('portfolio-modal');
        if (!modalBackdrop) return;

        const imageContainer = modalBackdrop.querySelector('.portfolio-modal-image');
        if (!imageContainer) return;

        const heroMain = imageContainer.querySelector('.hero-main-img');
        const heroSides = imageContainer.querySelectorAll('.hero-side-img');
        const prevBtn = modalBackdrop.querySelector('.portfolio-nav-prev');
        const nextBtn = modalBackdrop.querySelector('.portfolio-nav-next');
        const navDots = modalBackdrop.querySelectorAll('.nav-dot');

        if (!heroMain || !prevBtn || !nextBtn || heroSides.length === 0) return;

        // Collect all images
        const images = [heroMain, ...Array.from(heroSides)];
        let currentIndex = 0;

        function updateImage(index) {
            if (index < 0 || index >= images.length) return;

            // Update image visibility with fade effect
            images.forEach((img, i) => {
                if (i === index) {
                    img.style.opacity = '1';
                    img.style.zIndex = '2';
                } else {
                    img.style.opacity = '0';
                    img.style.zIndex = '0';
                }
            });

            // Update dots
            navDots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            currentIndex = index;
        }

        // Next button
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextIndex = (currentIndex + 1) % images.length;
            updateImage(nextIndex);
        });

        // Prev button
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage(prevIndex);
        });

        // Dot navigation
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                updateImage(index);
            });
        });

        // Reset to first image when modal opens
        const observer = new MutationObserver(() => {
            if (modalBackdrop.classList.contains('open')) {
                updateImage(0);
            }
        });

        observer.observe(modalBackdrop, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Initialize
        updateImage(0);
    }

    initPortfolioImageNav();

    // Work page: scroll-based animation for portfolio cards
    function initWorkPortfolioScrollAnimation() {
        const portfolioSection = document.getElementById('portfolio');
        if (!portfolioSection || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const cardWrappers = gsap.utils.toArray('#portfolio .project-wrap');
        if (!cardWrappers.length) return;

        // Simple text splitter (chars only) – lightweight alternative to SplitText
        function splitHeadingToChars(headingEl) {
            const text = headingEl.textContent || '';
            const chars = [];
            headingEl.textContent = '';

            for (let i = 0; i < text.length; i++) {
                const span = document.createElement('span');
                span.classList.add('card-title-char');
                span.textContent = text[i];
                headingEl.appendChild(span);
                chars.push(span);
            }
            return chars;
        }

        cardWrappers.forEach((wrap, index) => {
            const card = wrap.querySelector('.portfolio-card');
            const title = wrap.querySelector('.card-title');
            const image = wrap.querySelector('.card-image img');

            if (!card || !title) return;

            const chars = splitHeadingToChars(title);
            const isLastCard = index === cardWrappers.length - 1;

            // Initial state
            gsap.set(card, { opacity: 0, y: 80 });
            gsap.set(chars, { autoAlpha: 0, yPercent: 150 });
            if (image) {
                gsap.set(image, { scale: 1.05, yPercent: 10 });
            }

            // Main entry + dwell animation (pin all except last card)
            gsap.timeline({
                scrollTrigger: {
                    trigger: wrap,
                    // Align the vertical center of the wrapper with the viewport center
                    start: 'center center',
                    // Keep non‑last cards pinned for roughly one viewport of scroll
                    end: isLastCard ? '+=60%' : '+=100%',
                    pin: !isLastCard,
                    // Don't add extra space after each pinned card – prevents white gaps between cards
                    pinSpacing: !isLastCard ? false : true,
                    scrub: false,
                    toggleActions: 'play reverse play reverse'
                },
                defaults: { ease: 'power2.out' }
            })
                .to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9
                })
                .to(
                    chars,
                    {
                        autoAlpha: 1,
                        yPercent: 0,
                        duration: 0.9,
                        stagger: { each: 0.018, from: 'random' }
                    },
                    0.1
                )
                .to(
                    image || {},
                    {
                        scale: image ? 1 : undefined,
                        yPercent: image ? 0 : undefined,
                        duration: image ? 1.1 : 0
                    },
                    0
                );

            // Soft fade-out when leaving the focus area
            ScrollTrigger.create({
                trigger: wrap,
                start: 'center center',
                end: isLastCard ? 'center top' : 'bottom top',
                onLeave: () => {
                    gsap.to(card, {
                        opacity: 0,
                        y: -80,
                        duration: 0.6,
                        ease: 'power2.inOut'
                    });
                },
                onEnterBack: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    initWorkPortfolioScrollAnimation();

    // Horizontal scroll portfolio section for Work page
    // Disabled: cards are now shown in a static layout without horizontal scroll
    // (kept here commented for reference if needed in future)

    // Mobile Navigation Toggle
    function initMobileNav() {
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        const nav = document.getElementById('main-nav');

        if (!navToggle || !navLinks) return;

        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !nav.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Navbar scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (nav) {
                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
            
            lastScroll = currentScroll;
        });
    }

    initMobileNav();

    // ============================
    // Contact Form Handler
    // ============================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitButton = document.getElementById('submitButton');
        const formMessage = document.getElementById('formMessage');
        const messageTextarea = document.getElementById('message');
        const charCounter = document.getElementById('message-counter');
        
        if (!form) return;

        // Character counter for message field
        if (messageTextarea && charCounter) {
            const maxLength = 1000;
            messageTextarea.addEventListener('input', function() {
                const length = this.value.length;
                charCounter.textContent = `${length} / ${maxLength}`;
                
                // Update counter styling
                charCounter.classList.remove('warning', 'error');
                if (length > maxLength * 0.9) {
                    charCounter.classList.add('warning');
                }
                if (length > maxLength) {
                    charCounter.classList.add('error');
                }
            });
        }

        // Validation functions
        function validateName(name) {
            if (!name || name.trim().length < 2) {
                return 'Name must be at least 2 characters long';
            }
            if (name.trim().length > 100) {
                return 'Name must be less than 100 characters';
            }
            return '';
        }

        function validateEmail(email) {
            if (!email) {
                return 'Email is required';
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return 'Please enter a valid email address';
            }
            return '';
        }

        function validatePhone(phone) {
            if (!phone) return ''; // Phone is optional
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
                return 'Please enter a valid phone number';
            }
            return '';
        }

        function validateSubject(subject) {
            if (!subject || subject.trim().length < 3) {
                return 'Subject must be at least 3 characters long';
            }
            if (subject.trim().length > 200) {
                return 'Subject must be less than 200 characters';
            }
            return '';
        }

        function validateMessage(message) {
            if (!message || message.trim().length < 10) {
                return 'Message must be at least 10 characters long';
            }
            if (message.length > 1000) {
                return 'Message must be less than 1000 characters';
            }
            return '';
        }

        // Show error for a field
        function showFieldError(fieldId, errorMessage) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(`${fieldId}-error`);
            
            if (field && errorElement) {
                field.classList.add('error');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
                field.setAttribute('aria-invalid', 'true');
            }
        }

        // Clear error for a field
        function clearFieldError(fieldId) {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(`${fieldId}-error`);
            
            if (field && errorElement) {
                field.classList.remove('error');
                errorElement.textContent = '';
                errorElement.classList.remove('show');
                field.setAttribute('aria-invalid', 'false');
            }
        }

        // Real-time validation
        const fields = {
            name: validateName,
            email: validateEmail,
            phone: validatePhone,
            subject: validateSubject,
            message: validateMessage
        };

        Object.keys(fields).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                // Validate on blur
                field.addEventListener('blur', function() {
                    const error = fields[fieldId](this.value);
                    if (error) {
                        showFieldError(fieldId, error);
                    } else {
                        clearFieldError(fieldId);
                    }
                });

                // Clear error on input (for better UX)
                field.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        const error = fields[fieldId](this.value);
                        if (!error) {
                            clearFieldError(fieldId);
                        }
                    }
                });
            }
        });

        // Show form message
        function showFormMessage(message, type) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type} show`;
            formMessage.setAttribute('role', 'alert');
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide success message after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.classList.remove('show');
                }, 5000);
            }
        }

        // Hide form message
        function hideFormMessage() {
            formMessage.classList.remove('show');
        }

        // Set loading state
        function setLoadingState(isLoading) {
            if (isLoading) {
                submitButton.classList.add('loading');
                submitButton.disabled = true;
            } else {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        }

        // Validate entire form
        function validateForm() {
            let isValid = true;
            const formData = new FormData(form);

            // Validate all fields
            const nameError = validateName(formData.get('name'));
            const emailError = validateEmail(formData.get('email'));
            const phoneError = validatePhone(formData.get('phone'));
            const subjectError = validateSubject(formData.get('subject'));
            const messageError = validateMessage(formData.get('message'));

            if (nameError) {
                showFieldError('name', nameError);
                isValid = false;
            } else {
                clearFieldError('name');
            }

            if (emailError) {
                showFieldError('email', emailError);
                isValid = false;
            } else {
                clearFieldError('email');
            }

            if (phoneError) {
                showFieldError('phone', phoneError);
                isValid = false;
            } else {
                clearFieldError('phone');
            }

            if (subjectError) {
                showFieldError('subject', subjectError);
                isValid = false;
            } else {
                clearFieldError('subject');
            }

            if (messageError) {
                showFieldError('message', messageError);
                isValid = false;
            } else {
                clearFieldError('message');
            }

            return isValid;
        }

        // Form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Hide previous messages
            hideFormMessage();
            
            // Validate form
            if (!validateForm()) {
                showFormMessage('Please correct the errors in the form before submitting.', 'error');
                // Focus on first error field
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
                return;
            }

            // Set loading state
            setLoadingState(true);

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                phone: formData.get('phone')?.trim() || '',
                subject: formData.get('subject').trim(),
                message: formData.get('message').trim()
            };

            try {
                // Using FormSubmit - Simplest email service (No signup, no API keys needed!)
                // FormSubmit automatically handles form submission and sends email to skjuned7666@gmail.com
                // Just submit the form normally - FormSubmit will handle the rest
                
                // Prepare form data for FormSubmit
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('email', data.email);
                formData.append('phone', data.phone || 'Not provided');
                formData.append('subject', data.subject);
                formData.append('message', data.message);
                formData.append('_subject', 'New Contact Form Submission from H9Y Studio');
                formData.append('_captcha', 'false');
                formData.append('_template', 'box');

                // Submit form to FormSubmit
                const response = await fetch('https://formsubmit.co/ajax/skjuned7666@gmail.com', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                // Check if email was sent successfully
                if (result.success) {
                    // Success
                    showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                } else {
                    throw new Error(result.message || 'Failed to send email');
                }
                
                // Reset form
                form.reset();
                
                // Reset character counter
                if (charCounter) {
                    charCounter.textContent = '0 / 1000';
                    charCounter.classList.remove('warning', 'error');
                }
                
                // Clear all errors
                Object.keys(fields).forEach(fieldId => {
                    clearFieldError(fieldId);
                });

                // Focus on name field after successful submission
                const nameField = document.getElementById('name');
                if (nameField) {
                    setTimeout(() => nameField.focus(), 100);
                }

            } catch (error) {
                console.error('Form submission error:', error);
                console.error('Error details:', {
                    message: error.message,
                    text: error.text,
                    status: error.status
                });

                // Show specific error messages
                let errorMessage = 'Sorry, there was an error sending your message. ';
                
                if (error.message && error.message.includes('credentials not configured')) {
                    errorMessage = 'EmailJS is not configured yet. Please contact the website administrator.';
                } else if (error.message && error.message.includes('library not loaded')) {
                    errorMessage = 'Email service is not available. Please try again later.';
                } else if (error.text) {
                    errorMessage += 'Error: ' + error.text;
                } else if (error.message) {
                    errorMessage += error.message;
                } else {
                    errorMessage += 'Please try again later or contact us directly at skjuned7666@gmail.com';
                }

                showFormMessage(errorMessage, 'error');
            } finally {
                setLoadingState(false);
            }
        });
    }

    // Initialize contact form
    initContactForm();
});
