# Algor Studio — Sustav Dizajna & Specifikacija (Design System)

Dokumentacija dizajna, boja, tipografije, komponenti, pravila i arhitekture koda za web stranicu **Algor Studio** (`algor.studio`).

---

## 1. Identitet Brenda & Poslovne Informacije

- **Naziv brenda:** Algor Studio
- **Pravni subjekt:** Vinzego, obrt za proizvodnju i usluge
- **Vlasnik:** Vinko Grgić
- **Sjedište:** Markovo Polje, Zlatarska ulica 26a, 10000 Zagreb, Hrvatska
- **OIB:** 03419409491
- **Službena e-mail adresa:** `info@algor.studio`
- **Službena web stranica:** `https://algor.studio`
- **Nadležni sud:** Stvarno nadležni sud u Zagrebu
- **Ton komunikacije:** Objektivan, u 3. licu jednine (*"Algor studio producira...", "osigurana je podrška..."*), luksuzan, tehnološki napredan i usmjeren na mjerljive poslovne rezultate.

---

## 2. Paleta Boja (Color Palette & Tokens)

### Primarne pozadine (Dark Canvas)
- **Glavna tamna pozadina:** `#050508` *(Glavno tijelo stranice, footer, podstranice)*
- **Bento & Card površina:** `#0E0E12` *(Tamne staklene kartice, uloge u karijerama, FAQ)*
- **Sekundarna tamna površina:** `#14151A` *(Prednosti rada, istaknuti boxevi)*
- **Tagovi i bedževi:** `#09090B` / `rgba(255, 255, 255, 0.05)`
- **Svijetle kartice (High Contrast Bento):** `#FFFFFF` i `#EBFD72` *(Lime akcent kartica "Od 2024. godine")*

### Akcentne boje (Brand Accents)
- **Električno plava (Electric Neon Blue):** `#29ADFF` *(Glavni akcent brenda, sjaj, točka na logotipu, hover stanja, linkovi)*
- **Smaragdno zelena (Emerald Green):** `#10B981` / `#059669` *(UGC/Model oznake, uspješne konverzije, potvrde)*
- **Lime zelena (High Voltage Lime):** `#EBFD72` *(Kartica godine poslovanja u "O nama")*
- **Ljubičasti AI akcent:** `#7C3AED` / `#A855F7` *(AI automatizacije i agenti)*
- **Amber / Zlatna:** `#F59E0B` *(Ocjene 4.9/5, zvjezdice)*

### Boje teksta i tipografije
- **Glavni naslovi & istaknuti brend:** `#FFFFFF` *(100% snježno bijela, 700-800 težina)*
- **Primarni tekst na tamnom:** `#F1F5F9` / `#F8FAFC`
- **Sekundarni opisi & podnaslovi:** `#CBD5E1` / `#94A3B8`
- **Muted & Metadata tekst:** `#64748B` / `#71717A` / `#8E95A5`
- **Tekst na svijetlim karticama:** `#0A0A0F` / `#1E1E24`

### Obrubi i stakleni efekti (Borders & Glassmorphism)
- **Suptilni obrub kartica:** `rgba(255, 255, 255, 0.08)`
- **Hover obrub (Electric Blue):** `rgba(41, 173, 255, 0.30)`
- **Highlight obrub (Emerald):** `rgba(16, 185, 129, 0.25)`
- **Frosted Glass Blur:** `backdrop-filter: blur(24px) saturate(180%);`
- **Ambijentalni radijalni sjaj:** `radial-gradient(circle, rgba(41, 173, 255, 0.12) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 70%)`

---

## 3. Tipografija (Typography System)

- **Glavni sans-serif font:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Težine: `300 (Light)`, `400 (Regular)`, `500 (Medium)`, `600 (Semi-Bold)`, `700 (Bold)`, `800 (Extra-Bold)`
- **Monospace / Tehnički font:** `'Geist Mono', monospace`
  - Težine: `400 (Regular)`, `600 (Semi-Bold)`, `700 (Bold)`
  - Primjena: Bedževi, tagovi uloga, tehničke oznake, statusni signali.

### Skala naslova:
- **Hero H1:** `clamp(36px, 5vw, 56px)` | `letter-spacing: -1.8px; line-height: 1.1; font-weight: 800;`
- **Sekcijski H2:** `clamp(28px, 4vw, 42px)` | `letter-spacing: -1px; font-weight: 800;`
- **Bento Card H3:** `20px – 24px` | `letter-spacing: -0.6px; font-weight: 700;`
- **Glavni odlomci:** `15px – 16px` | `line-height: 1.65; color: #CBD5E1;`
- **Eyebrow Bedž:** `11.5px – 12px` | `'Geist Mono', uppercase; letter-spacing: 0.5px;`

---

## 4. Specifikacija Ključnih Sekcija & Komponenti

### A. Navigacija (`.ultra-navbar`)
- Plutajući stakleni otok (*floating glass pill*) s logotipom: `algor studio` (s električno plavom točkom).
- Linkovi: *O nama, Usluge, Projekti, Proces, Cijene, FAQ*.
- Direktni CTA kontakt: `✉️ info@algor.studio`.

### B. Hero Sekcija
- **Interaktivna mreža:** Dinamički 1:1 grid kvadrata s neonskim raspršivanjem miša (`#mesh-grid-container`).
- **Social Proof Pill:** Avatari + `20+` klijenata | ⭐⭐⭐⭐⭐ `4.9/5` | *Marketing i AI podrška za restorane, hotele, poliklinike i lokalne usluge*.
- **Ticker Logotipi klijenata:** Supernova, Admiral, Family Park, Restoran Taurus, Eschengarten.

### C. Sekcija "O nama" (`#about`)
- **Kartica 1 & 2:** Holistički pristup (Snimanje + Oglasi + Web + AI) i 15-minutni strateški poziv.
- **Kartica 3 (Lime akcent):** `Od 2024. godine` — *Kreiranje vrhunskog sadržaja, oglasnih kampanja i digitalnih rješenja za uspješan rast klijenata.*
- **Kartica 4 (Recenzija klijenta):** 
  - Brend: `ADMIRAL`
  - Citat: *"Algor nije samo napravio projekt, već postao dugotrajni partner za naše poslovanje."*
  - Autor: `Martina P., Admiral`

### D. Cjenik & Paketi (`#pricing`)
- **Sekcijski bedž:** `// 03 PAKETI`
- **3 Paketa suradnje:** *Start* (690 €), *Pro* (1.250 €), *Ultra* (2.150 €).
- **Pro & Ultra paketi:** Uključuju **Live Dashboard** za praćenje rezultata kampanja u realnom vremenu.
- **Ultra paket:** Uključuje *4 napredne Meta & Google Ads kampanje + 16 objava*.
- Na svakom paketu iznad CTA gumba: `Mjesečna suradnja`.
- **Trust Bar ispod cjenika:**
  1. 📊 *Mjesečni izvještaj uključen u sve pakete*
  2. 🎯 *Stalna optimizacija i fokus na rast*
  3. 🤝 *Direktna komunikacija i osobna podrška*

### E. Česta Pitanja (`#faq`)
- 6 sveobuhvatnih pitanja i odgovora formuliranih u trećem licu:
  1. Dolazak na lokaciju i organizacija snimanja (Zagreb i okolica).
  2. Vođenje Meta i Google oglasa i budžeti.
  3. Izrada visoko-konvertirajućih landing stranica.
  4. 24/7 AI asistent za automatizaciju upita i ugovaranje termina.
  5. Transparentni mjesečni izvještaji i praćenje rezultata.
  6. Početak suradnje i vremenski okvir lansiranja kampanja (7-10 dana).

### F. Podnožje Stranice (Footer)
- **Glavni CTA naslov:** *"Prestanite trošiti proračun na marketing koji ne konvertira"*
- **Zasluge & Brend:** `Izradio Algor Studio` *(istaknuto, bijeli bold font s hover efektom)*.
- **Pravni linkovi:** Politika privatnosti, Uvjeti korištenja, Politika kolačića.

### G. Baner za Kolačiće (GDPR Cookie Banner)
- Plutajući *frosted glass* baner na dnu ekrana.
- **Službeni tekst:**
  > *"Ova web stranica koristi kolačiće i srodne tehnologije za optimizaciju performansi, analitiku posjećenosti i unaprjeđenje korisničkog iskustva. Klikom na „Prihvati sve” pristajete na obradu podataka u navedene svrhe. Saznajte više u našoj Politici kolačića."*
- **Gumbi:** `Prihvati sve` i `Samo nužni`.
- **Tehnička pohrana:** `localStorage.setItem('algor_cookie_consent', ...)` + pravi HTTP kolačić `algor_cookie_consent` s trajanjem od 365 dana + Google Consent Mode v2 signalizacija.

### H. Stranica Karijere (`karijere.html`)
- Luksuzna tamna Bento tema (`#050508` s radijalnim plavim/zelenim ambijentalnim sjajem).
- Kartice otvorenih pozicija:
  - 📸 *Model za Foto & Video Kampanje (UGC)* — istaknuta uloga, zeleni smaragdni akcenti.
  - 🎬 *Short-Form Video Editor (Reels & TikTok)* — remote/hibridni rad.
  - 📩 *Otvorena Prijava* — za sve marketing i tehničke stručnjake.
- Bento sekcija prednosti: *Vrhunska Produkcija*, *Agilnost & Jasnoća*, *Točnost & Poštovanje*.

---

## 5. Pravne Stranice (Legal Compliance)
- **Politika Privatnosti (`politika-privatnosti.html`):** Usklađena s GDPR (Uredba EU 2016/679) i Zakonom o provedbi GDPR (NN 42/2018), 11 strukturiranih sekcija.
- **Uvjeti Korištenja (`uvjeti-koristenja.html`):** 9 pravnih članaka s točnim OIB-om, sjedištem obrta Vinzego i nadležnošću zagrebačkog suda.
- **Politika Kolačića (`kolacici.html`):** Usklađena sa Zakonom o elektroničkim komunikacijama (NN 76/22).

---

## 6. Pravila Sinhronizacije & Deploymenta
- Sav statički sadržaj poslužuje Express poslužitelj iz mape `./public`.
- **Obvezna naredba nakon svake izmjene datoteka:**
  ```bash
  cp index.html public/index.html && cp style.css public/style.css && cp script.js public/script.js && cp izrada-web-stranica.html public/izrada-web-stranica.html && cp karijere.html public/karijere.html && cp politika-privatnosti.html public/politika-privatnosti.html && cp kolacici.html public/kolacici.html && cp uvjeti-koristenja.html public/uvjeti-koristenja.html && cp design.md public/design.md
  ```
- **Git repozitorij:** `https://github.com/vinzego/Algor-web.git` (`main` grana).
