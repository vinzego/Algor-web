# Algor Studio — Sustav Dizajna & Specifikacija (Design System)

Službena dokumentacija dizajna, vizualnog identiteta, tipografije, boja, interakcija i arhitekture tema za web stranicu **Algor Studio** (`algor.studio`).

Aktivna primarna tema početne stranice definirana je u datoteci **`Algor-theme.css`** (`public/Algor-theme.css`).

---

## 1. Identitet Brenda & Poslovne Informacije

- **Naziv brenda:** Algor Studio
- **Pravni subjekt:** Vinzego, obrt za proizvodnju i usluge
- **Vlasnik:** Vinko Grgić
- **Sjedište:** Markovo Polje, Zlatarska ulica 26a, 10360 Zagreb, Hrvatska
- **OIB:** 03419409491
- **Službena e-mail adresa:** `info@algor.studio`
- **Službena web stranica:** `https://algor.studio`
- **Glavna odredišna stranica za upite i kontakt:** `/kontakt`
- **Službeni logotipi:**
  - `logo_black_transparent.png` (Crni prozirni logotip za svijetle površine i plutajući navbar)
  - `logo_white_transparent.png` (Bijeli prozirni logotip za tamne površine i footer)
- **Nadležni sud:** Stvarno nadležni sud u Zagrebu
- **Zlatno pravilo komunikacije:** **Isključivo treće lice jednine i procesni oblik** (*„Algor Studio producira...”, „osigurana je podrška...”, „cjelokupan proces odvija se...”*). Strogo je zabranjeno spominjanje „tima”, „naših stručnjaka” ili množine („mi radimo”). Ton je profesionalan, luksuzan, tehnološki napredan i usmjeren na mjerljive poslovne rezultate.

---

## 2. Paleta Boja & CSS Tokeni (`Algor-theme.css`)

### Glavne boje i akcenti:
- **Algor Signature Orange (`--c-orange`):** `#f65600` *(Glavni energetski akcent: gumbi, bedževi, rukopisne riječi, proces rada blok, hover efekti)*
- **Orange Hover (`--c-orange-hover`):** `#df4e00`
- **Orange Soft Glow (`--c-orange-soft`):** `rgba(246, 86, 0, 0.1)`

### Tamne površine (Deep Obsidian Canvas & Cards):
- **Glavna tamna boja (`--c-dark`):** `#020108`
- **Tamna površina (`--c-dark-surface`):** `#0a0a0f`
- **Tamna kartica (`--c-dark-card`):** `#121218`
- **Hover tamne kartice (`--c-dark-card-hover`):** `#181822`
- **Tamni obrub (`--c-dark-border`):** `rgba(255, 255, 255, 0.12)`
- **Muted tekst na tamnom (`--c-dark-text-muted`):** `#8e8e93` / `#94a3b8`

### Svijetle površine (Clean Editorial Canvas & Cards):
- **Glavna svijetla pozadina (`--c-light-bg`):** `#f5f5f5` / `#f8f9fa`
- **Svijetla površina (`--c-light-surface`):** `#ffffff`
- **Svijetla kartica (`--c-light-card`):** `#f9f9f9` / `#ffffff`
- **Svijetli obrub (`--c-light-border`):** `rgba(0, 0, 0, 0.08)`
- **Glavni tamni tekst (`--c-text-dark`):** `#020108`
- **Prigušeni tekst (`--c-text-muted`):** `#808083` / `#64748b`

### Radijusi & Geometrija:
- **Radijus gumba (Pill Shape):** `9999px` / `100px` (`--radius-pill`)
- **Radijus kartica:** `24px` / `20px` (`--radius-card`)
- **Maksimalna širina kontejnera:** `1360px` (`--container-max`)
- **Bočni padding kontejnera:** `clamp(16px, 3.5vw, 48px)` (`--container-pad`)

---

## 3. Tipografski Sustav (Typography System)

Na cijeloj web stranici koristi se pažljivo usklađena kombinacija tri fonta:

### A. Glavni Sans-Serif font (`--font-sans`) — **Inter**
- **Definicija:** `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- **Gdje se koristi:** Svi glavni naslovi, tekst kartica, odlomci, gumbi i navigacija.
- **Težine:** `400 (Regular)`, `500 (Medium)`, `600 (Semi-Bold)`, `700 (Bold)`.

### B. Akcentni rukopisni font (`--font-script`) — **Caveat**
- **Definicija:** `'Caveat', cursive, sans-serif`
- **Gdje se koristi:** `.accent-script` klasa unutar naslova za isticanje ključnih emotivnih i strateških riječi (npr. *„pametnije”*, *„rezultate”*, *„jednostavno”*, *„vjeruju”*).
- **Stil:** `font-weight: 600; font-size: 1.15em - 1.18em; transform: translateY(-2px); display: inline-block;`.

### C. Monospace font (`--font-mono`) — **Fragment Mono / Geist Mono**
- **Definicija:** `'Fragment Mono', 'Geist Mono', monospace`
- **Gdje se koristi:** Oznake sekcija (`.fb-eyebrow`), bedževi faza procesa (`.fb-process-step-pill`), tehničke oznake i statusne točke.

---

## 4. Pravila Skaliranja i Poravnanja Naslova

> [!IMPORTANT]
> **ZLATNO PRAVILO NASLOVA: LIJEVO PORAVNANJE I KOMPAKTNA ELEGANCIJA**
> 1. Svi naslovi sekcija na web stranici (**Naši radovi, O nama, Proces rada, Cjenik, Recenzije, FAQ**) **poravnati su ulijevo (`text-align: left; margin: 0;`)**.
> 2. Veličina svih glavnih sekcijskih naslova je ujednačena na **`clamp(34px, 4.5vw, 56px)`**.
> 3. Debljina naslova je rafinirana na **`font-weight: 600`** (uklonjen je preteški 800 bold).
> 4. Prored (line-height) je kompaktan: **`1.08`**.
> 5. Razmak među slovima (tracking / letter-spacing) je: **`-0.035em`**.

### Hijerarhija veličina:
| Element | Veličina fonta | Težina | Prored | Razmak slova | Poravnanje |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero H1 Naslov** | `clamp(38px, 5.2vw, 68px)` | `600` | `1.05` | `-0.035em` | Centrirano / Lijevo |
| **Glavni naslovi sekcija (H2)** | `clamp(34px, 4.5vw, 56px)` | `600` | `1.08` | `-0.035em` | **Lijevo (`text-align: left`)** |
| **Izjava klijenata (Statement)** | `clamp(30px, 4vw, 50px)` | `600` | `1.10` | `-0.035em` | Lijevo |
| **Naslovi kartica (H3)** | `clamp(22px, 2.2vw, 28px)` | `600` | `1.20` | `-0.030em` | Lijevo |
| **Podnaslovi i lead tekst** | `clamp(16px, 1.3vw, 20px)` | `400 / 500` | `1.60` | `-0.015em` | Lijevo / Centrirano |
| **Osnovni tekst (p)** | `15px – 16.5px` | `400` | `1.65` | `-0.010em` | Lijevo |
| **Eyebrow oznake** | `11.5px – 12px` | `600 / 700` | `1.00` | `0.14em` | Lijevo (Monospace) |

---

## 5. Ključni UI Elementi, Interakcije & Efekti

### A. Fiksno progresivno zamagljeno staklo (`.fb-bottom-glass-fade`)
- **Opis:** Fiksni stakleni sloj usidren na samom dnu ekrana (`position: fixed; bottom: 0; left: 0; right: 0; height: 110px; z-index: 9990; pointer-events: none;`).
- **Efekt:** Koristi `backdrop-filter: blur(24px)` u kombinaciji s vertikalnim gradientom maske (`mask-image: linear-gradient(to top, black 25%, transparent 100%)`).
- **Vizualni dojam:** Stvara osjećaj kao da sadržaj i slova prolaze iza zamagljenog stakla prije nego što se potpuno pojave na ekranu tijekom listanja.

### B. Animacija teksta slovo-po-slovo (Roll Text Animation)
- **Primjena:** Svi glavni gumbi (`.fb-btn-dark`, `.fb-btn-primary`, `.fb-btn-dark-outline`) i linkovi u navigaciji i podnožju.
- **Mehanika:** Svako slovo obavijeno je u `.fb-roll-char` sa CSS varijablom `--i` (indeks slova).
- **Hover:** Riječ se animira tako da slovo po slovo brzo izlazi odozdo (`translateY(-100%)` -> `translateY(0)` uz stagger delay `--i * 0.015s`).
- **Unhover:** Pri odmicanju miša, tekst se glatko i brzo vraća u početni položaj u suprotnom smjeru.

### C. Povezanost CTA gumba
- Svi gumbi poziva na akciju na cijeloj stranici (*„Zakažite uvodni razgovor”*, *„Započnite suradnju”*, *„Odaberite paket”*) vode izravno na stranicu za rezervaciju i kontakt: **`/kontakt`**.

### D. Navigacija (`.fb-navbar` & `.fb-mobile-menu`)
- **Desktop (> 768px):** Minimalistički plutajući otok / kapsula (`border-radius: 100px`) s logotipom, linkovima, kružnim mjeračem čitanja i CTA gumbom.
- **Mobilni uređaji (≤ 768px):** Fiksna, blago prozirna traka od ruba do ruba (`width: 100%`, `border-radius: 0`, `background: rgba(2, 1, 8, 0.85)`, `backdrop-filter: blur(20px)`):
  - **Lijeva strana:** Logotip studija (`.fb-nav-brand`).
  - **Desna strana:** Hamburger ikona (`.fb-nav-burger`) koja se pri otvaranju glatko transformira u križić (X).
  - **Cijeli zaslon:** Klikom na hamburger otvara se elegantan full-screen izbornik (`.fb-mobile-menu`) s velikim navigacijskim poveznicama, Roll animacijama i glavnim CTA gumbom za ugovaranje sastanka.

### E. Pročišćeno podnožje (Footer)
- Između logotipa i navigacijskih stupaca u footeru uklonjene su teške sive linije razdvajanja za prozračan i čist editorial izgled.

---

## 6. Struktura Sekcija Početne Stranice

1. **Hero sekcija:** Video pozadina, statusni bedž, H1 naslov s Caveat akcentom, podnaslov i 2 CTA gumba.
2. **Klijenti & Izjava o povjerenju:** Velika izjava o povjerenju (`.fb-clients-statement`) + beskonačna marquee traka s logotipima brendova (Supernova, Admiral, Family Park, Taurus, Eschengarten).
3. **Naši radovi (`#radovi`):** Lijevo poravnat naslov, 3-stupčana mreža studija slučaja s videozapisima, tagovima i rezultatima.
4. **O nama (`#o-nama`):** Lijevi editorial uvod s Caveat akcentom i 4-stupčana mreža ključnih statistika (*30+ Klijenata*, *4x Veći ROAS*, *100% Ključ u ruke*, *24/7 AI podrška*).
5. **Proces rada (`#proces`):** Signature narančasti blok (`#f65600`) s ljepljivim lijevim stupcem i 4 kartice procesa rada (01 Analiza, 02 Produkcija, 03 Lansiranje, 04 Skaliranje).
6. **Cjenik (`#cjenik`):** Lijevo poravnat naslov, lijevi toggle switch za mjesečni/godišnji prikaz, 3 paketa (*Start*, *Pro*, *Ultra*) te custom inquiry traka.
7. **Recenzije klijenata (`#recenzije`):** Lijevo poravnata eyebrow oznaka i naslov + beskonačni marquee vrtuljak stvarnih kartica recenzija s avatarima i citatima.
8. **Česta pitanja (`#faq`):** 2-stupčana sekcija s lijevim naslovom i interaktivnom harmonikom odgovora na najčešća pitanja s rotirajućim plus/križić ikonama.
9. **CTA Banner na dnu:** Veliki pročišćeni poziv na akciju s Caveat akcentom i gumbom za ugovaranje suradnje.
10. **Podnožje (Footer):** Pročišćeni footer s radnim vremenom, brzim linkovima, kontakt podacima i pravnim poveznicama.

---

## 8. Pravila Copywritinga & Ton Komunikacije (Copywriting Standards)

> [!IMPORTANT]
> **OBVEZNO PRAVILO PISANJA: ISKLJUČIVO TREĆE LICE (3RD PERSON) & PROCESNA PERSPEKTIVA**
> 
> 1. **Svi tekstovi na webu moraju biti pisani u 3. licu jednine ili bezličnom procesnom obliku:**
>    - *Ispravno:* „Algor Studio preuzima kompletnu produkciju...”, „Prije dolaska na lokaciju priprema se plan...”, „Klijent dobiva tjedne izvještaje...”, „Usluga uključuje...”
>    - *Zabranjeno:* „Mi radimo...”, „Naš tim...”, „Nudimo vam...”, „Naši stručnjaci će vam pomoći...”, „Mi snimamo...”.
> 2. **Solopreneur agencijski model:**
>    - Vlasnik vodi agenciju samostalno (bez internog tima zaposlenika).
>    - **Nikada ne spominjati riječ „tim” niti stvarati lažni privid korporativnog odjela**, već predstavljati studio kao visoko efikasan, automatiziran i vrhunski opremljen studio partnerstvo sustav.
> 3. **Obraćanje korisniku (CTA i pogodnosti):**
>    - Direktni pozivi na akciju i naslovi smiju se izravno obraćati klijentu u 2. licu (npr. *„Dogovorite besplatan uvodni razgovor”*, *„Saznajte koji paket odgovara vašim ciljevima”*), no svi opisi načina rada, odgovori na pitanja i procesi moraju strogo ostati u 3. licu.
> 4. **Ton glasa:**
>    - Samouvjeren, jasan, minimalistički, tehnički precizan i usmjeren na povrat ulaganja (ROI) i mjerljive poslovne rezultate.

---

## 9. Arhitektura Datoteka & Pravila Sinhronizacije

- **Glavni stylesheet teme:** `public/Algor-theme.css` (sinhroniziran u korijenu kao `Algor-theme.css`).
- **Glavni HTML:** `public/index.html` (sinhroniziran u korijenu kao `index.html`).
- **Build skripta:** `npm run build` (minifikacija i optimizacija u mapu `dist/`).
- **Lokalni poslužitelj:** `server.js` na portu `3001`.

```bash
# Naredba za potpunu sinkronizaciju nakon izmjena:
cp public/index.html index.html && cp public/Algor-theme.css Algor-theme.css
```

