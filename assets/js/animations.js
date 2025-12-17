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
// Add floating particles effect
document.addEventListener('DOMContentLoaded', function() {
    const ctaContent = document.querySelector('.cta-content');
    
    if (ctaContent) {
        // Create particles
        for (let i = 0; i < 15; i++) {
            createParticle(ctaContent);
        }
        
        // Create particles on mouse move
        ctaContent.addEventListener('mousemove', function(e) {
            if (Math.random() > 0.7) { // 30% chance to create particle
                createParticleAtPosition(ctaContent, e.clientX, e.clientY);
            }
        });
    }
    
    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random color (gold variations)
        const goldVariations = [
            'rgba(248, 213, 72, 0.3)',
            'rgba(255, 234, 109, 0.4)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(232, 213, 168, 0.3)'
        ];
        particle.style.background = goldVariations[Math.floor(Math.random() * goldVariations.length)];
        
        // Random animation
        const duration = Math.random() * 3 + 2;
        particle.style.animation = `particle-float ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        container.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                // Create new particle
                setTimeout(() => createParticle(container), 1000);
            }
        }, duration * 1000);
    }
    
    function createParticleAtPosition(container, x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Small size for mouse particles
        const size = Math.random() * 8 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Position at mouse
        const rect = container.getBoundingClientRect();
        particle.style.left = `${x - rect.left}px`;
        particle.style.top = `${y - rect.top}px`;
        
        // Gold color
        particle.style.background = 'rgba(248, 213, 72, 0.5)';
        
        // Quick animation
        const duration = Math.random() * 2 + 1;
        particle.style.animation = `particle-float ${duration}s ease-in-out forwards`;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, duration * 1000);
    }
})
document.addEventListener('DOMContentLoaded', function() {
    const innovationSection = document.querySelector('.innovation-cinematic');
    const particlesContainer = document.querySelector('.ai-particles');
    
    if (particlesContainer) {
        // Create initial particles
        for (let i = 0; i < 30; i++) {
            createAIParticle(particlesContainer);
        }
    }
    
    function createAIParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('ai-particle');
        
        // Random size
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        
        // Random vertical start position
        const startY = Math.random() * 100 + 100;
        particle.style.setProperty('--x-start', `${Math.random() * 100 - 50}px`);
        particle.style.setProperty('--x-end', `${Math.random() * 100 - 50}px`);
        particle.style.top = `${startY}%`;
        
        // Random color (blue variations)
        const blueVariations = [
            'rgba(0, 150, 255, 0.6)',
            'rgba(0, 212, 255, 0.7)',
            'rgba(100, 200, 255, 0.5)',
            'rgba(0, 100, 200, 0.4)'
        ];
        particle.style.background = blueVariations[Math.floor(Math.random() * blueVariations.length)];
        
        // Random animation
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        particle.style.animation = `particle-float ${duration}s linear infinite`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
        
        // Remove and recreate particles periodically
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
                setTimeout(() => createAIParticle(container), 1000);
            }
        }, duration * 1000);
    }
});

// Add sparkle effects to incubator section
document.addEventListener('DOMContentLoaded', function() {
    const incubatorSection = document.querySelector('.incubator-cinematic');
    const sparklesContainer = document.querySelector('.incubator-sparkles');
    
    if (sparklesContainer) {
        // Create initial sparkles
        for (let i = 0; i < 25; i++) {
            createSparkle(sparklesContainer);
        }
    }
    
    function createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('incubator-sparkle');
        
        // Random position
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 6 + 2;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        // Random animation
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 2;
        sparkle.style.animation = `sparkle-twinkle ${duration}s ease-in-out infinite`;
        sparkle.style.animationDelay = `${delay}s`;
        
        container.appendChild(sparkle);
        
        // Remove and recreate sparkles periodically
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
                setTimeout(() => createSparkle(container), 1000);
            }
        }, duration * 1000);
    }
    
    // Add hover effect to incubator button
    const incubatorBtn = document.querySelector('.btn-incubator');
    if (incubatorBtn) {
        incubatorBtn.addEventListener('mouseenter', function() {
            // Create mini sparkles on hover
            for (let i = 0; i < 8; i++) {
                createButtonSparkle(incubatorBtn);
            }
        });
    }
    
    function createButtonSparkle(button) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '6px';
        sparkle.style.height = '6px';
        sparkle.style.background = 'rgba(255, 255, 255, 0.8)';
        sparkle.style.borderRadius = '50%';
        
        // Random position around button
        const rect = button.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        // Animate outwards
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 30;
        
        const animation = sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        button.appendChild(sparkle);
        
        // Remove after animation
        animation.onfinish = () => {
            sparkle.remove();
        };
    }
});
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach(el => observer.observe(el));
});
document.addEventListener("DOMContentLoaded", () => {
  const welcomePopup = document.getElementById("welcomePopup");
  const notificationPopup = document.getElementById("notificationPopup");

  const closeWelcome = document.getElementById("closeWelcome");
  const closeNotification = document.getElementById("closeNotification");

  // Show welcome popup
  if (!sessionStorage.getItem("welcomeShown")) {
    setTimeout(() => {
      welcomePopup.classList.add("active");
      sessionStorage.setItem("welcomeShown", "true");
    }, 1500);
  }

  // Show notification popup
  if (!sessionStorage.getItem("notificationShown")) {
    setTimeout(() => {
      notificationPopup.classList.add("show");
      sessionStorage.setItem("notificationShown", "true");
    }, 6000);
  }

  // Close handlers
  closeWelcome.addEventListener("click", () => {
    welcomePopup.classList.remove("active");
  });

  closeNotification.addEventListener("click", () => {
    notificationPopup.classList.remove("show");
  });

  // Close welcome popup when clicking background
  welcomePopup.addEventListener("click", e => {
    if (e.target === welcomePopup) {
      welcomePopup.classList.remove("active");
    }
  });

  // Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      welcomePopup.classList.remove("active");
      notificationPopup.classList.remove("show");
    }
  });
});
