document.addEventListener('DOMContentLoaded', () => {
  
  // Mobile Navigation Hamburger Toggle & Auto-Close Engine
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const ultraNavMenu = document.getElementById('ultra-nav-menu');
  const ultraNavbar = document.querySelector('.ultra-navbar');

  if (mobileNavToggle && ultraNavMenu) {
    mobileNavToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNavToggle.classList.toggle('open');
      ultraNavMenu.classList.toggle('open');
      if (ultraNavbar) ultraNavbar.classList.toggle('expanded');
    });

    const navLinks = ultraNavMenu.querySelectorAll('.ultra-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('open');
        ultraNavMenu.classList.remove('open');
        if (ultraNavbar) ultraNavbar.classList.remove('expanded');
      });
    });

    document.addEventListener('click', (e) => {
      if (!ultraNavMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
        mobileNavToggle.classList.remove('open');
        ultraNavMenu.classList.remove('open');
        if (ultraNavbar) ultraNavbar.classList.remove('expanded');
      }
    });
  }
  
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

  // 9. Static Pricing Section (No clicks, no popups, no animations, no package hiding)
  const priceMarketing = document.getElementById('price-marketing');
  const priceCombined = document.getElementById('price-combined');
  const priceAi = document.getElementById('price-ai');

  if (priceMarketing) priceMarketing.textContent = '690';
  if (priceCombined) priceCombined.textContent = '1,250';
  if (priceAi) priceAi.textContent = '2,150';

  // 10. Mobile Bottom Sheet Slide-Up Form & 2-Step Calendar System
  const overlay = document.getElementById('mobile-sheet-overlay');
  const sheet = document.getElementById('mobile-bottom-sheet');
  const sheetCloseBtn = document.getElementById('sheet-close-btn');
  const sheetPkgText = document.getElementById('sheet-pkg-text');
  const sheetForm = document.getElementById('mobile-sheet-form');
  const sheetCalendarStep = document.getElementById('sheet-calendar-step');
  const sheetSuccessBox = document.getElementById('sheet-success-box');
  const sheetSuccessCloseBtn = document.getElementById('sheet-success-close-btn');

  const gcalSkipBtn = document.getElementById('gcal-skip-btn');
  const gcalConfirmBtn = document.getElementById('gcal-confirm-btn');

  let selectedPackageFull = 'Plus (1.250 €/mj.)';
  let clientName = 'Klijent';
  let clientEmail = 'vašu e-mail adresu';
  let selectedDate = 'Ponedjeljak, 17. Kol';
  let selectedTime = '11:30';

  function openMobileSheet(pkgTitle, pkgPrice) {
    selectedPackageFull = `${pkgTitle} (${pkgPrice})`;
    if (sheetPkgText) {
      sheetPkgText.innerHTML = `Odabran: <strong class="sheet-pkg-name-highlight">${selectedPackageFull}</strong>`;
    }

    if (sheetForm) sheetForm.style.display = 'flex';
    if (sheetCalendarStep) sheetCalendarStep.style.display = 'none';
    if (sheetSuccessBox) sheetSuccessBox.style.display = 'none';

    if (overlay) {
      overlay.style.display = 'block';
      setTimeout(() => overlay.classList.add('active'), 10);
    }
    if (sheet) {
      sheet.style.display = 'flex';
      setTimeout(() => sheet.classList.add('active'), 10);
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSheet() {
    if (overlay) overlay.classList.remove('active');
    if (sheet) sheet.classList.remove('active');

    setTimeout(() => {
      if (overlay) overlay.style.display = 'none';
      if (sheet) sheet.style.display = 'none';
      document.body.style.overflow = '';
    }, 350);
  }

  if (overlay) overlay.addEventListener('click', closeMobileSheet);
  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeMobileSheet);
  if (sheetSuccessCloseBtn) sheetSuccessCloseBtn.addEventListener('click', closeMobileSheet);

  // Calendar Picker Selection Logic
  const dayBtns = document.querySelectorAll('.gcal-day-btn');
  const slotBtns = document.querySelectorAll('.gcal-slot-btn');

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

  // Click delegation for ALL package cards and CTA buttons across the website
  document.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.price-card, .luxury-card');
    const ctaBtn = e.target.closest('.package-cta-btn, .ig-ad-cta-banner, .price-cta, .select-pkg-btn, .custom-ai-link, .ultra-nav-cta, .mesh-primary-btn, .btn-lime, .btn-primary, .hero-cta-btn, .luxury-btn-dark, .luxury-btn-glow, .figma-cta-btn');

    if (cardEl || ctaBtn) {
      const targetBtn = ctaBtn || e.target.closest('button, a');
      if (targetBtn && (targetBtn.type === 'submit' || targetBtn.closest('form') || targetBtn.id === 'sheet-close-btn' || targetBtn.id === 'sheet-success-close-btn' || targetBtn.classList.contains('sheet-close-btn'))) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      let title = 'Upit & Savjetovanje';
      let priceText = 'Besplatan Audit';

      const targetCard = cardEl || (ctaBtn ? ctaBtn.closest('.price-card, .bento-ref-card, .fit-card') : null);

      if (ctaBtn && ctaBtn.classList.contains('figma-cta-btn')) {
        title = 'Izrada Web Stranice';
        priceText = 'Besplatna Procjena';
      } else if (ctaBtn && ctaBtn.classList.contains('ig-ad-cta-banner')) {
        title = 'Ciljani Instagram Oglas';
        priceText = 'Lokacijska Produkcija & Ads';
      } else if (ctaBtn && ctaBtn.classList.contains('custom-ai-link')) {
        title = 'Procjena Projekta / Redizajn';
        priceText = 'Custom Rješenje';
      } else if (targetCard) {
        const titleEl = targetCard.querySelector('h3');
        const priceValEl = targetCard.querySelector('.price-val, .price-amount');
        const pricePerEl = targetCard.querySelector('.price-per');
        if (titleEl) title = titleEl.textContent.trim();
        if (priceValEl) {
          const per = pricePerEl ? pricePerEl.textContent.trim() : 'jednokratno';
          priceText = `${priceValEl.textContent.trim()} € (${per})`;
        } else {
          priceText = 'Po dogovoru';
        }
      }

      openMobileSheet(title, priceText);
      return false;
    }
  });

  // Form Submit -> Directly Move to Success Screen & Save CSV
  if (sheetForm) {
    sheetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('sheet-input-name');
      const companyInput = document.getElementById('sheet-input-company');
      const emailInput = document.getElementById('sheet-input-email');
      const phoneInput = document.getElementById('sheet-input-phone');

      clientName = nameInput && nameInput.value ? nameInput.value : 'Klijent';
      clientEmail = emailInput && emailInput.value ? emailInput.value : 'vašu e-mail adresu';
      const company = companyInput && companyInput.value ? companyInput.value : '';
      const phone = phoneInput && phoneInput.value ? phoneInput.value : '';

      sendInquiryToBackend({
        name: clientName,
        company: company,
        email: clientEmail,
        phone: phone,
        package: selectedPackageFull
      });

      const submitBtn = sheetForm.querySelector('.sheet-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Šaljem upit...</span>';
      }

      setTimeout(() => {
        sheetForm.style.display = 'none';
        if (sheetSuccessBox) {
          sheetSuccessBox.style.display = 'flex';
          const msg = document.getElementById('sheet-success-desc');
          if (msg) {
            msg.textContent = `Hvala vam, ${clientName}! Vaš upit za ${selectedPackageFull} uspješno je poslan. Kontaktirat ćemo vas na ${clientEmail} u najkraćem roku.`;
          }
        }
      }, 400);
    });
  }

  function sendInquiryToBackend(data) {
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(err => console.log('CSV save:', err));
  }

  // 11. Footer Inline Contact Form Submission
  const footerContactForm = document.getElementById('footerContactForm');
  const footerFormMessage = document.getElementById('footerFormMessage');

  if (footerContactForm) {
    footerContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('footerName').value;
      const company = document.getElementById('footerCompany').value;
      const email = document.getElementById('footerEmail').value;
      const phone = document.getElementById('footerPhone').value;
      const pkg = document.getElementById('footerPackage').value;
      const submitBtn = footerContactForm.querySelector('.footer-form-submit-btn');

      sendInquiryToBackend({
        name: name,
        company: company,
        email: email,
        phone: phone,
        package: pkg,
        calendarSlot: 'Upit s podnožja'
      });

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

  // 15. Pure CSS Keyframe Animated Chat Loop (Automatske rezervacije)
  // Managed 100% via pure CSS keyframe rules for bulletproof reliability
});


/* =========================================================
   DYNAMIC SVG PROCESS LINE: CONNECT DOT TO DOT DIRECTLY
   ========================================================= */
function updateProcessSvgLine() {
  const container = document.querySelector(".zigzag-process-container");
  const svg = document.getElementById("processConnectingSvg");
  const path = document.getElementById("processConnectingPath");
  if (!container || !svg || !path) return;
  
  const nodes = container.querySelectorAll(".card-line-anchor-node");
  if (nodes.length < 2) return;
  
  const cRect = container.getBoundingClientRect();
  const w = Math.round(cRect.width);
  const h = Math.round(cRect.height);
  if (w <= 0 || h <= 0) return;
  
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  
  const pts = [];
  nodes.forEach(node => {
    const r = node.getBoundingClientRect();
    pts.push({
      x: (r.left + r.width / 2) - cRect.left,
      y: (r.top + r.height / 2) - cRect.top
    });
  });
  
  let d = `M ${pts[0].x},${pts[0].y} `;
  
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const dy = p2.y - p1.y;
    
    // For swooping S-curve between dots
    const isP1Right = p1.x > p2.x;
    const cp1x = isP1Right ? p1.x + 35 : p1.x - 35;
    const cp1y = p1.y + dy * 0.45;
    
    const cp2x = isP1Right ? p2.x - 35 : p2.x + 35;
    const cp2y = p1.y + dy * 0.55;
    
    d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
  }
  
  path.setAttribute("d", d);
}

window.addEventListener("load", updateProcessSvgLine);
window.addEventListener("resize", updateProcessSvgLine);
window.addEventListener("orientationchange", updateProcessSvgLine);
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(updateProcessSvgLine, 100);
  setTimeout(updateProcessSvgLine, 400);
  setTimeout(updateProcessSvgLine, 1000);
});
