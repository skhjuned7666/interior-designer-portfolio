if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
gsap.registerPlugin(ScrollTrigger);
}

const config = {
gap: 0.08,
speed: 0.3,
arcRadius: 500,
};

const spotlightItems = [
{ name: "Silent Arc", img: "iconiqa 16.webp" },
{ name: "Bloom24", img: "iconiqa 3.jpg" },
{ name: "Glass Fade", img: "iconiqa 4.jpg" },
{ name: "Echo 9", img: "iconiqa 5.webp" },
{ name: "Velvet Loop", img: "iconiqa 10.jpg" },
{ name: "Field Two", img: "iconiqa 20.webp" },
{ name: "Pale Thread", img: "iconiqa 23.jpg" },
{ name: "Stillroom", img: "iconiqa 26.jpg" },
{ name: "Ghostline", img: "iconiqa 3.jpg" },
{ name: "Mono 73", img: "iconiqa 4.jpg" },
];

// Slider functionality for mobile/tablet
function initSpotlightSlider() {
    const sliderTrack = document.querySelector(".spotlight-slider-track");
    const progressBar = document.querySelector(".spotlight-slider-progress-bar");
    const progressContainer = document.querySelector(".spotlight-slider-progress");
    const prevBtn = document.querySelector(".spotlight-slider-prev");
    const nextBtn = document.querySelector(".spotlight-slider-next");
    
    if (!sliderTrack || !progressBar || !progressContainer || !prevBtn || !nextBtn) {
        console.warn("Spotlight slider elements not found");
        return;
    }
    
    // Clear existing content
    sliderTrack.innerHTML = "";
    
    let currentSlide = 0;
    
    // Create slides
    spotlightItems.forEach((item, index) => {
        // Create slide
        const slide = document.createElement("div");
        slide.className = "spotlight-slide";
        
        const image = document.createElement("img");
        image.src = item.img;
        image.alt = item.name;
        image.className = "spotlight-slide-image";
        
        const content = document.createElement("div");
        content.className = "spotlight-slide-content";
        
        const title = document.createElement("h2");
        title.className = "spotlight-slide-title";
        title.textContent = item.name;
        
        content.appendChild(title);
        slide.appendChild(image);
        slide.appendChild(content);
        sliderTrack.appendChild(slide);
    });
    
    // Update slider position
    function updateSlider() {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update progress bar
        const progress = ((currentSlide + 1) / spotlightItems.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === spotlightItems.length - 1;
    }
    
    // Click on progress bar to navigate
    progressContainer.addEventListener("click", (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const targetSlide = Math.floor(percentage * spotlightItems.length);
        goToSlide(Math.min(targetSlide, spotlightItems.length - 1));
    });
    
    // Navigate to specific slide
    function goToSlide(index) {
        if (index >= 0 && index < spotlightItems.length) {
            currentSlide = index;
            updateSlider();
        }
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < spotlightItems.length - 1) {
            currentSlide++;
            updateSlider();
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    // Button event listeners
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);
    
    // Swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    const sliderContainer = document.querySelector(".spotlight-slider-container");
    
    if (sliderContainer) {
        sliderContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        sliderContainer.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        const slider = document.querySelector(".spotlight-slider");
        if (!slider || !slider.offsetParent) return; // Check if slider is visible
        
        if (e.key === "ArrowLeft") {
            prevSlide();
        } else if (e.key === "ArrowRight") {
            nextSlide();
        }
    });
    
    // Initialize
    updateSlider();
}

// Wait for DOM and libraries to be ready
function initSpotlight() {
    const titlesContainer = document.querySelector(".spotlight-titles");
    const imagesContainer = document.querySelector(".spotlight-images");
    const spotlightHeader = document.querySelector(".spotlight-header");
    const titlesContainerElement = document.querySelector(
    ".spotlight-titles-container"
    );
    const introTextElements = document.querySelectorAll(".spotlight-intro-text");

    // Check if Spotlight section exists
    if (!titlesContainer || !imagesContainer || !spotlightHeader || !titlesContainerElement) {
        console.warn("Spotlight section elements not found");
        return;
    }

    // For tablet and mobile (<= 1024px), create slider
    if (window.innerWidth <= 1024) {
        initSpotlightSlider();
        return; // Don't initialize animations
    }

    // Desktop: Initialize animations
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("Spotlight: Required libraries not loaded");
        return;
    }

    // Initialize Lenis for Spotlight
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf (time * 1000));
    gsap.ticker.lagSmoothing(0);
const imageElements = [];

spotlightItems.forEach((item, index) => {
const titleElement = document.createElement("h1");
titleElement.textContent = item.name;
titleElement.style.opacity = "0.25"; // All titles start with low opacity
titlesContainer.appendChild(titleElement);

const imgWrapper = document.createElement("div");
imgWrapper.className = "spotlight-img";
const imgElement = document.createElement("img");
imgElement.src = item.img;
imgElement.alt = "";
imgWrapper.appendChild(imgElement);
imagesContainer.appendChild(imgWrapper);
imageElements.push(imgWrapper);
});

const titleElements = titlesContainer.querySelectorAll("h1");
let currentActiveIndex = 0;

const containerWidth = window.innerWidth;
const containerHeight = window.innerHeight;
const arcStartX = 100;
const arcStartY = -200;
const arcEndX = 100;
const arcEndY = containerHeight + 200;
const arcControlPointX = 100 + config.arcRadius;
const arcControlPointY = containerHeight / 2;

function getBezierPosition(t) {
const x =
(1 - t) * (1 - t) * arcStartX +
2* (1 - t) * t * arcControlPointX +
t * t * arcEndX;
const y =
(1 - t) * (1 - t) * arcStartY +
2 * (1 - t) * t * arcControlPointY +
t * t * arcEndY;
return { x, y };
}

function getImgProgressState (index, overallProgress) {
const startTime = index * config.gap;
const endTime = startTime + config.speed;

if (overallProgress < startTime) return -1;
if (overallProgress > endTime) return 2;

return (overallProgress - startTime) / config.speed;
}

imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

// Hide titles container initially until scroll animation starts
gsap.set(".spotlight-titles", { opacity: 0 });
gsap.set(titlesContainerElement, {
    "--before-opacity": "0",
    "--after-opacity": "0",
});

ScrollTrigger.create({
trigger: ".spotlight",
start: "top top",
end: `+=${window.innerHeight * 10}px`,
pin: true,
pinSpacing: true,
scrub: 1,
onUpdate: (self) => {
const progress = self.progress;

if (progress < 0.2) {
const animationProgress = progress / 0.2;

const moveDistance = window.innerWidth * 0.6;
gsap.set(introTextElements[0], {
    x: -animationProgress * moveDistance,
});
gsap.set(introTextElements [1], {
    x: animationProgress * moveDistance,
});
gsap.set(introTextElements[0], { opacity: 1 });
gsap.set(introTextElements [1], { opacity: 1 });

gsap.set(".spotlight-bg-img", {
    transform: `scale(${animationProgress})`,
});
gsap.set(".spotlight-bg-img img", {
    transform: `scale(${1.5 - animationProgress * 0.5})`,
});

imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
spotlightHeader.style.opacity = "0";
gsap.set(".spotlight-titles", { opacity: 0 });
gsap.set(titlesContainerElement, {
"--before-opacity": "0",
"--after-opacity": "0",
});
} else if (progress > 0.2 && progress < 0.25) {
gsap.set(".spotlight-titles", { opacity: 1 });
gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

gsap.set(introTextElements[0], { opacity: 0 });
gsap.set(introTextElements [1], { opacity: 0 });

imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
spotlightHeader.style.opacity = "1";
gsap.set(titlesContainerElement, {
"--before-opacity": "1",
"--after-opacity": "1",
});
} else if (progress > 0.25 && progress < 0.95) {
gsap.set(".spotlight-bg-img", { transform: "scale(1)" });
gsap.set(".spotlight-bg-img img", { transform: "scale(1)" });

gsap.set(introTextElements[0], { opacity: 0 });
gsap.set(introTextElements [1], { opacity: 0 });

spotlightHeader.style.opacity = "1";
gsap.set(titlesContainerElement, {
"--before-opacity": "1",
"--after-opacity": "1",
});

const switchProgress = (progress - 0.25) / 0.7;
const viewportHeight = window.innerHeight;
const titlesContainerHeight = titlesContainer.scrollHeight;
const startPosition = viewportHeight;
const targetPosition = -titlesContainerHeight;
const totalDistance = startPosition - targetPosition;
const currentY = startPosition - switchProgress * totalDistance;

gsap.set(".spotlight-titles", {
transform: `translateY(${currentY}px)`,
});

imageElements.forEach((img, index) => {
const imageProgress = getImgProgressState (index, switchProgress);

if (imageProgress < 0 || imageProgress > 1) {
gsap.set(img, { opacity: 0 });
} else {
const pos = getBezierPosition (imageProgress);
gsap.set(img, {
x: pos.x,
y: pos.y - 75,
opacity: 1,
});
}
});

const viewportMiddle = viewportHeight / 2;
let closestIndex = 0;
let closestDistance = Infinity;

titleElements.forEach((title, index) => {
const titleRect = title.getBoundingClientRect();
const titleCenter = titleRect.top + titleRect.height / 2;
const distanceFromCenter = Math.abs (titleCenter -
viewportMiddle);

if (distanceFromCenter < closestDistance) {
closestDistance = distanceFromCenter;
closestIndex = index;
}
});

if (closestIndex !== currentActiveIndex) {
if (titleElements [currentActiveIndex]) {
titleElements [currentActiveIndex].style.opacity = "0.25";
}
titleElements [closestIndex].style.opacity = "1";
document.querySelector(".spotlight-bg-img img").src =
spotlightItems [closestIndex].img;
currentActiveIndex = closestIndex;
}
} else if (progress > 0.95) {
spotlightHeader.style.opacity = "0";
gsap.set(titlesContainerElement, {
"--before-opacity": "0",
"--after-opacity": "0",
});
}
},
});
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpotlight);
} else {
    // DOM is already ready
    initSpotlight();
}

// Handle window resize - only reinitialize if crossing breakpoint
let lastWidth = window.innerWidth;
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const wasMobile = lastWidth <= 1024;
        const isMobile = currentWidth <= 1024;
        
        // Only reinitialize if crossing the 1024px breakpoint
        if (wasMobile !== isMobile) {
            // Kill existing ScrollTriggers if any
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.vars && trigger.vars.trigger === '.spotlight') {
                        trigger.kill();
                    }
                });
            }
            // Clear and reinitialize
            const titlesContainer = document.querySelector(".spotlight-titles");
            if (titlesContainer) {
                titlesContainer.innerHTML = '';
            }
            const sliderTrack = document.querySelector(".spotlight-slider-track");
            if (sliderTrack) {
                sliderTrack.innerHTML = '';
            }
            const progressBar = document.querySelector(".spotlight-slider-progress-bar");
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            initSpotlight();
        }
        
        lastWidth = currentWidth;
    }, 250);
});
