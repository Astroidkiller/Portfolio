const typingTexts = [
  'CSE Student at VIT-AP',
  'GenAI & LLM Enthusiast',
  'RAG Project Builder',
  'Python & Streamlit Developer',
  'Frontend Learner with Product Focus'
];

const typedText = document.getElementById('typedText');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.nav-menu a');
const reveals = document.querySelectorAll('.reveal');
const meterFills = document.querySelectorAll('.meter-fill');
const contactForm = document.getElementById('contactForm');

class TypeWriter {
  constructor(element, words) {
    this.element = element;
    this.words = words;
    this.wordIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.words[this.wordIndex];

    if (this.isDeleting) {
      this.charIndex--;
    } else {
      this.charIndex++;
    }

    this.element.textContent = current.slice(0, this.charIndex);

    let speed = this.isDeleting ? 45 : 85;

    if (!this.isDeleting && this.charIndex === current.length) {
      speed = 1400;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      speed = 350;
    }

    setTimeout(() => this.type(), speed);
  }
}

if (typedText) {
  new TypeWriter(typedText, typingTexts);
}

menuToggle?.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => navMenu.classList.remove('open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      if (entry.target.id === 'skills') {
        meterFills.forEach((fill) => {
          fill.style.width = `${fill.dataset.width}%`;
        });
      }
    }
  });
}, { threshold: 0.14 });

reveals.forEach((item) => observer.observe(item));
const skillsSection = document.getElementById('skills');
if (skillsSection) observer.observe(skillsSection);

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
  if (themeToggle) themeToggle.textContent = '🌙';
}

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '🌙' : '☀️';
});

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('main section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-menu a[href="#${id}"]`);

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove('active'));
      navLink?.classList.add('active');
    }
  });
});

function showError(input, message) {
  const existing = input.parentElement.querySelector('.error-text');
  if (existing) existing.remove();

  const error = document.createElement('span');
  error.className = 'error-text';
  error.textContent = message;
  input.insertAdjacentElement('afterend', error);
}

function clearErrors() {
  document.querySelectorAll('.error-text').forEach((item) => item.remove());
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');

  let valid = true;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.value.trim().length < 2) {
    showError(name, 'Please enter at least 2 characters.');
    valid = false;
  }
  if (!emailPattern.test(email.value.trim())) {
    showError(email, 'Please enter a valid email address.');
    valid = false;
  }
  if (subject.value.trim().length < 4) {
    showError(subject, 'Subject should be at least 4 characters.');
    valid = false;
  }
  if (message.value.trim().length < 10) {
    showError(message, 'Message should be at least 10 characters.');
    valid = false;
  }

  if (!valid) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "9a131bd9-b182-46b1-941c-baa40063e269",
        name: name.value.trim(),
        email: email.value.trim(),
        subject: subject.value.trim(),
        message: message.value.trim()
      })
    });

    const result = await response.json();
    const existingBanner = contactForm.querySelector('.success-banner');
    if (existingBanner) existingBanner.remove();

    const banner = document.createElement('div');
    banner.className = 'success-banner';

    if (response.status == 200) {
      banner.textContent = 'Message sent successfully! I will get back to you soon.';
      contactForm.appendChild(banner);
      contactForm.reset();
    } else {
      banner.textContent = result.message || 'Something went wrong, please try again.';
      contactForm.appendChild(banner);
    }
    
    setTimeout(() => banner.remove(), 5000);
  } catch (error) {
    showError(submitBtn, 'Network error. Please try again later.');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Fix Back to Top button
const backToTopBtn = document.querySelector('a[href="#top"]');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
