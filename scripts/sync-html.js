const fs = require('fs');
const path = require('path');

const CONTENT_FILE = path.join(__dirname, '..', 'data', 'content.json');

function renderRollText(text) {
  const chars = Array.from(text);
  const visible = chars.map((c, i) => `<span class="fb-roll-char" style="--i:${i};">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  const hover = chars.map((c, i) => `<span class="fb-roll-char" style="--i:${i};">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  return `<span class="fb-roll-track"><span class="fb-roll-visible">${visible}</span><span class="fb-roll-hover" aria-hidden="true">${hover}</span></span>`;
}

function renderFaqHtml(faqList) {
  if (!Array.isArray(faqList) || faqList.length === 0) return '';
  return faqList.map((item, index) => `
            <!-- FAQ ${index + 1} -->
            <div class="fb-faq-item${index === 0 ? ' is-open' : ''}">
              <div class="fb-faq-question">
                <h3 class="fb-faq-q-text">${item.q || ''}</h3>
                <span class="fb-faq-icon">${index === 0 ? '−' : '+'}</span>
              </div>
              <div class="fb-faq-answer">
                <p>${item.a || ''}</p>
              </div>
            </div>`).join('\n');
}

function syncHtmlFromContent(customContent) {
  const content = customContent || (fs.existsSync(CONTENT_FILE) ? JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')) : null);
  if (!content) return;

  const rootDir = path.join(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');

  function updateFile(filename, updater) {
    const targets = [
      path.join(publicDir, filename),
      path.join(rootDir, filename),
      path.join(distDir, filename)
    ];

    targets.forEach((targetPath) => {
      if (fs.existsSync(targetPath)) {
        try {
          const original = fs.readFileSync(targetPath, 'utf8');
          const updated = updater(original);
          if (updated && updated !== original) {
            fs.writeFileSync(targetPath, updated, 'utf8');
          }
        } catch (e) {
          console.error(`Error updating ${targetPath}:`, e.message);
        }
      }
    });
  }

  // ==========================================
  // 1. UPDATE index.html (Home)
  // ==========================================
  if (content.home) {
    updateFile('index.html', (html) => {
      let res = html;
      const h = content.home;

      if (h.hero_subtitle) {
        res = res.replace(/<p class="fb-hero-subtitle">[\s\S]*?<\/p>/, `<p class="fb-hero-subtitle">\n            ${h.hero_subtitle}\n          </p>`);
      }

      if (h.clients_statement) {
        res = res.replace(/<h2 class="fb-clients-statement">[\s\S]*?<\/h2>/, `<h2 class="fb-clients-statement">\n            ${h.clients_statement}\n          </h2>`);
      }

      if (h.about_title) {
        res = res.replace(/<h2 class="fb-about-title">[\s\S]*?<\/h2>/, `<h2 class="fb-about-title">\n              ${h.about_title}\n            </h2>`);
      }
      if (h.about_subtitle) {
        res = res.replace(/<p class="fb-about-lead">[\s\S]*?<\/p>/, `<p class="fb-about-lead">\n              ${h.about_subtitle}\n            </p>`);
      }

      // Home Process Section
      if (h.process_title) {
        res = res.replace(/<h2 class="fb-process-sticky-title">[\s\S]*?<\/h2>/, `<h2 class="fb-process-sticky-title">\n                ${h.process_title}\n              </h2>`);
      }
      if (h.process_desc) {
        res = res.replace(/<p class="fb-process-sticky-desc">[\s\S]*?<\/p>/, `<p class="fb-process-sticky-desc">\n                ${h.process_desc}\n              </p>`);
      }

      // Home FAQ List
      if (Array.isArray(h.faq)) {
        const faqMarkup = renderFaqHtml(h.faq);
        res = res.replace(/(<div class="fb-faq-list" id="fb-faq-list">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, `$1\n${faqMarkup}\n          $2`);
      }

      // Home CTA Banner
      if (h.cta_banner_title) {
        res = res.replace(/<h2 class="fb-cta-banner-title">[\s\S]*?<\/h2>/, `<h2 class="fb-cta-banner-title">\n          ${h.cta_banner_title}\n        </h2>`);
      }
      if (h.cta_banner_subtitle) {
        res = res.replace(/<p class="fb-cta-banner-subtitle">[\s\S]*?<\/p>/, `<p class="fb-cta-banner-subtitle">\n          ${h.cta_banner_subtitle}\n        </p>`);
      }

      return res;
    });
  }

  // ==========================================
  // 2. UPDATE izrada-web-stranica.html
  // ==========================================
  if (content.web_development) {
    updateFile('izrada-web-stranica.html', (html) => {
      let res = html;
      const w = content.web_development;

      if (w.hero_subtitle) {
        res = res.replace(/<p class="figma-hero-statement">[\s\S]*?<\/p>/, `<p class="figma-hero-statement">\n        ${w.hero_subtitle}\n      </p>`);
      }

      // Tehnologije Section
      if (w.tech_title) {
        res = res.replace(/(<section class="fb-process-section" id="tehnologije">[\s\S]*?<h2 class="fb-process-sticky-title">)[\s\S]*?(<\/h2>)/, `$1\n                ${w.tech_title}\n              $2`);
      }
      if (w.tech_desc) {
        res = res.replace(/(<section class="fb-process-section" id="tehnologije">[\s\S]*?<p class="fb-process-sticky-desc">)[\s\S]*?(<\/p>)/, `$1\n                ${w.tech_desc}\n              $2`);
      }

      // Web Dev FAQ List
      if (Array.isArray(w.faq)) {
        const faqMarkup = renderFaqHtml(w.faq);
        res = res.replace(/(<section class="fb-faq-section" id="faq">[\s\S]*?<div class="fb-faq-list" id="fb-faq-list">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, `$1\n${faqMarkup}\n          $2`);
      }

      // Web Dev CTA Banner
      if (w.cta_banner_title) {
        res = res.replace(/(<section class="fb-cta-banner-section" id="kontakt">[\s\S]*?<h2 class="fb-cta-banner-title"[^>]*>)[\s\S]*?(<\/h2>)/, `$1\n            ${w.cta_banner_title}\n          $2`);
      }

      return res;
    });
  }

  // ==========================================
  // 3. UPDATE chatgpt-ads.html
  // ==========================================
  if (content.chatgpt_ads) {
    updateFile('chatgpt-ads.html', (html) => {
      let res = html;
      const c = content.chatgpt_ads;

      if (c.hero_subtitle) {
        res = res.replace(/<p class="cga-hero-subtitle">[\s\S]*?<\/p>/, `<p class="cga-hero-subtitle">\n          ${c.hero_subtitle}\n        </p>`);
      }

      // Usporedba
      if (c.comp_title) {
        res = res.replace(/(<section class="cga-section" id="usporedba">[\s\S]*?<h2 class="fb-section-title">)[\s\S]*?(<\/h2>)/, `$1\n            ${c.comp_title}\n          $2`);
      }

      // Publika
      if (c.aud_title) {
        res = res.replace(/(<section class="cga-section" id="publika">[\s\S]*?<h2 class="fb-section-title">)[\s\S]*?(<\/h2>)/, `$1\n            ${c.aud_title}\n          $2`);
      }

      // Proces
      if (c.process_title) {
        res = res.replace(/(<section class="cga-section" id="proces">[\s\S]*?<h2 class="fb-section-title">)[\s\S]*?(<\/h2>)/, `$1\n            ${c.process_title}\n          $2`);
      }

      // Pricing
      if (c.pkg_desc) {
        res = res.replace(/(<p class="fb-price-card-sub"[^>]*>)[\s\S]*?(<\/p>)/, `$1\n                      ${c.pkg_desc}\n                    $2`);
      }
      if (c.pkg_price) {
        res = res.replace(/(<span class="fb-price-amount"[^>]*>)[\s\S]*?(<\/span>)/, `$1${c.pkg_price}$2`);
      }

      // ChatGPT Ads FAQ List
      if (Array.isArray(c.faq)) {
        const faqMarkup = renderFaqHtml(c.faq);
        res = res.replace(/(<section class="fb-faq-section" id="faq">[\s\S]*?<div class="fb-faq-list" id="fb-faq-list">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, `$1\n${faqMarkup}\n          $2`);
      }

      // ChatGPT Ads CTA Banner
      if (c.cta_banner_title) {
        res = res.replace(/(<section class="fb-cta-banner-section" id="kontakt">[\s\S]*?<h2 class="fb-cta-banner-title"[^>]*>)[\s\S]*?(<\/h2>)/, `$1\n            ${c.cta_banner_title}\n          $2`);
      }
      if (c.cta_banner_subtitle) {
        res = res.replace(/(<p class="fb-cta-banner-sub">)[\s\S]*?(<\/p>)/, `$1\n            ${c.cta_banner_subtitle}\n          $2`);
      }

      return res;
    });
  }
}

if (require.main === module) {
  syncHtmlFromContent();
  console.log('HTML files synced with data/content.json');
}

module.exports = { syncHtmlFromContent };
