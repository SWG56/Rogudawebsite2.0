// assets/js/animations.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll-based animations
    function revealOnScroll() {
        const elements = document.querySelectorAll('.reveal-text, .reveal-stagger');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Parallax effect
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Progress bar
    function updateProgressBar() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    }
    
    // Initialize all animations
    function initAnimations() {
        // Add scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        // Add hover effects
        const cards = document.querySelectorAll('.card, .glass-card');
        cards.forEach(card => {
            card.classList.add('hover-lift');
        });
        
        // Add enhanced buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-gold');
        buttons.forEach(btn => {
            btn.classList.add('btn-enhanced');
        });
        
        // Initial reveal check
        revealOnScroll();
        
        // Event listeners
        window.addEventListener('scroll', () => {
            revealOnScroll();
            parallaxEffect();
            updateProgressBar();
        });
        
        window.addEventListener('resize', revealOnScroll);
        
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Close mobile menu on click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Wait for fonts to load
    if (document.fonts) {
        document.fonts.ready.then(() => {
            initAnimations();
        });
    } else {
        initAnimations();
    }
    
    // Typewriter effect for hero
    function initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            function typeWriter() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            }
            
            setTimeout(typeWriter, 1000);
        });
    }
    
    // Initialize typewriter after page load
    setTimeout(initTypewriter, 500);
});
// Add to your animations.js or create a new file
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.textContent.includes('+') ? '+' : '%';
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Call this function in your initAnimations()
function initAnimations() {
    // ... existing code ...
    animateCounters();
    // ... rest of your code ...
}// Add to your animations.js file
function initAboutAnimations() {
    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card-cinematic');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200); // Stagger animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });
}

// Call in your main initialization
document.addEventListener('DOMContentLoaded', initAboutAnimations);
// Add to your animations.js or create new file
function openNotifyModal() {
    const modalHTML = `
        <div class="modal-overlay" id="notifyModal">
            <div class="modal-content program-modal">
                <button class="modal-close" onclick="closeNotifyModal()">×</button>
                <div class="modal-header">
                    <h3>Get Notified About Short Courses</h3>
                    <p>We'll email you when our short courses are available for registration.</p>
                </div>
                <div class="modal-body">
                    <form id="notifyForm" class="notify-form">
                        <div class="form-group">
                            <label for="notifyName">Full Name</label>
                            <input type="text" id="notifyName" placeholder="Enter your full name" required>
                        </div>
                        <div class="form-group">
                            <label for="notifyEmail">Email Address</label>
                            <input type="email" id="notifyEmail" placeholder="Enter your email address" required>
                        </div>
                        <div class="form-group">
                            <label for="notifyInterest">Course Interest</label>
                            <select id="notifyInterest" required>
                                <option value="">Select your interest</option>
                                <option value="illustration">Fashion Illustration Basics</option>
                                <option value="digital">Digital Pattern Making</option>
                                <option value="entrepreneurship">Fashion Entrepreneurship</option>
                                <option value="all">All Short Courses</option>
                            </select>
                        </div>
                        <button type="submit" class="btn-submit">
                            <span>Notify Me</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Handle form submission
    document.getElementById('notifyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would normally send the data to your server
        alert('Thank you! We will notify you when short courses become available.');
        closeNotifyModal();
    });
}

function closeNotifyModal() {
    const modal = document.getElementById('notifyModal');
    if (modal) {
        modal.remove();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeNotifyModal();
    }
});
