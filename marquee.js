function setupMarqueeAnimation() {
    // Wait for GSAP to be available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded, marquee animation skipped');
        return;
    }
    
    const marqueeContainer = document.querySelector('.card-marquee .marquee');
    if (!marqueeContainer) {
        console.warn('Marquee container not found');
        return;
    }
    
    const marqueeItems = gsap.utils.toArray('.marquee h1');
    if (marqueeItems.length === 0) {
        console.warn('No marquee items found');
        return;
    }
    
    // Only use original items (before cloning)
    const originalItems = marqueeItems.slice(0, marqueeItems.length / 2 || marqueeItems.length);
    
    // Calculate total width of all original items
    let totalWidth = 0;
    originalItems.forEach((item) => {
        totalWidth += item.offsetWidth + 30; // 30px is the margin-right
    });
    
    // Only clone if not already cloned
    if (marqueeContainer.children.length === originalItems.length) {
        // Duplicate all items for seamless loop
        originalItems.forEach((item) => {
            const clone = item.cloneNode(true);
            marqueeContainer.appendChild(clone);
        });
    }
    
    // Reset container position
    gsap.set(marqueeContainer, { x: 0 });
    
    // Animation speed
    const speed = 50; // pixels per second - adjust for faster/slower
    const duration = totalWidth / speed;
    
    // Kill any existing animation
    gsap.killTweensOf(marqueeContainer);
    
    // Create seamless infinite loop using timeline
    const tl = gsap.timeline({ repeat: -1 });
    
    // Animate to the left
    tl.to(marqueeContainer, {
        x: -totalWidth,
        duration: duration,
        ease: "none"
    })
    // Instantly reset position (invisible because clones are in exact same position)
    .set(marqueeContainer, { x: 0 });
} 
