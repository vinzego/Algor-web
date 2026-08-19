document.addEventListener('DOMContentLoaded', () => {
  
  // Dynamic Animated Glowing Mesh Grid Engine (Perfect 1:1 Squares on All Screen Sizes)
  const meshContainer = document.getElementById('mesh-grid-container');
  if (meshContainer) {
    let tiles = [];
    let totalTiles = 0;

    const buildPerfectSquareMesh = () => {
      meshContainer.innerHTML = '';
      const tileSize = 24; // 24px x 24px perfect square
      const width = meshContainer.clientWidth || window.innerWidth;
      const height = meshContainer.clientHeight || window.innerHeight;

      const cols = Math.ceil(width / tileSize);
      const rows = Math.ceil(height / tileSize);
      totalTiles = cols * rows;
      tiles = [];

      meshContainer.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
      meshContainer.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;

      for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.className = 'mesh-tile';
        meshContainer.appendChild(tile);
        tiles.push(tile);
      }
    };

    buildPerfectSquareMesh();
    window.addEventListener('resize', buildPerfectSquareMesh);

    // Function to trigger random glowing tiles in soft yellow
    const pulseRandomTiles = () => {
      if (!tiles.length) return;
      const count = Math.floor(Math.random() * 12) + 16;
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * totalTiles);
        const tile = tiles[randomIndex];
        if (tile) {
          tile.classList.add('glowing-lime');
          setTimeout(() => {
            tile.classList.remove('glowing-lime');
          }, 1400 + Math.random() * 1200);
        }
      }
    };

    pulseRandomTiles();
    setInterval(pulseRandomTiles, 900);
  }

  // Live Clock Ticker for Hero Section (Zagreb / GMT+1)
  const heroLiveTimeEl = document.getElementById('hero-live-time');
  if (heroLiveTimeEl) {
    const updateHeroTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      heroLiveTimeEl.textContent = `${hours}:${minutes} ${ampm} / GMT+1`;
    };
    updateHeroTime();
    setInterval(updateHeroTime, 10000);
  }

  // 1. Static Package Pricing Engine (Fixed Higher Prices with AI included)
  const priceStart = document.getElementById('price-marketing');
  const pricePlus = document.getElementById('price-combined');
  const priceExtra = document.getElementById('price-ai');

  if (priceStart) priceStart.textContent = '690';
  if (pricePlus) pricePlus.textContent = '1,250';
  if (priceExtra) priceExtra.textContent = '2,150';

  // 2. Active AI Flow Stepper Animation
  const flowSteps = document.querySelectorAll('.flow-steps .flow-step');
  let currentStepIndex = 1; // start with korak 2 active (index 1)

  if (flowSteps.length > 0) {
    setInterval(() => {
      // Deactivate all steps
      flowSteps.forEach(step => {
        step.classList.remove('active');
        const dot = step.querySelector('.step-dot');
        if (dot) dot.classList.remove('pulsing');
      });

      // Increment step
      currentStepIndex = (currentStepIndex + 1) % flowSteps.length;
      
      // Activate current step
      const activeStep = flowSteps[currentStepIndex];
      activeStep.classList.add('active');
      
      // Add pulsing animation to active dot
      const activeDot = activeStep.querySelector('.step-dot');
      if (activeDot) {
        activeDot.classList.add('pulsing');
      }
    }, 4000); // changes every 4 seconds
  }

  // 3. Smooth scrolling for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === 'javascript:void(0)') return;
      e.preventDefault();
      try {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } catch (err) {
        // ignore invalid selectors
      }
    });
  });



  // 5. Scroll Reveal Text Color Fade Animation (Word-by-word)
  const revealText = document.getElementById('about-reveal-text');
  if (revealText) {
    const words = revealText.querySelectorAll('.reveal-word');
    window.addEventListener('scroll', () => {
      const rect = revealText.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight;
      const end = windowHeight * 0.35;
      
      let globalProgress = 0;
      if (rect.top <= start && rect.top >= end) {
        globalProgress = (start - rect.top) / (start - end);
      } else if (rect.top < end) {
        globalProgress = 1;
      }
      
      const totalWords = words.length;
      words.forEach((word, index) => {
        const wordStart = index / totalWords;
        const wordEnd = (index + 1.2) / totalWords;
        
        let wordProgress = 0;
        if (globalProgress >= wordEnd) {
          wordProgress = 1;
        } else if (globalProgress <= wordStart) {
          wordProgress = 0;
        } else {
          wordProgress = (globalProgress - wordStart) / (wordEnd - wordStart);
        }
        
        const opacity = 0.15 + (0.85 * wordProgress);
        word.style.color = `rgba(18, 19, 22, ${opacity})`;
      });
    });
  }

  // 6. Process Section Sticky Active Step Observer
  const processCards = document.querySelectorAll('#process [data-step-card]');
  const processIndicators = document.querySelectorAll('#process [data-step]');
  if (processCards.length > 0 && processIndicators.length > 0) {
    window.addEventListener('scroll', () => {
      const windowCenter = window.innerHeight / 2;
      let activeStep = '1';
      
      processCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= windowCenter && rect.bottom >= 100) {
          activeStep = card.getAttribute('data-step-card');
        }
      });
      
      processIndicators.forEach(ind => {
        if (ind.getAttribute('data-step') === activeStep) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    });

    // Indicator Click to Scroll
    processIndicators.forEach(ind => {
      ind.addEventListener('click', () => {
        const step = ind.getAttribute('data-step');
        const targetCard = document.querySelector(`#process [data-step-card="${step}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // 7. Marketing Section Sticky Active Step Observer
  const mktCards = document.querySelectorAll('#marketing [data-mkt-card]');
  const mktIndicators = document.querySelectorAll('#marketing [data-mkt-step]');
  if (mktCards.length > 0 && mktIndicators.length > 0) {
    window.addEventListener('scroll', () => {
      const windowCenter = window.innerHeight / 2;
      let activeStep = '1';
      
      mktCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= windowCenter && rect.bottom >= 100) {
          activeStep = card.getAttribute('data-mkt-card');
        }
      });
      
      mktIndicators.forEach(ind => {
        if (ind.getAttribute('data-mkt-step') === activeStep) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    });

    // Indicator Click to Scroll
    mktIndicators.forEach(ind => {
      ind.addEventListener('click', () => {
        const step = ind.getAttribute('data-mkt-step');
        const targetCard = document.querySelector(`#marketing [data-mkt-card="${step}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // 8. AI Automations Card Scroll Pop-Up Reveal (Re-animates every time on scroll)
  const aiSection = document.getElementById('ai-automations');
  if (aiSection) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px'
    };

    const aiObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aiSection.classList.add('popup-visible');
        } else {
          aiSection.classList.remove('popup-visible');
        }
      });
    }, observerOptions);

    aiObserver.observe(aiSection);
  }

  // 9. Pricing Section Static Setup
  const priceMarketing = document.getElementById('price-marketing');
  const priceCombined = document.getElementById('price-combined');
  const priceAi = document.getElementById('price-ai');

  if (priceMarketing) priceMarketing.textContent = '690';
  if (priceCombined) priceCombined.textContent = '1,250';
  if (priceAi) priceAi.textContent = '2,150';

  // 10. Multi-Step Quiz Modal Interactivity
  const calendarModal = document.getElementById('calendar-booking-modal');
  const modalBackdrop = document.getElementById('booking-modal-backdrop');
  const modalCloseBtn = document.getElementById('booking-modal-close');
  const quizPreselectedPkg = document.getElementById('quiz-preselected-pkg');
  const bookingForm = document.getElementById('calendar-booking-form');
  const modalSuccessState = document.getElementById('modal-success-state');
  const modalSuccessClose = document.getElementById('modal-success-close');

  let currentQuizStep = 1;
  let activePackageName = 'PLUS (Marketing + AI)';

  window.quizGoToStep = function(stepNum) {
    const stepPanels = document.querySelectorAll('.quiz-step-panel');
    const fill = document.getElementById('quiz-progress-fill');
    const counter = document.getElementById('quiz-step-counter');
    const hint = document.getElementById('quiz-step-title-hint');

    const stepTitles = [
      "1. Primarni cilj suradnje",
      "2. Djelatnost poslovanja",
      "3. Upiti i automatizacija",
      "4. Kontakt & Google Kalendar"
    ];

    if (stepNum < 1) stepNum = 1;
    if (stepNum > 4) stepNum = 4;
    currentQuizStep = stepNum;

    stepPanels.forEach(panel => {
      if (parseInt(panel.getAttribute('data-quiz-step')) === stepNum) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    if (fill) fill.style.width = `${stepNum * 25}%`;
    if (counter) counter.textContent = `Korak ${stepNum} od 4`;
    if (hint) hint.textContent = stepTitles[stepNum - 1] || '';

    // Scroll content to top when changing step
    const modalContent = document.querySelector('.booking-modal-content');
    if (modalContent) modalContent.scrollTop = 0;
  };

  function openBookingModal(pkgTitleText) {
    const calendarModal = document.getElementById('calendar-booking-modal');
    if (!calendarModal) return;

    if (pkgTitleText) activePackageName = pkgTitleText;

    if (quizPreselectedPkg) {
      quizPreselectedPkg.textContent = `Odabrani paket: ${activePackageName}`;
    }

    if (bookingForm) bookingForm.style.display = 'block';
    if (modalSuccessState) modalSuccessState.style.display = 'none';

    window.quizGoToStep(1);

    calendarModal.classList.add('active');
    calendarModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    const calendarModal = document.getElementById('calendar-booking-modal');
    if (!calendarModal) return;
    calendarModal.classList.remove('active');
    calendarModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.openBookingModal = openBookingModal;
  window.closeBookingModal = closeBookingModal;

  // Event delegation to capture clicks on any pricing button or custom link
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.price-cta, .select-pkg-btn, .custom-ai-link');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.price-card');
      let pkgName = 'PLUS (Marketing + AI)';
      if (card) {
        const titleEl = card.querySelector('h3');
        if (titleEl) pkgName = titleEl.textContent.trim();
      } else if (btn.classList.contains('custom-ai-link')) {
        pkgName = 'Custom AI Automatizacija';
      }
      openBookingModal(pkgName);
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeBookingModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeBookingModal);
  if (modalSuccessClose) modalSuccessClose.addEventListener('click', closeBookingModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && calendarModal && calendarModal.style.display === 'flex') {
      closeBookingModal();
    }
  });

  // Date and Time Slot Picker Logic
  const dayBtns = document.querySelectorAll('.gcal-day-btn');
  const slotBtns = document.querySelectorAll('.gcal-slot-btn');
  let selectedDate = 'Ponedjeljak, 17. Kol';
  let selectedTime = '11:30';

  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDate = btn.getAttribute('data-date') || selectedDate;
    });
  });

  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTime = btn.getAttribute('data-time') || selectedTime;
    });
  });

  // Quiz Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-input-name').value;
      const company = document.getElementById('modal-input-company').value;
      const email = document.getElementById('modal-input-email').value;

      const submitBtn = document.getElementById('modal-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Šaljem upit i rezervaciju...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Potvrdi ➔</span>';
        }
        if (bookingForm) bookingForm.style.display = 'none';
        if (modalSuccessState) {
          document.getElementById('modal-success-desc').textContent = 
            `Hvala vam, ${name}! Za tvrtku ${company} zaprimljen je upit za paket ${activePackageName}. Google Kalendar pozivnica za ${selectedDate} u ${selectedTime}h poslana je na ${email}.`;
          modalSuccessState.style.display = 'block';
        }
      }, 700);
    });
  }

  // 11. Footer Inline Contact Form Submission
  const footerContactForm = document.getElementById('footerContactForm');
  const footerFormMessage = document.getElementById('footerFormMessage');

  if (footerContactForm) {
    footerContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('footerName').value;
      const submitBtn = footerContactForm.querySelector('.footer-form-submit-btn');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Šaljem upit...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Pošalji upit ➔</span>';
        }
        if (footerContactForm) footerContactForm.reset();
        if (footerFormMessage) {
          footerFormMessage.textContent = `Hvala vam, ${name}! Vaš upit je uspješno poslan. Kontaktirat ćemo vas unutar 2 sata.`;
          footerFormMessage.style.display = 'inline-block';
        }
      }, 700);
    });
  }

  // 12. AI Section ScrollSpy for Sticky Left Panel Indicators
  const exampleCards = document.querySelectorAll('.ai-example-card');
  const stickyIndicators = document.querySelectorAll('.sticky-step-item');

  if (exampleCards.length && stickyIndicators.length) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2
    };

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cardId = entry.target.getAttribute('id');
          let index = 0;
          if (cardId === 'example-card-1') index = 0;
          if (cardId === 'example-card-2') index = 1;
          if (cardId === 'example-card-3') index = 2;

          stickyIndicators.forEach((ind, i) => {
            if (i === index) ind.classList.add('active');
            else ind.classList.remove('active');
          });
        }
      });
    }, observerOptions);

    exampleCards.forEach(card => cardObserver.observe(card));
  }

  // 13. Modern Smooth Scroll Reveal Observer
  const revealElements = document.querySelectorAll(
    '.info-header, .ba-card, .fit-card, .price-card, .portfolio-item-card, .vertical-step-card, .disclosure, .footer-conversion-area, .bento-card, .stat-card'
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal-on-scroll');
    const parentGrid = el.parentElement;
    if (parentGrid && (parentGrid.classList.contains('portfolio-grid') || parentGrid.classList.contains('before-after-container') || parentGrid.classList.contains('ideal-fit-grid') || parentGrid.classList.contains('pricing-grid'))) {
      const cardIndex = Array.from(parentGrid.children).indexOf(el);
      el.style.transitionDelay = `${(cardIndex * 0.12).toFixed(2)}s`;
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 14. Top Scroll Progress Indicator Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });

});
