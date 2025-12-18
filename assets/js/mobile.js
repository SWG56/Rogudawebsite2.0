// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Toggle menu function
    function toggleMenu() {
        mobileToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    // Toggle menu on button click
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }
    
    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
    });
    
    // Close menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // Close menu on window resize (if resizing to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            mobileToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        // Swipe left to close menu
        if (touchStartX - touchEndX > 50 && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});
/* Typewriter effect for "Dreams" */
function typeDreamsText() {
  const text = "Dreams";
  const element = document.getElementById("dreamsText");
  let index = 0;

  element.textContent = "";

  const typingInterval = setInterval(() => {
    element.textContent += text.charAt(index);
    index++;

    if (index === text.length) {
      clearInterval(typingInterval);
    }
  }, 180); // typing speed (luxury pace)
}

/* Trigger AFTER welcome popup closes */
function closeWelcomePopup() {
  const popup = document.getElementById('welcomePopup');
  if (popup) {
    popup.classList.remove('active');
  }

  // Start typing after popup closes
  setTimeout(typeDreamsText, 400);
}
// ================= UNIVERSAL MOBILE NAV TOGGLE =================
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav-cinematic");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (!nav || !toggle || !links) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });

  // Close menu when a link is clicked
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("is-open"));
  });

  // Close menu on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) nav.classList.remove("is-open");
  });
});
