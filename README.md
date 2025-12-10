# 🎨 Roguda Fashion & Art Design School

**POPIA-Compliant Cinematic Web Application**

[![License](https://img.shields.io/badge/license-MIT-gold.svg)](LICENSE)
[![POPIA Compliant](https://img.shields.io/badge/POPIA-Compliant-green.svg)](docs/popia_compliance.html)

---

## 📋 Overview

Roguda Fashion & Art Design School is a modern, cinematic web application built with **HTML, CSS (Glassmorphism), PHP, and JavaScript**. The platform features:

- ✨ **Cinematic Black & Gold Design** with glassmorphism effects
- 🤖 **AI Fashion Studio** with 3D visualization (Three.js)
- 🛍️ **Student Marketplace** for showcasing designs
- 📱 **Fully Responsive** (Mobile, Tablet, Desktop)
- 🔒 **POPIA Compliant** with comprehensive privacy policies
- 🚀 **Optimized for Afrihost Hosting** (HTML/PHP/JS stack)

---

## 🗂️ Project Structure

```
roguda/
│
├── index.html                # Landing page
├── about.html                # About & heritage page
├── apply.html                # Application form (POPIA consent)
├── studio.html               # AI Fashion Studio
├── marketplace.html          # Student shop showcase
├── login.html                # Login page
├── register.html             # Registration page
├── dashboard.html            # Student portal
│
├── assets/
│   ├── css/
│   │   ├── main.css          # Global styles
│   │   ├── cinematic.css     # Black & gold glassmorphism
│   │   ├── auth.css          # Login/register styling
│   │   └── responsive.css    # Mobile/tablet breakpoints
│   │
│   ├── js/
│   │   ├── main.js           # Navigation, scroll, animations
│   │   ├── studio.js         # 3D material selector + cost simulator
│   │   ├── marketplace.js    # Shop preview animations
│   │   ├── auth.js           # Login/register logic
│   │   ├── dashboard.js      # Student dashboard
│   │   └── encryption.js     # Security utilities
│   │
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.jpg
│   │   ├── Back1.jpg – Back7.jpg
│   │   └── icons/ (ai.svg, sewing.svg, shop.svg, certificate.svg)
│   │
│   └── videos/
│       └── intro.mp4         # Optional cinematic loop
│
├── data/
│   ├── materials.json        # Material costs & properties
│   ├── projects.json         # Student project data
│   └── users.json            # Temporary user storage
│
├── includes/
│   ├── header.php            # Reusable navigation
│   ├── footer.php            # Reusable footer
│   └── mailer.php            # Form handler (POPIA compliant)
│
├── docs/
│   ├── privacy_policy.html   # Privacy policy
│   ├── terms.html            # Terms of service
│   └── popia_compliance.html # POPIA compliance document
│
├── .htaccess                 # HTTPS redirect, clean URLs, security
└── README.md                 # This file
```

---

## 🎨 Design System

### Color Palette
- **Primary Black:** `#000000`
- **Gold:** `#D4AF37`
- **Gold Light:** `#F7E7B2`
- **White:** `#FFFFFF`

### Typography
- **Body Font:** Outfit (Google Fonts)
- **Display Font:** Playfair Display (Google Fonts)

### Key Features
- **Glassmorphism:** `backdrop-filter: blur(20px)` with gold borders
- **Gold Glow Effect:** Text shadows with `rgba(212, 175, 55, 0.5)`
- **Responsive Grid:** CSS Grid with 12-column layout
- **Smooth Animations:** Fade-in-up effects with CSS keyframes

---

## 🔐 POPIA Compliance

Every form includes:
- ✅ **Consent Checkbox:** "I consent to my personal data being processed..."
- ✅ **Link to POPIA Policy:** `docs/popia_compliance.html`
- ✅ **No Third-Party Tracking:** No Google Analytics or ads
- ✅ **HTTPS Enforced:** Via `.htaccess`
- ✅ **Secure Data Handling:** All form submissions via `includes/mailer.php`

**View Full Policy:** [POPIA Compliance Document](docs/popia_compliance.html)

---

## 🚀 Deployment to Afrihost

### Step 1: Prepare Files
1. Ensure all image files (`logo.svg`, `hero.jpg`, `Back1-7.jpg`, icons) are in `assets/images/`
2. (Optional) Add `intro.mp4` to `assets/videos/` for hero background

### Step 2: Upload to Afrihost
1. **Connect via FTP:**
   - Host: `ftp.yourdomain.co.za`
   - Username: Your Afrihost username
   - Password: Your Afrihost password

2. **Upload Structure:**
   - Upload **all files** to `/public_html/` directory
   - Maintain folder structure exactly as shown above

3. **Set Permissions:**
   - `.htaccess`: `644`
   - `includes/mailer.php`: `644`
   - All other files: `644`
   - Directories: `755`

### Step 3: Configure Email (mailer.php)
Open `includes/mailer.php` and update:
```php
$to = 'applications@roguda.co.za'; // Your actual email
```

### Step 4: Test
1. Visit `https://yourdomain.co.za`
2. Test application form submission
3. Test login/register flow (uses localStorage)
4. Test AI Studio and Marketplace navigation

---

## 💻 Local Development

### Requirements
- **Web Server:** Apache (with mod_rewrite) or any PHP-enabled server
- **PHP Version:** 7.4+ (for `mailer.php`)
- **Browser:** Modern browser with JavaScript enabled

### Running Locally
1. **Using XAMPP/WAMP/MAMP:**
   ```
   Place project in htdocs/ or www/ folder
   Access via http://localhost/roguda-website/
   ```

2. **Using PHP Built-in Server:**
   ```powershell
   cd "C:\Users\NefefLocal\Documents\roguda website"
   php -S localhost:8000
   ```

3. **Open in Browser:**
   ```
   http://localhost:8000/index.html
   ```

---

## 🛠️ Customization

### Update Logo
Replace `assets/images/logo.svg` with your school logo (SVG or PNG).

### Change Colors
Edit `assets/css/main.css`:
```css
:root {
    --color-gold: #D4AF37;  /* Your gold color */
    --color-black: #000000; /* Your base color */
}
```

### Add Real Images
Replace placeholder references in HTML:
- `assets/images/hero.jpg` → Your hero image
- `assets/images/Back1-7.jpg` → Gallery images
- `assets/images/icons/*.svg` → Custom icons

### Enable Real Database (Advanced)
Replace localStorage-based auth in `assets/js/auth.js` with:
- MySQL/PostgreSQL backend
- Proper password hashing (bcrypt)
- Session management via PHP

---

## 🧪 Testing Checklist

- [ ] All pages load without errors
- [ ] Navigation menu works (desktop & mobile)
- [ ] Application form submits successfully
- [ ] POPIA consent checkbox is required
- [ ] Login/Register creates localStorage session
- [ ] Dashboard loads with demo data
- [ ] AI Studio displays 3D canvas (Three.js)
- [ ] Marketplace grid displays properly
- [ ] All legal documents accessible
- [ ] HTTPS redirect works (on live server)
- [ ] Mobile responsive on all pages

---

## 📧 Support & Contact

**Roguda Fashion & Art Design School**
- Email: info@roguda.co.za
- Website: [Coming Soon]
- Phone: +27 XX XXX XXXX

---

## 📄 License

This project is proprietary software owned by Roguda Fashion & Art Design School.

---

## 🎓 Credits

**Developed by:** Roguda Development Team  
**Design Inspiration:** Cinematic black & gold aesthetic  
**Technologies:** HTML5, CSS3, JavaScript (ES6), PHP, Three.js  
**Compliance:** POPIA (Protection of Personal Information Act)

---

## 🔄 Version History

- **v1.0.0** (November 28, 2025)
  - Initial scaffold complete
  - Full POPIA compliance implemented
  - All core pages and functionality delivered

---

**Roguda Schema Complete ✅**

*Where creativity meets technology. Welcome to the future of African fashion education.*
