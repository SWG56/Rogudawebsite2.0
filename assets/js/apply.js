 const steps = document.querySelectorAll(".form-step");
    const progressSteps = document.querySelectorAll(".progress-step");
    let currentStep = 0;

    document.querySelectorAll(".btn-next").forEach(btn =>
      btn.addEventListener("click", () => {
        if (validateCurrentStep()) {
          changeStep(1);
        }
      })
    );

    document.querySelectorAll(".btn-prev").forEach(btn =>
      btn.addEventListener("click", () => changeStep(-1))
    );

    function changeStep(direction) {
      steps[currentStep].classList.remove("active");
      progressSteps[currentStep].classList.remove("active");
      currentStep += direction;
      steps[currentStep].classList.add("active");
      progressSteps[currentStep].classList.add("active");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateCurrentStep() {
      const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
      let isValid = true;

      currentInputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#E57373';
          isValid = false;
          setTimeout(() => {
            input.style.borderColor = 'rgba(199,158,79,0.25)';
          }, 2000);
        }
      });

      if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
      }

      return isValid;
    }
    document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav-open");
    navToggle.classList.toggle("open");
  });

  // Close menu when clicking a link (mobile UX)
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      navToggle.classList.remove("open");
    });
  });
});
