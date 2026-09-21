require('dotenv').config({ quiet: true });
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const helmet = require('helmet');
const { Client } = require('@notionhq/client');
const nodemailer = require('nodemailer');

const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const sourcePublicDir = path.join(__dirname, 'public');
const builtPublicDir = path.join(__dirname, 'dist');
const publicDir = isProduction && fs.existsSync(builtPublicDir) ? builtPublicDir : sourcePublicDir;

if (isProduction && publicDir !== builtPublicDir) {
  console.warn('Production build not found; serving verified files from public/.');
}
if (isProduction && process.env.SAVE_LOCAL_CSV !== 'true'
  && (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID)) {
  console.warn('Durable contact-form storage is not configured; the website remains available but form submissions will return 503.');
}

const trustProxy = process.env.TRUST_PROXY;
if (trustProxy) {
  app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);
}

function getInlineScriptHashes(directory) {
  const hashes = new Set();
  for (const filename of fs.readdirSync(directory)) {
    if (!filename.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(directory, filename), 'utf8');
    const scriptPattern = /<script\b(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptPattern.exec(html)) !== null) {
      const digest = crypto.createHash('sha256').update(match[1], 'utf8').digest('base64');
      hashes.add(`'sha256-${digest}'`);
    }
  }
  return [...hashes];
}

const inlineScriptHashes = getInlineScriptHashes(publicDir);

// Security: Hide Express technology fingerprint
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", ...inlineScriptHashes, 'https://www.googletagmanager.com'],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      imgSrc: ["'self'", 'data:', 'https://algor.studio', 'https://www.google-analytics.com', 'https://www.googletagmanager.com', 'https://www.google.com', 'https://googleads.g.doubleclick.net'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://region1.google-analytics.com', 'https://www.googletagmanager.com', 'https://www.google.com', 'https://googleads.g.doubleclick.net'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      ...(isProduction ? { upgradeInsecureRequests: [] } : {})
    }
  },
  crossOriginEmbedderPolicy: false,
  frameguard: { action: 'deny' },
  hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  next();
});

// Security: Block unauthorized access to hidden files, environment files, logs and data
app.use((req, res, next) => {
  const p = req.path.toLowerCase();
  if (p.includes('/.') || /\.(?:env|csv|log|md|map)$/i.test(p) || p.startsWith('/data') || p.endsWith('/server.js')) {
    return res.status(404).send('Not Found');
  }
  next();
});

// Enable gzip/deflate compression for all requests (cuts payload by ~80%)
app.use(compression({
  threshold: 1024,
  level: 6
}));

app.use(express.json({ limit: '32kb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '32kb', parameterLimit: 50 }));

// Pre-warmed fast paths for HTML pages and SEO assets
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  const file = path.join(publicDir, 'robots.txt');
  res.sendFile(file);
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  const file = path.join(publicDir, 'sitemap.xml');
  res.sendFile(file);
});


app.get(['/kontakt', '/kontakt.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/kontakt');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'kontakt.html'));
});

app.get(['/izrada-web-stranica', '/izrada-web-stranica.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/izrada-web-stranica');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'izrada-web-stranica.html'));
});

app.get(['/chatgpt-ads', '/chatgpt-ads.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/chatgpt-ads');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'chatgpt-ads.html'));
});

app.get(['/karijere', '/karijere.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/karijere');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'karijere.html'));
});

app.get(['/politika-privatnosti', '/politika-privatnosti.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/politika-privatnosti');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'politika-privatnosti.html'));
});

app.get(['/uvjeti-koristenja', '/uvjeti-koristenja.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/uvjeti-koristenja');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'uvjeti-koristenja.html'));
});

app.get(['/kolacici', '/kolacici.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/kolacici');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'kolacici.html'));
});

app.get(['/admiral-studija-slucaja', '/admiral-studija-slucaja.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/admiral-studija-slucaja');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'admiral-studija-slucaja.html'));
});

app.get(['/family-park-studija-slucaja', '/family-park-studija-slucaja.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/family-park-studija-slucaja');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'family-park-studija-slucaja.html'));
});

app.get(['/eschengarten-studija-slucaja', '/eschengarten-studija-slucaja.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/eschengarten-studija-slucaja');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'eschengarten-studija-slucaja.html'));
});

app.get(['/supernova-studija-slucaja', '/supernova-studija-slucaja.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/supernova-studija-slucaja');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'supernova-studija-slucaja.html'));
});

app.get(['/hvala', '/hvala.html'], (req, res) => {
  if (req.path.endsWith('.html')) return res.redirect(301, '/hvala');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'hvala.html'));
});

app.get(['/', '/index.html'], (req, res) => {
  if (req.path === '/index.html') return res.redirect(301, '/');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Serve only public static files with instant cache for assets
const staticOptions = {
  fallthrough: true,
  index: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    }
  }
};
app.use(express.static(publicDir, staticOptions));

const CSV_FILE = path.join(__dirname, 'data', 'upiti.csv');

// Initialize Notion Client if credentials exist
let notion = null;
if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
  notion = new Client({ auth: process.env.NOTION_TOKEN, timeoutMs: 8000 });
}

// Initialize Nodemailer SMTP Transporter
let mailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    connectionTimeout: 7000,
    greetingTimeout: 7000,
    socketTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true
  });
}

const confirmationLogoPath = path.join(sourcePublicDir, 'logo_white_transparent.png');
const confirmationLogo = fs.existsSync(confirmationLogoPath) ? fs.readFileSync(confirmationLogoPath) : null;

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

// Helper function to append to CSV with UTF-8 BOM for Microsoft Excel compatibility
function saveInquiryToCSV(data) {
  const dataDir = path.dirname(CSV_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  }

  const fileExists = fs.existsSync(CSV_FILE);
  const header = 'Datum i Vrijeme,Ime i Prezime,Tvrtka ili Web,E-mail,Mobitel,Odabrani Paket,Vrijednost (€),Izvor Stranica,Uređaj,Termin u Kalendaru\n';
  
  const timestamp = new Date().toLocaleString('hr-HR', { timeZone: 'Europe/Zagreb' });
  const escapeCsv = (val) => {
    let str = (val || '').toString();
    // Neutralize Formula Injection (CWE-1236) if value starts with =, +, -, @, tab, or CR
    if (/^[=+\-@\t\r]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  };
  
  const row = [
    escapeCsv(timestamp),
    escapeCsv(data.name),
    escapeCsv(data.company),
    escapeCsv(data.email),
    escapeCsv(data.phone),
    escapeCsv(data.package),
    escapeCsv(data.estimatedValue || 0),
    escapeCsv(data.source || 'Web'),
    escapeCsv(data.device || 'Desktop'),
    escapeCsv(data.calendarSlot || 'Nije odabrano')
  ].join(',') + '\n';

  if (!fileExists) {
    fs.writeFileSync(CSV_FILE, '\uFEFF' + header + row, { encoding: 'utf8', mode: 0o600 });
  } else {
    fs.appendFileSync(CSV_FILE, row, 'utf8');
  }
  fs.chmodSync(CSV_FILE, 0o600);
}

function getEstimatedDealValue(pkg) {
  if (!pkg) return 0;
  const p = pkg.toLowerCase();
  if (p.includes('ultra')) return (p.includes('990') && !p.includes('1190') && !p.includes('1.190')) ? 990 : 1190;
  if (p.includes('custom') || p.includes('shop') || p.includes('1850') || p.includes('1.850') || p.includes('1,850')) return 1850;
  if (p.includes('business') || p.includes('web-pro') || (p.includes('990') && !p.includes('pro'))) return 990;
  if (p.includes('chatgpt') || p.includes('searchgpt')) return 400;
  if (p.includes('pro') || p.includes('plus')) return p.includes('590') ? 590 : 790;
  if (p.includes('start')) return p.includes('590') ? 590 : 400;
  if (p.includes('landing') || p.includes('490')) return 490;
  if (p.includes('instagram') || p.includes('oglas')) return 500;
  if (p.includes('audit')) return 0;
  return 0;
}

function normalizeNotionPackage(pkg) {
  if (!pkg) return 'Uvodni razgovor';
  const p = pkg.toLowerCase();
  if (p.includes('chatgpt') || p.includes('searchgpt') || p.includes('openai')) return 'ChatGPT Ads';
  if (p.includes('start')) return 'Paket Start';
  if (p.includes('ultra')) return 'Paket Ultra';
  if (p.includes('plus') || p.includes('pro')) return 'Paket Pro';
  if (p.includes('audit') || p.includes('savjetovanj') || p.includes('kontakt') || p.includes('konzultacij') || p.includes('uvodni') || p.includes('razgovor') || p.includes('sastanak')) return 'Uvodni razgovor';
  return 'Izrada weba';
}

// Helper to format appointment date & time range for Notion Date property
function formatNotionAppointmentDate(dateStr, timeStr, fullText) {
  const text = (dateStr || '') + ' ' + (fullText || '');
  if (text.includes('Preskočeno') || text.includes('Nije')) return null;

  let year, month, day;

  // 1. Try ISO YYYY-MM-DD
  const isoMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    [, year, month, day] = isoMatch;
  } else {
    // 2. Try Croatian date e.g. 4. rujna 2026.
    const hrMatch = text.match(/(\d{1,2})\.\s*([a-zA-ZčćžšđČĆŽŠĐ]+)\s*(\d{4})/i);
    if (hrMatch) {
      day = hrMatch[1].padStart(2, '0');
      const monthName = hrMatch[2].toLowerCase();
      const hrMonths = {
        'siječnja': '01', 'siječanj': '01',
        'veljače': '02', 'veljača': '02',
        'ožujka': '03', 'ožujak': '03',
        'travnja': '04', 'travanj': '04',
        'svibnja': '05', 'svibanj': '05',
        'lipnja': '06', 'lipanj': '06',
        'srpnja': '07', 'srpanj': '07',
        'kolovoza': '08', 'kolovoz': '08',
        'rujna': '09', 'rujan': '09',
        'listopada': '10', 'listopad': '10',
        'studenoga': '11', 'studeni': '11',
        'prosinca': '12', 'prosinac': '12'
      };
      month = hrMonths[monthName];
      year = hrMatch[3];
    }
  }

  if (!year || !month || !day) return null;

  const timeSource = (timeStr || '') + ' ' + (fullText || '');
  const timeMatch = timeSource.match(/(\d{1,2}):(\d{2})/);

  if (timeMatch) {
    const sH = timeMatch[1].padStart(2, '0');
    const sM = timeMatch[2];
    return {
      start: `${year}-${month}-${day}T${sH}:${sM}:00+02:00`
    };
  }

  return { start: `${year}-${month}-${day}` };
}

// Helper function to save inquiry to Notion database "Algor upiti"
async function saveInquiryToNotion(data) {
  if (!notion || !process.env.NOTION_DATABASE_ID) {
    console.warn('Notion API credentials missing, skipping Notion save.');
    return;
  }

  const cleanPackage = normalizeNotionPackage(data.package);
  const estimatedValue = getEstimatedDealValue(data.package);
  const source = data.source || 'Izrada Web Stranica';
  const device = data.device || 'Desktop';

  const properties = {
    'Ime i prezime': {
      title: [{ text: { content: data.name || 'Novi upit' } }]
    },
    'Tvrtka/web': {
      rich_text: [{ text: { content: data.company || '-' } }]
    },
    'Datum upita': {
      date: { start: new Date().toISOString().split('T')[0] }
    },
    'Status': {
      status: { name: 'Novi upit' }
    },
    'Paket': {
      select: { name: cleanPackage }
    },
    'Izvor': {
      select: { name: source }
    },
    'Uređaj': {
      select: { name: device }
    },
    'Vrijednost (€)': {
      number: estimatedValue
    }
  };

  if (data.email && data.email.trim()) {
    properties['Email'] = {
      email: data.email.trim()
    };
  }

  if (data.phone && data.phone.trim()) {
    properties['Mobitel'] = {
      phone_number: data.phone.trim()
    };
  }

  if (data.calendarSlot && data.calendarSlot.trim()) {
    properties['Termin sastanka'] = {
      rich_text: [{ text: { content: data.calendarSlot.trim() } }]
    };
  }

  // Populate Notion 'Termin' Date property
  const appointmentDateObj = formatNotionAppointmentDate(
    data.appointmentDate,
    data.appointmentTime,
    data.calendarSlot
  );

  if (appointmentDateObj) {
    properties['Termin'] = {
      date: appointmentDateObj
    };
  }

  const children = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `📋 Detalji upita s weba:\n• Ime i prezime: ${data.name || '-'}\n• Tvrtka / Web: ${data.company || '-'}\n• Email: ${data.email || '-'}\n• Mobitel: ${data.phone || '-'}\n• Odabrani paket: ${data.package || '-'}\n• Procijenjena vrijednost: ${estimatedValue} €\n• Izvor stranice: ${source}\n• Uređaj: ${device}\n• Napomena / poruka: ${data.calendarSlot || 'Nema napomene'}`
            }
          }
        ]
      }
    }
  ];

  await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID },
    properties,
    children
  });
}

// Helper function to send an automated confirmation email to the client
async function sendClientConfirmationEmail(data) {
  if (!mailTransporter || !data.email) {
    if (!mailTransporter) {
      console.warn('SMTP transporter not initialized (SMTP_HOST/SMTP_USER/SMTP_PASS missing). Confirmation email skipped.');
    }
    return;
  }

  const clientName = escapeHtml(data.name || 'poštovani');
  const pkg = escapeHtml(data.package || 'Izrada Weba & Digitalna Rješenja');
  const company = escapeHtml(data.company || 'Nije navedeno');
  const phone = escapeHtml(data.phone || 'Nije naveden');
  const note = escapeHtml(data.calendarSlot && data.calendarSlot !== 'Nije odabrano' && data.calendarSlot !== 'Upit s podnožja'
    ? data.calendarSlot
    : 'Besplatna procjena projekta i savjetovanje');

  const attachments = confirmationLogo ? [{
      filename: 'logo.png',
      content: confirmationLogo,
      cid: 'algorlogo'
    }] : [];

  const htmlContent = `
<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potvrda primitka upita | Algor Studio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f3f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f3f7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner with Official Algor Logo -->
          <tr>
            <td style="background-color: #050508; padding: 36px 32px; text-align: center; border-bottom: 2px solid #0066FF;">
              <a href="https://algor.studio" target="_blank" style="text-decoration: none; display: inline-block;">
                <img src="${confirmationLogo ? 'cid:algorlogo' : 'https://algor.studio/logo_white_transparent.png'}" alt="Algor Studio" width="170" style="display: block; margin: 0 auto; max-width: 170px; height: auto; border: 0;" />
              </a>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;">
                Digitalna Agencija &bull; Web &bull; Marketing &bull; AI
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px 24px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a;">
                Pozdrav ${clientName},
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Hvala vam na javljanju! Vaš upit je uspješno zaprimljen u naš sustav. Osobno ću detaljno pregledati vaše zahtjeve i javiti vam se u najkraćem mogućem roku (unutar <strong>2 radna sata</strong>).
              </p>

              <!-- Summary Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; margin: 24px 0; padding: 20px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 14px 0; font-size: 13.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                      📋 Sažetak vašeg upita:
                    </h3>
                    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px;">
                      <tr>
                        <td width="38%" style="color: #64748b; font-weight: 600;">Odabrana usluga:</td>
                        <td style="color: #0f172a; font-weight: 700;">${pkg}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Ime i prezime:</td>
                        <td style="color: #0f172a; font-weight: 600;">${clientName}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Tvrtka / Web:</td>
                        <td style="color: #0f172a;">${company}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Kontakt telefon:</td>
                        <td style="color: #0f172a;">${phone}</td>
                      </tr>
                      <tr>
                        <td style="color: #64748b; font-weight: 600;">Napomena / Detalji:</td>
                        <td style="color: #0f172a;">${note}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                Ako u međuvremenu imate bilo kakva dodatna pitanja ili želite priložiti dodatne materijale, slobodno odgovorite izravno na ovaj email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #050508; padding: 24px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08);">
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                <strong>Algor Studio</strong> &bull; <a href="https://algor.studio" style="color: #0066FF; text-decoration: none;">algor.studio</a> &bull; <a href="mailto:info@algor.studio" style="color: #0066FF; text-decoration: none;">info@algor.studio</a>
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11.5px; color: #64748b;">
                Ovaj email je automatska potvrda zaprimanja vašeg upita.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM || '"Algor Studio" <info@algor.studio>',
    to: data.email,
    subject: `Potvrda primitka upita: ${pkg} | Algor Studio`,
    html: htmlContent,
    attachments
  });
}

// In-memory rate limiting map for form submissions (IP -> { count, resetAt })
const rateLimitMap = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes window
  const maxAttempts = 5;

  if (rateLimitMap.size >= 10000 && !rateLimitMap.has(ip)) {
    const oldestKey = rateLimitMap.keys().next().value;
    rateLimitMap.delete(oldestKey);
  }

  const record = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
  } else {
    record.count += 1;
  }
  rateLimitMap.set(ip, record);
  return record.count > maxAttempts;
}

// Clean up stale rate limit entries every 30 minutes
const rateLimitCleanup = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 30 * 60 * 1000);
rateLimitCleanup.unref();

const allowedOrigins = new Set(['https://algor.studio', 'https://www.algor.studio']);
if (process.env.SITE_ORIGIN) {
  try {
    allowedOrigins.add(new URL(process.env.SITE_ORIGIN).origin);
  } catch {
    console.warn('SITE_ORIGIN is invalid and was ignored.');
  }
}
if (!isProduction) {
  allowedOrigins.add(`http://localhost:${PORT}`);
  allowedOrigins.add(`http://127.0.0.1:${PORT}`);
}

function safeTokenEqual(received, expected) {
  if (typeof received !== 'string' || typeof expected !== 'string') return false;
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return receivedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

// API endpoint to submit inquiries with rate-limiting, sanitization, and spam filters
app.post('/api/contact', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const origin = req.get('origin');
    if (origin && !allowedOrigins.has(origin)) {
      return res.status(403).json({ success: false, error: 'Zahtjev nije dopušten.' });
    }
    if (!req.is('application/json') && !req.is('application/x-www-form-urlencoded')) {
      return res.status(415).json({ success: false, error: 'Nepodržan format zahtjeva.' });
    }

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

    // 0. Rate limiting protection (max 5 submissions per 10 min per IP)
    if (isRateLimited(clientIp)) {
      return res.status(429).json({ success: false, error: 'Previše poslanih upita u kratkom vremenu. Molimo pričekajte nekoliko minuta.' });
    }

    const { name, company, email, phone, package: pkg, appointmentDate, appointmentTime, meetingType, calendarSlot, source, device, hp } = req.body;
    
    // Honeypot check (anti-bot trap)
    if (hp) {
      return res.json({ success: true, message: 'Upit je uspješno zaprimljen.' });
    }

    // Input sanitization & validation
    const sanitize = (str, maxLen = 200) => String(str ?? '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .trim()
      .slice(0, maxLen);
    const cleanName = sanitize(name, 100);
    const cleanCompany = sanitize(company, 100);
    const cleanEmail = sanitize(email, 254);
    const cleanPhone = sanitize(phone, 50);
    const cleanPkg = sanitize(pkg, 100);
    const cleanCalendarSlot = sanitize(calendarSlot, 500);
    const cleanSource = sanitize(source, 100) || 'Web Stranica';
    const submittedDevice = sanitize(device, 50);
    const cleanDevice = ['Desktop', 'Tablet', 'Mobile'].includes(submittedDevice) ? submittedDevice : 'Desktop';
    const cleanAppDate = sanitize(appointmentDate, 50);
    const cleanAppTime = sanitize(appointmentTime, 50);
    const cleanMeetingType = sanitize(meetingType, 50);

    if (!cleanName && !cleanEmail && !cleanPhone) {
      return res.status(400).json({ success: false, error: 'Molimo unesite kontakt podatke.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanEmail && !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Molimo unesite ispravnu e-mail adresu.' });
    }

    if (cleanAppDate && !/^\d{4}-\d{2}-\d{2}$/.test(cleanAppDate)) {
      return res.status(400).json({ success: false, error: 'Datum termina nije ispravan.' });
    }
    if (cleanAppTime && !/^\d{2}:\d{2}$/.test(cleanAppTime)) {
      return res.status(400).json({ success: false, error: 'Vrijeme termina nije ispravno.' });
    }

    const estimatedValue = getEstimatedDealValue(cleanPkg);

    const inquiry = {
        name: cleanName,
        company: cleanCompany,
        email: cleanEmail,
        phone: cleanPhone,
        package: cleanPkg,
        appointmentDate: cleanAppDate,
        appointmentTime: cleanAppTime,
        meetingType: cleanMeetingType,
        calendarSlot: cleanCalendarSlot,
        source: cleanSource,
        device: cleanDevice,
        estimatedValue
    };

    // Plaintext local backups are disabled by default to minimize retained personal data.
    let storedLocally = false;
    if (process.env.SAVE_LOCAL_CSV === 'true') {
      saveInquiryToCSV(inquiry);
      storedLocally = true;
    }

    const [notionResult, emailResult] = await Promise.allSettled([
      saveInquiryToNotion(inquiry),
      cleanEmail ? sendClientConfirmationEmail(inquiry) : Promise.resolve()
    ]);

    if (notionResult.status === 'rejected') {
      console.error('Notion save failed:', notionResult.reason?.name || 'Error');
    } else if (notion) {
      console.log('Contact inquiry stored in Notion.');
    }
    if (emailResult.status === 'rejected') {
      console.error('Confirmation email failed:', emailResult.reason?.name || 'Error');
    } else if (cleanEmail && mailTransporter) {
      console.log('Contact confirmation email sent.');
    }

    const storedInNotion = Boolean(notion) && notionResult.status === 'fulfilled';
    if (!storedLocally && !storedInNotion) {
      return res.status(503).json({ success: false, error: 'Upit trenutačno nije moguće spremiti. Pokušajte ponovno.' });
    }

    res.json({ success: true, message: 'Upit je uspješno zaprimljen.' });
  } catch (err) {
    console.error('Contact request failed:', err?.name || 'Error');
    res.status(500).json({ success: false, error: 'Spremanje upita nije uspjelo.' });
  }
});

// Admin endpoint to download CSV file with secret authentication key protection
app.get('/admin/export-csv', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const expectedSecret = process.env.ADMIN_SECRET_KEY;

  res.setHeader('Cache-Control', 'no-store');
  if (!expectedSecret) {
    return res.status(404).send('Not Found');
  }
  if (!safeTokenEqual(token, expectedSecret)) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).send('Pristup odbijen.');
  }

  if (fs.existsSync(CSV_FILE)) {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="upiti.csv"');
    res.sendFile(CSV_FILE);
  } else {
    res.status(404).send('CSV zapis ne postoji.');
  }
});

app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API ruta ne postoji.' });
});

app.use((err, req, res, next) => {
  if (!err) return next();
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'Zahtjev je prevelik.' });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Neispravan zahtjev.' });
  }
  console.error('Unhandled request error:', err?.name || 'Error');
  return res.status(500).json({ success: false, error: 'Došlo je do pogreške.' });
});

// 404 Handler for all other unhandled GET routes
app.use((req, res) => {
  res.status(404);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(publicDir, '404.html'));
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
}

module.exports = app;
