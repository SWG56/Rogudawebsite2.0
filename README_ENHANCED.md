# 🎓 Roguda Fashion & Art Design School - Web Application

**POPIA-Compliant | QCTO-Accredited | Cinematic Design | Afrihost-Ready**

Complete web application for Roguda Fashion & Art Design School featuring black & gold glassmorphism UI, AI-powered fashion studio, student marketplace, and comprehensive learning management system.

---

## 📋 Project Overview

A fully functional, production-ready website for a fashion design school with:
- **Modern Stack**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript, PHP 7.4+
- **Design System**: Black (#000000) & Gold (#D4AF37) cinematic theme
- **Legal Compliance**: Full POPIA compliance with consent management
- **Quality Standards**: QCTO-accredited programs (NQF Levels 4-5)
- **3D Visualization**: Three.js-powered AI Fashion Studio
- **Responsive**: Mobile-first design with tablet/desktop breakpoints
- **Hosting**: Optimized for Afrihost shared hosting (no Node.js required)

---

## 📂 Project Structure

```
roguda website/
│
├── index.html                  # Landing page with cinematic hero
├── about.html                  # School history & values
├── programs.html               # QCTO qualifications (NQF 4-5)
├── incubator.html             # Graduate business hub
├── apply.html                  # POPIA-compliant application form
├── studio.html                 # AI Fashion Studio (Three.js)
├── marketplace.html            # Student project showcase
├── login.html                  # Authentication with API
├── register.html               # User registration
├── dashboard.html              # Student LMS portal
│
├── assets/
│   ├── css/
│   │   ├── main.css           # Core styles (590 lines)
│   │   ├── cinematic.css      # Glassmorphism effects (330 lines)
│   │   ├── auth.css           # Authentication pages (280 lines)
│   │   └── responsive.css     # Mobile breakpoints (220 lines)
│   │
│   ├── js/
│   │   ├── main.js            # Global utilities & animations
│   │   ├── studio.js          # Three.js 3D visualization
│   │   ├── marketplace.js     # Product interactions
│   │   ├── auth.js            # Login/register with API integration
│   │   ├── dashboard.js       # Student portal functionality
│   │   ├── encryption.js      # Crypto utilities
│   │   ├── lms.js             # **NEW** Learning Management System
│   │   └── popia.js           # **NEW** POPIA consent & privacy management
│   │
│   └── images/
│       ├── logo.svg           # Roguda logo
│       └── icons/             # SVG icon set
│
├── api/                        # **NEW** Backend REST endpoints
│   ├── register.php           # User registration with password hashing
│   ├── login.php              # Authentication with session tokens
│   ├── upload_project.php     # Student work uploads
│   └── fetch_data.php         # Dynamic data retrieval
│
├── data/
│   ├── materials.json         # Fabric database (8 materials)
│   ├── projects.json          # Student showcase projects
│   ├── users.json             # User accounts (JSON storage)
│   ├── courses.json           # **NEW** QCTO curriculum (3 programs)
│   └── incubator_projects.json # **NEW** Graduate startups (8 businesses)
│
├── docs/
│   ├── popia_compliance.html  # POPIA Policy (15 sections)
│   ├── privacy_policy.html    # Privacy Notice (12 sections)
│   ├── terms.html             # Terms of Service (17 sections)
│   └── quality_policy.html    # **NEW** QCTO Quality Standards
│
├── includes/
│   ├── header.php             # Reusable navigation
│   ├── footer.php             # Footer component
│   └── mailer.php             # Form submission handler
│
├── .htaccess                   # Apache config (HTTPS, security headers)
└── README.md                   # This file
```

---

## 🎨 Design System

### Color Palette
```css
:root {
    --primary-black: #000000;
    --primary-gold: #D4AF37;
    --gold-light: #F7E7B2;
    --gold-dark: #B8941E;
    --glass-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(212, 175, 55, 0.2);
}
```

### Typography
- **Headings**: Playfair Display (serif, 400/700)
- **Body**: Outfit (sans-serif, 300/400/600/700)

### UI Components
- **Glass Cards**: `backdrop-filter: blur(20px)` with gold borders
- **Buttons**: Gold gradient with hover glow effects
- **Animations**: Fade-in-up, parallax scrolling, intersection observer
- **Forms**: POPIA consent checkboxes required on all submissions

---

## 🚀 New Features (Enhanced Version)

### 1. **API Backend (api/)**
Complete REST API with 4 endpoints:

- **register.php**: User registration with `password_hash()`, POPIA consent validation, email uniqueness checks
- **login.php**: Authentication with `password_verify()`, session token generation
- **upload_project.php**: Student project uploads (5MB max, images/PDFs only)
- **fetch_data.php**: Dynamic data retrieval for courses, projects, incubator

**Usage Example**:
```javascript
// Login via API
const response = await fetch('api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const result = await response.json();
```

### 2. **Learning Management System (lms.js)**
Comprehensive LMS functionality:

- **Course Progress Tracking**: Module completion, grades, GPA calculation
- **Assignment Management**: Submission, deadlines, status tracking
- **Course Materials**: Videos, PDFs, quizzes with completion tracking
- **Certificate Generation**: Automatic credential creation
- **Learning Analytics**: Activity logging, upcoming deadlines

**Key Functions**:
```javascript
RogudaLMS.loadCourseProgress(studentEmail);
RogudaLMS.submitAssignment(assignmentId, file, studentEmail);
RogudaLMS.getUpcomingDeadlines(studentEmail);
RogudaLMS.calculateGPA(grades);
```

### 3. **POPIA Compliance Module (popia.js)**
Privacy management toolkit:

- **Consent Banner**: Cookie consent with accept/reject options
- **Data Rights**: Export, deletion, correction requests
- **Audit Trail**: Access logging for compliance
- **Privacy Settings**: Marketing consent toggle
- **GDPR/POPIA Alignment**: Right to be forgotten, data portability

**Auto-Initialization**:
```javascript
PopiaManager.initConsentBanner(); // Shows banner on first visit
PopiaManager.requestDataDeletion(email, reason);
PopiaManager.requestDataExport(email);
```

### 4. **QCTO Programs Page (programs.html)**
Detailed qualification showcase:

- **3 NQF-Accredited Programmes**:
  - Fashion Design (NQF 5, 12 months, 85 credits)
  - Pattern Making & Grading (NQF 4, 9 months, 84 credits)
  - Fashion Production Management (NQF 5, 10 months, 88 credits)
- **Detailed Curriculum**: Learning outcomes, career paths, entry requirements
- **Application Process**: 4-step guide with CTA buttons
- **Stats Footer**: Duration, credits, NQF level for each programme

### 5. **Graduate Incubator (incubator.html)**
Business support hub:

- **Success Metrics**: 24 startups, R2.5M funding, 85% survival rate
- **6 Benefit Cards**: Workspace, mentorship, funding, training, market access, network
- **3 Success Stories**: Featured graduate businesses with testimonials
- **Dynamic Project Grid**: Live showcase from `incubator_projects.json`
- **Application Process**: Eligibility criteria and submission flow

### 6. **Quality Policy Document (quality_policy.html)**
Comprehensive QCTO compliance:

- **11 Policy Sections**: Accreditation, assessment standards, educator qualifications, student support
- **Grading Scale**: A+ to F (90-100% down to 0-49%)
- **Assessment Types**: Formative, summative, practical, portfolio, WIL
- **Complaints Process**: 4-step resolution (informal → formal → appeals → QCTO mediation)
- **Certification**: Graduation requirements, qualification types

---

## 🔧 Technical Features

### Authentication System
- **API Integration**: `auth.js` now calls `api/login.php` and `api/register.php`
- **Password Security**: `password_hash()` with BCRYPT (PHP backend)
- **Session Management**: Token-based with localStorage (client-side)
- **Auto-Redirect**: Protected pages check session status with `checkAuth()`

### Data Storage
- **JSON Files**: Temporary storage (pre-database phase)
- **File Structure**:
  - `users.json`: User accounts with hashed passwords
  - `courses.json`: QCTO curriculum with module details
  - `incubator_projects.json`: Graduate startup profiles
  - `projects.json`: Student work showcase
  - `materials.json`: Fabric database for AI Studio

### Security Features
- **HTTPS Enforcement**: `.htaccess` redirects all HTTP to HTTPS
- **CSP Headers**: Content Security Policy prevents XSS attacks
- **HSTS**: Strict-Transport-Security for HTTPS-only connections
- **File Protection**: Blocks direct access to `.json` and `.htaccess` files
- **Input Sanitization**: `htmlspecialchars()` on all form data
- **POPIA Compliance**: No third-party tracking, explicit consent required

---

## 📦 Afrihost Deployment

### Pre-Deployment Checklist
1. ✅ Ensure PHP 7.4+ is enabled on hosting
2. ✅ Verify mod_rewrite is active (for `.htaccess`)
3. ✅ Configure SSL certificate (free Let's Encrypt via cPanel)
4. ✅ Set folder permissions: `755` for directories, `644` for files
5. ✅ Update email settings in `mailer.php` (SMTP credentials)

### File Upload via FTP
```bash
# Connect to Afrihost FTP
Host: ftp.yourdomain.co.za
Username: your_ftp_username
Password: your_ftp_password

# Upload structure
public_html/
├── index.html
├── programs.html
├── incubator.html
├── assets/ (entire folder)
├── api/ (entire folder)
├── data/ (entire folder)
├── docs/ (entire folder)
├── includes/ (entire folder)
└── .htaccess
```

### Post-Deployment Steps
1. **Test API Endpoints**: Visit `https://yourdomain.co.za/api/login.php` (should return "Method not allowed")
2. **Verify HTTPS**: All pages should redirect to HTTPS automatically
3. **Check Forms**: Submit test registration to verify `mailer.php` sends emails
4. **Test Mobile**: Use Chrome DevTools responsive mode to check breakpoints
5. **Validate POPIA**: Confirm consent banner appears on first visit

### Database Migration (Future)
When ready to migrate from JSON to MySQL:
```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'instructor', 'admin') DEFAULT 'student',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    popia_consent BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Update api/register.php and api/login.php to use mysqli or PDO
```

---

## 🎯 Usage Examples

### Student Registration Flow
1. User visits `register.html`
2. Fills form with POPIA consent checkbox
3. `auth.js` calls `api/register.php` via `fetch()`
4. PHP hashes password with `password_hash()` and saves to `users.json`
5. Success → Redirect to `login.html`

### Course Enrollment
1. Student logs in → `dashboard.html`
2. `lms.js` loads enrolled courses from `courses.json`
3. Displays progress bars, grades, and module completion
4. Student clicks module → Opens course materials

### Privacy Management
1. User visits site → `popia.js` shows consent banner
2. User clicks "Privacy Settings" in footer
3. Can request data export or account deletion
4. Requests logged to `popia_access_logs` (localStorage)

---

## 🔐 POPIA Compliance Features

### Data Collection
- ✅ **Explicit Consent**: Checkboxes on all forms (required)
- ✅ **Purpose Statement**: Clear explanation of data usage
- ✅ **Legal Basis**: POPIA Section 11 (consent-based processing)

### User Rights
- ✅ **Right to Access**: `PopiaManager.requestDataExport(email)`
- ✅ **Right to Correction**: Contact form for updates
- ✅ **Right to Deletion**: `PopiaManager.requestDataDeletion(email, reason)`
- ✅ **Right to Portability**: JSON data export via email

### Security Measures
- ✅ **SSL/TLS Encryption**: HTTPS enforced
- ✅ **Password Hashing**: BCRYPT via `password_hash()`
- ✅ **Access Control**: Session-based authentication
- ✅ **Audit Trail**: `PopiaManager.logDataAccess(action, dataType)`

### Retention Policy
- **Student Records**: 5 years after graduation
- **Application Forms**: 1 year if not enrolled
- **Session Data**: 24 hours (localStorage)
- **Access Logs**: 90 days

---

## 🧪 Testing Guide

### Manual Testing Checklist
```
[ ] Registration creates account and hashes password
[ ] Login authenticates and creates session token
[ ] Dashboard loads student data from LMS
[ ] AI Studio renders 3D canvas with Three.js
[ ] Marketplace displays projects from JSON
[ ] Forms validate POPIA consent (required)
[ ] Mobile menu toggles correctly
[ ] Consent banner appears on first visit
[ ] HTTPS redirects work in .htaccess
[ ] API endpoints return JSON responses
[ ] Quality policy displays all 11 sections
[ ] Incubator loads projects dynamically
[ ] Programs page shows QCTO curriculum
```

### Browser Testing
- ✅ **Chrome 120+**: Full support (recommended)
- ✅ **Firefox 121+**: Full support
- ✅ **Safari 17+**: Partial (backdrop-filter may need `-webkit-`)
- ✅ **Edge 120+**: Full support
- ❌ **IE 11**: Not supported (uses modern ES6)

### Performance Benchmarks
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **Page Load**: < 3 seconds on 3G
- **First Contentful Paint**: < 1.5 seconds
- **Time to Interactive**: < 4 seconds

---

## 📞 Support & Maintenance

### Contact Information
- **Privacy Inquiries**: privacy@roguda.co.za
- **Quality Assurance**: quality@roguda.co.za
- **Technical Support**: info@roguda.co.za
- **Phone**: +27 (0) 11 234 5678

### Update Schedule
- **Security Patches**: As needed (immediate)
- **Content Updates**: Monthly
- **Policy Reviews**: Annually (December)
- **QCTO Compliance Audits**: Every 2 years

---

## 📄 License & Attribution

- **Code**: Proprietary to Roguda Fashion & Art Design School
- **Design**: Custom cinematic theme by development team
- **Fonts**: Google Fonts (Outfit, Playfair Display) - SIL Open Font License
- **Three.js**: MIT License
- **Icons**: Custom SVG assets

---

## 🔄 Version History

### v2.1 (December 2024) - Current
- ✅ Added API backend (4 PHP endpoints)
- ✅ Built LMS module (lms.js)
- ✅ Implemented POPIA consent manager (popia.js)
- ✅ Created QCTO programs page
- ✅ Added graduate incubator hub
- ✅ Wrote quality policy document (11 sections)
- ✅ Updated auth.js for API integration

### v2.0 (November 2024)
- ✅ Initial scaffold with 8 HTML pages
- ✅ Glassmorphism CSS system (4 files)
- ✅ JavaScript functionality (6 files)
- ✅ Three.js AI Studio
- ✅ Legal compliance documents (3 policies)
- ✅ Apache configuration (.htaccess)

---

## 🚧 Roadmap (Future Enhancements)

1. **Database Migration**: MySQL/PostgreSQL instead of JSON files
2. **Payment Gateway**: Online application fee processing
3. **Live Chat**: Student support chatbot
4. **Video Streaming**: Lecture recordings with DRM
5. **Mobile App**: React Native iOS/Android companion
6. **Analytics Dashboard**: Admin reporting (enrollment, retention)
7. **Email Automation**: Welcome series, reminders, newsletters
8. **Multi-Language**: Afrikaans, Zulu translations

---

## 📖 Developer Notes

### Code Standards
- **Indentation**: 4 spaces (HTML/CSS), 2 spaces (JS)
- **Naming**: camelCase (JS), kebab-case (CSS), PascalCase (Classes)
- **Comments**: DocBlock style for functions
- **File Size**: Max 500 lines per file (split if larger)

### Git Workflow (If Using)
```bash
# Clone repository
git clone https://github.com/roguda/website.git

# Create feature branch
git checkout -b feature/new-lms-module

# Commit changes
git add .
git commit -m "Add LMS assignment submission feature"

# Push to repository
git push origin feature/new-lms-module
```

### Performance Tips
1. **Image Optimization**: Use WebP format (fallback to JPG)
2. **Lazy Loading**: Add `loading="lazy"` to images below fold
3. **Minification**: Minify CSS/JS for production (use UglifyJS)
4. **Caching**: Leverage `.htaccess` cache headers (1 year for assets)
5. **CDN**: Use CDN for Three.js and Google Fonts

---

## 🙏 Acknowledgments

- **Design Inspiration**: Luxury fashion brands (Gucci, Dior)
- **Technical Stack**: Modern web standards (W3C, WHATWG)
- **Legal Framework**: POPIA Act 4 of 2013, GDPR principles
- **Education Standards**: QCTO, SAQA, CHE guidelines

---

**Built with ❤️ for South African Fashion Education**

*Last Updated: December 2024*
