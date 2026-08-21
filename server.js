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

// Helper function to save inquiry to Notion database
async function saveInquiryToNotion(data) {
  if (!notion || !process.env.NOTION_DATABASE_ID) {
    console.warn('Notion API credentials missing, skipping Notion save.');
    return;
  }

  const titleContent = `${data.name || 'Novi upit'} • ${data.package || 'Web upit'}`;
  const properties = {
    'Name': {
      title: [{ text: { content: titleContent } }]
    },
    'Ime': {
      rich_text: [{ text: { content: data.name || '-' } }]
    },
    'Email': {
      email: data.email || null
    },
    'Projekt': {
      rich_text: [{ text: { content: `${data.package || 'Opći upit'} • ${data.company || '-'}` } }]
    },
    'Poruka': {
      rich_text: [{ text: { content: `Mobitel: ${data.phone || '-'} | Napomena: ${data.calendarSlot || 'Izravan upit'}` } }]
    },
    'Datum': {
      date: { start: new Date().toISOString().split('T')[0] }
    },
    'Status': {
      status: { name: 'Novi upit' }
    }
  };

  const children = [];
  if (data.company || data.phone || data.calendarSlot) {
    children.push({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: { content: `Ime: ${data.name || '-'}\nTvrtka: ${data.company || '-'}\nEmail: ${data.email || '-'}\nMobitel: ${data.phone || '-'}\nPaket: ${data.package || '-'}\nNapomena: ${data.calendarSlot || '-'}` }
          }
        ]
      }
    });
  }

  await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID },
    properties,
    children: children.length > 0 ? children : undefined
  });
}

// API endpoint to submit inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const { name, company, email, phone, package: pkg, calendarSlot } = req.body;
    
    // Save to CSV backup
    saveInquiryToCSV({ name, company, email, phone, package: pkg, calendarSlot });

    // Save to Notion
    try {
      await saveInquiryToNotion({ name, company, email, phone, package: pkg, calendarSlot });
      console.log('Upit uspješno poslan u Notion za:', name);
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
