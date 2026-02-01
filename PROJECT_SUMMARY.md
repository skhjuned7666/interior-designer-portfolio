# H9Y Studio - Project Summary

## 🎯 Project Kya Hai?

**H9Y Studio** ek **Interior Design Studio** ka portfolio website hai. Ye ek **single-page application** hai jo hospitality interior design services showcase karta hai. Website mein heavy animations aur smooth scrolling effects hain.

---

## 🛠️ Technologies Used

### Core Technologies:
- **HTML5** - Structure
- **CSS3** - Styling aur responsive design
- **Vanilla JavaScript** - Functionality

### External Libraries (CDN se load):
1. **GSAP 3.13.0** - Animation library (sab animations isse hain)
2. **ScrollTrigger** - Scroll-based animations ke liye plugin
3. **Lenis 1.0.27** - Smooth scrolling library

### Custom Assets:
- Custom fonts (NB International, SuisseIntl-Light)
- Images aur videos (assets folder mein)

---

## 📁 Project Structure

```
project-root/
├── index.html          # Main HTML file (269 lines)
├── style.css           # Sab styling (973 lines)
├── script.js           # Main JavaScript logic (515 lines)
├── marquee.js          # Marquee animation (60 lines)
├── spotlight.js        # Spotlight section animations (245 lines)
│
├── assets/
│   ├── images/         # Project images, cards
│   └── video/          # Background video (luxury.mp4)
│
└── fonts/              # Custom fonts
```

---

## 🏗️ Website Sections

1. **Hero Section** (`#page1`)
   - Full-screen video background
   - Custom cursor effect
   - "H9Y Studio" animated text

2. **About Section** (`#page2`)
   - Company description
   - Location info

3. **Services Section** (`#services`)
   - 3 flip cards (3D animations)
   - Hospitality, Interior Design, Turnkey Solution

4. **Work/Portfolio** (`#work`)
   - Project cards with images
   - Marquee text animation
   - Scroll-triggered animations

5. **Spotlight Section** (`#contact`)
   - Interactive image gallery
   - Scroll-based animations
   - 10 spotlight items

6. **Footer**
   - Contact info, newsletter, social links

---

## ⚙️ Main Features

### Animations:
- ✅ Smooth scrolling (Lenis)
- ✅ Scroll-triggered animations (ScrollTrigger)
- ✅ 3D card flip effects
- ✅ Custom cursor on hero
- ✅ Marquee text scrolling
- ✅ Spotlight image gallery with bezier curve animations

### Responsive:
- ✅ Mobile-friendly (breakpoints: 1000px, 900px, 768px, 500px)
- ✅ Touch support

---

## 🚀 Kaise Run Karein?

1. `index.html` ko browser mein kholo
2. Internet connection chahiye (CDN libraries ke liye)
3. Scroll karke animations dekho

**Note:** Koi build process nahi hai, directly HTML file open kar sakte ho.

---

## 📝 Key Files Ka Kaam

- **index.html** - Sab sections ka structure
- **style.css** - Sab styling, responsive design
- **script.js** - Main animations, navigation, card effects
- **marquee.js** - Infinite scrolling marquee text
- **spotlight.js** - Spotlight section ki complex animations

---

## 💡 Important Points

- **No build process** - Direct HTML/CSS/JS
- **CDN dependencies** - GSAP, ScrollTrigger, Lenis
- **Heavy animations** - Performance ke liye optimized
- **Single page** - Sab sections ek hi page mein

---

*Simple summary for new developers - Updated: Current project state*

