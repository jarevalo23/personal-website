// ============ Mobile hamburger menu ============

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close the menu after tapping a link (mobile)
navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ============ Nav shadow once the page is scrolled ============

const nav = document.getElementById("nav");

window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  },
  { passive: true }
);

// ============ Fade-in sections as they scroll into view ============

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// ============ Footer year ============

document.getElementById("year").textContent = new Date().getFullYear();
