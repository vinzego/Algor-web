# Algor Studio – Glavni Dizajnerski Sustav & Standardi (Design System)

Ovaj dokument definira **službeni vizualni i dizajnerski standard** web stranice Algor Studio temeljen na početnoj stranici (`index.html`). 
**Sve buduće i postojeće podstranice MORAJU pratiti ova pravila** kako bi se očuvao prepoznatljiv, luksuzan, tehnološki i konzistentan Framer/Figma izgled.

---

## 1. Tipografija (Fonts & Hierarchy)

### Glavni Fontovi:
- **Primarni font (Tekst i naslovi):** `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - *Postavke:* `font-feature-settings: "cv02", "cv03", "cv04", "cv11"; letter-spacing: -0.015em;`
- **Monospace font (Tech bedževi, brojke, tagovi, kod):** `'Geist Mono', monospace`
- **Rukopisni naglasci (opcionalno za ručne bilješke):** `'Caveat', cursive` (wght: 700)

### Hijerarhija Veličina i Težina:
- **H1 (Hero naslov):** `clamp(38px, 6vw, 68px)` | Težina: `600` do `700` | `letter-spacing: -2px` | `line-height: 1.05`
- **H2 (Sekcijski naslovi):** `clamp(28px, 3.8vw, 44px)` | Težina: `600` | `letter-spacing: -1.2px` | `line-height: 1.15`
- **H2 u Tamnim sekcijama (Usporedba/Recenzije):** `clamp(38px, 5.2vw, 64px)` | Težina: `600` | `letter-spacing: -0.03em`
- **H3 (Kartice/Bento blokovi):** `18px` – `22px` | Težina: `700` | `letter-spacing: -0.4px`
- **Odlomci (Lead Paragraphs):** `16.5px` | Težina: `400` – `500` | `color: #475569` | `line-height: 1.65`
- **Običan tekst (Body):** `14.5px` – `15px` | `line-height: 1.55` | `color: #64748b` ili `#334155`

---

## 2. Paleta Boja (Color Palette)

### Svijetle Površine (Canvas & Cards):
- **Glavna pozadina stranice:** `#f7f7f8` (svijetlosiva Apple/Framer nijansa)
- **Pozadina kartica (Bento/Price/Reviews):** `#ffffff` (čista bijela)
- **Obrubi (Borders light):** `1px solid rgba(0, 0, 0, 0.06)` ili `#e2e8f0`
- **Primarni tekst:** `#09090b` / `#0f172a`
- **Sekundarni tekst:** `#475569` / `#64748b`

### Tamne Površine (Hero, Usporedba, FAQ, Footer):
- **Hero / Bento Dark:** `#08090d` do `#0c0e14`
- **Glavni tamni gradijent (Wide Black Card):**
  ```css
  background: #08090d;
  background-image: 
    radial-gradient(ellipse at 50% 0%, rgba(41, 173, 255, 0.09) 0%, transparent 60%),
    radial-gradient(ellipse at 50% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
    linear-gradient(to bottom, #0c0e14, #06070a);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.45), inset 0 0 100px rgba(0, 0, 0, 0.7);
  ```
- **Tekst u tamnim sekcijama:** `#ffffff` (glavni), `#8e8e93` / `#a1a1aa` (muted)

### Akcentne Boje (Accents & Highlights):
- **Brand Cyan / Electric Blue:** `#29ADFF` (Tech badges, akcenti, ikone)
- **Brand Deep Blue:** `#0284c7` / `#0066FF` (Linkovi, toggle, interakcije)
- **Lime Green (Overtake / Success):** `#9cf846` / `#10b981` (Kvačice, istaknuti bedževi)
- **Yellow / Gold (Upozorenja / Ocjene):** `#ffd166` / `#ffb703` (Zvijezdice ★)
- **Red / Coral (Canvas vodiči & markeri):** `#ff453a`

---

## 3. Gumbi i Interaktivni Elementi (Pill Buttons)

Svi glavni CTA gumbi koriste **Framer Capsule (Pill) dizajn s kružićem sa strelicom na desnoj strani**:

### Crni Pill Gumb (Glavni CTA za svijetlu pozadinu):
- **Izgled:** Crna kapsula (`#09090b`), zaobljeni rubovi `9999px`, padding `6px 6px 6px 24px`.
- **Desni kružić:** Bijeli krug (`#ffffff`) s crnom strelicom ↗ (`#09090b`).
- **Hover efekt:** `transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.25);` i mikropomak strelice `translate(1px, -1px)`.

### Bijeli Pill Gumb (Za tamne kartice i istaknute pakete):
- **Izgled:** Bijela kapsula (`#ffffff`), crni tekst (`#09090b`), obrub `1px solid rgba(0,0,0,0.08)`.
- **Desni kružić:** Crni krug (`#09090b`) s bijelom strelicom ↗ (`#ffffff`).

---

## 4. Oznake Sekcija (Tech Badges)

Svaka sekcija započinje prepoznatljivim minimalističkim monospace bedžem:
```html
<div class="section-tech-badge">
  <span class="tech-badge-dot"></span>
  <span>// 01 NAZIV SEKCIJE</span>
</div>
```
- **Stil:** `background: rgba(41, 173, 255, 0.12); border: 1px solid rgba(41, 173, 255, 0.35); color: #29ADFF; border-radius: 999px; font-family: 'Geist Mono', monospace; font-size: 11.5px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;`
- **Plava pulsirajuća točkica:** `width: 6px; height: 6px; border-radius: 50%; background: #29ADFF; box-shadow: 0 0 8px #29ADFF;`

---

## 5. Razmaci, Zaobljenja i Kartice (Spacing & Border Radius)

### Kontejneri & Širine:
- **Maksimalna širina sadržaja (`--max-width`):** `1200px` – `1320px` (Centrirano `margin: 0 auto; padding: 0 24px;`)
- **Maksimalna širina velikih tamnih kartica:** `1540px`

### Vertikalni Razmaci (Section Spacing):
- **Svijetle sekcije:** `padding: 90px 24px;`
- **Razmak između naslova i sadržaja sekcije:** `36px` do `48px`
- **Razmak između kartica u gridu (`gap`):** `24px` do `28px`

### Zaobljenja (Border Radius):
- **Velike sekcijske kartice (Dark container / Footer):** `36px` do `40px`
- **Pojedinačne kartice (Bento, Pricing, Projects, Reviews):** `24px` do `28px`
- **Pilule, gumbi i bedževi:** `999px` (Fully rounded)
- **Fotografije i avatari u karticama:** `12px` do `16px` ili `50%` za avatare

### Chamfered kartice (Specifičan Framer rezani kut):
- **Gornji desni chamfer (Review card):** `clip-path: polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%);`
- **Donji desni chamfer (Stats card):** `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%);`

---

## 6. Navigacija (Floating Capsule Navbar)

- **Pozicija:** Fiksirana na vrhu ekrana (`top: 18px; left: 50%; transform: translateX(-50%); z-index: 999;`)
- **Pozadina:** `rgba(255, 255, 255, 0.88)` uz `backdrop-filter: blur(16px);`
- **Obrub:** `1px solid rgba(0, 0, 0, 0.08); border-radius: 999px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);`
- **Sadržaj:** Samo glavne stranice (bez linkova na sekcije na podstranicama), email link u monospace stilu i glatki animirani hamburger izbornik za mobitele.

---

## 7. Pravila Implementacije Novih Stranica

1. **Uvijek koristiti iste CSS varijable i strukturu klasa** definiranih u `index.html` / `style.css`.
2. **Hero sekcija** mora biti usklađena sa stilom (tamni tech canvas ili čisti minimalizam sa section tech badgeom).
3. **CTA sekcija** na dnu svake stranice mora koristiti standardnu `framer-minimal-cta-section` ili integrirani footer obrazac.
4. **Responzivnost:** Na mobilnim uređajima (`<= 768px`) ukloniti suvišne hover efekte, prilagoditi gridove na 1 stupac, a tipografiju skalirati putem `clamp()`.
