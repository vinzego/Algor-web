# Algor Studio — Sustav Dizajna & Specifikacija (Design System)

Dokumentacija dizajna, boja, tipografije, komponenti, pravila i arhitekture koda za web stranicu **Algor Studio** (`algor.studio`).

---

## 1. Identitet Brenda & Poslovne Informacije

- **Naziv brenda:** Algor Studio
- **Pravni subjekt:** Vinzego, obrt za proizvodnju i usluge
- **Vlasnik:** Vinko Grgić
- **Sjedište:** Markovo Polje, Zlatarska ulica 26a, 10360 Zagreb, Hrvatska
- **OIB:** 03419409491
- **Službena e-mail adresa:** `info@algor.studio`
- **Službena web stranica:** `https://algor.studio`
- **Službeni logotipi:**
  - `logo_black_transparent.png` (Crni prozirni logotip za svijetle površine i plutajući navbar)
  - `logo_white_transparent.png` (Bijeli prozirni logotip za tamne površine i footer)
- **Nadležni sud:** Stvarno nadležni sud u Zagrebu
- **Ton komunikacije:** Objektivan, u 3. licu jednine (*"Algor studio producira...", "osigurana je podrška..."*), luksuzan, tehnološki napredan i usmjeren na mjerljive poslovne rezultate.

---

## 2. Paleta Boja (Overtake & Algor Color Palette & Tokens)

### Primarne pozadine & Površine (Overtake Dark & Light Canvas)
- **Glavna tamna pozadina (`--canvas-dark`):** `#0B0B0C` *(Deep obsidian tamni canvas za hero, podnožje i tamne sekcije)*
- **Tamna kartična površina (`--surface-dark`):** `#161616` / `#171718` s obrubom `rgba(255, 255, 255, 0.10)`
- **Svijetla pozadina sekcija (`--canvas-light`):** `#F0F0F0` / `#EDEBE3` *(Čista, topla svjetla sekcijska površina)*
- **Svijetla kartična površina (`--surface-light`):** `#FFFFFF` s obrubom `#E2E8F0` / `rgba(0, 0, 0, 0.08)`
- **Kontejnerske kapsule & Bento:** `#161616` i `#FFFFFF` s radijusom `28px`

### Akcentne boje (Brand & Overtake Accents)
- **Overtake Neonski Lime (`--accent-lime`):** `#9EFC65` *(Glavni visokonaponski akcent: istaknuti gumbi, 'Pro' paket sjaj, točke na bedževima, hover stanja)*
- **Električno plava (Electric Neon Blue):** `#29ADFF` *(Sjaj, točka na logotipu, suptilni tech akcenti)*
- **Smaragdno zelena (Emerald Green):** `#10B981` / `#059669` *(UGC/Model oznake, uspješne konverzije, potvrde)*
- **Ljubičasti AI akcent:** `#7C3AED` / `#A855F7` *(AI automatizacije i agenti)*
- **Amber / Zlatna:** `#F59E0B` *(Ocjene 4.9/5, zvjezdice)*

### Boje teksta i tipografije
- **Glavni naslovi & istaknuti brend:** `#FFFFFF` (na tamnom) / `#0B0B0C` (na svijetlom)
- **Primarni tekst na tamnom:** `#F1F5F9` / `#FFFFFF`
- **Sekundarni opisi & podnaslovi:** `#94A3B8` / `#8E95A5` / `rgba(255, 255, 255, 0.65)`
- **Muted & Metadata tekst:** `#64748B` / `#71717A`
- **Tekst na svijetlim karticama:** `#0B0B0C` / `#1E1E24`

### Obrubi, sjene i kartice (Borders & Radius)
- **Standardni radijus kartica i kontejnera:** `28px` (Overtake signature border-radius)
- **Radijus gumba (Pill Shape):** `999px` (Full Pill)
- **Suptilni obrub kartica:** `1px solid rgba(255, 255, 255, 0.10)` (tamno) / `1px solid #E2E8F0` (svijetlo)
- **Hover obrub (Lime/Glow):** `rgba(158, 252, 101, 0.35)`
- **Ambijentalni radijalni sjaj:** `radial-gradient(circle, rgba(158, 252, 101, 0.12) 0%, rgba(41, 173, 255, 0.06) 50%, transparent 70%)`

---

## 3. Tipografija (Typography System — Overtake Style)

- **Glavni display i sans-serif font:** `'Switzer', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
  - Fontshare URL: `https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700,800,900&display=swap`
  - Težine: `400 (Regular)`, `500 (Medium)`, `600 (Semi-Bold)`, `700 (Bold)`, `800 (Extra-Bold)`, `900 (Black)`
- **Monospace / Tehnički font:** `'Geist Mono', monospace`
  - Težine: `400 (Regular)`, `600 (Semi-Bold)`, `700 (Bold)`
  - Primjena: Sekcijski brojači (`// 01`, `// 02`), bedževi, statusni signali.

### Skala naslova & Tipografska pravila:
- **Hero H1:** `clamp(38px, 5.5vw, 68px)` | `letter-spacing: -0.04em; line-height: 1.05; font-weight: 800; font-family: 'Switzer', sans-serif;`
- **Sekcijski H2:** `clamp(28px, 4.2vw, 48px)` | `letter-spacing: -0.035em; line-height: 1.1; font-weight: 800;`
- **Kartični H3:** `20px – 26px` | `letter-spacing: -0.025em; font-weight: 700;`
- **Glavni odlomci:** `15px – 16.5px` | `line-height: 1.6; color: #94A3B8;`
- **Overtake Eyebrow Bedž:** `11.5px – 13px` | `'Geist Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;`
- **Overtake Pill Gumb:** `font-weight: 700; border-radius: 999px; padding: 12px 24px;` s ugrađenim kružnim rotirajućim indikatorom strelice (`.btn-arrow-circle: ↗`).

---

## 4. Standardizirani Razmaci i Padding Sustav (Spacing & Layout Rules)

> [!IMPORTANT]
> **ZLATNO PRAVILO PADDINGA (24PX DEFAULT)**:
> Za izradu **svake sekcije, kontejnera i glavnog elementa**, defaultni bočni i vanjski padding **mora biti 24px** (`padding: ... 24px ...` ili `padding: 0 24px`).

### Standardne postavke širine i razmaka:
1. **Default bočni padding sekcija:** `24px` (npr. `padding: 60px 24px;` ili `padding: 80px 24px;`).
   - Ovo sprječava pojavu neželjenog viška praznog prostora s lijeve i desne strane ekrana te omogućuje karticama i mrežama da iskoriste puni potencijal ekrana i budu maksimalno široke i pregledne.
2. **Maksimalna širina kontejnera (`max-width`):** **`1540px`** za sve glavne sekcije (`.plain-section`, `#why-algor`, `#pricing`, `.stats-grid`, itd.).
3. **Hero & About kartice pune širine:** `width: calc(100% - 32px); margin: 16px auto; border-radius: 32px;` s unutarnjim bočnim paddingom od `24px` do `48px`.
4. **Standardni Gap unutar Gridova:** `gap: 24px` (ujednačeno na svim sekcijama s 3 ili 4 stupca).
5. **Mobilni i tablet padding:**
   - Na mobilnim uređajima (≤ 768px): bočni padding `16px` do `20px` uz `gap: 16px` do `20px`.

---

## 5. Specifikacija Ključnih Sekcija & Komponenti

### A. Navigacija (`.ultra-navbar`)
- Plutajući stakleni otok (*floating glass pill*) s logotipom: `algor studio` (s električno plavom točkom).
- Linkovi: *O nama, Usluge, Projekti, Proces, Cijene, FAQ*.
- Direktni CTA kontakt: `✉️ info@algor.studio`.

### B. Hero Sekcija
- **Interaktivna mreža:** Dinamički 1:1 grid kvadrata s neonskim raspršivanjem miša (`#mesh-grid-container`).
- **Social Proof Pill:** Avatari + `20+` klijenata | ⭐⭐⭐⭐⭐ `4.9/5` | *Marketing i AI podrška za restorane, hotele, poliklinike i lokalne usluge*.
- **Ticker Logotipi klijenata:** Supernova, Admiral, Admiral Hotel, Family Park, Restoran Taurus, Eschengarten.

### C. Sekcija "O nama" (`#about`)
- Kontejner usklađen s Hero karticom: `width: calc(100% - 32px); border-radius: 32px;`.
- **Bento 3 kartice:** Visina `350px`, radijus `24px`:
  1. *Autentični foto/video sprint* (slika visoke kvalitete).
  2. *AI tehnološka orbita* (animirani pulsirajući centar + 6 kružećih logotipa: Google, ChatGPT, Python, Meta, Instagram, GA4).
  3. *Klijentska recenzija* (Admiral / Martina P.).
- **Tekstualni uvod:** Jedinstven, ujednačen odlomak (font 19px, #334155).
- **Minimalistički red metrika (4 stupca):** `30+` Zadovoljnih klijenata, `All-in-one` Kompletan sustav, `100%` Transparentno, `Ključ u ruke` Bez lutanja.
- **Galerija slika 1:** Marquee traka fotografija s lokacija.

### D. Sekcija "Zašto Algor" (`#why-algor`)
- **Default padding & pozadina:** Integrirano unutar `.dark-combined-container` na crnoj mreži (`#050508`).
- **3-Card Asimetrični Grid:** `grid-template-columns: 1.42fr 1fr 1fr; gap: 24px;`.
  1. **Zelena kartica (Electric Lime `#bef264`, ~42% širine):** `1 Partner` — *Bez gubljenja vremena na koordinaciju fotografa, marketing agencije i programera — sve vodimo na jednom mjestu.*
  2. **Bijela kartica (`#FFFFFF`, ~29% širine):** `100% Marketing + Tehnologija` — *Video produkcija, ciljani oglasi, brze landing stranice i AI automatizacije rade sinkronizirano.*
  3. **Tamna Obsidian staklena kartica (`rgba(14, 14, 18, 0.65)`, ~29% širine):** `24/7 AI Sustav` — *Automatizacija bez pauze. Pametni asistenti kvalificiraju potencijalne klijente i automatski zakazuju termine u vaš kalendar 24/7.*

### E. Cjenik & Paketi (`#pricing`)
- **Default padding:** `padding: 90px 24px 80px 24px; max-width: 1540px;`.
- **Sekcijski bedž:** `// 03 PAKETI`
- **3 Proširena Paketa:** 
  - *Start* (490 €/mj) — Sadržaj & Meta Oglasi
  - *Pro* (890 €/mj) — ★ Najpopularniji // Sustav Akvizicije (Meta + Google + ChatGPT + Landing + AI Lead Asistent)
  - *Ultra* (1.390 €/mj) — Skaliranje & Automatizacija (Full Funnel + CRM + WhatsApp)
- **Kartice paketa:** Široki luksuzni tamni obsidian dizajn (`padding: 42px 34px; border-radius: 36px;`).
- **Trust Bar:** Mjesečni izvještaj • Stalna optimizacija • Osobna podrška.

### F. Česta Pitanja (`#faq`) & Galerija 2
- 6 sveobuhvatnih pitanja i odgovora.
- Ispod FAQ-a nalazi se druga marquee traka s fotografijama s terena.

### G. Podnožje Stranice (Footer)
- **Glavni CTA naslov:** *"Prestanite trošiti proračun na marketing koji ne konvertira"*
- **Zasluge & Brend:** `Izradio Algor Studio`.
- **Pravni linkovi:** Politika privatnosti, Uvjeti korištenja, Politika kolačića.

### H. Baner za Kolačiće (GDPR Cookie Banner)
- Plutajući *frosted glass* baner na dnu ekrana.
- **Tehnička pohrana:** `localStorage.setItem('algor_cookie_consent', ...)` + HTTP kolačić `algor_cookie_consent` s trajanjem od 365 dana + Google Consent Mode v2 signalizacija.

### I. Stranica Karijere (`karijere.html`)
- Luksuzna tamna Bento tema (`#050508` s radijalnim plavim/zelenim ambijentalnim sjajem).
- Kartice otvorenih pozicija:
  - 📸 *Model za Foto & Video Kampanje (UGC)* — istaknuta uloga, zeleni smaragdni akcenti.
  - 🎬 *Short-Form Video Editor (Reels & TikTok)* — remote/hibridni rad.
  - 📩 *Otvorena Prijava* — za sve marketing i tehničke stručnjake.
- Bento sekcija prednosti: *Vrhunska Produkcija*, *Agilnost & Jasnoća*, *Točnost & Poštovanje*.

---

## 6. Pravne Stranice (Legal Compliance)
- **Politika Privatnosti (`politika-privatnosti.html`):** Usklađena s GDPR (Uredba EU 2016/679) i Zakonom o provedbi GDPR (NN 42/2018), 11 strukturiranih sekcija.
- **Uvjeti Korištenja (`uvjeti-koristenja.html`):** 9 pravnih članaka s točnim OIB-om, sjedištem obrta Vinzego i nadležnošću zagrebačkog suda.
- **Politika Kolačića (`kolacici.html`):** Usklađena sa Zakonom o elektroničkim komunikacijama (NN 76/22).

---

## 7. Pravila Sinhronizacije & Deploymenta
- Sav statički sadržaj poslužuje Express poslužitelj iz mape `./public`.
- **Obvezna naredba nakon svake izmjene datoteka:**
  ```bash
  cp index.html public/index.html && cp style.css public/style.css && cp script.js public/script.js && cp izrada-web-stranica.html public/izrada-web-stranica.html && cp karijere.html public/karijere.html && cp politika-privatnosti.html public/politika-privatnosti.html && cp kolacici.html public/kolacici.html && cp uvjeti-koristenja.html public/uvjeti-koristenja.html && cp design.md public/design.md
  ```
- **Git repozitorij:** `https://github.com/vinzego/Algor-web.git` (`main` grana).
