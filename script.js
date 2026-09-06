document.addEventListener('DOMContentLoaded', () => {
  
  // 0. Ultra-Fast Instant Page Prefetcher (Prefetches kontakt.html on hover/touch intent for 0ms transition)
  const prefetchTargetUrl = (url) => {
    if (!url || document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchTargetUrl('/kontakt');
      prefetchTargetUrl('/kontakt?paket=pro');
      prefetchTargetUrl('/kontakt?paket=start');
    });
  } else {
    setTimeout(() => {
      prefetchTargetUrl('/kontakt');
    }, 800);
  }

  document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a[href*="kontakt"]');
    if (a && a.href) prefetchTargetUrl(a.href);
  }, { passive: true });

  document.addEventListener('touchstart', (e) => {
    const a = e.target.closest('a[href*="kontakt"]');
    if (a && a.href) prefetchTargetUrl(a.href);
  }, { passive: true });

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

  // ========================================================
  // Algor Studio Custom GDPR Cookie Consent Engine & Google Consent Mode v2
  // ========================================================
  const initCookieConsent = () => {
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
  // Dedicated Fast Path for Contact Page (kontakt.html)
  // ========================================================
  const contactFormStep1 = document.getElementById('contact-page-form-step-1');
  const contactFormStep2 = document.getElementById('contact-page-form-step-2');
  const contactStepSuccess = document.getElementById('contact-page-step-success');

  if (contactFormStep1 && contactFormStep2) {
    let contactPageData = {};
    let selectedMeetingType = 'Sastanak uživo';
    let selectedContactSlot = '';
    let selectedCalendarDateStr = '';

    const urlParams = new URLSearchParams(window.location.search);
    const pkgParam = urlParams.get('paket') || urlParams.get('usluga') || urlParams.get('service');
    let selectedPackageName = 'Besplatan Audit';
    let formPackageLabel = 'Besplatan Audit (Konzultacije)';

    if (pkgParam) {
      const p = pkgParam.toLowerCase();
      if (p.includes('chatgpt') || p.includes('searchgpt') || p.includes('openai')) {
        selectedPackageName = 'ChatGPT Ads';
        formPackageLabel = 'ChatGPT Ads & AI Search';
      } else if (p.includes('start')) {
        selectedPackageName = 'Paket Start';
        formPackageLabel = 'Paket Start (490 €/mj.)';
      } else if (p.includes('pro') || p.includes('plus')) {
        selectedPackageName = 'Paket Pro';
        formPackageLabel = 'Paket Pro (890 €/mj.)';
      } else if (p.includes('ultra') || p.includes('ai')) {
        selectedPackageName = 'Paket Ultra';
        formPackageLabel = 'Paket Ultra (1.390 €/mj.)';
      } else if (p.includes('landing') || p.includes('web-start')) {
        selectedPackageName = 'Izrada weba';
        formPackageLabel = 'Landing Stranica (od 490 €)';
      } else if (p.includes('business') || p.includes('web-business') || p.includes('web-pro')) {
        selectedPackageName = 'Izrada weba';
        formPackageLabel = 'Business Web (od 990 €)';
      } else if (p.includes('custom') || p.includes('web-custom') || p.includes('shop') || p.includes('1850') || p.includes('1.850')) {
        selectedPackageName = 'Izrada weba';
        formPackageLabel = 'Custom Web Aplikacija (od 1.850 €)';
      }
    }

    const formPkgName = document.getElementById('form-pkg-name');
    if (formPkgName) {
      formPkgName.textContent = formPackageLabel;
    }

    const stepInd1 = document.getElementById('step-ind-1');
    const stepInd2 = document.getElementById('step-ind-2');
    const typeCardLive = document.getElementById('type-card-live');
    const typeCardMeet = document.getElementById('type-card-meet');
    const contactDateInput = document.getElementById('contact-date');
    const contactSlotsWrap = document.getElementById('contact-time-slots-wrap');
    const contactBtnBack = document.getElementById('contact-btn-back');
    const contactBtnConfirm = document.getElementById('contact-btn-confirm');
    const contactSuccessSummary = document.getElementById('contact-success-summary');

    const calMonthTitle = document.getElementById('cal-month-title');
    const calDaysGrid = document.getElementById('cal-days-grid');
    const calPrevMonthBtn = document.getElementById('cal-prev-month');
    const calNextMonthBtn = document.getElementById('cal-next-month');
    const calSelectedBadge = document.getElementById('cal-selected-badge');
    const calSelectedBadgeText = document.getElementById('cal-selected-badge-text');

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

    if (typeCardLive && typeCardMeet) {
      typeCardLive.addEventListener('click', () => {
        typeCardLive.classList.add('selected');
        typeCardMeet.classList.remove('selected');
        selectedMeetingType = 'Sastanak uživo';
      });

      typeCardMeet.addEventListener('click', () => {
        typeCardMeet.classList.add('selected');
        typeCardLive.classList.remove('selected');
        selectedMeetingType = 'Google Meet poziv';
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

          cell.addEventListener('click', () => {
            selectedCalendarDateStr = dayStr;
            if (contactDateInput) {
              contactDateInput.value = dayStr;
            }

            const formatted = cellDate.toLocaleDateString('hr-HR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });

            if (calSelectedBadge && calSelectedBadgeText) {
              calSelectedBadgeText.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
              calSelectedBadge.style.display = 'inline-flex';
            }

            renderCalendar();
            checkContactValidity();
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
        btn.textContent = slot;

        if (slot === selectedContactSlot) {
          btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
          contactSlotsWrap.querySelectorAll('.contact-slot-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          selectedContactSlot = slot;
          checkContactValidity();
        });

        contactSlotsWrap.appendChild(btn);
      });
    }

    function checkContactValidity() {
      if (contactBtnConfirm) {
        if (contactDateInput && contactDateInput.value && selectedContactSlot) {
          contactBtnConfirm.removeAttribute('disabled');
        } else {
          contactBtnConfirm.setAttribute('disabled', 'true');
        }
      }
    }

    contactFormStep1.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('contact-name').value.trim();
      const compVal = document.getElementById('contact-company').value.trim();
      const emailVal = document.getElementById('contact-email').value.trim();
      const phoneInput = document.getElementById('contact-phone');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';

      contactPageData = {
        name: nameVal,
        company: compVal,
        email: emailVal,
        phone: phoneVal
      };

      contactFormStep1.style.display = 'none';
      contactFormStep2.style.display = 'block';

      if (stepInd1) stepInd1.classList.remove('active');
      if (stepInd2) stepInd2.classList.add('active');

      const now = new Date();
      let initDate = new Date();
      if (initDate.getDay() === 0) {
        initDate.setDate(initDate.getDate() + 1);
      } else if (initDate.getDay() === 6) {
        initDate.setDate(initDate.getDate() + 2);
      }

      calViewYear = initDate.getFullYear();
      calViewMonth = initDate.getMonth();

      selectedCalendarDateStr = `${calViewYear}-${String(calViewMonth + 1).padStart(2, '0')}-${String(initDate.getDate()).padStart(2, '0')}`;
      if (contactDateInput) {
        contactDateInput.value = selectedCalendarDateStr;
      }

      const formatted = initDate.toLocaleDateString('hr-HR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      if (calSelectedBadge && calSelectedBadgeText) {
        calSelectedBadgeText.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        calSelectedBadge.style.display = 'inline-flex';
      }

      selectedContactSlot = '';
      renderCalendar();
      renderContactSlots();
      checkContactValidity();
    });

    if (contactBtnBack) {
      contactBtnBack.addEventListener('click', () => {
        contactFormStep2.style.display = 'none';
        contactFormStep1.style.display = 'block';
        if (stepInd1) stepInd1.classList.add('active');
        if (stepInd2) stepInd2.classList.remove('active');
      });
    }

    if (contactBtnConfirm) {
      contactBtnConfirm.addEventListener('click', async () => {
        if (!contactDateInput || !contactDateInput.value || !selectedContactSlot) {
          alert('Molimo odaberite datum i vrijeme termina.');
          return;
        }

        contactBtnConfirm.disabled = true;
        contactBtnConfirm.innerHTML = '<span>Rezerviram...</span>';

        const dateVal = contactDateInput.value;
        let formattedDate = dateVal;
        try {
          const parts = dateVal.split('-');
          if (parts.length === 3) {
            const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            formattedDate = d.toLocaleDateString('hr-HR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        } catch (e) {
          console.error('Date format error:', e);
        }

        const appointmentDetails = `${selectedMeetingType} • ${formattedDate} u ${selectedContactSlot}h`;

        if (typeof window.gtag === 'function') {
          try {
            window.gtag('event', 'generate_lead', {
              event_category: 'Contact',
              event_label: selectedPackageName || 'Sastanak / Upit',
              value: 1
            });
          } catch (e) {}
        }

        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: contactPageData.name || 'Klijent',
              company: contactPageData.company || '',
              email: contactPageData.email || '',
              phone: contactPageData.phone || '',
              package: selectedPackageName,
              appointmentDate: dateVal,
              appointmentTime: selectedContactSlot,
              meetingType: selectedMeetingType,
              calendarSlot: appointmentDetails,
              source: 'Kontakt stranica',
              device: (window.innerWidth <= 768) ? 'Mobitel' : 'Desktop'
            })
          });
        } catch (err) {
          console.log('Inquiry submit note:', err);
        }

        const bookingSummaryData = {
          name: contactPageData.name || '',
          company: contactPageData.company || '',
          email: contactPageData.email || '',
          phone: contactPageData.phone || '',
          package: formPackageLabel || selectedPackageName || 'Besplatan Audit (Konzultacije)',
          calendarSlot: appointmentDetails
        };
        try {
          sessionStorage.setItem('algor_booking_summary', JSON.stringify(bookingSummaryData));
        } catch (e) {}

        const stepsBar = document.querySelector('.booking-steps-bar');
        if (stepsBar) stepsBar.style.display = 'none';

        contactFormStep2.style.display = 'none';
        if (contactStepSuccess) {
          contactStepSuccess.style.display = 'block';
          if (contactSuccessSummary) {
            contactSuccessSummary.innerHTML = `
              <div style="font-weight: 800; font-size: 15px; margin-bottom: 12px; color: #0f172a;">📋 Detalji Vaše rezervacije:</div>
              <div style="margin-bottom: 6px;">👤 <strong>Ime i prezime:</strong> ${contactPageData.name || ''}</div>
              <div style="margin-bottom: 6px;">🏢 <strong>Tvrtka / Web:</strong> ${contactPageData.company || ''}</div>
              <div style="margin-bottom: 6px;">✉️ <strong>Email:</strong> ${contactPageData.email || ''}</div>
              ${contactPageData.phone ? `<div style="margin-bottom: 6px;">📞 <strong>Mobitel:</strong> ${contactPageData.phone}</div>` : ''}
              <div style="margin-bottom: 6px;">📦 <strong>Paket / Usluga:</strong> ${formPackageLabel || selectedPackageName}</div>
              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; color: #0284c7; font-weight: 700; font-size: 14.5px;">
                📅 ${appointmentDetails}
              </div>
            `;
          }
          contactStepSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        setTimeout(() => {
          window.location.href = '/hvala';
        }, 400);
      });
    }

    const contactBtnSkip = document.getElementById('contact-btn-skip');
    if (contactBtnSkip) {
      contactBtnSkip.addEventListener('click', async () => {
        contactBtnSkip.disabled = true;
        if (contactBtnConfirm) contactBtnConfirm.disabled = true;

        const bookingSummaryData = {
          name: contactPageData.name || '',
          company: contactPageData.company || '',
          email: contactPageData.email || '',
          phone: contactPageData.phone || '',
          package: formPackageLabel || selectedPackageName || 'Besplatan Audit (Konzultacije)',
          calendarSlot: 'Termin nije odabran (Preskočeno)'
        };
        try {
          sessionStorage.setItem('algor_booking_summary', JSON.stringify(bookingSummaryData));
        } catch (e) {}

        if (typeof window.gtag === 'function') {
          try {
            window.gtag('event', 'generate_lead', {
              event_category: 'Contact',
              event_label: selectedPackageName || 'Upit bez termina',
              value: 1
            });
          } catch (e) {}
        }

        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: contactPageData.name || 'Klijent',
              company: contactPageData.company || '',
              email: contactPageData.email || '',
              phone: contactPageData.phone || '',
              package: selectedPackageName,
              calendarSlot: 'Termin nije odabran (Preskočeno)',
              source: 'Kontakt stranica',
              device: (window.innerWidth <= 768) ? 'Mobitel' : 'Desktop'
            })
          });
        } catch (err) {
          console.log('Inquiry submit note:', err);
        }

        const stepsBar = document.querySelector('.booking-steps-bar');
        if (stepsBar) stepsBar.style.display = 'none';

        contactFormStep2.style.display = 'none';
        if (contactStepSuccess) {
          contactStepSuccess.style.display = 'block';
          if (contactSuccessSummary) {
            contactSuccessSummary.innerHTML = `
              <div style="font-weight: 800; font-size: 15px; margin-bottom: 12px; color: #0f172a;">📋 Detalji Vašeg upita:</div>
              <div style="margin-bottom: 6px;">👤 <strong>Ime i prezime:</strong> ${contactPageData.name || ''}</div>
              <div style="margin-bottom: 6px;">🏢 <strong>Tvrtka / Web:</strong> ${contactPageData.company || ''}</div>
              <div style="margin-bottom: 6px;">✉️ <strong>Email:</strong> ${contactPageData.email || ''}</div>
              ${contactPageData.phone ? `<div style="margin-bottom: 6px;">📞 <strong>Mobitel:</strong> ${contactPageData.phone}</div>` : ''}
              <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e1; color: #0284c7; font-weight: 700; font-size: 14.5px;">
                📦 <strong>Usluga:</strong> ${selectedPackageName}
              </div>
            `;
          }
          contactStepSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        setTimeout(() => {
          window.location.href = '/hvala';
        }, 400);
      });
    }

    // Early return so homepage-only scripts never execute on kontakt.html!
    return;
  }

  // Dynamic Animated Glowing Mesh Grid Engine (Perfect 1:1 Squares on All Screen Sizes)
  const meshContainer = document.getElementById('mesh-grid-container');
  if (meshContainer) {
    let tiles = [];
    let totalTiles = 0;

    const buildPerfectSquareMesh = () => {
      meshContainer.innerHTML = '';
      const tileSize = 24; // 24px x 24px perfect square
      const width = Math.max(meshContainer.clientWidth || 0, window.innerWidth || 0, 1200);
      const height = Math.max(meshContainer.clientHeight || 0, window.innerHeight || 0, 800);

      const cols = Math.ceil(width / tileSize);
      const rows = Math.ceil(height / tileSize);
      totalTiles = cols * rows;
      tiles = [];

      meshContainer.style.gridTemplateColumns = `repeat(${cols}, ${tileSize}px)`;
      meshContainer.style.gridTemplateRows = `repeat(${rows}, ${tileSize}px)`;

      const fragment = document.createDocumentFragment();
      for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.className = 'mesh-tile';
        fragment.appendChild(tile);
        tiles.push(tile);
      }
      meshContainer.appendChild(fragment);
    };

    buildPerfectSquareMesh();
    setTimeout(buildPerfectSquareMesh, 150);
    window.addEventListener('resize', buildPerfectSquareMesh);

    // Function to trigger random glowing tiles in neon/cyan
    const pulseRandomTiles = () => {
      if (!tiles.length) return;
      const count = Math.floor(Math.random() * 16) + 20;
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * totalTiles);
        const tile = tiles[randomIndex];
        if (tile) {
          tile.classList.add('glowing-lime');
          setTimeout(() => {
            tile.classList.remove('glowing-lime');
          }, 1200 + Math.random() * 1000);
        }
      }
    };

    pulseRandomTiles();
    setInterval(pulseRandomTiles, 700);
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
  const scrollRevealContainers = document.querySelectorAll('.scroll-reveal-text');
  if (scrollRevealContainers.length > 0) {
    const updateRevealWords = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      scrollRevealContainers.forEach(revealContainer => {
        const words = revealContainer.querySelectorAll('.reveal-word');
        if (!words.length) return;

        const rect = revealContainer.getBoundingClientRect();
        const isProcessStatement = (revealContainer.id === 'process-statement-reveal' || revealContainer.classList.contains('ecosystem-reveal-title') || revealContainer.classList.contains('process-reveal-title'));
        const start = windowHeight * 0.88;
        const end = windowHeight * 0.30;
        
        let globalProgress = 0;
        if (rect.top <= start && rect.top >= end) {
          globalProgress = (start - rect.top) / (start - end);
        } else if (rect.top < end) {
          globalProgress = 1;
        } else {
          globalProgress = 0;
        }
        
        const totalWords = words.length;
        words.forEach((word, index) => {
          const wordStart = index / totalWords;
          const wordEnd = (index + 1) / totalWords;
          
          let wordProgress = 0;
          if (globalProgress >= wordEnd) {
            wordProgress = 1;
          } else if (globalProgress <= wordStart) {
            wordProgress = 0;
          } else {
            wordProgress = (globalProgress - wordStart) / (wordEnd - wordStart);
          }
          
          // Fades from light grey (rgba(15, 23, 42, 0.15)) to full black (rgba(15, 23, 42, 1.0))
          const opacity = 0.15 + (0.85 * wordProgress);
          word.style.color = `rgba(15, 23, 42, ${opacity})`;
        });
      });
    };

    window.addEventListener('scroll', updateRevealWords, { passive: true });
    window.addEventListener('resize', updateRevealWords, { passive: true });
    updateRevealWords();
    setTimeout(updateRevealWords, 150);
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

  function detectInquirySource() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('izrada-web-stranica')) return 'Izrada Web Stranica';
    if (path.includes('karijere')) return 'Karijere';
    if (path.includes('kontakt')) return 'Kontakt Stranica';
    return 'Marketing & AI (Naslovna)';
  }

  function detectUserDevice() {
    return (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
      ? 'Mobitel'
      : 'Desktop';
  }

  function sendInquiryToBackend(data) {
    const payload = {
      ...data,
      source: data.source || detectInquirySource(),
      device: data.device || detectUserDevice()
    };

    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'generate_lead', {
          event_category: 'Contact',
          event_label: payload.package || payload.source || 'Lead',
          value: 1
        });
      } catch (e) {
        // ignore
      }
    }

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.log('Inquiry sync error:', err));
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
      const phoneInput = document.getElementById('footerPhone');
      const phone = phoneInput ? phoneInput.value : '';
      const pkgInput = document.getElementById('footerPackage');
      const pkg = pkgInput ? pkgInput.value : 'Upit s podnožja';
      const msgInput = document.getElementById('footerMessage');
      const msg = msgInput ? msgInput.value : '';
      const submitBtn = footerContactForm.querySelector('.footer-form-submit-btn');

      sendInquiryToBackend({
        name: name,
        company: company,
        email: email,
        phone: phone,
        package: pkg,
        calendarSlot: msg || 'Upit s podnožja',
        source: 'Podnožje (Footer Forma)'
      });

      const bookingSummaryData = {
        name: name,
        company: company,
        email: email,
        phone: phone,
        package: pkg,
        calendarSlot: msg || 'Upit s podnožja'
      };
      try {
        sessionStorage.setItem('algor_booking_summary', JSON.stringify(bookingSummaryData));
      } catch (e) {}

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Pošalji upit ➔</span>';
        }
        if (footerContactForm) footerContactForm.reset();
        window.location.href = '/hvala';
      }, 500);
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


