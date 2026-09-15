/**
 * ============================================================================
 * JC SILVA — PERSONAL PORTFOLIO SCRIPT
 * Features:
 *   - Interactive Canvas: Tropical Ocean Waves & Ambient Sun Sparkles
 *   - 3D Card Tilt Engine with Specular Glare Reflection
 *   - Clean Micro-Interactions & Hover Feedback
 *   - Scroll Spy & Frosted Navigation Bar
 *   - Mobile Drawer Navigation
 *   - Skills Filter System
 *   - Project Case Study Modal Viewer
 *   - Contact Form Real-time Validation & Feedback Toast
 *   - Procedural Web Audio Beach Ambiance Synthesizer
 *   - IntersectionObserver Scroll Reveal Animations
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. ENVIRONMENT CANVAS (Ocean Waves & Sun Sparkles)
  // ==========================================================================
  const canvas = document.getElementById('beach-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationFrameId;
    let waveStep = 0;
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    // Floating warm sunlight particles
    const particleCount = Math.min(35, Math.floor(width / 35));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseVal: Math.random() * Math.PI,
    }));

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    }, { passive: true });

    function drawWaves() {
      // Soft mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render floating warm particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulseVal += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulseVal));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${currentAlpha * 0.4})`;
        ctx.fill();
      });

      // Layer 1: Distant soft ocean horizon tide
      drawSingleWave({
        yBase: height * 0.88,
        amplitude: 14,
        frequency: 0.002,
        speed: 0.012,
        color: 'rgba(56, 189, 248, 0.08)',
        phase: waveStep,
      });

      // Layer 2: Mid-range calm wave swell
      drawSingleWave({
        yBase: height * 0.91,
        amplitude: 18,
        frequency: 0.003,
        speed: 0.018,
        color: 'rgba(2, 132, 199, 0.07)',
        phase: waveStep + 1.8,
      });

      // Layer 3: Foreground shoreline foam edge
      drawSingleWave({
        yBase: height * 0.95,
        amplitude: 12,
        frequency: 0.0025,
        speed: 0.024,
        color: 'rgba(240, 231, 216, 0.12)',
        phase: waveStep + 3.2,
      });

      waveStep += 0.02;
      animationFrameId = requestAnimationFrame(drawWaves);
    }

    function drawSingleWave({ yBase, amplitude, frequency, speed, color, phase }) {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 12) {
        // Cursor proximity wave bend
        const distToMouse = Math.abs(x - mouse.x);
        const mouseEffect = distToMouse < 200 ? (1 - distToMouse / 200) * 8 : 0;

        const y = yBase + Math.sin(x * frequency + phase * speed * 25) * amplitude + mouseEffect;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Pause when page is hidden to save energy
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(drawWaves);
      }
    });

    drawWaves();
  }

  // ==========================================================================
  // 2. 3D CARD TILT ENGINE & SPECULAR GLARE
  // ==========================================================================
  const tiltCards = document.querySelectorAll('.tilt-card');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouchDevice && tiltCards.length > 0) {
    tiltCards.forEach((card) => {
      const maxTilt = parseFloat(card.dataset.tiltMax) || 10;

      function onMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -maxTilt;
        const rotateY = ((cardX - centerX) / centerX) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;

        // Specular highlight positioning
        const glareX = (cardX / rect.width) * 100;
        const glareY = (cardY / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${glareX}%`);
        card.style.setProperty('--mouse-y', `${glareY}%`);
      }

      function onMouseLeave() {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      }

      function onMouseEnter() {
        card.style.transition = 'none';
      }

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
      card.addEventListener('mouseenter', onMouseEnter);
    });
  }



  // ==========================================================================
  // 4. FLOATING NAVBAR & SCROLL SPY
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Scroll Spy active state
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
      });
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ==========================================================================
  // 5. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburgerBtn?.addEventListener('click', openMobileMenu);
  closeDrawerBtn?.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 6. SKILLS FILTER TABS
  // ==========================================================================
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      skillCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // 7. PROJECT DETAILS MODAL & DATA
  // ==========================================================================
  const projectModal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const projectDetails = {
    ricemill: {
      title: 'Rice Mill Management System',
      badge: 'Full-Stack Web System • Academic & Enterprise Project',
      image: 'assets/project-ricemill.jpg',
      technologies: ['Laravel', 'PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
      overview:
        'A comprehensive web-based management platform engineered to modernize rice mill operations. It replaces manual, error-prone paper ledgers by centralizing paddy procurement, processing batch scheduling, farmer transaction accounts, and operational business performance reporting.',
      highlights: [
        'End-to-end grain inventory management tracking Jasmine, Basmati, and Brown rice varieties in real-time.',
        'Automated batch scheduling calendar to streamline milling machine workloads and preventative maintenance.',
        'Accurate farmer payment ledgers with instant digital receipt generation and transaction summaries.',
        'Operational dashboards presenting processing efficiency percentages and daily milling outputs.',
        'Structured with Laravel MVC pattern and normalized MySQL database ensuring ACID transaction integrity.'
      ],
      role: 'Lead Full-Stack Developer (System Architecture, Database Schema Design, Backend Logic & Dashboard UI)'
    },
    volleyball: {
      title: 'Volleyball Scoring System',
      badge: 'Sports Web Application • Real-time Scoring & Set Tracking',
      image: 'assets/project-volleyball.jpg',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'State Management', 'Responsive UI'],
      overview:
        'A dedicated digital scoring and match management system designed to eliminate tedious paper scoresheets during local volleyball officiating and school tournaments. Built with real-time state tracking and instant score reflection.',
      highlights: [
        'Live multi-set score updates with instant set-point and match-point validation logic.',
        'Court rotation diagram assisting referees and scorers in tracking player rotational positions.',
        'Team roster management with starter vs. bench tracking and libero substitution rules.',
        'Detailed serve statistics recording aces, serve errors, and player efficiency ratings.',
        'Timeouts remaining counter, set duration stopwatch, and match logs exportable for tournament coordinators.'
      ],
      role: 'Frontend & Logic Developer (Scoring Rules Engine, UI Design, Match State Handling)'
    },
    portfolio: {
      title: 'Personal Portfolio (Beach Frosted Glass Concept)',
      badge: 'Interactive Portfolio Experience • Modern Web Design',
      image: 'assets/jc-beach.jpg',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API', '3D CSS Transforms', 'Glassmorphism'],
      overview:
        'An artistic and modern personal portfolio that reflects a peaceful tropical beach environment beside the ocean while maintaining high professional standards for an IT student. Combines luxury frosted glass architecture with natural tones, interactive 3D cards, and smooth environmental animations.',
      highlights: [
        'Custom multi-layer HTML5 canvas simulating calm ocean tides and ambient warm sun particles.',
        'Dynamic 3D card tilt engine with interactive specular light glare calculating real-time cursor perspective.',
        'Rich frosted glass UI design system with curated natural palettes (Ocean Azure, Sand Beige, Soft Driftwood).',
        'Harmonious integration of authentic personal beach photography with elegant depth layers.',
        'Built with 100% vanilla HTML, CSS, and JavaScript for lightning-fast 60 FPS performance and zero dependency bloat.'
      ],
      role: 'Sole Designer & Developer (Concept, Visual Artistry, Mathematical Waves, Front-End Code)'
    }
  };

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalBody.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-header-img" loading="lazy">
      <div class="modal-meta-pills">
        <span class="tech-pill" style="background: var(--ocean-100); color: var(--ocean-700); font-weight: 700;">${data.badge}</span>
      </div>
      <h2 class="modal-title">${data.title}</h2>
      
      <div class="modal-meta-pills" style="margin-top: 0.75rem;">
        ${data.technologies.map(t => `<span class="tech-pill">${t}</span>`).join('')}
      </div>

      <h3 class="modal-section-title">Project Overview</h3>
      <p class="modal-description">${data.overview}</p>

      <h3 class="modal-section-title">Key Architectural Features</h3>
      <ul class="modal-features-list">
        ${data.highlights.map(h => `
          <li class="modal-feature-item">
            <span class="feature-check">✓</span>
            <span>${h}</span>
          </li>
        `).join('')}
      </ul>

      <h3 class="modal-section-title">My Contributions</h3>
      <p class="modal-description" style="font-weight: 600; color: var(--ocean-800);">${data.role}</p>
    `;

    projectModal?.classList.add('active');
    projectModal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal?.classList.remove('active');
    projectModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.dataset.project;
      if (projectId) openProjectModal(projectId);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // ==========================================================================
  // 8. CONTACT FORM VALIDATION & TOAST
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  function showToast(message, isError = false) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.style.background = isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(11, 25, 44, 0.92)';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  function validateField(inputEl, condition) {
    const parentGroup = inputEl.closest('.form-group');
    if (condition) {
      parentGroup?.classList.remove('has-error');
      return true;
    } else {
      parentGroup?.classList.add('has-error');
      return false;
    }
  }

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    // Realtime input clearing on type
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      input?.addEventListener('input', () => {
        input.closest('.form-group')?.classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, nameInput.value.trim().length >= 2);
      const isEmailValid = validateField(
        emailInput,
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
      );
      const isSubjectValid = validateField(subjectInput, subjectInput.value.trim().length >= 3);
      const isMessageValid = validateField(messageInput, messageInput.value.trim().length >= 10);

      if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
        // Show simulated loading state
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>SENDING MESSAGE...</span> 🌊`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          contactForm.reset();
          showToast('Thank you! Your message has been sent successfully.');
        }, 1200);
      } else {
        showToast('Please check the required fields before submitting.', true);
      }
    });
  }

  // ==========================================================================
  // 9. PROCEDURAL WEB AUDIO BEACH AMBIANCE SYNTHESIZER
  // ==========================================================================
  const audioBtn = document.getElementById('audio-toggle-btn');
  const iconMuted = document.querySelector('.audio-icon-muted');
  const iconPlaying = document.querySelector('.audio-icon-playing');
  let audioCtx = null;
  let isAudioPlaying = false;
  let noiseNode = null;
  let filterNode = null;
  let gainNode = null;
  let lfoNode = null;

  function initOceanSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Pink noise buffer generator (simulating rolling water)
      const bufferSize = audioCtx.sampleRate * 3;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      // Filter: sweeps smoothly between 220Hz and 650Hz to mimic receding and washing waves
      filterNode = audioCtx.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(280, audioCtx.currentTime);

      // Low-Frequency Oscillator (LFO) for wave swelling cycle (~0.12 Hz = 8.3s cycle)
      lfoNode = audioCtx.createOscillator();
      lfoNode.frequency.setValueAtTime(0.12, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(220, audioCtx.currentTime);

      lfoNode.connect(filterNode.frequency);

      // Main volume gain
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);

      noiseNode.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      noiseNode.start();
      lfoNode.start();
    } catch (err) {
      console.warn('Web Audio API not supported or blocked:', err);
    }
  }

  audioBtn?.addEventListener('click', () => {
    if (!audioCtx) {
      initOceanSound();
    }

    if (!audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isAudioPlaying) {
      // Fade in gently
      gainNode?.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode?.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
      gainNode?.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 1.5);

      isAudioPlaying = true;
      audioBtn.classList.add('playing');
      iconMuted?.classList.add('hidden');
      iconPlaying?.classList.remove('hidden');
    } else {
      // Fade out gently
      gainNode?.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode?.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
      gainNode?.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      isAudioPlaying = false;
      audioBtn.classList.remove('playing');
      iconMuted?.classList.remove('hidden');
      iconPlaying?.classList.add('hidden');
    }
  });

  // ==========================================================================
  // 10. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }
});
