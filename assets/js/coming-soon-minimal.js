// Minimal Countdown Timer
class CountdownTimerMinimal {
    constructor() {
        // Set launch date to 2 years from now
        this.launchDate = new Date();
        this.launchDate.setFullYear(this.launchDate.getFullYear() + 2);
        this.launchDate.setMonth(2); // March
        this.launchDate.setDate(15); // 15th
        this.launchDate.setHours(10, 0, 0, 0); // 10:00 AM
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set launch date display
        const launchDateElement = document.getElementById('launchDate');
        if (launchDateElement) {
            launchDateElement.textContent = this.formatDate(this.launchDate);
        }
        
        // Start countdown
        this.startCountdown();
        
        // Add CSS animations
        this.addAnimations();
    }
    
    startCountdown() {
        // Initial update
        this.updateCountdown();
        
        // Update every second
        setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }
    
    updateCountdown() {
        const now = new Date();
        const timeRemaining = this.launchDate - now;
        
        if (timeRemaining <= 0) {
            this.handleCountdownEnd();
            return;
        }
        
        // Calculate time units
        const totalSeconds = Math.floor(timeRemaining / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        
        const years = Math.floor(totalDays / 365);
        const days = totalDays % 365;
        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;
        
        // Update displays
        this.updateDisplay('months', this.formatNumber(24 - years, 2));
        this.updateDisplay('days', this.formatNumber(days, 3));
        this.updateDisplay('hours', this.formatNumber(hours, 5));
        this.updateDisplay('minutes', this.formatNumber(minutes, 7));
        this.updateDisplay('seconds', this.formatNumber(seconds, 8));
        
        // Update progress bars
        this.updateProgressBars({
            months: (24 - years) / 24,
            days: days / 365,
            hours: hours / 24,
            minutes: minutes / 60,
            seconds: seconds / 60
        });
    }
    
    formatNumber(number, length) {
        let str = number.toString();
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
    
    updateDisplay(unit, value) {
        const unitElement = document.querySelector(`[data-unit="${unit}"] .unit-number`);
        if (!unitElement) return;
        
        const digits = unitElement.querySelectorAll('.digit');
        const currentValue = Array.from(digits)
            .map(digit => digit.textContent)
            .join('');
        
        if (currentValue !== value) {
            // Update each digit
            for (let i = 0; i < value.length; i++) {
                if (digits[i] && digits[i].textContent !== value[i]) {
                    this.animateDigit(digits[i], value[i]);
                }
            }
        }
    }
    
    animateDigit(digitElement, newValue) {
        // Quick flip animation
        digitElement.style.transform = 'scale(1.2)';
        digitElement.style.opacity = '0.7';
        
        setTimeout(() => {
            digitElement.textContent = newValue;
            digitElement.style.transform = 'scale(1)';
            digitElement.style.opacity = '1';
        }, 150);
    }
    
    updateProgressBars(progress) {
        // Update each progress bar
        Object.keys(progress).forEach(unit => {
            const bar = document.querySelector(`[data-unit="${unit}"] .progress-bar`);
            if (bar) {
                const width = progress[unit] * 100;
                bar.style.width = `${width}%`;
            }
        });
    }
    
    addAnimations() {
        // Add CSS for animations
        if (!document.querySelector('#countdown-animations')) {
            const style = document.createElement('style');
            style.id = 'countdown-animations';
            style.textContent = `
                .timer-unit {
                    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
                }
                
                .timer-unit:hover {
                    transform: translateY(-5px);
                }
                
                .digit {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .progress-bar {
                    transition: width 0.5s ease;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    handleCountdownEnd() {
        // Create celebration effect
        const celebration = document.createElement('div');
        celebration.className = 'celebration-effect';
        celebration.innerHTML = `
            <div class="celebration-message">
                <h2>🎉 We're Live! 🎉</h2>
                <p>The wait is over! Our new programs are now available.</p>
                <a href="apply.html" class="celebration-link">Explore Now</a>
            </div>
        `;
        
        document.body.appendChild(celebration);
        
        // Add styles
        celebration.style.position = 'fixed';
        celebration.style.top = '0';
        celebration.style.left = '0';
        celebration.style.width = '100%';
        celebration.style.height = '100%';
        celebration.style.background = 'rgba(10, 10, 10, 0.95)';
        celebration.style.display = 'flex';
        celebration.style.alignItems = 'center';
        celebration.style.justifyContent = 'center';
        celebration.style.zIndex = '3000';
        celebration.style.opacity = '0';
        celebration.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            celebration.style.opacity = '1';
        }, 100);
        
        // Add celebration styles
        const message = celebration.querySelector('.celebration-message');
        message.style.textAlign = 'center';
        message.style.padding = '2rem';
        message.style.background = 'rgba(255, 215, 0, 0.1)';
        message.style.border = '2px solid #FFD700';
        message.style.borderRadius = '20px';
        message.style.maxWidth = '500px';
        
        const link = celebration.querySelector('.celebration-link');
        link.style.display = 'inline-block';
        link.style.marginTop = '1.5rem';
        link.style.padding = '0.8rem 2rem';
        link.style.background = '#FFD700';
        link.style.color = '#000';
        link.style.textDecoration = 'none';
        link.style.borderRadius = '10px';
        link.style.fontWeight = 'bold';
        
        // Remove celebration after 5 seconds
        setTimeout(() => {
            celebration.style.opacity = '0';
            setTimeout(() => {
                celebration.remove();
            }, 500);
        }, 5000);
    }
}

// Initialize countdown
document.addEventListener('DOMContentLoaded', () => {
    window.countdown = new CountdownTimerMinimal();
});

    // Simple floating animation for background elements
    document.addEventListener('DOMContentLoaded', function() {
      const circles = document.querySelectorAll('.circle');
      const lines = document.querySelectorAll('.gold-line');
      
      // Animate circles
      circles.forEach((circle, index) => {
        circle.style.animationDelay = `${index * 0.5}s`;
      });
      
      // Animate lines
      lines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.3 + 0.5}s`;
      });
      
      // Add scroll animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);
      
      // Observe sections
      document.querySelectorAll('.timer-section, .notify-section, .social-section').forEach(section => {
        observer.observe(section);
      });
    });
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("nav-open");
    document.body.classList.toggle("nav-lock");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      document.body.classList.remove("nav-lock");
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  // Force Studio/Marketplace to ALWAYS go to comingsoon.html
  document
    .querySelectorAll('a[href$="studio.html"], a[href$="marketplace.html"]')
    .forEach((a) => (a.href = "comingsoon.html"));

  if (!toggle || !navLinks) return;

  // Toggle menu
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("nav-open");
  });

  // Close menu when clicking a link (mobile)
  navLinks.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    document.body.classList.remove("nav-open");
  });

  // Close menu if clicking outside
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("nav-open")) return;
    const clickedInsideNav = e.target.closest(".nav-cinematic");
    const clickedMenu = e.target.closest(".nav-links");
    if (!clickedInsideNav && !clickedMenu) {
      document.body.classList.remove("nav-open");
    }
  });

  // Close with ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") document.body.classList.remove("nav-open");
  });
});
