document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // Algor Studio Custom GDPR Cookie Consent Engine & Google Consent Mode v2
  // ========================================================
  const initCookieConsent = () => {
    const loadGoogleTag = () => {
      if (document.querySelector('script[data-algor-google-tag]')) return;
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18423241784';
      script.dataset.algorGoogleTag = 'true';
      document.head.appendChild(script);
    };

    let banner = document.getElementById('algor-cookie-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'algor-cookie-banner';
      banner.className = 'algor-cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-modal', 'true');
      banner.setAttribute('aria-label', 'Postavke kolačića i privatnost');
      
      banner.innerHTML = `
        <div class="cookie-banner-inner">
          <div class="cookie-banner-content">
            <div class="cookie-banner-badge">
              <span class="cookie-icon">🍪</span>
              <span>Privatnost &amp; Kolačići</span>
            </div>
            <p class="cookie-banner-text">
              Ova web stranica koristi kolačiće i srodne tehnologije za optimizaciju performansi, analitiku posjećenosti i unaprjeđenje korisničkog iskustva. Klikom na „Prihvati sve” pristajete na obradu podataka u navedene svrhe. Saznajte više u našoj <a href="/kolacici" class="cookie-link">Politici kolačića</a>.
            </p>
          </div>
          <div class="cookie-banner-actions">
            <button type="button" id="cookie-btn-accept" class="cookie-btn cookie-btn-accept">Prihvati sve</button>
            <button type="button" id="cookie-btn-necessary" class="cookie-btn cookie-btn-necessary">Samo nužni</button>
          </div>
        </div>
      `;
      document.body.appendChild(banner);
    }

    const setCookie = (name, value, days) => {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    };

    const getCookie = (name) => {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    };

    const applyConsent = (type) => {
      localStorage.setItem('algor_cookie_consent', type);
      setCookie('algor_cookie_consent', type, 365);
      window.dispatchEvent(new CustomEvent('algorCookieConsent', { detail: { consent: type } }));
      if (typeof window.gtag === 'function') {
        if (type === 'all') {
          window.gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
          });
          loadGoogleTag();
        } else {
          window.gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
          });
        }
      }
    };

    const showBanner = () => {
      setTimeout(() => {
        banner.classList.add('visible');
      }, 600);
    };

    const hideBanner = () => {
      banner.classList.remove('visible');
    };

    const consent = localStorage.getItem('algor_cookie_consent') || getCookie('algor_cookie_consent');
    if (!consent) {
      showBanner();
    } else {
      applyConsent(consent);
    }

    const btnAccept = document.getElementById('cookie-btn-accept');
    const btnNecessary = document.getElementById('cookie-btn-necessary');

    if (btnAccept) {
      btnAccept.addEventListener('click', () => {
        applyConsent('all');
        hideBanner();
      });
    }

    if (btnNecessary) {
      btnNecessary.addEventListener('click', () => {
        applyConsent('necessary');
        hideBanner();
      });
    }

    const triggerLinks = document.querySelectorAll('a[href="#cookie-settings"], .open-cookie-banner');
    triggerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showBanner();
      });
    });
  };

  initCookieConsent();

  // ========================================================
  // Dedicated Fast Path for Contact Page (kontakt.html) - Apple Minimalist Flow
  // ========================================================
  const contactPageForm = document.getElementById('contact-page-form');
  const appleBookingModal = document.getElementById('apple-booking-modal');

  if (contactPageForm) {
    let selectedMeetingType = 'Google Meet poziv';
    let selectedContactSlot = '';
    let selectedCalendarDateStr = '';
    let selectedCalendarDateFormatted = '';

    // Service Selection Pills Handler (Standalone Form - User selects service)
    const servicePills = document.querySelectorAll('.apple-service-pill');
    const serviceInput = document.getElementById('contact-service-input');

    if (servicePills.length > 0) {
      servicePills.forEach(pill => {
        pill.addEventListener('click', () => {
          servicePills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const val = pill.getAttribute('data-service') || 'Izrada web stranica';
          if (serviceInput) serviceInput.value = val;
        });
      });
    }

    // Modal Elements
    const btnOpenBookingSidebar = document.getElementById('btn-open-booking-sidebar');
    const appleModalCloseBtn = document.getElementById('apple-modal-close-btn');
    const modalTypeCardMeet = document.getElementById('modal-type-card-meet');
    const modalTypeCardLive = document.getElementById('modal-type-card-live');
    const modalContactDate = document.getElementById('modal-contact-date');
    const modalBtnConfirmBooking = document.getElementById('modal-btn-confirm-booking');
    const contactSlotsWrap = document.getElementById('contact-time-slots-wrap');
    const modalClientName = document.getElementById('modal-client-name');
    const modalClientEmail = document.getElementById('modal-client-email');
    const modalClientPhone = document.getElementById('modal-client-phone');

    const calMonthTitle = document.getElementById('cal-month-title');
    const calDaysGrid = document.getElementById('cal-days-grid');
    const calPrevMonthBtn = document.getElementById('cal-prev-month');
    const calNextMonthBtn = document.getElementById('cal-next-month');

    const monthNamesHr = [
      'Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj',
      'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'
    ];

    let currentCalDate = new Date();
    let calViewYear = currentCalDate.getFullYear();
    let calViewMonth = currentCalDate.getMonth();

    const contactSlotsList = [
      '09:00',
      '09:45',
      '10:30',
      '11:15',
      '12:00',
      '12:45',
      '13:30',
      '14:15',
      '15:00',
      '15:45'
    ];

    function openBookingModal() {
      if (!appleBookingModal) return;

      // Pre-fill modal client fields from main form inputs
      const formName = document.getElementById('contact-name');
      const formEmail = document.getElementById('contact-email');
      const formPhone = document.getElementById('contact-phone');

      if (modalClientName && formName && formName.value.trim()) {
        modalClientName.value = formName.value.trim();
      }
      if (modalClientEmail && formEmail && formEmail.value.trim()) {
        modalClientEmail.value = formEmail.value.trim();
      }
      if (modalClientPhone && formPhone && formPhone.value.trim()) {
        modalClientPhone.value = formPhone.value.trim();
      }

      appleBookingModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderCalendar();
      renderContactSlots();
      checkBookingModalValidity();
    }

    function closeBookingModal() {
      if (!appleBookingModal) return;
      appleBookingModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (btnOpenBookingSidebar) {
      btnOpenBookingSidebar.addEventListener('click', openBookingModal);
    }
    if (appleModalCloseBtn) {
      appleModalCloseBtn.addEventListener('click', closeBookingModal);
    }

    if (appleBookingModal) {
      appleBookingModal.addEventListener('click', (e) => {
        if (e.target === appleBookingModal) {
          closeBookingModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appleBookingModal.classList.contains('open')) {
          closeBookingModal();
        }
      });
    }

    // Modal Meeting Type
    if (modalTypeCardMeet && modalTypeCardLive) {
      modalTypeCardMeet.addEventListener('click', () => {
        modalTypeCardMeet.classList.add('selected');
        modalTypeCardLive.classList.remove('selected');
        selectedMeetingType = 'Google Meet poziv';
      });

      modalTypeCardLive.addEventListener('click', () => {
        modalTypeCardLive.classList.add('selected');
        modalTypeCardMeet.classList.remove('selected');
        selectedMeetingType = 'Sastanak uživo';
      });
    }

    function renderCalendar() {
      if (!calDaysGrid || !calMonthTitle) return;

      calMonthTitle.textContent = `${monthNamesHr[calViewMonth]} ${calViewYear}.`;

      const realToday = new Date();
      const isPastMonth = (calViewYear < realToday.getFullYear()) || 
                          (calViewYear === realToday.getFullYear() && calViewMonth <= realToday.getMonth());
      if (calPrevMonthBtn) {
        calPrevMonthBtn.disabled = isPastMonth;
      }

      calDaysGrid.innerHTML = '';

      const firstDayObj = new Date(calViewYear, calViewMonth, 1);
      let startingDayIndex = firstDayObj.getDay();
      startingDayIndex = (startingDayIndex === 0) ? 6 : startingDayIndex - 1;

      const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();

      for (let i = 0; i < startingDayIndex; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'cal-day-cell cal-day-empty';
        calDaysGrid.appendChild(emptyCell);
      }

      const todayZero = new Date(realToday.getFullYear(), realToday.getMonth(), realToday.getDate());

      for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(calViewYear, calViewMonth, day);
        const dayOfWeek = cellDate.getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        const isPast = (cellDate < todayZero);

        const dayStr = `${calViewYear}-${String(calViewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const cell = document.createElement('div');
        cell.className = 'cal-day-cell';
        cell.textContent = day;
        cell.dataset.date = dayStr;

        if (isPast) {
          cell.classList.add('cal-day-past');
        } else if (isWeekend) {
          cell.classList.add('cal-day-weekend');
          cell.title = 'Vikend (Neradni dan)';
        } else {
          cell.classList.add('cal-day-active');
          if (dayStr === selectedCalendarDateStr) {
            cell.classList.add('cal-day-selected');
          }

          cell.addEventListener('click', (e) => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            selectedCalendarDateStr = dayStr;
            if (modalContactDate) {
              modalContactDate.value = dayStr;
            }

            const formatted = cellDate.toLocaleDateString('hr-HR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
            selectedCalendarDateFormatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

            renderCalendar();
            renderContactSlots();
            checkBookingModalValidity();
          });
        }

        calDaysGrid.appendChild(cell);
      }
    }

    if (calPrevMonthBtn) {
      calPrevMonthBtn.addEventListener('click', () => {
        calViewMonth--;
        if (calViewMonth < 0) {
          calViewMonth = 11;
          calViewYear--;
        }
        renderCalendar();
      });
    }

    if (calNextMonthBtn) {
      calNextMonthBtn.addEventListener('click', () => {
        calViewMonth++;
        if (calViewMonth > 11) {
          calViewMonth = 0;
          calViewYear++;
        }
        renderCalendar();
      });
    }

    function renderContactSlots() {
      if (!contactSlotsWrap) return;
      contactSlotsWrap.innerHTML = '';

      contactSlotsList.forEach(slot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'contact-slot-btn';
        btn.textContent = `${slot} h`;

        if (slot === selectedContactSlot) {
          btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
          contactSlotsWrap.querySelectorAll('.contact-slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedContactSlot = slot;
          checkBookingModalValidity();
        });

        contactSlotsWrap.appendChild(btn);
      });
    }

    function checkBookingModalValidity() {
      if (!modalBtnConfirmBooking) return;
      const hasDate = Boolean(selectedCalendarDateStr);
      const hasSlot = Boolean(selectedContactSlot);
      const hasName = modalClientName && modalClientName.value.trim().length > 0;
      const hasEmail = modalClientEmail && modalClientEmail.value.trim().length > 0 && modalClientEmail.value.includes('@');

      if (hasDate && hasSlot && hasName && hasEmail) {
        modalBtnConfirmBooking.removeAttribute('disabled');
      } else {
        modalBtnConfirmBooking.setAttribute('disabled', 'true');
      }
    }

    if (modalClientName) modalClientName.addEventListener('input', checkBookingModalValidity);
    if (modalClientEmail) modalClientEmail.addEventListener('input', checkBookingModalValidity);

    // Modal Booking Confirm Submission
    if (modalBtnConfirmBooking) {
      modalBtnConfirmBooking.addEventListener('click', async () => {
        if (!selectedCalendarDateStr || !selectedContactSlot) {
          alert('Molimo odaberite datum i satnicu.');
          return;
        }

        const clientName = modalClientName ? modalClientName.value.trim() : '';
        const clientEmail = modalClientEmail ? modalClientEmail.value.trim() : '';
        const clientPhone = modalClientPhone ? modalClientPhone.value.trim() : '';

        if (!clientName || !clientEmail) {
          alert('Molimo unesite Vaše ime i email adresu.');
          return;
        }

        modalBtnConfirmBooking.disabled = true;
        modalBtnConfirmBooking.innerHTML = '<span>Rezerviram termin...</span>';

        const appointmentDetails = `${selectedMeetingType} • ${selectedCalendarDateFormatted || selectedCalendarDateStr} u ${selectedContactSlot}h`;
        const chosenService = (serviceInput && serviceInput.value) ? serviceInput.value : 'Izrada web stranica';

        const bookingSummaryData = {
          name: clientName,
          company: '',
          email: clientEmail,
          phone: clientPhone,
          message: 'Rezervacija uvodnog termina putem kalendara',
          package: chosenService,
          calendarSlot: appointmentDetails
        };

        if (typeof window.gtag === 'function') {
          try {
            window.gtag('event', 'generate_lead', {
              event_category: 'Contact',
              event_label: `Zakazani sastanak: ${selectedMeetingType}`,
              value: 1
            });
            window.gtag('event', 'conversion', {
              'send_to': 'AW-18423241784'
            });
          } catch (e) {}
        }

        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: clientName,
              company: '',
              email: clientEmail,
              phone: clientPhone,
              message: 'Rezervacija uvodnih konzultacija (15 min)',
              package: chosenService,
              appointmentDate: selectedCalendarDateStr,
              appointmentTime: selectedContactSlot,
              meetingType: selectedMeetingType,
              calendarSlot: appointmentDetails,
              source: 'Kontakt stranica (Apple Modal Rezervacija)',
              device: (window.innerWidth <= 768) ? 'Mobitel' : 'Desktop'
            })
          });
        } catch (err) {}

        try {
          sessionStorage.setItem('algor_booking_summary', JSON.stringify(bookingSummaryData));
        } catch (e) {}

        window.location.href = '/kontakt/hvala';
      });
    }

    // Main Form Submit Handler
    contactPageForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('contact-name');
      const compEl = document.getElementById('contact-company');
      const emailEl = document.getElementById('contact-email');
      const phoneEl = document.getElementById('contact-phone');
      const msgEl = document.getElementById('contact-message');
      const consentEl = document.getElementById('contact-consent');
      const btnSubmit = document.getElementById('btn-submit-inquiry');

      if (!nameEl || !nameEl.value.trim()) {
        if (nameEl) { nameEl.focus(); nameEl.reportValidity(); }
        return;
      }
      if (!compEl || !compEl.value.trim()) {
        if (compEl) { compEl.focus(); compEl.reportValidity(); }
        return;
      }
      if (!emailEl || !emailEl.value.trim() || !emailEl.checkValidity()) {
        if (emailEl) { emailEl.focus(); emailEl.reportValidity(); }
        return;
      }
      if (consentEl && !consentEl.checked) {
        consentEl.focus();
        consentEl.reportValidity();
        return;
      }

      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>Šaljem upit...</span>';
      }

      const chosenService = (serviceInput && serviceInput.value) ? serviceInput.value : 'Izrada web stranica';

      const postData = {
        name: nameEl.value.trim(),
        company: compEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl ? phoneEl.value.trim() : '',
        message: msgEl ? msgEl.value.trim() : '',
        package: chosenService,
        meetingType: 'Direktan upit (bez zakazanog termina)',
        calendarSlot: 'Direktan upit (Klijent se javio porukom)',
        source: 'Kontakt stranica (Apple Minimalist Forma)',
        device: (window.innerWidth <= 768) ? 'Mobitel' : 'Desktop'
      };

      const bookingSummaryData = {
        name: postData.name,
        company: postData.company,
        email: postData.email,
        phone: postData.phone,
        message: postData.message,
        package: postData.package,
        calendarSlot: 'Direktan upit (Klijent se javio porukom)'
      };

      try {
        sessionStorage.setItem('algor_booking_summary', JSON.stringify(bookingSummaryData));
      } catch (e) {}

      if (typeof window.gtag === 'function') {
        try {
          window.gtag('event', 'generate_lead', {
            event_category: 'Contact',
            event_label: postData.package ? `${postData.package} (Direktan upit)` : 'Direktan upit',
            value: 1
          });
          window.gtag('event', 'conversion', {
            'send_to': 'AW-18423241784'
          });
        } catch (e) {}
      }

      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
      } catch (err) {}

      window.location.href = '/kontakt/hvala';
    });

    // Early return so homepage-only scripts never execute on kontakt.html
    return;
  }

  // ========================================================
  // Smooth scrolling for internal anchor links
  // ========================================================
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

  // ========================================================
  // Pricing Section "Snimanje sadržaja" Production Toggle
  // ========================================================
  const initPricingToggle = () => {
    const prodToggle = document.getElementById('pricing-production-toggle');
    const switchTrack = document.getElementById('pricing-switch-track');
    const toggleBadge = document.getElementById('pricing-toggle-badge');
    const pricingCards = document.querySelectorAll('.fb-price-card[data-base-price], .framer-price-card[data-base-price]');

    if (!prodToggle || pricingCards.length === 0) return;

    let isProductionOn = true;

    const updatePrices = () => {
      prodToggle.setAttribute('aria-checked', isProductionOn ? 'true' : 'false');
      prodToggle.classList.toggle('active', isProductionOn);
      if (switchTrack) switchTrack.classList.toggle('active', isProductionOn);

      if (toggleBadge) {
        toggleBadge.textContent = isProductionOn ? 'UKLJUČENO' : 'ISKLJUČENO';
      }

      pricingCards.forEach(card => {
        const base = parseInt(card.dataset.basePrice, 10);
        const addon = parseInt(card.dataset.addonPrice, 10);
        const numEl = card.querySelector('.price-val-num');
        const addonItem = card.querySelector('.service-production');
        const addonCopy = addonItem ? addonItem.querySelector('.service-copy') : null;
        const checkIcon = addonItem ? addonItem.querySelector('.check-icon') : null;
        const ctaLink = card.querySelector('.framer-pill-btn, a.fb-btn-dark, a.fb-btn-primary');
        const plan = card.dataset.plan;

        const currentPrice = isProductionOn ? (base + addon) : base;

        if (numEl) {
          numEl.textContent = currentPrice >= 1000 ? currentPrice.toLocaleString('de-DE') : currentPrice;
        }

        if (addonItem) {
          if (isProductionOn) {
            addonItem.classList.remove('fb-feature-disabled');
            if (checkIcon) {
              checkIcon.className = 'fb-feature-check check-icon';
              checkIcon.textContent = '✓';
            }
            if (addonCopy) {
              addonCopy.textContent = addonItem.dataset.included;
            }
          } else {
            addonItem.classList.add('fb-feature-disabled');
            if (checkIcon) {
              checkIcon.className = 'fb-feature-cross check-icon';
              checkIcon.textContent = '✕';
            }
            if (addonCopy) {
              addonCopy.textContent = addonItem.dataset.excluded;
            }
          }
        }

        if (ctaLink && plan) {
          ctaLink.href = `/kontakt?paket=${plan}${isProductionOn ? '&snimanje=da' : ''}`;
        }
      });
    };

    prodToggle.addEventListener('click', (e) => {
      e.preventDefault();
      isProductionOn = !isProductionOn;
      updatePrices();
    });

    prodToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        isProductionOn = !isProductionOn;
        updatePrices();
      }
    });

    // Run once to initialize link states
    updatePrices();
  };

  initPricingToggle();

  // ========================================================
  // Floating Capsule Navbar Mobile Menu Logic
  // ========================================================
  const navToggleBtn = document.getElementById('nav-mobile-toggle');
  const navMobileMenu = document.getElementById('nav-mobile-menu');
  const mainCapsuleNavbar = document.getElementById('main-capsule-navbar');

  if (mainCapsuleNavbar) {
    const syncNavbarSize = () => {
      const isScrolled = window.scrollY > 20;
      mainCapsuleNavbar.classList.toggle('is-scrolled', isScrolled);
      if (mainCapsuleNavbar.parentElement) {
        mainCapsuleNavbar.parentElement.classList.toggle('is-scrolled', isScrolled);
      }
    };

    syncNavbarSize();
    window.addEventListener('scroll', syncNavbarSize, { passive: true });
  }

  if (navToggleBtn && navMobileMenu) {
    const toggleNavMenu = (forceState) => {
      const isOpen = typeof forceState === 'boolean' ? forceState : !navMobileMenu.classList.contains('is-open');
      navMobileMenu.classList.toggle('is-open', isOpen);
      navToggleBtn.classList.toggle('is-active', isOpen);
      navToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (mainCapsuleNavbar) {
        mainCapsuleNavbar.classList.toggle('is-expanded', isOpen);
      }
    };

    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNavMenu();
    });

    // Close when clicking any link inside mobile menu
    navMobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleNavMenu(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMobileMenu.contains(e.target) && !navToggleBtn.contains(e.target)) {
        toggleNavMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMobileMenu.classList.contains('is-open')) {
        toggleNavMenu(false);
      }
    });
  }

  // ========================================================
  // Circular Scroll Progress Meter
  // ========================================================
  const scrollCircle = document.getElementById('fb-scroll-circle');
  const scrollText = document.getElementById('fb-scroll-text');
  if (scrollCircle && scrollText) {
    const circumference = 2 * Math.PI * 14; // r=14 -> ~87.96
    const updateScrollMeter = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      const offset = circumference * (1 - progress);
      scrollCircle.style.strokeDashoffset = offset;
      scrollText.textContent = `${Math.round(progress * 100)}%`;
    };
    window.addEventListener('scroll', updateScrollMeter, { passive: true });
    window.addEventListener('resize', updateScrollMeter);
    updateScrollMeter();
  }

  // ========================================================
  // Mobile Nav Burger & Overlay
  // ========================================================
  const burgerBtn = document.getElementById('fb-nav-burger');
  const mobileMenu = document.getElementById('fb-mobile-menu');
  if (burgerBtn && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    burgerBtn.addEventListener('click', () => toggleMenu());
    mobileMenu.querySelectorAll('.fb-mobile-link, .fb-btn-primary, a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // ========================================================
  // FAQ Accordion
  // ========================================================
  const faqList = document.getElementById('fb-faq-list');
  if (faqList) {
    const faqItems = Array.from(faqList.querySelectorAll('.fb-faq-item'));
    faqItems.forEach((item) => {
      const q = item.querySelector('.fb-faq-question');
      if (q) {
        q.addEventListener('click', () => {
          const wasOpen = item.classList.contains('is-open');
          faqItems.forEach((fi) => fi.classList.remove('is-open'));
          if (!wasOpen) {
            item.classList.add('is-open');
          }
        });
      }
    });
  }

  // ========================================================
  // Kinetic Staggered Rolling Text for Action Buttons & Links
  // ========================================================
  const initTextRoll = () => {
    const selectors = [
      '.fb-btn-primary',
      '.fb-btn-dark',
      '.fb-btn-white',
      '.fb-btn-dark-outline',
      '.fb-cta-banner-btn',
      '.fb-nav-links a',
      '.fb-mobile-link',
      '.fb-footer-col a',
      '.fb-footer-legal-links a',
      '.fb-footer-bottom a'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));
    elements.forEach((btn) => {
      if (btn.querySelector('.fb-roll-track') || btn.dataset.rollInit === 'true' || btn.classList.contains('fb-toggle-btn') || btn.classList.contains('cookie-btn') || btn.classList.contains('fb-nav-brand') || btn.querySelector('img')) return;
      btn.dataset.rollInit = 'true';
      btn.classList.add('fb-roll-btn');

      const items = [];
      const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            if (ch === '\n' || ch === '\r' || ch === '\t') continue;
            items.push({ type: 'char', char: ch });
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          if (tag === 'svg') {
            items.push({ type: 'html', html: node.outerHTML });
          } else {
            const text = node.textContent.trim();
            if (text.length > 0 && text.length <= 3 && !node.firstElementChild) {
              items.push({ type: 'html', html: node.outerHTML });
            } else {
              Array.from(node.childNodes).forEach(processNode);
            }
          }
        }
      };

      Array.from(btn.childNodes).forEach(processNode);
      if (items.length === 0) return;

      const visibleTrack = document.createElement('span');
      visibleTrack.className = 'fb-roll-visible';

      const hoverTrack = document.createElement('span');
      hoverTrack.className = 'fb-roll-hover';
      hoverTrack.setAttribute('aria-hidden', 'true');

      items.forEach((item, idx) => {
        const vChar = document.createElement('span');
        vChar.className = 'fb-roll-char';
        vChar.style.setProperty('--i', idx);

        const hChar = document.createElement('span');
        hChar.className = 'fb-roll-char';
        hChar.style.setProperty('--i', idx);

        if (item.type === 'html') {
          vChar.innerHTML = item.html;
          hChar.innerHTML = item.html;
        } else if (item.char === ' ') {
          vChar.innerHTML = '&nbsp;';
          hChar.innerHTML = '&nbsp;';
        } else {
          vChar.textContent = item.char;
          hChar.textContent = item.char;
        }

        visibleTrack.appendChild(vChar);
        hoverTrack.appendChild(hChar);
      });

      btn.innerHTML = '';
      const track = document.createElement('span');
      track.className = 'fb-roll-track';
      track.appendChild(visibleTrack);
      track.appendChild(hoverTrack);
      btn.appendChild(track);
    });
  };

  initTextRoll();
});
