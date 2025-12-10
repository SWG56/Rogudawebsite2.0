// ========================================
// ROGUDA DASHBOARD - CAREER CONTROL CENTER
// Canvas drawing, cost calculator, animations, quotes, reflections
// ========================================

// Load user data from PHP session
async function loadUserData() {
    try {
        const response = await fetch('includes/get-session.php');
        const data = await response.json();
        
        if (data.logged_in) {
            document.getElementById('userName').textContent = data.user;
            document.getElementById('userProgram').textContent = data.program;
            
            // Set avatar initial
            const initial = data.user.charAt(0).toUpperCase();
            document.getElementById('userAvatar').textContent = initial;
        } else {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Display current date
function displayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-ZA', options);
    document.getElementById('currentDate').textContent = today;
}

// Animate progress ring
function animateProgressRing() {
    const circle = document.querySelector('.progress-ring .progress');
    const percent = 85;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percent / 100) * circumference;
    
    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 500);
}

// Animate counter numbers
function animateCounter(elementId, targetValue, duration = 1500) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const start = 0;
    const increment = targetValue / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            element.textContent = targetValue;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Sparkle effect on stat card click
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function(e) {
            createSparkle(this, e);
        });
    });

    // Animate on hover
    document.querySelectorAll('.quick-link-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

function createSparkle(element, event) {
    const sparkle = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    sparkle.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, rgba(199, 158, 79, 1) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: sparkleExpand 0.6s ease-out forwards;
    `;
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
}

// Add sparkle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleExpand {
        to {
            width: 80px;
            height: 80px;
            opacity: 0;
            transform: translate(-50%, -50%);
        }
    }
`;
document.head.appendChild(style);

// Canvas Drawing for Design Studio
let canvas, ctx, isDrawing = false;

function initCanvas() {
    canvas = document.getElementById('designCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Set canvas background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Drawing events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e.touches[0]);
    });
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e.touches[0]);
    });
    canvas.addEventListener('touchend', stopDrawing);
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#C79E4F';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    showToast('Canvas cleared', 'info');
}

function saveDesign() {
    const dataURL = canvas.toDataURL('image/png');
    // In production, this would save to database
    localStorage.setItem('lastDesign', dataURL);
    showToast('✨ Design saved successfully!', 'success');
}

// Calculate material cost
function updateCost() {
    const fabricType = document.getElementById('fabricType');
    const quantity = document.getElementById('fabricQuantity');
    const costDisplay = document.getElementById('materialCost');
    
    if (fabricType && quantity && costDisplay) {
        const costPerMeter = parseFloat(fabricType.value);
        const meters = parseFloat(quantity.value) || 0;
        const total = costPerMeter * meters;
        costDisplay.textContent = `R ${total.toFixed(2)}`;
    }
}

// Motivational Quotes
const quotes = [
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "Fashion is about dressing according to what's fashionable. Style is more about being yourself.", author: "Oscar de la Renta" },
    { text: "Every stitch tells a story of heritage and innovation.", author: "Roguda Vision" },
    { text: "Design is not just what it looks like. Design is how it works.", author: "Steve Jobs" },
    { text: "Fashion is the armor to survive the reality of everyday life.", author: "Bill Cunningham" },
    { text: "Style is a way to say who you are without having to speak.", author: "Rachel Zoe" }
];

function changeQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.getElementById('dailyQuote');
    if (quoteElement) {
        quoteElement.style.opacity = '0';
        setTimeout(() => {
            quoteElement.textContent = `"${randomQuote.text}"`;
            quoteElement.nextElementSibling.textContent = `— ${randomQuote.author}`;
            quoteElement.style.opacity = '1';
        }, 300);
    }
}

// Save reflection
function saveReflection() {
    const reflection = document.getElementById('dailyReflection').value;
    if (reflection.trim()) {
        // In production, save to database
        localStorage.setItem(`reflection_${new Date().toDateString()}`, reflection);
        showToast('💭 Reflection saved!', 'success');
        document.getElementById('dailyReflection').value = '';
    } else {
        showToast('Please write something first', 'error');
    }
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }, 300 + (index * 200));
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation CSS
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(toastStyle);

// Initialize all animations and features
window.addEventListener('load', () => {
    loadUserData();
    displayDate();
    animateProgressRing();
    initCanvas();
    animateSkillBars();
    
    // Animate counters with delays
    setTimeout(() => animateCounter('activeModules', 4), 200);
    setTimeout(() => animateCounter('completedTasks', 12), 400);
    setTimeout(() => animateCounter('achievements', 8), 600);
    
    // Setup event listeners
    const fabricType = document.getElementById('fabricType');
    const quantity = document.getElementById('fabricQuantity');
    if (fabricType) fabricType.addEventListener('change', updateCost);
    if (quantity) quantity.addEventListener('input', updateCost);
    
    // Initial cost calculation
    updateCost();
});
