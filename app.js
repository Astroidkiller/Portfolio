/* ═══════════════════════════════════════════════════════
   Apple Liquid Glass Portfolio — app.js
   Enhanced micro-interactions & animations
   ═══════════════════════════════════════════════════════ */

'use strict';

// ── 1. TYPEWRITER ─────────────────────────────────────
const typingTexts = [
  'CSE Student at VIT-AP',
  'GenAI & LLM Enthusiast',
  'RAG Pipeline Builder',
  'Python & TypeScript Developer',
  'Multi-Agent AI Explorer',
  'Frontend Craftsperson'
];

class TypeWriter {
  constructor(element, words) {
    this.el = element;
    this.words = words;
    this.wordIdx = 0;
    this.charIdx = 0;
    this.deleting = false;
    this.tick();
  }
  tick() {
    const word = this.words[this.wordIdx];
    if (this.deleting) {
      this.charIdx--;
    } else {
      this.charIdx++;
    }
    this.el.textContent = word.slice(0, this.charIdx);
    let speed = this.deleting ? 40 : 78;
    if (!this.deleting && this.charIdx === word.length) {
      speed = 1600;
      this.deleting = true;
    } else if (this.deleting && this.charIdx === 0) {
      this.deleting = false;
      this.wordIdx = (this.wordIdx + 1) % this.words.length;
      speed = 320;
    }
    setTimeout(() => this.tick(), speed);
  }
}

const typedEl = document.getElementById('typedText');
if (typedEl) new TypeWriter(typedEl, typingTexts);

// ── 2. NAVIGATION ─────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');
const navLinks   = document.querySelectorAll('.nav-menu a');
const themeToggle = document.getElementById('themeToggle');

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  // Animate hamburger → X
  const spans = menuToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    const spans = menuToggle?.querySelectorAll('span');
    spans?.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (navMenu?.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !menuToggle?.contains(e.target)) {
    navMenu.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }
});

// ── 3. THEME TOGGLE & GITHUB IMAGES ───────────────────
function updateGithubImages(isLight) {
  const statsImg = document.getElementById('githubStatsImg');
  const langsImg = document.getElementById('githubLangsImg');
  const activityImg = document.getElementById('githubActivityImg');

  if (isLight) {
    if (statsImg) statsImg.src = 'https://github-readme-stats.vercel.app/api?username=Astroidkiller&show_icons=true&theme=transparent&hide_border=true&title_color=7c3aed&icon_color=7c3aed&text_color=374151&count_private=true';
    if (langsImg) langsImg.src = 'https://github-readme-stats.vercel.app/api/top-langs/?username=Astroidkiller&layout=compact&theme=transparent&hide_border=true&title_color=7c3aed&text_color=374151';
    if (activityImg) activityImg.src = 'https://github-readme-activity-graph.vercel.app/graph?username=Astroidkiller&theme=github&hide_border=true&bg_color=00000000&color=7c3aed&line=7c3aed&point=7c3aed';
  } else {
    if (statsImg) statsImg.src = 'https://github-readme-stats.vercel.app/api?username=Astroidkiller&show_icons=true&theme=transparent&hide_border=true&title_color=a78bfa&icon_color=a78bfa&text_color=e2e8f0&count_private=true';
    if (langsImg) langsImg.src = 'https://github-readme-stats.vercel.app/api/top-langs/?username=Astroidkiller&layout=compact&theme=transparent&hide_border=true&title_color=a78bfa&text_color=e2e8f0';
    if (activityImg) activityImg.src = 'https://github-readme-activity-graph.vercel.app/graph?username=Astroidkiller&theme=react-dark&hide_border=true&bg_color=00000000&color=a78bfa&line=7c3aed&point=a78bfa';
  }
}

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
  if (themeToggle) themeToggle.textContent = '🌙';
}
updateGithubImages(document.body.classList.contains('light'));

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '🌙' : '☀️';
  updateGithubImages(isLight);
  // Bounce animation
  themeToggle.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.3) rotate(20deg)' },
    { transform: 'scale(1) rotate(0deg)' }
  ], { duration: 360, easing: 'cubic-bezier(0.34,1.56,0.64,1)' });
});

// ── 4. SCROLL REVEAL (IntersectionObserver) ───────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ── 5. ACTIVE NAV LINK (scroll spy) ───────────────────
const sections = document.querySelectorAll('main section[id]');
const observerOptions = {
  root: null,
  rootMargin: '-30% 0px -50% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
      if (activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
      }
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// ── 6. PARALLAX CURSOR ORBS (Disabled for Performance) ──
// Removed background orb parallax movement animation loop.

// ── 7. GLASS CARD TILT (3D hover) ─────────────────────
const tiltCards = document.querySelectorAll('.project-card, .github-card, .info-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const tiltX  = y * -8;
    const tiltY  = x *  8;
    card.style.transform = `translateY(-6px) scale(1.01) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  });
});

// ── 8. CONTACT FORM ───────────────────────────────────
const contactForm = document.getElementById('contactForm');

function showError(input, msg) {
  clearError(input);
  const err = document.createElement('span');
  err.className = 'error-text';
  err.textContent = msg;
  input.insertAdjacentElement('afterend', err);
  input.style.borderColor = 'rgba(255,80,100,0.6)';
}

function clearError(input) {
  const existing = input.parentElement.querySelector('.error-text');
  if (existing) existing.remove();
  input.style.borderColor = '';
}

function clearAllErrors() {
  document.querySelectorAll('.error-text').forEach(e => e.remove());
  document.querySelectorAll('.contact-card input, .contact-card textarea').forEach(i => {
    i.style.borderColor = '';
  });
}

contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  clearAllErrors();

  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;
  if (name.value.trim().length < 2)       { showError(name, 'Please enter at least 2 characters.'); valid = false; }
  if (!emailRe.test(email.value.trim()))   { showError(email, 'Please enter a valid email address.'); valid = false; }
  if (subject.value.trim().length < 4)    { showError(subject, 'Subject should be at least 4 characters.'); valid = false; }
  if (message.value.trim().length < 10)   { showError(message, 'Message should be at least 10 characters.'); valid = false; }
  if (!valid) return;

  const btn = contactForm.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '9a131bd9-b182-46b1-941c-baa40063e269',
        name:    name.value.trim(),
        email:   email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim()
      })
    });
    const data = await res.json();

    // Remove old banner
    contactForm.querySelector('.success-banner')?.remove();

    const banner = document.createElement('div');
    banner.className = 'success-banner';
    banner.textContent = res.ok
      ? '✅ Message sent! I will get back to you soon.'
      : data.message || 'Something went wrong, please try again.';
    contactForm.appendChild(banner);

    if (res.ok) {
      contactForm.reset();
      banner.animate([{ opacity:0, transform:'translateY(6px)' }, { opacity:1, transform:'translateY(0)' }],
        { duration:400, easing:'ease', fill:'both' });
    }

    setTimeout(() => {
      banner.animate([{ opacity:1 }, { opacity:0 }], { duration:400, fill:'both' })
            .onfinish = () => banner.remove();
    }, 6000);

  } catch {
    showError(btn, 'Network error. Please try again later.');
  } finally {
    btn.textContent = orig;
    btn.disabled    = false;
  }
});

// ── 9. SMOOTH BACK TO TOP ─────────────────────────────
const backToTop = document.querySelector('#back-to-top');
backToTop?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 10. BUTTON RIPPLE EFFECT ──────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute;
      width:4px; height:4px;
      background:rgba(255,255,255,0.5);
      border-radius:50%;
      transform:translate(-50%,-50%) scale(0);
      left:${x}px; top:${y}px;
      pointer-events:none;
      z-index:10;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    ripple.animate(
      [{ transform:'translate(-50%,-50%) scale(0)', opacity:1 },
       { transform:`translate(-50%,-50%) scale(${Math.max(rect.width, rect.height) * 0.5})`, opacity:0 }],
      { duration: 600, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => ripple.remove();
  });
});

// ── 11. SKILL TAGS STAGGER ON HOVER ───────────────────
document.querySelectorAll('.tag-row').forEach(row => {
  const tags = row.querySelectorAll('span');
  row.addEventListener('mouseenter', () => {
    tags.forEach((t, i) => {
      setTimeout(() => {
        t.style.transform = 'scale(1.08)';
        t.style.background = 'rgba(10, 132, 255, 0.10)';
        t.style.borderColor = 'rgba(10, 132, 255, 0.20)';
      }, i * 30);
    });
  });
  row.addEventListener('mouseleave', () => {
    tags.forEach(t => {
      t.style.transform = '';
      t.style.background = '';
      t.style.borderColor = '';
    });
  });
});

// ── 12. SCROLL PROGRESS INDICATOR ─────────────────────
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position:fixed;
  top:0; left:0;
  height:2px;
  background:linear-gradient(90deg, #007aff, #0a84ff, #60a5fa);
  width:0%;
  z-index:9999;
  transition:width 0.1s linear;
  pointer-events:none;
`;
document.body.appendChild(progressBar);

let progressTicking = false;
window.addEventListener('scroll', () => {
  if (!progressTicking) {
    window.requestAnimationFrame(() => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.pageYOffset / total) * 100 : 0;
      progressBar.style.width = pct + '%';
      progressTicking = false;
    });
    progressTicking = true;
  }
}, { passive: true });

// ── 13. MINI CARD STAGGER REVEAL ──────────────────────
// Already handled by reveal + delay-1/2 classes above.
// Additional: add glow pulse on cert cards when they enter
const miniCards = document.querySelectorAll('.mini-card');
const miniObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.boxShadow =
          '0 0 0 1px rgba(10, 132, 255, 0.15), 0 32px 64px rgba(0,0,0,0.55)';
        setTimeout(() => { entry.target.style.boxShadow = ''; }, 900);
      }, i * 80);
      miniObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
miniCards.forEach(c => miniObserver.observe(c));

// ── 14. HERO ENTRANCE ANIMATION (no GSAP dependency) ──
window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(32px)';
    requestAnimationFrame(() => {
      heroContent.style.transition = 'opacity 0.9s cubic-bezier(0.23,1,0.32,1), transform 0.9s cubic-bezier(0.34,1.56,0.64,1)';
      heroContent.style.opacity   = '1';
      heroContent.style.transform = 'translateY(0)';
    });
  }
});
