require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Client } = require('@notionhq/client');
const nodemailer = require('nodemailer');

const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable gzip/deflate compression for all requests (cuts payload by ~80%)
app.use(compression({
  threshold: 1024,
  level: 6
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pre-warmed fast paths for HTML pages
const publicDir = path.join(__dirname, 'public');

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

// Serve static files with instant cache for assets
const staticOptions = {
  maxAge: '2h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=86400');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    }
  }
};
app.use(express.static(publicDir, staticOptions));
app.use(express.static(__dirname, staticOptions));

const CSV_FILE = path.join(__dirname, 'upiti.csv');

// Initialize Notion Client if credentials exist
let notion = null;
if (process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID) {
  notion = new Client({ auth: process.env.NOTION_TOKEN });
}

// Initialize Nodemailer SMTP Transporter
let mailTransporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_PORT === '465' || true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Helper function to append to CSV with UTF-8 BOM for Microsoft Excel compatibility
function saveInquiryToCSV(data) {
  const fileExists = fs.existsSync(CSV_FILE);
  const header = 'Datum i Vrijeme,Ime i Prezime,Tvrtka ili Web,E-mail,Mobitel,Odabrani Paket,Vrijednost (€),Izvor Stranica,Uređaj,Termin u Kalendaru\n';
  
  const timestamp = new Date().toLocaleString('hr-HR', { timeZone: 'Europe/Zagreb' });
  const escapeCsv = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
  
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
    fs.writeFileSync(CSV_FILE, '\uFEFF' + header + row, 'utf8');
  } else {
    fs.appendFileSync(CSV_FILE, row, 'utf8');
  }
}

function getEstimatedDealValue(pkg) {
  if (!pkg) return 0;
  const p = pkg.toLowerCase();
  if (p.includes('start') || p.includes('590')) return 590;
  if (p.includes('pro') || p.includes('plus') || p.includes('890')) return 890;
  if (p.includes('ultra') || p.includes('ai') || p.includes('1550') || p.includes('1.550')) return 1550;
  if (p.includes('490')) return 490;
  if (p.includes('990')) return 990;
  if (p.includes('1850') || p.includes('1.850') || p.includes('1,850')) return 1850;
  if (p.includes('instagram') || p.includes('oglas')) return 500;
  if (p.includes('audit')) return 0;
  return 0;
}

function normalizeNotionPackage(pkg) {
  if (!pkg) return 'Besplatan Audit';
  const p = pkg.toLowerCase();
  if (p.includes('start') || p.includes('590')) return 'Paket Start';
  if (p.includes('plus') || p.includes('pro') || p.includes('890')) return 'Paket Pro';
  if (p.includes('ultra') || p.includes('ai') || p.includes('1550') || p.includes('1.550')) return 'Paket Ultra';
  if (p.includes('audit') || p.includes('savjetovanj') || p.includes('kontakt') || p.includes('konzultacij') || p.includes('uvodni') || p.includes('razgovor') || p.includes('sastanak')) return 'Besplatan Audit';
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
    'Email': {
      email: data.email || null
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

  if (data.phone) {
    properties['Mobitel'] = {
      phone_number: data.phone.trim()
    };
  }

  if (data.calendarSlot) {
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
  if (!mailTransporter || !data.email) return;

  const clientName = data.name || 'poštovani';
  const pkg = data.package || 'Izrada Weba & Digitalna Rješenja';
  const company = data.company || 'Nije navedeno';
  const phone = data.phone || 'Nije naveden';
  const note = data.calendarSlot && data.calendarSlot !== 'Nije odabrano' && data.calendarSlot !== 'Upit s podnožja'
    ? data.calendarSlot
    : 'Besplatna procjena projekta i savjetovanje';

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
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #050508; padding: 36px 32px; text-align: center; border-bottom: 2px solid #29ADFF;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                ALGOR<span style="color: #29ADFF;">STUDIO</span>
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">
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
                <strong>Algor Studio</strong> &bull; <a href="https://algor.studio" style="color: #29ADFF; text-decoration: none;">algor.studio</a> &bull; <a href="mailto:info@algor.studio" style="color: #29ADFF; text-decoration: none;">info@algor.studio</a>
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
    from: '"Algor Studio" <info@algor.studio>',
    to: data.email,
    subject: `Potvrda zaprimanja upita: ${pkg} | Algor Studio`,
    html: htmlContent
  });
}

// API endpoint to submit inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, email, phone, package: pkg, appointmentDate, appointmentTime, meetingType, calendarSlot, source, device } = req.body;
    const estimatedValue = getEstimatedDealValue(pkg);
    
    // 1. Save to CSV backup
    saveInquiryToCSV({ name, company, email, phone, package: pkg, calendarSlot, source, device, estimatedValue });

    // 2. Save directly to Notion database
    try {
      await saveInquiryToNotion({ name, company, email, phone, package: pkg, appointmentDate, appointmentTime, meetingType, calendarSlot, source, device, estimatedValue });
      console.log(`✓ Upit uspješno poslan u Notion [Algor upiti]: ${name} | ${pkg} (${estimatedValue} €) | ${source} | ${device}`);
    } catch (notionErr) {
      console.error('Greška pri spremanju u Notion:', notionErr.message);
    }

    // 3. Automatically send client confirmation email
    try {
      if (email) {
        await sendClientConfirmationEmail({ name, company, email, phone, package: pkg, calendarSlot });
        console.log(`✓ Automatski potvrdni email poslan klijentu: ${email}`);
      }
    } catch (emailErr) {
      console.error('Greška pri slanju potvrdnog emaila:', emailErr.message);
    }

    res.json({ success: true, message: 'Upit je uspješno spremljen u CSV, Notion i poslan je potvrdni email!' });
  } catch (err) {
    console.error('Greška pri spremanju upita:', err);
    res.status(500).json({ success: false, error: 'Spremanje upita nije uspjelo.' });
  }
});

// Admin endpoint to download CSV file directly
app.get('/admin/export-csv', (req, res) => {
  if (fs.existsSync(CSV_FILE)) {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="upiti.csv"');
    res.sendFile(CSV_FILE);
  } else {
    res.status(404).send('Trenutno nema spremljenih upita.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
