/* ================================================================
   Alex Rivera Portfolio — main.js
   Covers: Phases 7.1, 7.2, 7.3 + bonus features from playbook
   ================================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────────
   1. SCROLL ANIMATIONS — Intersection Observer
   Phase 7.1: "Use the Intersection Observer API to detect elements
   with .animate-on-scroll entering viewport, then add .animated"
   ────────────────────────────────────────────────────────────────── */

const animatedEls = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        scrollObserver.unobserve(entry.target); // fire once only
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

animatedEls.forEach(el => scrollObserver.observe(el));


/* ──────────────────────────────────────────────────────────────────
   2. NAVBAR — scroll state + active link highlighting
   Phase 7.2: "Glassmorphism navbar that becomes visible on scroll"
   Phase 7.1: "Active-nav-link highlight that updates on scroll"
   ────────────────────────────────────────────────────────────────── */

const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Scrolled class for glass effect
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateActiveLink();
}, { passive: true });

// Active section highlight
function updateActiveLink() {
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < bottom) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + id
        );
      });
    }
  });
}

// Run once on load
updateActiveLink();


/* ──────────────────────────────────────────────────────────────────
   3. MOBILE NAVIGATION
   Phase 7.2: "Mobile: collapse into animated hamburger menu"
   ────────────────────────────────────────────────────────────────── */

const hamburger   = document.getElementById('hamburger');
const mobileNav   = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

function openMobileMenu() {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  const newState = !isOpen;

  hamburger.setAttribute('aria-expanded', String(newState));
  mobileNav.classList.toggle('open', newState);
  mobileNav.setAttribute('aria-hidden', String(!newState));
  document.body.style.overflow = newState ? 'hidden' : '';
}

function closeMobileMenu() {
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openMobileMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});


/* ──────────────────────────────────────────────────────────────────
   4. SMOOTH SCROLLING
   Phase 7.1: "Smooth scrolling for navigation and CTA button links"
   ────────────────────────────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Offset for fixed nav
    const navH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    ) || 70;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - navH;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* ──────────────────────────────────────────────────────────────────
   5. BACK TO TOP BUTTON
   ────────────────────────────────────────────────────────────────── */

document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ──────────────────────────────────────────────────────────────────
   6. TYPING ANIMATION for hero tagline
   Bonus prompt: "Make my tagline appear with a typing animation"
   ────────────────────────────────────────────────────────────────── */

const typingTarget = document.getElementById('typing-target');
const phrases = [
  'Designer. Animator. Creative Thinker.',
  'Bringing ideas to life through motion.',
  'Interactive Design & Animation.',
  'Crafting experiences that move people.',
];

if (typingTarget) {
  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let delay       = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingTarget.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      typingTarget.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;
      delay = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at end of phrase
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // Start after a short initial delay
  setTimeout(type, 900);
}


/* ──────────────────────────────────────────────────────────────────
   7. CUSTOM CURSOR
   Bonus prompt: "Custom animated cursor that scales on hover"
   ────────────────────────────────────────────────────────────────── */

const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

// Only activate cursor on non-touch devices
if (window.matchMedia('(pointer: fine)').matches && cursor && cursorDot) {

  let mouseX = 0, mouseY = 0;
  let curX   = 0, curY   = 0;

  // Show cursor immediately on first move
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot snaps instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';

    document.body.classList.add('cursor-ready');
  }, { once: true });

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Animate ring with lag
  function animateCursor() {
    curX += (mouseX - curX) * 0.14;
    curY += (mouseY - curY) * 0.14;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Grow on interactive elements
  const interactiveEls = 'a, button, [role="button"], .project-card, .skill-badge, .social-link';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactiveEls)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactiveEls)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-ready', 'cursor-hover');
  });

  document.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-ready');
  });
}


/* ──────────────────────────────────────────────────────────────────
   8. ANIMATED COUNTER for About stats
   ────────────────────────────────────────────────────────────────── */

function animateCount(el, target, duration = 1200) {
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed  = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        animateCount(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterEls.forEach(el => counterObserver.observe(el));


/* ──────────────────────────────────────────────────────────────────
   9. PROJECT CARD 3D TILT — desktop only
   ────────────────────────────────────────────────────────────────── */

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;   // -1 to 1
      const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;   // -1 to 1

      card.style.transform = `
        translateY(-6px)
        rotateY(${dx * 4}deg)
        rotateX(${-dy * 3}deg)
      `;
      card.style.transition = 'transform 0.08s linear, border-color 0.3s, box-shadow 0.4s';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.4s';
    });
  });
}
