/* ================================================================
   PHYSICS TEACHER PORTFOLIO — script.js
   Handles: Navbar, Mobile Menu, Counters, Quiz, Form, Animations
================================================================ */

/* ----------------------------------------------------------------
   1. NAVBAR — shrink on scroll + mobile toggle
---------------------------------------------------------------- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Shrink navbar when page is scrolled
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Open / close mobile menu
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ----------------------------------------------------------------
   2. FOOTER YEAR — automatically keeps copyright current
---------------------------------------------------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ----------------------------------------------------------------
   3. ANIMATED COUNTERS — fires when stats section enters viewport
---------------------------------------------------------------- */
const counters = document.querySelectorAll('.counter');

/**
 * Animates a number from 0 to target over ~1.8 seconds.
 * @param {HTMLElement} el  - the element to animate
 * @param {number}      target - final number
 */
function animateCounter(el, target) {
  const duration  = 1800;  // ms
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const eased    = 1 - (1 - progress) * (1 - progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target; // ensure exact final value
  }

  requestAnimationFrame(step);
}

// Intersection Observer — trigger once when 60% visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const target = parseInt(entry.target.dataset.target, 10);
      animateCounter(entry.target, target);
    }
  });
}, { threshold: 0.6 });

counters.forEach(c => statsObserver.observe(c));

/* ----------------------------------------------------------------
   4. SCROLL FADE-IN ANIMATIONS
   Adds .visible to any element with .fade-up when it scrolls into view
---------------------------------------------------------------- */
const fadeEls = document.querySelectorAll(
  '.service-card, .stat-card, .video-card, .resource-card, ' +
  '.testimonial-card, .fact-item, .section-header'
);

// Tag them for the CSS transition
fadeEls.forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger by index within group for a wave effect
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (i % 8) * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ----------------------------------------------------------------
   5. PHYSICS QUIZ OF THE DAY
---------------------------------------------------------------- */

/** Question bank — EDIT: Add more questions or adjust difficulty/topics */
const quizBank = [
  {
    question: "An object accelerates from rest to 20 m/s in 4 seconds. What is its acceleration?",
    options: ["4 m/s²", "5 m/s²", "80 m/s²", "2.5 m/s²"],
    correct: 1,
    level: "⚡ Intermediate",
    topic: "Topic: Kinematics",
    explanation: "Using a = Δv / Δt = (20 − 0) / 4 = 5 m/s²."
  },
  {
    question: "What is the SI unit of electric charge?",
    options: ["Ampere", "Volt", "Coulomb", "Ohm"],
    correct: 2,
    level: "🌱 Beginner",
    topic: "Topic: Electricity",
    explanation: "Electric charge is measured in Coulombs (C), named after Charles-Augustin de Coulomb."
  },
  {
    question: "A 10 kg object is placed on a surface. What is the normal force acting on it? (g = 10 m/s²)",
    options: ["1 N", "10 N", "100 N", "1000 N"],
    correct: 2,
    level: "🌱 Beginner",
    topic: "Topic: Forces",
    explanation: "Normal force = mg = 10 × 10 = 100 N. It balances gravity when on a flat surface."
  },
  {
    question: "Which of the following is a vector quantity?",
    options: ["Speed", "Temperature", "Velocity", "Mass"],
    correct: 2,
    level: "🌱 Beginner",
    topic: "Topic: Scalars & Vectors",
    explanation: "Velocity has both magnitude and direction, making it a vector. Speed is a scalar (magnitude only)."
  },
  {
    question: "The wavelength of a wave is 0.5 m and its frequency is 400 Hz. What is its wave speed?",
    options: ["800 m/s", "200 m/s", "0.00125 m/s", "400 m/s"],
    correct: 1,
    level: "⚡ Intermediate",
    topic: "Topic: Waves",
    explanation: "Using v = fλ = 400 × 0.5 = 200 m/s."
  },
  {
    question: "A 2 kg ball is lifted 5 m vertically. What is its gain in gravitational potential energy? (g = 10 m/s²)",
    options: ["10 J", "100 J", "25 J", "1000 J"],
    correct: 1,
    level: "⚡ Intermediate",
    topic: "Topic: Energy",
    explanation: "GPE = mgh = 2 × 10 × 5 = 100 J."
  },
  {
    question: "What happens to resistance when temperature increases in a metallic conductor?",
    options: ["Decreases", "Stays the same", "Increases", "Becomes zero"],
    correct: 2,
    level: "⚡ Intermediate",
    topic: "Topic: Electricity",
    explanation: "In metals, higher temperature causes more lattice vibrations, increasing resistance."
  },
  {
    question: "Which law states that every action has an equal and opposite reaction?",
    options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", "Hooke's Law"],
    correct: 2,
    level: "🌱 Beginner",
    topic: "Topic: Forces",
    explanation: "Newton's Third Law: Forces always come in equal and opposite pairs acting on different bodies."
  },
  {
    question: "The half-life of a radioactive substance is 10 years. After 30 years, what fraction of the original sample remains?",
    options: ["1/2", "1/4", "1/8", "1/6"],
    correct: 2,
    level: "🔥 Advanced",
    topic: "Topic: Radioactivity",
    explanation: "After 3 half-lives: (1/2)³ = 1/8 of the original sample remains."
  },
  {
    question: "What type of electromagnetic radiation has the highest frequency?",
    options: ["Radio waves", "Visible light", "X-rays", "Gamma rays"],
    correct: 3,
    level: "⚡ Intermediate",
    topic: "Topic: EM Spectrum",
    explanation: "Gamma rays have the highest frequency (and shortest wavelength) in the electromagnetic spectrum."
  },
  {
    question: "A transformer has 200 primary turns and 50 secondary turns. If the input voltage is 240 V, what is the output voltage?",
    options: ["60 V", "960 V", "120 V", "480 V"],
    correct: 0,
    level: "🔥 Advanced",
    topic: "Topic: Electromagnetism",
    explanation: "Vs/Vp = Ns/Np → Vs = 240 × (50/200) = 60 V. This is a step-down transformer."
  },
  {
    question: "Which particle has negligible mass and no charge?",
    options: ["Proton", "Neutron", "Electron", "Neutrino"],
    correct: 3,
    level: "🔥 Advanced",
    topic: "Topic: Particles",
    explanation: "Neutrinos have near-zero mass and no electric charge — they interact only via weak nuclear force."
  }
];

// Quiz state
let currentQuestion   = null;
let quizScore         = 0;
let quizTotal         = 0;
let answeredThisRound = false;
let usedIndices       = [];

const quizQuestion = document.getElementById('quizQuestion');
const quizOptions  = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const nextBtn      = document.getElementById('nextQuizBtn');
const skipBtn      = document.getElementById('skipQuizBtn');
const scoreEl      = document.getElementById('quizScore');
const totalEl      = document.getElementById('quizTotal');
const levelEl      = document.getElementById('quizLevel');
const topicEl      = document.getElementById('quizTopic');

/** Picks a random question not recently used */
function pickQuestion() {
  if (usedIndices.length >= quizBank.length) usedIndices = []; // reset if exhausted
  let idx;
  do { idx = Math.floor(Math.random() * quizBank.length); }
  while (usedIndices.includes(idx));
  usedIndices.push(idx);
  return quizBank[idx];
}

/** Renders a question onto the page */
function loadQuestion(q) {
  currentQuestion   = q;
  answeredThisRound = false;

  quizQuestion.textContent = q.question;
  levelEl.textContent      = q.level;
  topicEl.textContent      = q.topic;
  quizFeedback.textContent = '';
  quizFeedback.className   = 'quiz-feedback';
  nextBtn.style.display    = 'none';

  // Build option buttons
  quizOptions.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => handleAnswer(i, btn));
    quizOptions.appendChild(btn);
  });
}

/** Handles the student's answer selection */
function handleAnswer(selectedIndex, selectedBtn) {
  if (answeredThisRound) return;
  answeredThisRound = true;
  quizTotal++;
  totalEl.textContent = quizTotal;

  const allOptions = quizOptions.querySelectorAll('.quiz-option');

  // Disable all options
  allOptions.forEach(btn => (btn.disabled = true));

  if (selectedIndex === currentQuestion.correct) {
    // Correct!
    quizScore++;
    scoreEl.textContent = quizScore;
    selectedBtn.classList.add('correct');
    quizFeedback.textContent = `✅ Correct! ${currentQuestion.explanation}`;
    quizFeedback.className   = 'quiz-feedback correct-msg';
  } else {
    // Wrong — highlight the correct answer
    selectedBtn.classList.add('wrong');
    allOptions[currentQuestion.correct].classList.add('correct');
    quizFeedback.textContent = `❌ Not quite. ${currentQuestion.explanation}`;
    quizFeedback.className   = 'quiz-feedback wrong-msg';
  }

  nextBtn.style.display = 'inline-flex';
}

// "Next Question" button
nextBtn.addEventListener('click', () => {
  loadQuestion(pickQuestion());
});

// "Different Question" / skip
skipBtn.addEventListener('click', () => {
  loadQuestion(pickQuestion());
});

// Load the first question on page load
loadQuestion(pickQuestion());

/* ----------------------------------------------------------------
   6. CONTACT FORM — client-side validation & feedback
   NOTE: To actually send emails, integrate Formspree or EmailJS:
         1. Formspree: <form action="https://formspree.io/f/YOUR_ID">
         2. Or use the fetch() approach below with EmailJS
---------------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // --- Simple client-side validation ---
  let valid = true;

  const fields = [
    { id: 'contactName',    test: v => v.trim().length >= 2 },
    { id: 'contactEmail',   test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'contactSubject', test: v => v !== '' },
    { id: 'contactMessage', test: v => v.trim().length >= 10 }
  ];

  fields.forEach(field => {
    const el = document.getElementById(field.id);
    if (!field.test(el.value)) {
      el.classList.add('error');
      valid = false;
    } else {
      el.classList.remove('error');
    }
  });

  if (!valid) {
    formStatus.textContent  = '⚠️ Please fill in all required fields correctly.';
    formStatus.className    = 'form-note error';
    return;
  }

  // --- Simulate sending (replace with real fetch to Formspree / EmailJS) ---
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled   = true;
  submitBtn.innerHTML  = '<i class="ph ph-circle-notch ph-spin"></i> Sending…';
  formStatus.textContent = '';
  formStatus.className   = 'form-note';

  // Simulate async delay (2 seconds) — REPLACE this block with a real fetch()
  setTimeout(() => {
    // On success:
    formStatus.textContent = '✅ Message sent! Dr. Okonkwo will reply within 24 hours.';
    formStatus.className   = 'form-note success';
    contactForm.reset();
    submitBtn.disabled  = false;
    submitBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';

    /* REAL FORMSPREE EXAMPLE — uncomment and configure to go live:
    ---------------------------------------------------------------
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name:    document.getElementById('contactName').value,
        email:   document.getElementById('contactEmail').value,
        phone:   document.getElementById('contactPhone').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
      })
    })
    .then(res => {
      if (res.ok) {
        formStatus.textContent = '✅ Message sent! Dr. Okonkwo will reply within 24 hours.';
        formStatus.className   = 'form-note success';
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    })
    .catch(() => {
      formStatus.textContent = '❌ Something went wrong. Please try WhatsApp or email directly.';
      formStatus.className   = 'form-note error';
    })
    .finally(() => {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message';
    });
    ---------------------------------------------------------------*/
  }, 2000);
});

// Remove error class on input
contactForm.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('error'));
});

/* ----------------------------------------------------------------
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   (CSS scroll-behavior already handles this, but this JS version
    provides better cross-browser support and offset correction)
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ----------------------------------------------------------------
   8. ACTIVE NAV LINK — highlights the section currently in view
---------------------------------------------------------------- */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.querySelectorAll('a').forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--gold)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

/* ----------------------------------------------------------------
   9. CLOSE MOBILE MENU when clicking outside it
---------------------------------------------------------------- */
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

/* ----------------------------------------------------------------
   END OF SCRIPT.JS
   Quick edit checklist:
   - To add quiz questions: add objects to quizBank[] above
   - To activate form: uncomment the Formspree fetch() block
   - To change counter targets: edit data-target in index.html
---------------------------------------------------------------- */
