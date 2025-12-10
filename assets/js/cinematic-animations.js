/* ========================================
   ROGUDA CINEMATIC ANIMATIONS
   Intersection Observer + Parallax Effects
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
    // ========================================
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Optional: Unobserve after animation completes
                // animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with data-animate attribute
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => animationObserver.observe(el));
    }

    // ========================================
    // PARALLAX HERO EFFECT
    // ========================================
    
    let ticking = false;
    
    function parallaxHero() {
        const hero = document.querySelector('.hero-cinematic');
        if (!hero) return;

        const scrollY = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Subtle parallax movement
                const parallaxSpeed = 0.5;
                hero.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
                
                // Fade effect as user scrolls
                const heroHeight = hero.offsetHeight;
                const opacity = Math.max(0, 1 - (scrollY / heroHeight) * 1.5);
                
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.opacity = opacity;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    
    function handleNavScroll() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-toggle');
        const menu = document.querySelector('.nav-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking nav links
        const navLinks = menu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL TO ANCHOR LINKS
    // ========================================
    
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Don't interfere with hash-only links
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const navHeight = document.querySelector('nav')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ========================================
    
    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3
        });
        
        sections.forEach(section => observer.observe(section));
    }

    // ========================================
    // CARD HOVER TILT EFFECT (3D)
    // ========================================
    
    function initCardTilt() {
        const cards = document.querySelectorAll('.glass-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * 5;
                const rotateY = ((centerX - x) / centerX) * 5;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ========================================
    // STATS COUNTER ANIMATION
    // ========================================
    
    function animateCounter(element, start, end, duration) {
        let current = start;
        const range = end - start;
        const increment = range / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = formatNumber(end);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-counter'));
                    animateCounter(counter, 0, target, 2000);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ========================================
    // PAGE LOADER
    // ========================================
    
    function hidePageLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('loaded');
            }, 500);
        }
    }

    // ========================================
    // LAZY LOAD IMAGES
    // ========================================
    
    function initLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // ========================================
    // WAVE ANIMATION ON SCROLL
    // ========================================
    
    function animateWaves() {
        const waves = document.querySelectorAll('.wave-separator path');
        
        waves.forEach((wave, index) => {
            const speed = 0.001 * (index + 1);
            let position = 0;
            
            setInterval(() => {
                position += speed;
                wave.style.transform = `translateX(${Math.sin(position) * 20}px)`;
            }, 50);
        });
    }

    // ========================================
    // INITIALIZE ALL ON DOM READY
    // ========================================
    
    function init() {
        // Core animations
        initScrollAnimations();
        initSmoothScroll();
        highlightActiveNav();
        
        // Mobile menu
        initMobileMenu();
        
        // Visual effects
        initCardTilt();
        initCounters();
        initLazyLoad();
        animateWaves();
        
        // Page loader
        hidePageLoader();
        
        // Scroll effects
        window.addEventListener('scroll', () => {
            handleNavScroll();
            parallaxHero();
        }, { passive: true });
        
        // Initial call
        handleNavScroll();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================
    // EXPOSE PUBLIC API
    // ========================================
    
    window.RogudaCinematic = {
        initScrollAnimations,
        animateCounter,
        parallaxHero
    };

})();
