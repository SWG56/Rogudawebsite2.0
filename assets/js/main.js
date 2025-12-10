// ======================================
// MAIN JAVASCRIPT - main.js
// Navigation, Scroll, Animations
// ======================================

// DOM Elements
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.querySelector('.nav-menu');
const mainNav = document.getElementById('mainNav');

// Mobile Navigation Toggle
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
}

// Navbar Scroll Effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in, .glass-card, .feature-card').forEach(el => {
    observer.observe(el);
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-section');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.backgroundPositionY = -(scrolled * speed) + 'px';
    });
});

// Form Validation Helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Local Storage Helper
const Storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },
    
    remove: (key) => {
        localStorage.removeItem(key);
    },
    
    clear: () => {
        localStorage.clear();
    }
};

// Toast Notification System
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 20px 30px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 
                     type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 
                     'rgba(212, 175, 55, 0.9)'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Page Load Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console branding
console.log('%c🎨 Roguda Fashion & Art Design School', 'color: #D4AF37; font-size: 24px; font-weight: bold;');
console.log('%cWebsite crafted with passion for innovation and heritage.', 'color: #F7E7B2; font-size: 14px;');
// Hide scroll indicator when user scrolls past hero
function handleScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const heroSection = document.querySelector('.hero-cinematic');
    
    if (!scrollIndicator || !heroSection) return;
    
    const heroHeight = heroSection.offsetHeight;
    const scrollPosition = window.pageYOffset;
    
    if (scrollPosition > heroHeight * 0.3) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
        document.body.classList.add('scrolled');
    } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
        document.body.classList.remove('scrolled');
    }
}

// Initialize
window.addEventListener('scroll', handleScrollIndicator);
window.addEventListener('load', handleScrollIndicator);