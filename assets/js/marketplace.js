// ======================================
// MARKETPLACE JAVASCRIPT - marketplace.js
// Shop Preview Grid Animation
// ======================================

// Animate product cards on scroll
function animateProducts() {
    const productCards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// Newsletter Form Handler
function setupNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Validate email
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Store in localStorage (simulate subscription)
            const subscribers = Storage.get('newsletter_subscribers') || [];
            
            if (subscribers.includes(email)) {
                showToast('You are already subscribed!', 'info');
                return;
            }
            
            subscribers.push(email);
            Storage.set('newsletter_subscribers', subscribers);
            
            // Success feedback
            showToast('Thank you for subscribing! We\'ll notify you when the marketplace launches.', 'success');
            emailInput.value = '';
        });
    }
}

// Add hover effect to product cards
function setupProductHoverEffects() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.product-image').style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.product-image').style.transform = 'scale(1)';
        });
    });
}

// Load sample products from JSON (optional future enhancement)
async function loadProducts() {
    try {
        const response = await fetch('data/projects.json');
        if (response.ok) {
            const products = await response.json();
            // Populate marketplace grid with real data
            console.log('Products loaded:', products);
        }
    } catch (error) {
        console.log('Using static product display');
    }
}

// Initialize marketplace functionality
if (document.getElementById('marketplaceGrid')) {
    window.addEventListener('load', () => {
        animateProducts();
        setupNewsletterForm();
        setupProductHoverEffects();
        loadProducts();
    });
}
