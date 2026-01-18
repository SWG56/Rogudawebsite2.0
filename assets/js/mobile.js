// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;
    
// Create overlay element (skip on apply page to prevent blocking submit)
const isApplyPage = window.location.pathname.toLowerCase().includes("apply");
let overlay = null;

if (!isApplyPage) {
  overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);
}
    
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
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
    });
  });

  // Close when clicking overlay
  document.addEventListener("click", (e) => {
    if (
      document.body.classList.contains("menu-open") &&
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      document.body.classList.remove("menu-open");
    }
  });
});
/* =========================================
   mobile.js (NAV FIX)
   - Works on ALL pages including Apply
   - Shows menu properly on mobile
   - Closes on outside click / link click / ESC
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav-cinematic");
  if (!nav) return;

  const toggle = nav.querySelector(".nav-toggle");
  const links = nav.querySelector(".nav-links");
  if (!toggle || !links) return;

  // Ensure aria
  toggle.setAttribute("aria-expanded", "false");

  // Create backdrop if missing
  let backdrop = nav.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    nav.appendChild(backdrop);
  }

  const openNav = () => {
    nav.classList.add("nav-open");
    document.body.classList.add("nav-lock");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeNav = () => {
    nav.classList.remove("nav-open");
    document.body.classList.remove("nav-lock");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    nav.classList.contains("nav-open") ? closeNav() : openNav();
  });

  // Close when clicking backdrop
  backdrop.addEventListener("click", closeNav);

  // Close when clicking any nav link
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeNav());
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // If resizing to desktop, unlock scroll and close menu
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeNav();
  });
});
