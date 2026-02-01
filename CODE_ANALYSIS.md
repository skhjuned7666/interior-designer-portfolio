# H9Y Studio - Complete Code Analysis

## 📋 Project Overview

**Project Name:** H9Y Studio  
**Type:** Single Page Application (SPA) - Interior Design Studio Portfolio  
**Technology Stack:** HTML5, CSS3, JavaScript (Vanilla), GSAP Animation Library, Lenis Smooth Scroll  
**Purpose:** Showcase hospitality interior design studio with interactive animations and smooth scrolling

---

## 🏗️ Project Structure

```
test-don-h9y -
├── index.html          (269 lines) - Main HTML structure
├── style.css           (973 lines) - All styling and responsive design
├── script.js           (514 lines) - Main JavaScript functionality
├── marquee.js          (59 lines)  - Marquee animation logic
├── spotlight.js        (244 lines) - Spotlight section animations
├── assets/
│   ├── favicon.ico
│   ├── images/         - Project images and cards
│   └── video/          - Background video (luxury.mp4)
└── fonts/              - Custom fonts (NB International, SuisseIntl-Light)
```

---

## 📄 HTML Structure (index.html)

### Sections Breakdown:

1. **Navigation Bar** (`#main-nav`)
   - Fixed position navigation
   - Brand: "Vision To Reality."
   - Links: Home, Work, About, Services, Contact
   - Menu button (right side)

2. **Hero Section** (`#page1`)
   - Full-screen video background
   - Custom cursor effect ("Play Reel")
   - Large animated "H9Y Studio" text (each letter wrapped in `<span>`)

3. **About Section** (`#page2`)
   - Company description
   - Location info: "Paris & San Diego"
   - Large headline text with scroll animation

4. **Services Section** (`.sticky` with `#services`)
   - Three flip cards with 3D transforms
   - Cards: Hospitality, Interior Design, Complete Turnkey Solution
   - Sticky header: "Three Pillars With One Solution."

5. **Work/Portfolio Section** (`#work` with `.m-cards`)
   - Multiple project cards with images
   - Marquee text animation
   - Scroll-triggered animations
   - 5 project cards (currently all showing "Curved Horizon")

6. **Contact/Spotlight Section** (`#contact` with `.spotlight`)
   - Interactive spotlight effect
   - Dynamic image gallery
   - Scroll-based title animations
   - 10 spotlight items with images

7. **Footer**
   - Three-column grid layout
   - Left: Heading, locations, business email, newsletter signup
   - Middle: Navigation links (column layout)
   - Right: Social links, terms
   - Large centered "H9Y Studio" brand text at bottom

### External Dependencies (CDN):
- GSAP 3.13.0 (GreenSock Animation Platform)
- ScrollTrigger plugin
- Lenis 1.0.27 (Smooth scroll library)

---

## 🎨 CSS Styling (style.css)

### Key Features:

#### 1. **Typography**
- **Custom Fonts:**
  - `nb` (NB International Regular) - Used for large headings
  - `hehe` (SuisseIntl-Light) - Primary body font
  - Google Fonts: Inter, Google Sans Flex (imported)

#### 2. **Color Scheme**
```css
:root {
    --bg: whitesmoke;
    --fg: #fff;
    --card-1: #b2b2b2;
    --card-2: #495057;
    --card-3: #2f2f2f;
}
```
- Primary accent: `#ff5f38` (orange/coral)
- Background: `whitesmoke` (light sections), `#000` (footer)
- Text: `#2f2f2f` (dark), `#fff` (light)

#### 3. **Layout System**
- **Viewport-based sizing:** Uses `vw`, `vh`, `svh` units for responsive design
- **Grid layouts:** Footer uses CSS Grid (3 columns)
- **Flexbox:** Navigation, cards, content areas
- **Fixed positioning:** Navigation bar, cursor effect

#### 4. **Responsive Design**
- **Breakpoints:**
  - `max-width: 1000px` - Cards stack vertically
  - `max-width: 900px` - Footer single column, card title adjustments
  - `max-width: 768px` - Navigation adjustments
  - `max-width: 500px` - Mobile navigation

#### 5. **Animation-Ready CSS**
- `will-change` properties for performance
- `transform-style: preserve-3d` for 3D card flips
- `backface-visibility: hidden` for card animations
- `clip-path` for spotlight section effects

#### 6. **Key Components Styled:**
- Navigation (fixed, transparent background)
- Hero video section
- 3D flip cards with perspective
- Marquee cards with rounded images
- Spotlight section with complex clipping
- Footer with grid layout

---

## ⚙️ JavaScript Functionality

### Main Script (script.js) - 514 lines

#### 1. **Initialization**
- Waits for DOM and GSAP to load
- Registers ScrollTrigger plugin
- Initializes Lenis smooth scroll (with fallback)

#### 2. **Navigation System**
- Smooth scroll to anchor links
- Offset calculation for fixed navigation
- Lenis integration for smooth scrolling
- Fallback to native smooth scroll

#### 3. **Cursor Effect** (`cursorEffect()`)
- Custom cursor on hero section
- Follows mouse movement using GSAP
- Scales and fades on hover enter/leave
- Orange circular cursor with "Play Reel" text

#### 4. **Page 2 Animation** (`page2Animation()`)
- Scroll-triggered text reveal
- Y-axis translation animation
- Scrub animation (tied to scroll)

#### 5. **Sticky Cards Animation** (`initAnimations()`)
- **Complex scroll-based animations:**
  - Header fade-in (0.1-0.25 progress)
  - Card container width animation (75% → 60%)
  - Gap animation between cards (0.35 progress)
  - Border radius changes
  - 3D card flip (0.45 progress)
  - Card rotation and translation
- **Responsive:** Disabled on screens < 1000px
- **Resize handling:** Reinitializes on window resize

#### 6. **Marquee Cards Animation** (`initMarqueeAnimation()`)
- **Text splitting:** Custom SplitText alternative
- **Character animations:** Each letter animates individually
- **Image animations:**
  - Scale from 0.5 to 1.0
  - Border radius from 400px to 25px
  - Inner image scale adjustments
- **Marquee fade:** Opacity based on image scale
- **Content reveal:** Title and description animations
- **Card pinning:** Each card pins on scroll
- **Image transitions:** Scale and opacity between cards

#### 7. **Performance Optimizations**
- `will-change` properties
- GSAP ticker integration
- ScrollTrigger refresh management
- Resize debouncing

---

## 🎬 Marquee Animation (marquee.js)

### Functionality:
- **Infinite horizontal scrolling** text
- **Seamless loop:** Clones items for continuous animation
- **Speed control:** 50 pixels per second
- **GSAP Timeline:** Uses timeline for smooth looping
- **Auto-cloning:** Duplicates items automatically

### Features:
- Calculates total width dynamically
- Resets position invisibly for seamless loop
- Kills existing animations before starting new ones

---

## ✨ Spotlight Section (spotlight.js)

### Complex Scroll-Based Animation System

#### 1. **Configuration**
```javascript
{
    gap: 0.08,        // Time gap between items
    speed: 0.3,       // Animation speed
    arcRadius: 500    // Bezier curve radius
}
```

#### 2. **Spotlight Items** (10 items)
- Each has name and image
- Dynamically generated in DOM

#### 3. **Animation Phases:**

**Phase 1 (0-20% progress):**
- Intro text slides in/out
- Background image scales from 0 to 1
- Inner image scales from 1.5 to 1

**Phase 2 (20-25% progress):**
- Titles container fades in
- Diagonal lines appear
- Header text appears

**Phase 3 (25-95% progress):**
- Titles scroll vertically
- Images follow bezier curve path
- Active title highlights (opacity 1 vs 0.25)
- Background image changes based on active item
- Images fade in/out based on progress

**Phase 4 (95-100% progress):**
- Header fades out
- Diagonal lines fade out

#### 4. **Bezier Curve Animation**
- Images follow curved path using quadratic bezier
- Calculated positions based on scroll progress
- Smooth arc movement

#### 5. **Active Item Detection**
- Calculates closest title to viewport center
- Updates background image accordingly
- Changes title opacity

#### 6. **Lenis Integration**
- Creates separate Lenis instance for spotlight
- Integrated with GSAP ticker
- Smooth scroll coordination

---

## 🎯 Key Features & Interactions

### 1. **Smooth Scrolling**
- Lenis library for buttery smooth scroll
- ScrollTrigger integration
- Fallback to native smooth scroll

### 2. **Scroll-Triggered Animations**
- All animations tied to scroll position
- Scrub animations (smooth, tied to scroll speed)
- Pin animations (sections stay in place)

### 3. **3D Transforms**
- Card flip animations (rotateY)
- Perspective transforms
- 3D card effects

### 4. **Performance Features**
- `will-change` CSS properties
- GSAP optimization
- Efficient event handling
- Resize debouncing

### 5. **Responsive Design**
- Mobile-first considerations
- Breakpoint-based animations
- Touch-friendly interactions

---

## 📊 Technical Details

### Browser Support:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- CSS Grid and Flexbox support needed

### Performance:
- Uses `requestAnimationFrame` for smooth animations
- GSAP for hardware-accelerated animations
- Optimized scroll listeners
- Efficient DOM manipulation

### Accessibility:
- Semantic HTML structure
- Anchor links for navigation
- Alt text for images (some missing)
- Keyboard navigation support (basic)

### Code Quality:
- **Well-organized:** Separate files for different functionalities
- **Modular:** Each animation system in separate file
- **Commented:** Some comments, could use more
- **Error handling:** Console warnings for missing elements
- **Fallbacks:** Native scroll fallback if Lenis unavailable

---

## 🔧 Dependencies

### External Libraries (CDN):
1. **GSAP 3.13.0**
   - Core animation library
   - Used for all animations
   - Timeline and Tween management

2. **ScrollTrigger Plugin**
   - Scroll-based animations
   - Pin functionality
   - Progress tracking

3. **Lenis 1.0.27**
   - Smooth scrolling
   - Custom easing
   - Touch support

### Custom Assets:
- Video: `assets/video/luxury.mp4`
- Images: Multiple project images
- Fonts: Custom OTF fonts

---

## 🎨 Design Patterns Used

1. **Scroll-Driven Animations:** Most animations triggered by scroll
2. **Progressive Enhancement:** Fallbacks for missing libraries
3. **Component-Based:** Each section is self-contained
4. **Performance-First:** Optimized for 60fps animations
5. **Responsive Design:** Mobile-first approach

---

## 📝 Notes & Observations

### Strengths:
✅ Smooth, professional animations  
✅ Well-structured code  
✅ Good performance optimization  
✅ Responsive design  
✅ Modern web technologies  

### Areas for Improvement:
⚠️ Some hardcoded values could be configurable  
⚠️ Missing alt text on some images  
⚠️ Limited error handling in some areas  
⚠️ Could benefit from more comments  
⚠️ Newsletter form not functional (no backend)  

### Current Issues:
- All project cards show same content ("Curved Horizon")
- Newsletter form is presentational only
- Social media links are placeholders (#)
- Some images use root directory instead of assets folder

---

## 🚀 Usage

1. Open `index.html` in a modern browser
2. Ensure internet connection for CDN libraries
3. Scroll to see animations
4. Click navigation links for smooth scrolling
5. Hover over hero section for cursor effect

---

## 📈 File Statistics

- **Total Lines of Code:** ~2,059 lines
  - HTML: 269 lines
  - CSS: 973 lines
  - JavaScript: 817 lines (script.js + marquee.js + spotlight.js)

- **External Dependencies:** 3 CDN libraries
- **Custom Fonts:** 2 fonts
- **Images:** ~15+ images
- **Video:** 1 background video

---

*Analysis generated: Complete codebase review*  
*Last Updated: Current project state*

