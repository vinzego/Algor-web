const fs = require('fs');
const path = require('path');

function makeRoll(text, iconHtml = '') {
  let chars = [];
  for (let i = 0; i < text.length; i++) {
    chars.push(text[i] === ' ' ? '&nbsp;' : text[i]);
  }
  if (iconHtml) chars.push(iconHtml);
  
  let v = chars.map((c, i) => `<span class="fb-roll-char" style="--i:${i};">${c}</span>`).join('');
  let h = chars.map((c, i) => `<span class="fb-roll-char" style="--i:${i};">${c}</span>`).join('');
  return `<span class="fb-roll-track"><span class="fb-roll-visible">${v}</span><span class="fb-roll-hover" aria-hidden="true">${h}</span></span>`;
}

function processHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Simple link replacer helper (only if not already rolled)
  const replaceLink = (pattern, text, icon = '') => {
    // E.g. <li><a href="#projekti">Projekti</a></li>
    content = content.replace(pattern, (match, p1, p2) => {
      if (match.includes('fb-roll-track')) return match;
      return `${p1}${makeRoll(text, icon)}${p2}`;
    });
  };

  // 1. Nav Links
  replaceLink(/(<a href="#projekti">)Projekti(<\/a>)/g, 'Projekti');
  replaceLink(/(<a href="#about">)O nama(<\/a>)/g, 'O nama');
  replaceLink(/(<a href="#proces">)Proces(<\/a>)/g, 'Proces');
  replaceLink(/(<a href="#cjenik">)Cjenik(<\/a>)/g, 'Cjenik');
  replaceLink(/(<a href="#faq">)FAQ(<\/a>)/g, 'FAQ');

  // 2. Mobile Nav Links
  replaceLink(/(<a href="#projekti" class="fb-mobile-link">)Projekti(<\/a>)/g, 'Projekti');
  replaceLink(/(<a href="#about" class="fb-mobile-link">)O nama(<\/a>)/g, 'O nama');
  replaceLink(/(<a href="#proces" class="fb-mobile-link">)Proces(<\/a>)/g, 'Proces');
  replaceLink(/(<a href="#cjenik" class="fb-mobile-link">)Cjenik(<\/a>)/g, 'Cjenik');
  replaceLink(/(<a href="#faq" class="fb-mobile-link">)FAQ(<\/a>)/g, 'FAQ');
  replaceLink(/(<a href="mailto:info@algor.studio" class="fb-mobile-link">)Kontakt(<\/a>)/g, 'Kontakt');

  // 3. Footer Links
  replaceLink(/(<a href="#usluge">)Društvene mreže(<\/a>)/g, 'Društvene mreže');
  replaceLink(/(<a href="#usluge">)Sadržaj &amp; Marketing(<\/a>)/g, 'Sadržaj & Marketing');
  replaceLink(/(<a href="\/izrada-web-stranica">)Izrada web-stranica(<\/a>)/g, 'Izrada web-stranica');
  replaceLink(/(<a href="\/chatgpt-ads">)ChatGPT Ads(<\/a>)/g, 'ChatGPT Ads');
  replaceLink(/(<a href="#cjenik">)Cjenik paketa(<\/a>)/g, 'Cjenik paketa');

  replaceLink(/(<a href="#about">)O nama(<\/a>)/g, 'O nama');
  replaceLink(/(<a href="#projekti">)Projekti(<\/a>)/g, 'Projekti');
  replaceLink(/(<a href="#proces">)Proces(<\/a>)/g, 'Proces');
  replaceLink(/(<a href="#recenzije">)Recenzije(<\/a>)/g, 'Recenzije');
  replaceLink(/(<a href="#faq">)Česta pitanja(<\/a>)/g, 'Česta pitanja');
  replaceLink(/(<a href="\/karijere">)Karijere(<\/a>)/g, 'Karijere');

  replaceLink(/(<a href="mailto:info@algor.studio">)info@algor.studio(<\/a>)/g, 'info@algor.studio');
  replaceLink(/(<a href="https:\/\/www\.instagram\.com\/algor_studio"[^>]*>)Instagram(<\/a>)/g, 'Instagram');

  replaceLink(/(<a href="\/politika-privatnosti">)Privatnost(<\/a>)/g, 'Privatnost');
  replaceLink(/(<a href="\/uvjeti-koristenja">)Uvjeti(<\/a>)/g, 'Uvjeti');
  replaceLink(/(<a href="\/kolacici">)Kolačići(<\/a>)/g, 'Kolačići');
  replaceLink(/(<a href="#cookie-settings" class="open-cookie-banner">)Postavke(<\/a>)/g, 'Postavke');

  replaceLink(/(<a href="\/politika-privatnosti">)Politika privatnosti(<\/a>)/g, 'Politika privatnosti');
  replaceLink(/(<a href="\/uvjeti-koristenja">)Uvjeti korištenja(<\/a>)/g, 'Uvjeti korištenja');
  replaceLink(/(<a href="\/kolacici">)Politika kolačića(<\/a>)/g, 'Politika kolačića');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed links in:', filePath);
}

processHtml('index.html');
processHtml('public/index.html');
