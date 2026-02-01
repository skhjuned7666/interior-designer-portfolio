# H9Y Studio - Interior Design Portfolio Website

A modern, animated portfolio website for H9Y Studio, showcasing hospitality interior design services with smooth scrolling, 3D animations, and interactive elements.

## 🎯 Overview

H9Y Studio is a single-page application portfolio website that presents an interior design studio specializing in hospitality spaces. The website features award-winning design with smooth animations, 3D card effects, and scroll-triggered interactions.

## ✨ Features

- **Smooth Scrolling** - Buttery smooth scroll experience using Lenis
- **3D Card Animations** - Interactive flip cards for services section
- **Scroll-Triggered Animations** - GSAP ScrollTrigger for dynamic content reveals
- **Custom Cursor** - Interactive cursor effect on hero section
- **Marquee Text** - Infinite scrolling text animations
- **Spotlight Gallery** - Interactive image gallery with bezier curve animations
- **Video Background** - Full-screen video background on hero section
- **Responsive Design** - Mobile-friendly with multiple breakpoints
- **Custom Typography** - Unique fonts for brand identity

## 🛠️ Technologies Used

### Core
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript** - No framework dependencies

### External Libraries (CDN)
- **GSAP 3.13.0** - Professional animation library
- **ScrollTrigger** - Scroll-based animation plugin
- **Lenis 1.0.27** - Smooth scrolling library

### Assets
- Custom fonts (NB International, SuisseIntl-Light)
- High-quality images and video content

## 📁 Project Structure

```
project-root/
├── index.html          # Main HTML file
├── about.html          # About page
├── contact.html        # Contact page
├── services.html       # Services page
├── work.html           # Work/Portfolio page
├── style.css           # All styling and responsive design
├── script.js           # Main JavaScript functionality
├── marquee.js          # Marquee animation logic
├── spotlight.js        # Spotlight section animations
├── assets/
│   ├── images/         # Project images and cards
│   ├── video/          # Background video (luxury.mp4)
│   └── favicon.ico
├── fonts/              # Custom fonts
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN libraries)

### Installation

1. Clone or download the repository
```bash
git clone <repository-url>
cd 22test-don-h9y
```

2. Open the project
   - Simply open `index.html` in your web browser
   - Or use a local development server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

3. Navigate to `http://localhost:8000` in your browser

**Note:** No build process required - this is a pure HTML/CSS/JS project.

## 📄 Pages

- **index.html** - Home page with all main sections
- **about.html** - About the studio
- **services.html** - Detailed services information
- **work.html** - Portfolio showcase
- **contact.html** - Contact information and form

## 🎨 Website Sections

### 1. Hero Section
- Full-screen video background
- Custom cursor effect ("Play Reel")
- Animated "H9Y Studio" text

### 2. About Section
- Company description
- Location information (Paris & San Diego)
- Scroll-triggered text animations

### 3. Services Section
- Three interactive 3D flip cards:
  - Hospitality
  - Interior Design
  - Complete Turnkey Solution
- Sticky header animation

### 4. Work/Portfolio Section
- Project cards with images
- Marquee text animation
- Scroll-triggered card reveals

### 5. Spotlight Section
- Interactive image gallery
- Bezier curve animations
- Dynamic title scrolling

### 6. Footer
- Contact information
- Newsletter signup
- Social media links
- Navigation

## 🎬 Key Animations

- **Smooth Scrolling** - Lenis-powered smooth scroll
- **Scroll Triggers** - Animations tied to scroll position
- **3D Card Flips** - Perspective transforms on service cards
- **Marquee Effect** - Infinite horizontal text scrolling
- **Spotlight Gallery** - Curved path image animations
- **Text Reveals** - Character-by-character text animations

## 📱 Responsive Design

Breakpoints:
- **1000px** - Cards stack vertically
- **900px** - Footer single column layout
- **768px** - Navigation adjustments
- **500px** - Mobile navigation

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Requirements:**
- JavaScript enabled
- CSS Grid and Flexbox support
- Modern CSS features (transform, clip-path, etc.)

## 🔧 Customization

### Changing Colors
Edit CSS variables in `style.css`:
```css
:root {
    --bg: whitesmoke;
    --fg: #fff;
    --card-1: #b2b2b2;
    --card-2: #495057;
    --card-3: #2f2f2f;
}
```

### Modifying Animations
- Main animations: `script.js`
- Marquee effects: `marquee.js`
- Spotlight animations: `spotlight.js`

### Adding Content
- Update HTML structure in respective `.html` files
- Add images to `assets/images/`
- Update styles in `style.css`

## 📝 Notes

- All animations are optimized for 60fps performance
- Uses hardware-accelerated CSS transforms
- Smooth scrolling requires Lenis library (loaded via CDN)
- Video background may require optimized file size for better performance

## 🤝 Contributing

This is a portfolio project. For suggestions or improvements, please create an issue or pull request.

## 📄 License

© 2024 H9Y Studio. All rights reserved.

## 📧 Contact

**H9Y Studio**  
New Business: harain.designoltre@gmail.com  
Locations: San Diego-USA, Paris-France

---

**Built with ❤️ using GSAP, Lenis, and modern web technologies**

