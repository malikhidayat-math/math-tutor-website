/* =========================================================================
   Hidayat ul Allah — Online Mathematics Tutor
   Frontend-only interactivity (no backend / no dependencies)
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     1. Footer year
     --------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     2. Sticky header — add shadow/border once the page has scrolled
     --------------------------------------------------------------------- */
  var header = document.getElementById("site-header");
  function onScrollHeader() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------------------------------------------------------------
     3. Mobile navigation toggle
     --------------------------------------------------------------------- */
  var navToggle = document.getElementById("navToggle");
  var primaryNav = document.getElementById("primaryNav");

  function closeNav() {
    navToggle.classList.remove("open");
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", function () {
    var isOpen = primaryNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu whenever a nav link is tapped
  primaryNav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  /* ---------------------------------------------------------------------
     4. FAQ accordion — only one panel open at a time
     --------------------------------------------------------------------- */
  var accordion = document.getElementById("accordion");
  if (accordion) {
    var triggers = accordion.querySelectorAll(".accordion-trigger");

    triggers.forEach(function (trigger) {
      var panel = trigger.parentElement.nextElementSibling;
      panel.style.maxHeight = 0;

      trigger.addEventListener("click", function () {
        var isOpen = trigger.getAttribute("aria-expanded") === "true";

        // Close every other panel first
        triggers.forEach(function (otherTrigger) {
          if (otherTrigger !== trigger) {
            otherTrigger.setAttribute("aria-expanded", "false");
            otherTrigger.parentElement.nextElementSibling.style.maxHeight = 0;
          }
        });

        // Toggle the clicked one
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = isOpen ? 0 : panel.scrollHeight + "px";
      });
    });
  }

  /* ---------------------------------------------------------------------
     5. Scroll-to-top button
     --------------------------------------------------------------------- */
  var scrollTopBtn = document.getElementById("scrollTop");
  function onScrollTopVisibility() {
    scrollTopBtn.classList.toggle("visible", window.scrollY > 480);
  }
  window.addEventListener("scroll", onScrollTopVisibility, { passive: true });
  onScrollTopVisibility();

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------------------------------------------------------------------
     6. Scroll-reveal animation for cards & sections
     --------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".quali-card, .service-card, .why-card, .testimonial-card, .section-heading, .about-content, .contact-info, .contact-form"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------------------------------------------------------------------
     7. Contact form — frontend-only validation & submission simulation
     --------------------------------------------------------------------- */
  var form = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");

  function setError(fieldId, message) {
    var errorEl = document.getElementById("err-" + fieldId);
    if (errorEl) errorEl.textContent = message;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var isValid = true;

      setError("name", "");
      setError("email", "");
      setError("message", "");

      if (name.length < 2) {
        setError("name", "Please enter your full name.");
        isValid = false;
      }
      if (!isValidEmail(email)) {
        setError("email", "Please enter a valid email address.");
        isValid = false;
      }
      if (message.length < 10) {
        setError("message", "Please write a short message (10+ characters).");
        isValid = false;
      }

      if (!isValid) {
        formStatus.style.color = "#C0392B";
        formStatus.textContent = "Please fix the highlighted fields.";
        return;
      }

      // No backend is connected — simulate a successful send and
      // guide the student toward WhatsApp/email as a direct fallback.
      formStatus.style.color = "#128C4A";
      formStatus.textContent = "Thanks, " + name.split(" ")[0] + "! Your message is ready — for the fastest reply, tap WhatsApp or Email above.";
      form.reset();
    });
  }
})();
