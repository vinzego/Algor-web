require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Client } = require('@notionhq/client');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory, fallback to root if not found
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

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
  if (p.includes('490')) return 490;
  if (p.includes('990')) return 990;
  if (p.includes('1850') || p.includes('1.850') || p.includes('1,850')) return 1850;
  if (p.includes('690')) return 690;
  if (p.includes('1250') || p.includes('1.250') || p.includes('1,250')) return 1250;
  if (p.includes('2150') || p.includes('2.150') || p.includes('2,150')) return 2150;
  if (p.includes('instagram') || p.includes('oglas')) return 500;
  if (p.includes('audit')) return 0;
  return 0;
}

function normalizeNotionPackage(pkg) {
  if (!pkg) return 'Custom Paket';
  const p = pkg.toLowerCase();
  if (p.includes('490')) return 'Landing Stranica (od 490 €)';
  if (p.includes('990')) return 'Business Web (od 990 €)';
  if (p.includes('1850') || p.includes('1.850') || p.includes('1,850')) return 'Custom Aplikacija (od 1.850 €)';
  if (p.includes('690') || p.includes('start')) return 'Start (690 €/mj.)';
  if (p.includes('1250') || p.includes('1.250') || p.includes('1,250') || p.includes('plus') || p.includes('pro')) return 'Plus (1.250 €/mj.)';
  if (p.includes('2150') || p.includes('2.150') || p.includes('2,150') || p.includes('ultra') || p.includes('ai')) return 'Pro / AI (2.150 €/mj.)';
  if (p.includes('audit') || p.includes('savjetovanj')) return 'Besplatan Audit (0 €)';
  if (p.includes('instagram') || p.includes('oglas')) return 'Ciljani Instagram Oglas';
  if (p.includes('procjena') && p.includes('web')) return 'Izrada Weba (Besplatna Procjena)';
  if (p.includes('redizajn') || p.includes('procjena')) return 'Procjena Projekta / Redizajn';
  return pkg.replace(/,/g, '.').trim() || 'Custom Paket';
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
                Hvala vam na javljanju! Vaš upit je uspješno zaprimljen u naš sustav. Naš tim će detaljno pregledati vaše zahtjeve i javiti vam se u najkraćem mogućem roku (unutar <strong>2 radna sata</strong>).
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
    const { name, company, email, phone, package: pkg, calendarSlot, source, device } = req.body;
    const estimatedValue = getEstimatedDealValue(pkg);
    
    // 1. Save to CSV backup
    saveInquiryToCSV({ name, company, email, phone, package: pkg, calendarSlot, source, device, estimatedValue });

    // 2. Save directly to Notion database
    try {
      await saveInquiryToNotion({ name, company, email, phone, package: pkg, calendarSlot, source, device, estimatedValue });
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

// System instruction and knowledge base for Algor AI
const ALGOR_AI_SYSTEM_INSTRUCTION = `
Vi ste Algor AI, 24/7 inteligentni marketing i prodajni AI agent (AI Lead Engine) tvrtke Algor Studio.

GLAVNI FOKUS I STROGO PRAVILO:
1. STROGO ZABRANJENO NUDITI IZRADO WEBA U PRVOJ PORUCI! Glavni cilj je prodaja i ugovaranje sastanka za **Pro Marketing Paket** (Meta & Google Ads kampanje, 360° marketing, akvizicija klijenata) te **Besplatan Marketing & Prodajni Audit**.
2. TRENUTNA KONVERZIJA: Čim klijent pritisne brzi gumb ili izrazi interes za marketing, audit ili sastanak, Algor AI MORA ODMAH zatražiti podatke u jednoj poruci!

PRAVILA STILA I DUŽINE ODGOVORA:
1. POTPUNI ODGOVORI: Svaki odgovor mora biti u potpunosti dovršen s točkom na kraju. Nikada nemojte stati usred riječi ili rečenice.
2. KRATKO I DIREKTNO (2 do 4 retka teksta): Budite brzi i prodajno usmjereni.
3. TREĆE LICE: O tvrtki i rezultatima govorite ISKLJUČIVO u trećem licu ("Algor Studio osigurava...", "Pro paket donosi..."). Za sebe koristite "Algor AI".

PRIMJER BRZOG PRODAJNOG ODGOVORA ZA PRO PAKET:
"Odlično! Za ugovaranje sastanka oko Pro Marketing Paketa i besplatnog audita, ostavite mi u jednoj poruci:
1. Vaše ime i prezime
2. Naziv tvrtke ili web stranicu
3. E-mail adresu i željeni datum/vrijeme (Uživo ili Google Meet).
Algor AI odmah rezervira Vaš termin i šalje potvrdu!"

AUTOMATSKO SPREMANJE U NOTION (TAJNI MARKER):
Kada klijent dostavi Ime, Tvrtku, Email, Vrstu sastanka (Uživo ili Google Meet) i Datum/Vrijeme, na KRAJU vašeg odgovora priložite tajni JSON marker:
[[LEAD_DATA: {"name": "...", "company": "...", "email": "...", "phone": "...", "meetingType": "Uživo ili Google Meet", "dateTime": "..."}]]

O ALGOR STUDIJU & PAKETIMA:
- Glavni fokus: **Pro Paket** (1.250 €/mj) – Meta & Google Ads kampanje, WhatsApp podrška 24/5, akvizicija kupaca i kompletno vođenje marketinga. Uključen besplatan marketing audit.
- Ostali paketi: Start (690 €/mj), Ultra (2.150 €/mj).
`;

// API endpoint for Algor AI Chatbot & Appointment Booking
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, leadData } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY nije konfiguriran u .env datoteci.' });
    }

    // Direct Lead / Booking submission fallback
    if (leadData && (leadData.name || leadData.email)) {
      const { name, company, email, phone, package: pkg, calendarSlot, source, device } = leadData;
      const estimatedValue = getEstimatedDealValue(pkg || 'Besplatan Audit (0 €)');

      saveInquiryToCSV({
        name,
        company,
        email,
        phone: phone || 'Nije naveden',
        package: pkg || 'Sastanak (Algor AI)',
        calendarSlot: calendarSlot || 'Ugovoreno u chatu s Algor AI',
        source: source || 'Algor AI Conversational Lead',
        device: device || 'Web Widget',
        estimatedValue
      });

      try {
        await saveInquiryToNotion({
          name,
          company,
          email,
          phone: phone || 'Nije naveden',
          package: pkg || 'Sastanak (Algor AI)',
          calendarSlot: calendarSlot || 'Ugovoreno u chatu s Algor AI',
          source: source || 'Algor AI Conversational Lead',
          device: device || 'Web Widget',
          estimatedValue
        });
      } catch (notionErr) {
        console.error('Algor AI Notion error:', notionErr.message);
      }

      try {
        if (email) {
          await sendClientConfirmationEmail({
            name,
            company,
            email,
            phone: phone || 'Nije naveden',
            package: pkg || 'Sastanak & Besplatan Audit (Algor AI)',
            calendarSlot: calendarSlot || 'Ugovoreno u realnom vremenu putem Algor AI agenta'
          });
        }
      } catch (emailErr) {
        console.error('Algor AI email confirmation error:', emailErr.message);
      }

      return res.json({
        success: true,
        bookingConfirmed: true,
        reply: `Odlično, ${name}! Algor AI je zabilježio vaš zahtjev za sastankom u Notion bazi. Potvrda je poslana na ${email}. Tim Algor Studija će vas kontaktirati ubrzo.`
      });
    }

    // Gemini 3.6 Flash API conversation
    const formattedContents = [];
    if (Array.isArray(messages)) {
      messages.forEach(msg => {
        formattedContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content || msg.text || '' }]
        });
      });
    }

    if (formattedContents.length === 0) {
      formattedContents.push({
        role: 'user',
        parts: [{ text: 'Pozdrav' }]
      });
    }

    const requestBody = {
      systemInstruction: {
        parts: [{ text: ALGOR_AI_SYSTEM_INSTRUCTION }]
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.5,
        maxOutputTokens: 1200
      }
    };

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash-lite',
      'gemini-3.6-flash'
    ];

    let geminiData = null;
    let lastErrorMsg = '';

    for (const model of modelsToTry) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const resAttempt = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        const dataAttempt = await resAttempt.json();
        if (resAttempt.ok && dataAttempt.candidates && dataAttempt.candidates.length > 0) {
          geminiData = dataAttempt;
          break;
        } else {
          lastErrorMsg = dataAttempt.error?.message || 'Quota limit';
        }
      } catch (mErr) {
        lastErrorMsg = mErr.message;
      }
    }

    let aiReplyText = '';
    if (geminiData && geminiData.candidates && geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      aiReplyText = geminiData.candidates[0].content.parts[0].text;
    } else {
      aiReplyText = 'Odlično! Algor Studio u sklopu Pro Marketing Paketa osigurava kompletne Meta & Google Ads kampanje, akviziciju klijenata i WhatsApp podršku 24/5. Želite li sastanak uživo ili Google Meet poziv?';
    }

    // Conversational Lead extraction & Notion sync
    let leadMatch = aiReplyText.match(/\[\[LEAD_DATA:\s*(\{.*?\})\s*\]\]/s);
    let parsedLead = null;

    if (leadMatch && leadMatch[1]) {
      try {
        parsedLead = JSON.parse(leadMatch[1]);
      } catch (pErr) {
        console.error('Greška pri parsiranju JSON leada:', pErr.message);
      }
      aiReplyText = aiReplyText.replace(/\[\[LEAD_DATA:\s*\{.*?\}\s*\]\]/s, '').trim();
    }

    // Fallback extraction from last user message
    if (!parsedLead && Array.isArray(messages) && messages.length > 0) {
      const lastUserMsg = messages.filter(m => m.role === 'user').pop();
      if (lastUserMsg && lastUserMsg.content) {
        const text = lastUserMsg.content;
        const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
        if (emailMatch) {
          const email = emailMatch[0];
          const isLive = /uživo|lokacij|zagreb/i.test(text);
          const meetingType = isLive ? 'Sastanak uživo' : 'Google Meet poziv';
          
          parsedLead = {
            name: text.match(/(?:ime je|sam|pozrav,?\s*)([A-ZČĆŠĐŽa-zčćšđž]+\s+[A-ZČĆŠĐŽa-zčćšđž]+)/i)?.[1] || 'Klijent s weba',
            company: text.match(/(?:tvrtka|web|d\.o\.o\.|j\.d\.o\.o\.|craft|studio)\s*:?\s*([A-ZČĆŠĐŽa-zčćšđž0-9\s.]+)/i)?.[1] || 'Nije navedeno',
            email: email,
            phone: text.match(/\+?\d[\d\s-]{7,}\d/)?.[0] || 'Nije naveden',
            meetingType: meetingType,
            dateTime: text.match(/(?:u|dana|datum)?\s*([0-9]{1,2}[\.\/][0-9]{1,2}|ponedjeljak|utorak|srijeda|četvrtak|petak|subota|nedjelja|\b\d{1,2}:\d{2}\b)/i)?.[0] || 'Po dogovoru'
          };
        }
      }
    }

    if (parsedLead && parsedLead.email) {
      const name = parsedLead.name || 'Klijent';
      const company = parsedLead.company || 'Nije navedeno';
      const email = parsedLead.email;
      const phone = parsedLead.phone || 'Nije naveden';
      const meetingType = parsedLead.meetingType || 'Google Meet';
      const dateTime = parsedLead.dateTime || 'Po dogovoru';
      const pkg = `Sastanak: ${meetingType} (${dateTime})`;
      const calendarSlot = `${meetingType} — ${dateTime}`;

      saveInquiryToCSV({
        name, company, email, phone, package: pkg, calendarSlot, source: 'Algor AI Conversational Lead', device: 'Web Chat', estimatedValue: 0
      });

      try {
        await saveInquiryToNotion({
          name, company, email, phone, package: pkg, calendarSlot, source: 'Algor AI Conversational Lead', device: 'Web Chat', estimatedValue: 0
        });
        console.log(`✓ Conversational Lead usmjeren u Notion: ${name} (${email}) | ${meetingType} ${dateTime}`);
      } catch (nErr) {
        console.error('Notion error:', nErr.message);
      }

      try {
        await sendClientConfirmationEmail({
          name, company, email, phone, package: pkg, calendarSlot
        });
      } catch (eErr) {
        console.error('Mail error:', eErr.message);
      }
    }

    res.json({ success: true, reply: aiReplyText });
  } catch (err) {
    console.error('Greška na /api/chat ruti:', err);
    res.status(500).json({ error: 'Došlo je do neočekivane greške.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
