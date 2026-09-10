// Main JS for Portfolio (GSAP + Particles + Animations)

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const cursorGlow = document.getElementById("cursorGlow");

  // Type effect in hero section
  const typedTextEl = document.getElementById("typed-text");
  const texts = [
    "Backend Developer...",
    "AI & Data Science Student...",
    "REST API Specialist...",
    "Python Enthusiast..."
  ];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];
    if (isDeleting) {
      typedTextEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
      setTimeout(() => (isDeleting = true), 1000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }

    const speed = isDeleting ? 70 : 150;
    setTimeout(type, speed);
  }
  type();

  // Loader fade out
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
      cursorGlow.style.opacity = "1";
    }, 300);
  }, 1500);

  // Cursor glow follow
  document.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    cursorGlow.style.left = `${clientX}px`;
    cursorGlow.style.top = `${clientY}px`;
  });

  // Nav toggle for mobile
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Navigation links smooth scroll
  document.querySelectorAll(".nav-link, .footer-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth",
          });
          navToggle.classList.remove("active");
          navMenu.classList.remove("active");
        }
      }
    });
  });

  // Project cards animation
  gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
      },
    });
  });

  // Skill bars animation
  gsap.utils.toArray(".skill-progress").forEach((bar) => {
    const level = bar.dataset.level || "70";
    gsap.from(bar, {
      width: 0,
      duration: 2,
      scrollTrigger: {
        trigger: bar,
        start: "top 80%",
      },
    });
  });

  // Stats counter animation
  const stats = [
    { id: "projectsCount", end: 1 },
    { id: "certificationsCount", end: 7 },
    { id: "experienceYears", end: 2 },
  ];

  stats.forEach((stat) => {
    const el = document.getElementById(stat.id);
    if (el) {
      gsap.to(el, {
        innerText: stat.end,
        snap: { innerText: 1 },
        duration: 2.5,
        scrollTrigger: {
          trigger: "#about",
          start: "top 70%",
        },
      });
    }
  });

  // Particles JS config
  if (window.particlesJS) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#5a4aff" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 2, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#5a4aff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }

  // Contact Form submission
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Message sent successfully!");
        contactForm.reset();
      } else {
        alert("Error: " + (data.message || "Something went wrong."));
      }
    } catch (err) {
      alert("Network error. Please try again.");
      console.error(err);
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  });
});