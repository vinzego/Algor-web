require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { Client } = require('@notionhq/client');

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

// Helper function to append to CSV with UTF-8 BOM for Microsoft Excel compatibility
function saveInquiryToCSV(data) {
  const fileExists = fs.existsSync(CSV_FILE);
  const header = 'Datum i Vrijeme,Ime i Prezime,Tvrtka ili Web,E-mail,Mobitel,Odabrani Paket,Termin u Kalendaru\n';
  
  const timestamp = new Date().toLocaleString('hr-HR', { timeZone: 'Europe/Zagreb' });
  const escapeCsv = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;
  
  const row = [
    escapeCsv(timestamp),
    escapeCsv(data.name),
    escapeCsv(data.company),
    escapeCsv(data.email),
    escapeCsv(data.phone),
    escapeCsv(data.package),
    escapeCsv(data.calendarSlot || 'Nije odabrano')
  ].join(',') + '\n';

  if (!fileExists) {
    fs.writeFileSync(CSV_FILE, '\uFEFF' + header + row, 'utf8');
  } else {
    fs.appendFileSync(CSV_FILE, row, 'utf8');
  }
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
              content: `📋 Detalji upita s weba:\n• Ime i prezime: ${data.name || '-'}\n• Tvrtka / Web: ${data.company || '-'}\n• Email: ${data.email || '-'}\n• Mobitel: ${data.phone || '-'}\n• Odabrani paket: ${data.package || '-'}\n• Napomena / poruka: ${data.calendarSlot || 'Nema napomene'}`
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

// API endpoint to submit inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, email, phone, package: pkg, calendarSlot } = req.body;
    
    // 1. Save to CSV backup
    saveInquiryToCSV({ name, company, email, phone, package: pkg, calendarSlot });

    // 2. Save directly to Notion database
    try {
      await saveInquiryToNotion({ name, company, email, phone, package: pkg, calendarSlot });
      console.log(`✓ Upit uspješno poslan u Notion [Algor upiti] za: ${name}`);
    } catch (notionErr) {
      console.error('Greška pri spremanju u Notion:', notionErr.message);
    }

    res.json({ success: true, message: 'Upit je uspješno spremljen u CSV i Notion!' });
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
