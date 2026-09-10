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
  const contactFormStep3 = document.getElementById('contact-page-form-step-3');
  const contactStepSuccess = document.getElementById('contact-page-step-success');

  if (contactFormStep1 && contactFormStep2) {
    let contactPageData = {};
    let selectedMeetingType = 'Sastanak uživo';
    let selectedContactSlot = '';
    let selectedCalendarDateStr = '';
    let selectedCalendarDateFormatted = '';

    const urlParams = new URLSearchParams(window.location.search);
    const pkgParam = urlParams.get('paket') || urlParams.get('usluga') || urlParams.get('service');
    let selectedPackageName = 'Besplatne konzultacije';
    let formPackageLabel = 'Besplatne konzultacije';

    const snimanje = urlParams.get('snimanje') === 'da';

    if (pkgParam) {
      const p = pkgParam.toLowerCase();
      if (p.includes('chatgpt') || p.includes('searchgpt') || p.includes('openai')) {
        selectedPackageName = 'ChatGPT Ads';
        formPackageLabel = 'ChatGPT Ads & AI Search (400 €/mj.)';
      } else if (p.includes('start')) {
        if (snimanje) {
          selectedPackageName = 'Start + Snimanje sadržaja';
          formPackageLabel = 'Start + Snimanje sadržaja (590 €/mj.)';
        } else {
          selectedPackageName = 'Start';
          formPackageLabel = 'Start (400 €/mj.)';
        }
      } else if (p.includes('pro') || p.includes('plus')) {
        if (snimanje) {
          selectedPackageName = 'Pro + Snimanje sadržaja';
          formPackageLabel = 'Pro + Snimanje sadržaja (990 €/mj.)';
        } else {
          selectedPackageName = 'Pro';
          formPackageLabel = 'Pro (700 €/mj.)';
        }
      } else if (p.includes('ultra') || p.includes('ai')) {
        if (snimanje) {
          selectedPackageName = 'Ultra + Snimanje sadržaja';
          formPackageLabel = 'Ultra + Snimanje sadržaja (1.490 €/mj.)';
        } else {
          selectedPackageName = 'Ultra';
          formPackageLabel = 'Ultra (1.100 €/mj.)';
        }
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
    const stepInd3 = document.getElementById('step-ind-3');
    const typeCardLive = document.getElementById('type-card-live');
    const typeCardMeet = document.getElementById('type-card-meet');
    const contactDateInput = document.getElementById('contact-date');
    const contactSlotsWrap = document.getElementById('contact-time-slots-wrap');
    const contactBtnBackTo1 = document.getElementById('contact-btn-back-to-1');
    const contactBtnBackTo2 = document.getElementById('contact-btn-back-to-2');
    const btnChangeDate = document.getElementById('btn-change-date');
    const contactBtnConfirm = document.getElementById('contact-btn-confirm');
    const contactSuccessSummary = document.getElementById('contact-success-summary');

    const summaryPillMeetingIcon = document.getElementById('summary-pill-meeting-icon');
    const summaryPillDateText = document.getElementById('summary-pill-date-text');
    const summaryPillTypeText = document.getElementById('summary-pill-type-text');

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

          const onDaySelect = (e) => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
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
            selectedCalendarDateFormatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);

            renderCalendar();

            // Auto-advance to Step 3 (Time selection) with smooth transition
            setTimeout(() => {
              goToStep3();
            }, 120);
          };

          cell.addEventListener('click', onDaySelect);
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

    function goToStep3() {
      if (!contactFormStep3) return;

      contactFormStep1.style.display = 'none';
      contactFormStep2.style.display = 'none';
      contactFormStep3.style.display = 'flex';

      const cardBox = document.querySelector('.contact-card-box');
      if (cardBox) {
        cardBox.scrollTop = 0;
        if (window.innerWidth <= 768) {
          cardBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (stepInd1) stepInd1.classList.remove('active');
      if (stepInd2) stepInd2.classList.remove('active');
      if (stepInd3) stepInd3.classList.add('active');

      if (summaryPillDateText) {
        summaryPillDateText.textContent = selectedCalendarDateFormatted || selectedCalendarDateStr;
      }
      if (summaryPillTypeText) {
        summaryPillTypeText.textContent = `${selectedMeetingType} (45 min)`;
      }
      if (summaryPillMeetingIcon) {
        summaryPillMeetingIcon.textContent = (selectedMeetingType === 'Google Meet poziv') ? '💻' : '🏢';
      }

      renderContactSlots();
      checkContactValidity();
    }

    function goToStep2() {
      contactFormStep1.style.display = 'none';
      if (contactFormStep3) contactFormStep3.style.display = 'none';
      contactFormStep2.style.display = 'flex';

      const cardBox = document.querySelector('.contact-card-box');
      if (cardBox) {
        cardBox.scrollTop = 0;
        if (window.innerWidth <= 768) {
          cardBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      if (stepInd1) stepInd1.classList.remove('active');
      if (stepInd2) stepInd2.classList.add('active');
      if (stepInd3) stepInd3.classList.remove('active');

      renderCalendar();
    }

    const btnDirectInquiry = document.getElementById('btn-direct-inquiry');
    const btnToMeeting = document.getElementById('btn-to-meeting');

    function getAndValidateStep1() {
      const nameEl = document.getElementById('contact-name');
      const compEl = document.getElementById('contact-company');
      const emailEl = document.getElementById('contact-email');
      const phoneEl = document.getElementById('contact-phone');
      const consentEl = document.getElementById('contact-consent');

      if (!nameEl || !nameEl.value.trim()) {
        if (nameEl) {
          nameEl.focus();
          nameEl.reportValidity();
        }
        return null;
      }
      if (!compEl || !compEl.value.trim()) {
        if (compEl) {
          compEl.focus();
          compEl.reportValidity();
        }
        return null;
      }
      if (!emailEl || !emailEl.value.trim() || !emailEl.checkValidity()) {
        if (emailEl) {
          emailEl.focus();
          emailEl.reportValidity();
        }
        return null;
      }
      if (consentEl && !consentEl.checked) {
        consentEl.focus();
        consentEl.reportValidity();
        return null;
      }

      return {
        name: nameEl.value.trim(),
        company: compEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl ? phoneEl.value.trim() : ''
      };
    }

    function showFormSuccess(summaryData) {
      if (!summaryData) return;

      const stepsBar = document.querySelector('.booking-steps-bar');
      if (stepsBar) stepsBar.style.display = 'none';

      contactFormStep1.style.display = 'none';
      if (contactFormStep2) contactFormStep2.style.display = 'none';
      if (contactFormStep3) contactFormStep3.style.display = 'none';

      const pkgBanner = document.getElementById('form-selected-pkg-banner');
      if (pkgBanner) pkgBanner.style.display = 'none';

      if (contactStepSuccess) {
        contactStepSuccess.style.display = 'block';

        const successTitle = document.getElementById('contact-success-title') || contactStepSuccess.querySelector('.success-heading');
        const successDesc = document.getElementById('contact-success-desc') || contactStepSuccess.querySelector('.success-message-text');

        const isMeeting = summaryData.calendarSlot && !summaryData.calendarSlot.includes('Direktan upit') && !summaryData.calendarSlot.includes('Upit s podnožja');
        if (successTitle) {
          successTitle.textContent = isMeeting ? 'Sastanak je uspješno zakazan!' : 'Upit je uspješno poslan!';
        }
        if (successDesc) {
          successDesc.textContent = isMeeting 
            ? 'Hvala vam! Vaš zahtjev za terminom je zaprimljen i potvrđen.'
            : 'Hvala vam! Vaš upit je zaprimljen. Javit ćemo vam se u najkraćem mogućem roku (unutar 24h).';
        }

        if (contactSuccessSummary) {
          contactSuccessSummary.innerHTML = `
            <div style="font-weight: 800; font-size: 14.5px; margin-bottom: 14px; color: #0284c7; display: flex; align-items: center; gap: 8px;">
              <span>📋</span> Detalji zaprimljenog upita:
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-weight: 600;">Status obrade:</span>
                <span style="color: #10b981; font-weight: 700;">✓ Zaprimljeno u sustavu</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-weight: 600;">Ime i prezime:</span>
                <span style="color: #0f172a; font-weight: 700;">${summaryData.name || '-'}</span>
              </div>
              ${summaryData.company ? `
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-weight: 600;">Tvrtka / Web:</span>
                <span style="color: #0f172a; font-weight: 700;">${summaryData.company}</span>
              </div>` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-weight: 600;">Email adresa:</span>
                <span style="color: #0f172a; font-weight: 700;">${summaryData.email || '-'}</span>
              </div>
              ${summaryData.phone ? `
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-weight: 600;">Broj mobitela:</span>
                <span style="color: #0f172a; font-weight: 700;">${summaryData.phone}</span>
              </div>` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-weight: 600;">Odabrana usluga:</span>
                <span style="color: #0284c7; font-weight: 800;">${summaryData.package || 'Konzultacije'}</span>
              </div>
              ${isMeeting ? `
              <div style="background: #f0f9ff; border: 1.5px dashed #bae6fd; border-radius: 10px; padding: 10px 14px; margin-top: 6px; color: #0284c7; font-weight: 700; font-size: 13.5px;">
                📅 <strong>Odabrani termin:</strong> ${summaryData.calendarSlot}
              </div>` : ''}
            </div>
          `;
        }

        // Update URL to /kontakt#hvala
        if (window.location.hash !== '#hvala') {
          try {
            history.pushState(null, '', '/kontakt#hvala');
          } catch (e) {
            window.location.hash = 'hvala';
          }
        }

        const cardBox = document.querySelector('.contact-card-box');
        if (cardBox) {
          cardBox.scrollTop = 0;
          cardBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          contactStepSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Google Ads Conversion tracking event
        if (typeof window.gtag === 'function') {
          try {
            window.gtag('event', 'conversion', {
              'send_to': 'AW-18423241784'
            });
          } catch (e) {}
        }
      }
    }

    if (contactFormStep1) {
      contactFormStep1.addEventListener('submit', (e) => {
        e.preventDefault();
        if (btnDirectInquiry) btnDirectInquiry.click();
      });
    }

    if (btnDirectInquiry) {
      btnDirectInquiry.addEventListener('click', async () => {
        const data = getAndValidateStep1();
        if (!data) return;

        btnDirectInquiry.disabled = true;
        if (btnToMeeting) btnToMeeting.disabled = true;
        btnDirectInquiry.innerHTML = '<span>✉️ Šaljem upit...</span>';

        contactPageData = data;

        const bookingSummaryData = {
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          package: formPackageLabel || selectedPackageName || 'Besplatan Audit (Konzultacije)',
          calendarSlot: 'Direktan upit (Klijent se javio porukom)'
        };
        try {
          sessionStorage.setItem('algor_booking_summary', JSON.stringify(bookingSummaryData));
        } catch (e) {}

        if (typeof window.gtag === 'function') {
          try {
            window.gtag('event', 'generate_lead', {
              event_category: 'Contact',
              event_label: selectedPackageName ? `${selectedPackageName} (Direktan upit)` : 'Direktan upit',
              value: 1
            });
          } catch (e) {}
        }

        try {
          await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: data.name,
              company: data.company,
              email: data.email,
              phone: data.phone,
              package: selectedPackageName,
              meetingType: 'Direktan upit (bez zakazanog termina)',
              calendarSlot: 'Direktan upit (Klijent se javio porukom)',
              source: 'Kontakt stranica (Direktan upit)',
              device: (window.innerWidth <= 768) ? 'Mobitel' : 'Desktop'
            })
          });
        } catch (err) {
        }

        showFormSuccess(bookingSummaryData);
      });
    }

    if (btnToMeeting) {
      btnToMeeting.addEventListener('click', () => {
        const data = getAndValidateStep1();
        if (!data) return;

        contactPageData = data;
        goToStep2();
      });
    }

    if (contactBtnBackTo1) {
      contactBtnBackTo1.addEventListener('click', () => {
        contactFormStep2.style.display = 'none';
        if (contactFormStep3) contactFormStep3.style.display = 'none';
        contactFormStep1.style.display = 'block';

        const cardBox = document.querySelector('.contact-card-box');
        if (cardBox) cardBox.scrollTop = 0;

        const pkgBanner = document.getElementById('form-selected-pkg-banner');
        if (pkgBanner) {
          pkgBanner.style.display = 'flex';
        }

        if (stepInd1) stepInd1.classList.add('active');
        if (stepInd2) stepInd2.classList.remove('active');
        if (stepInd3) stepInd3.classList.remove('active');
      });
    }

    if (contactBtnBackTo2) {
      contactBtnBackTo2.addEventListener('click', () => {
        goToStep2();
      });
    }

    if (btnChangeDate) {
      btnChangeDate.addEventListener('click', () => {
        goToStep2();
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
              source: 'Kontakt stranica (Zakazani sastanak)',
              device: (window.innerWidth <= 768) ? 'Mobitel' : 'Desktop'
            })
          });
        } catch (err) {
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

        showFormSuccess(bookingSummaryData);
      });
    }

    const btnNewInquiry = document.getElementById('btn-new-inquiry');
    if (btnNewInquiry) {
      btnNewInquiry.addEventListener('click', () => {
        try {
          sessionStorage.removeItem('algor_booking_summary');
          history.pushState(null, '', '/kontakt');
        } catch (e) {
          window.location.hash = '';
        }
        window.location.reload();
      });
    }

    // Auto-display success state if loaded with #hvala hash and summary exists
    if (window.location.hash === '#hvala') {
      try {
        const raw = sessionStorage.getItem('algor_booking_summary');
        if (raw) {
          showFormSuccess(JSON.parse(raw));
        }
      } catch (e) {}
    }

    // Early return so homepage-only scripts never execute on kontakt.html!
    return;
  }

  // Dynamic Animated Glowing Mesh Grid Engine (Perfect 1:1 Squares on All Screen Sizes)
  const meshContainer = document.getElementById('mesh-grid-container');
  if (meshContainer) {
    let tiles = [];
    let totalTiles = 0;
    let resizeTimer = null;

    const buildPerfectSquareMesh = () => {
      meshContainer.innerHTML = '';
      const tileSize = 24; // 24px x 24px perfect square
      const width = meshContainer.clientWidth || window.innerWidth || 360;
      const height = meshContainer.clientHeight || window.innerHeight || 600;

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
    
    // Debounced resize handler for orientation change / resize
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildPerfectSquareMesh, 120);
    }, { passive: true });

    // Function to trigger random glowing tiles in unified single light blue shade
    const pulseRandomTiles = () => {
      if (!tiles.length) return;
      const isMobile = window.innerWidth <= 768;
      const count = isMobile
        ? Math.floor(Math.random() * 15) + 20  // 20-35 tiles on mobile (battery-friendly)
        : Math.floor(Math.random() * 35) + 55; // 55-90 tiles on desktop

      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * totalTiles);
        const tile = tiles[randomIndex];
        if (tile) {
          tile.classList.add('glowing-blue');
          setTimeout(() => {
            tile.classList.remove('glowing-blue');
          }, 1400 + Math.random() * 1200);
        }
      }
    };

    pulseRandomTiles();
    setInterval(pulseRandomTiles, 400);
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
        // Start fading in when the top of the container reaches 90% of viewport
        // Finish fading in when the container reaches 30% of viewport
        const start = windowHeight * 0.90;
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
          // Spread words across the progression range
          const wordStart = index / totalWords;
          const wordEnd = Math.min(1, (index + 1.15) / totalWords);
          
          let wordProgress = 0;
          if (globalProgress >= wordEnd) {
            wordProgress = 1;
          } else if (globalProgress <= wordStart) {
            wordProgress = 0;
          } else {
            wordProgress = (globalProgress - wordStart) / (wordEnd - wordStart);
          }
          
          // Fades from muted light grey (rgba(11, 11, 12, 0.15)) to full solid black/obsidian (rgba(11, 11, 12, 1.0))
          const opacity = (0.15 + (0.85 * wordProgress)).toFixed(3);
          word.style.setProperty('color', `rgba(11, 11, 12, ${opacity})`, 'important');
        });
      });
    };

    window.addEventListener('scroll', updateRevealWords, { passive: true });
    window.addEventListener('resize', updateRevealWords, { passive: true });
    window.addEventListener('orientationchange', updateRevealWords, { passive: true });
    updateRevealWords();
    setTimeout(updateRevealWords, 100);
    setTimeout(updateRevealWords, 400);
  }

  // 6. Process Section Sticky Active Step Observer
  const processCards = document.querySelectorAll('#process [data-step-card]');
  const processIndicators = document.querySelectorAll('#process [data-step]');
  if (processCards.length > 0 && processIndicators.length > 0) {
    const updateProcessStep = () => {
      const windowCenter = window.innerHeight * 0.45;
      let activeStep = '1';
      
      processCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= windowCenter && rect.bottom >= 80) {
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
    };

    window.addEventListener('scroll', updateProcessStep, { passive: true });
    updateProcessStep();
    setTimeout(updateProcessStep, 200);

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
    }).catch(() => {});
  }

  // 11. Footer Inline Contact Form Submission
  const footerContactForm = document.getElementById('footerContactForm');
  
  if (footerContactForm) {
    footerContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const footerNameEl = document.getElementById('footerName');
      const footerCompanyEl = document.getElementById('footerCompany');
      const footerEmailEl = document.getElementById('footerEmail');
      const name = footerNameEl ? footerNameEl.value.trim() : '';
      const company = footerCompanyEl ? footerCompanyEl.value.trim() : '';
      const email = footerEmailEl ? footerEmailEl.value.trim() : '';
      const phoneInput = document.getElementById('footerPhone');
      const phone = phoneInput ? phoneInput.value : '';
      const pkgInput = document.getElementById('footerPackage');
      const pkg = pkgInput ? pkgInput.value : 'Upit s podnožja';
      const msgInput = document.getElementById('footerMessage');
      const msg = msgInput ? msgInput.value : '';
      const hpInput = document.getElementById('footerHp');
      const hp = hpInput ? hpInput.value : '';
      const submitBtn = footerContactForm.querySelector('.footer-form-submit-btn');

      sendInquiryToBackend({
        name: name,
        company: company,
        email: email,
        phone: phone,
        package: pkg,
        calendarSlot: msg || 'Upit s podnožja',
        source: 'Podnožje (Footer Forma)',
        hp: hp
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

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Šaljem upit...</span>';
      }
      window.location.href = '/kontakt#hvala';
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
    '.info-header, .ba-card, .fit-card, .price-card, .portfolio-item-card, .vertical-step-card, .disclosure, .footer-conversion-area, .bento-card, .stat-card, .tech-step-card, .standard-feature-card'
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

  // 14. Real-time Scroll-Driven Typewriter Effect on Headings
  const initScrollTypewriter = () => {
    const headingSelectors = [
      '.figma-h1-title',
      '.tech-sticky-title',
      '.framer-about-heading',
      '.framer-compare-title',
      '.about-section-heading',
      '.info-title',
      '.faq-dark-title',
      '.framer-minimal-cta-title'
    ];

    const headings = document.querySelectorAll(headingSelectors.join(', '));
    if (!headings.length) return;

    const headingItems = [];

    headings.forEach((heading) => {
      // Helper to wrap characters in words and spans without breaking line breaks or spaces
      const wrapChars = (node, isAccent = false) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent;
          if (!text) return;
          
          // Split by whitespace while preserving tokens
          const tokens = text.split(/(\s+)/);
          const frag = document.createDocumentFragment();

          tokens.forEach((token) => {
            if (/^\s+$/.test(token)) {
              frag.appendChild(document.createTextNode(token));
            } else if (token.length > 0) {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'typewriter-word';

              for (let i = 0; i < token.length; i++) {
                const charSpan = document.createElement('span');
                charSpan.className = isAccent ? 'typewriter-char accent-char-typed' : 'typewriter-char';
                charSpan.textContent = token[i];
                wordSpan.appendChild(charSpan);
              }
              frag.appendChild(wordSpan);
            }
          });

          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName.toLowerCase() === 'svg' || node.tagName.toLowerCase() === 'style' || node.tagName.toLowerCase() === 'script') {
            return;
          }
          const hasAccent = isAccent || node.classList.contains('accent-char');
          Array.from(node.childNodes).forEach(child => wrapChars(child, hasAccent));
        }
      };

      wrapChars(heading);

      const chars = heading.querySelectorAll('.typewriter-char');
      if (chars.length > 0) {
        headingItems.push({
          el: heading,
          chars: chars,
          count: chars.length
        });
      }
    });

    // Real-time scroll calculate
    let ticking = false;

    const onScroll = () => {
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      headingItems.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        
        // When top of heading enters from bottom of viewport to center
        // Start typing when heading is at 92% of screen height, finish when it reaches ~35%
        const startY = windowHeight * 0.92;
        const endY = windowHeight * 0.35;

        let progress = (startY - rect.top) / (startY - endY);
        progress = Math.max(0, Math.min(1, progress));

        const activeCount = Math.round(progress * item.count);

        for (let i = 0; i < item.count; i++) {
          if (i < activeCount) {
            item.chars[i].classList.add('is-typed');
          } else {
            item.chars[i].classList.remove('is-typed');
          }
        }
      });

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
    // Initial run
    onScroll();
  };

  initScrollTypewriter();

  // ========================================================
  // Pricing Section "Snimanje sadržaja" Production Toggle
  // ========================================================
  const initPricingToggle = () => {
    const prodToggle = document.getElementById('pricing-production-toggle');
    const switchTrack = document.getElementById('pricing-switch-track');
    const toggleBadge = prodToggle ? prodToggle.querySelector('.pricing-toggle-badge') : null;
    const pricingCards = document.querySelectorAll('.framer-price-card[data-base-price]');

    if (!prodToggle || !switchTrack || pricingCards.length === 0) return;

    let isProductionOn = true;

    const updatePrices = () => {
      prodToggle.setAttribute('aria-checked', isProductionOn ? 'true' : 'false');
      switchTrack.classList.toggle('active', isProductionOn);

      if (toggleBadge) {
        toggleBadge.textContent = isProductionOn ? 'UKLJUČENO' : 'ISKLJUČENO';
        toggleBadge.style.background = isProductionOn ? 'rgba(2, 132, 199, 0.1)' : 'rgba(100, 116, 139, 0.1)';
        toggleBadge.style.color = isProductionOn ? '#0284c7' : '#64748b';
      }

      pricingCards.forEach(card => {
        const base = parseInt(card.dataset.basePrice, 10);
        const addon = parseInt(card.dataset.addonPrice, 10);
        const numEl = card.querySelector('.price-val-num');
        const addonItem = card.querySelector('.feature-item-addon');
        const ctaLink = card.querySelector('.framer-pill-btn');
        const plan = card.dataset.plan;

        if (numEl) {
          numEl.textContent = isProductionOn ? (base + addon) : base;
        }

        if (addonItem) {
          addonItem.classList.toggle('is-hidden', !isProductionOn);
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

  // Floating Capsule Navbar Mobile Menu Logic
  const navToggleBtn = document.getElementById('nav-mobile-toggle');
  const navMobileMenu = document.getElementById('nav-mobile-menu');
  const mainCapsuleNavbar = document.getElementById('main-capsule-navbar');

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
});

// Mobile process cards: tap a card to reveal its description and deliverable.
document.addEventListener('DOMContentLoaded', () => {
  const processCards = Array.from(document.querySelectorAll('.process-card-item'));
  const mobileQuery = window.matchMedia('(max-width: 640px)');
  if (!processCards.length) return;

  const setExpanded = (activeCard) => {
    processCards.forEach((card) => {
      const isActive = card === activeCard && !card.classList.contains('is-expanded');
      card.classList.toggle('is-expanded', isActive);
      card.setAttribute('aria-expanded', String(isActive));
    });
  };

  processCards.forEach((card) => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');
    card.addEventListener('click', () => {
      if (mobileQuery.matches) setExpanded(card);
    });
    card.addEventListener('keydown', (event) => {
      if (mobileQuery.matches && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        setExpanded(card);
      }
    });
  });

  mobileQuery.addEventListener('change', () => {
    if (!mobileQuery.matches) {
      processCards.forEach((card) => {
        card.classList.remove('is-expanded');
        card.setAttribute('aria-expanded', 'false');
      });
    }
  });
});
