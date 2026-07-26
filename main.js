/* ============================================================
   MAIN.JS — Akash Pandey Portfolio
   Features:
   - Scroll progress bar
   - Particle canvas background
   - Typewriter role cycler
   - Animated stat counters
   - Card tilt effect (mouse tracking)
   - Scroll reveal (IntersectionObserver)
   - Skill bar animation
   - Mobile nav toggle
   - Magnetic button effect
============================================================ */

'use strict';

/* ---- Scroll Progress Bar ---- */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / total) * 100;
  if (scrollBar) scrollBar.style.width = pct + '%';
}, { passive: true });

/* ---- Scroll Reveal (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ---- Mobile Nav Toggle ---- */
const ham = document.getElementById('nav-ham');
const mobileMenu = document.getElementById('mobile-menu');

function openMobileMenu() {
  ham.classList.add('open');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  ham.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  ham.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  ham.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (ham) {
  ham.addEventListener('click', () => {
    if (ham.classList.contains('open')) closeMobileMenu();
    else openMobileMenu();
  });
}
// Expose to onclick in HTML
window.closeMobileMenu = closeMobileMenu;

/* ---- Typewriter Role Cycler ---- */
const roles = [
  'Android Apps',
  'FinTech Engines',
  'Backend APIs',
  'Secure Payment Flows',
  'Jetpack Compose UIs'
];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;
let typeTimeout;
const typeEl = document.getElementById('typewriter-text');

function type() {
  if (!typeEl) return;
  const current = roles[roleIdx];

  if (!isDeleting) {
    typeEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      typeTimeout = setTimeout(type, 1800); // pause at end
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  typeTimeout = setTimeout(type, isDeleting ? 50 : 80);
}

// Start typewriter after hero animation delay
setTimeout(type, 1200);

/* ---- Animated Stat Counters ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ---- Skill Bar Animation ---- */
function animateSkillBars(panel) {
  panel.querySelectorAll('.skill-bar-fill').forEach(bar => {
    const targetWidth = bar.dataset.width + '%';
    // Reset first
    bar.style.width = '0%';
    // Then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.width = targetWidth;
      });
    });
  });
}

/* ---- Skill Tab Switcher ---- */
const tabMap = {
  android: 'panel-android',
  backend: 'panel-backend',
  langs:   'panel-langs'
};

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.skill-tab').forEach(tab => {
    tab.classList.remove('active');
    tab.setAttribute('aria-selected', 'false');
  });
  const activeTab = document.getElementById('tab-' + tabName);
  if (activeTab) {
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
  }

  // Show/hide panels
  Object.entries(tabMap).forEach(([key, panelId]) => {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    if (key === tabName) {
      panel.style.display = 'flex';
      animateSkillBars(panel);
    } else {
      panel.style.display = 'none';
    }
  });
}
window.switchTab = switchTab;

// Animate initial tab bars (Android panel) when About scrolls into view
const aboutSection = document.getElementById('about');
if (aboutSection) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const initialPanel = document.getElementById('panel-android');
        if (initialPanel) animateSkillBars(initialPanel);
        aboutObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  aboutObserver.observe(aboutSection);
}

/* ---- Particle Canvas Background ---- */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 60;
  const MINT = '56, 189, 248';
  const ROSE = '244, 63, 94';

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? ROSE : MINT;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.12;
          ctx.strokeStyle = `rgba(${MINT}, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
      p.update();
    });

    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    draw();
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();

  // Reduce particle motion if user prefers
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
  }
})();

/* ---- Card Tilt Effect ---- */
document.querySelectorAll('.proj-card, .terminal').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * 5;
    const rotY = ((cx - x) / cx) * 5;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;

    // Update radial gradient position for proj cards
    if (card.classList.contains('proj-card')) {
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      card.style.setProperty('--mx', pctX + '%');
      card.style.setProperty('--my', pctY + '%');
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- Magnetic Button Effect ---- */
document.querySelectorAll('.btn-primary, .btn-submit').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    btn.style.transform = `translate(${dx * 0.1}px, ${dy * 0.1}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ---- Navbar hide/show on scroll ---- */
let lastScrollY = 0;
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  const cur = window.scrollY;
  if (siteHeader) {
    if (cur > 80 && cur > lastScrollY) {
      siteHeader.style.transform = 'translateY(-100%)';
    } else {
      siteHeader.style.transform = 'translateY(0)';
    }
  }
  lastScrollY = cur;
}, { passive: true });

// Add transition to header for smooth hide/show
if (siteHeader) {
  siteHeader.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
}
