document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rogudaForm");
  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".progress-step");
  let currentStep = 0;

  function setStep(index) {
    if (index < 0 || index >= steps.length) return;

    steps[currentStep].classList.remove("active");
    progressSteps[currentStep].classList.remove("active");

    currentStep = index;

    steps[currentStep].classList.add("active");
    progressSteps[currentStep].classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeStep(direction) {
    setStep(currentStep + direction);
  }

  function validateStep(stepIndex) {
    const requiredFields = steps[stepIndex].querySelectorAll(
      "input[required], select[required], textarea[required]"
    );

    let valid = true;

    requiredFields.forEach((field) => {
      // Special handling for file inputs
      if (field.type === "file") {
        if (!field.files || field.files.length === 0) {
          valid = false;
          field.style.borderColor = "#E57373";
          setTimeout(() => (field.style.borderColor = ""), 2000);
        }
        return;
      }

      // Checkboxes must be checked
      if (field.type === "checkbox") {
        if (!field.checked) {
          valid = false;
        }
        return;
      }

      // Normal inputs/selects/textareas
      if (!String(field.value || "").trim()) {
        valid = false;
        field.style.borderColor = "#E57373";
        setTimeout(() => (field.style.borderColor = ""), 2000);
      }
    });

    return valid;
  }

  function validateAllSteps() {
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        setStep(i);
        alert("Please complete all required fields before submitting.");
        return false;
      }
    }
    return true;
  }

  // Next buttons
  document.querySelectorAll(".btn-next").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        changeStep(1);
      } else {
        alert("Please fill in all required fields before proceeding.");
      }
    })
  );

  // Prev buttons
  document.querySelectorAll(".btn-prev").forEach((btn) =>
    btn.addEventListener("click", () => changeStep(-1))
  );

  // Final submit (this is the missing piece)
  if (form) {
    form.addEventListener("submit", (e) => {
      // Let the browser also do its own checks
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }

      // Our step-by-step validation
      if (!validateAllSteps()) {
        e.preventDefault();
        return;
      }

      // If all good, allow normal submit to submit_application.php
    });
  }

  // Mobile nav toggle (your existing code)
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("nav-open");
      navToggle.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("nav-open");
        navToggle.classList.remove("open");
      });
    });
  }
});
