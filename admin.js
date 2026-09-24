(() => {
  'use strict';

  let currentContent = null;
  let isDirty = false;

  const loginWrapper = document.getElementById('admin-login-wrapper');
  const dashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('admin-login-form');
  const passwordInput = document.getElementById('admin-password-input');
  const loginError = document.getElementById('admin-login-error');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const saveBtn = document.getElementById('admin-btn-save');
  const statusDot = document.getElementById('admin-status-dot');
  const statusText = document.getElementById('admin-status-text');
  const toast = document.getElementById('admin-toast');
  const toastText = document.getElementById('admin-toast-text');

  function showToast(message, isError = false) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('is-active');
    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 3500);
  }

  function setDirty(state) {
    isDirty = state;
    if (statusDot) statusDot.classList.toggle('is-unsaved', isDirty);
    if (statusText) statusText.textContent = isDirty ? 'Imate nespremljene promjene' : 'Sve promjene su spremljene';
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeHtmlAttr(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Check authentication status
  async function checkAuth() {
    try {
      const res = await fetch('/api/admin/check-auth');
      if (res.ok) {
        showDashboard();
        loadContent();
      } else {
        showLogin();
      }
    } catch {
      showLogin();
    }
  }

  function showLogin() {
    if (loginWrapper) loginWrapper.classList.remove('is-hidden');
    if (dashboard) dashboard.classList.remove('is-visible');
  }

  function showDashboard() {
    if (loginWrapper) loginWrapper.classList.add('is-hidden');
    if (dashboard) dashboard.classList.add('is-visible');
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginError) loginError.classList.remove('is-visible');
      const password = passwordInput ? passwordInput.value : '';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          showDashboard();
          loadContent();
        } else {
          if (loginError) {
            loginError.textContent = data.error || 'Neispravna lozinka.';
            loginError.classList.add('is-visible');
          }
        }
      } catch {
        if (loginError) {
          loginError.textContent = 'Došlo je do greške pri povezivanju.';
          loginError.classList.add('is-visible');
        }
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
      } finally {
        showLogin();
        if (passwordInput) passwordInput.value = '';
      }
    });
  }

  // Tabs Navigation
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach((b) => b.classList.remove('is-active'));
      tabPanes.forEach((p) => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('is-active');
    });
  });

  // Deep property helper
  function getDeepProp(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : '', obj);
  }

  function setDeepProp(obj, path, value) {
    const parts = path.split('.');
    let curr = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!curr[parts[i]]) curr[parts[i]] = {};
      curr = curr[parts[i]];
    }
    curr[parts[parts.length - 1]] = value;
  }

  // Load Content
  async function loadContent() {
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Neuspješno dohvaćanje podataka');
      currentContent = await res.json();
      populateForm();
      setDirty(false);
    } catch (err) {
      showToast('Greška pri učitavanju sadržaja: ' + err.message, true);
    }
  }

  // Populate Form Fields
  function populateForm() {
    if (!currentContent) return;

    // Single inputs & textareas
    document.querySelectorAll('[data-path]').forEach((input) => {
      const path = input.getAttribute('data-path');
      const val = getDeepProp(currentContent, path);
      input.value = val !== undefined ? val : '';
      
      input.removeEventListener('input', onInputChange);
      input.addEventListener('input', onInputChange);
    });

    // Render FAQ sections
    renderFaqSection('home-faq-list', 'home', 'btn-add-home-faq');
    renderFaqSection('web-faq-list', 'web_development', 'btn-add-web-faq');
    renderFaqSection('chatgpt-faq-list', 'chatgpt_ads', 'btn-add-chatgpt-faq');
  }

  function onInputChange() {
    setDirty(true);
  }

  // Generalized FAQ List Renderer
  function renderFaqSection(containerId, sectionKey, addBtnId) {
    const container = document.getElementById(containerId);
    if (!container || !currentContent) return;

    if (!currentContent[sectionKey]) {
      currentContent[sectionKey] = {};
    }
    if (!Array.isArray(currentContent[sectionKey].faq)) {
      currentContent[sectionKey].faq = [];
    }

    const faqs = currentContent[sectionKey].faq;
    container.innerHTML = '';

    faqs.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'admin-faq-item';
      div.innerHTML = `
        <div class="admin-faq-header">
          <span class="admin-faq-number">Pitanje #${index + 1}</span>
          <button type="button" class="admin-btn-delete" data-faq-del="${index}">Obriši</button>
        </div>
        <div class="admin-form-group" style="margin-bottom: 12px;">
          <label class="admin-label">Pitanje</label>
          <input type="text" class="admin-input faq-q-field" data-faq-idx="${index}" value="${escapeHtmlAttr(item.q)}">
        </div>
        <div class="admin-form-group" style="margin-bottom: 0;">
          <label class="admin-label">Odgovor (u 3. licu)</label>
          <textarea class="admin-textarea faq-a-field" data-faq-idx="${index}">${escapeHtml(item.a)}</textarea>
        </div>
      `;
      container.appendChild(div);
    });

    // Delete buttons
    container.querySelectorAll('.admin-btn-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-faq-del'), 10);
        if (!isNaN(idx) && currentContent[sectionKey].faq) {
          currentContent[sectionKey].faq.splice(idx, 1);
          renderFaqSection(containerId, sectionKey, addBtnId);
          setDirty(true);
        }
      });
    });

    // Input listeners for questions
    container.querySelectorAll('.faq-q-field').forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-faq-idx'), 10);
        if (currentContent[sectionKey].faq[idx]) {
          currentContent[sectionKey].faq[idx].q = e.target.value;
          setDirty(true);
        }
      });
    });

    // Input listeners for answers
    container.querySelectorAll('.faq-a-field').forEach((input) => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.getAttribute('data-faq-idx'), 10);
        if (currentContent[sectionKey].faq[idx]) {
          currentContent[sectionKey].faq[idx].a = e.target.value;
          setDirty(true);
        }
      });
    });

    // Setup Add Button listener once
    const addBtn = document.getElementById(addBtnId);
    if (addBtn && !addBtn.dataset.bound) {
      addBtn.dataset.bound = 'true';
      addBtn.addEventListener('click', () => {
        if (!currentContent[sectionKey]) currentContent[sectionKey] = {};
        if (!Array.isArray(currentContent[sectionKey].faq)) currentContent[sectionKey].faq = [];

        currentContent[sectionKey].faq.push({
          q: 'Novo često pitanje',
          a: 'Detaljan i stručan odgovor formuliran u trećem licu.'
        });
        renderFaqSection(containerId, sectionKey, addBtnId);
        setDirty(true);
      });
    }
  }

  // Save Content
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      if (!currentContent) return;

      // Harvest all field inputs
      document.querySelectorAll('[data-path]').forEach((input) => {
        const path = input.getAttribute('data-path');
        const val = input.value;
        setDeepProp(currentContent, path, val);
      });

      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span>⏳ Spremanje...</span>';

      try {
        const res = await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentContent)
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setDirty(false);
          showToast('Sve promjene su uspješno spremljene i sinkronizirane!');
        } else {
          showToast('Greška pri spremanju: ' + (data.error || 'Nepoznata greška'), true);
        }
      } catch (err) {
        showToast('Greška pri povezivanju s poslužiteljem: ' + err.message, true);
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span>💾 Spremi sve promjene</span>';
      }
    });
  }

  // Warn if leaving with unsaved changes
  window.addEventListener('beforeunload', (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Initial check on load
  checkAuth();
})();
