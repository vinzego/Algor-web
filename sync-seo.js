require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('@notionhq/client');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_SEO_DATABASE_ID;

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error('ERROR: NOTION_TOKEN or NOTION_SEO_DATABASE_ID is missing in .env file.');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

// Helper to extract text from Notion page properties (Rich Text/Title)
function getPlainText(property) {
  if (!property) return '';
  if (property.type === 'title') {
    return property.title.map(t => t.plain_text).join('');
  }
  if (property.type === 'rich_text') {
    return property.rich_text.map(t => t.plain_text).join('');
  }
  return '';
}

// Helper to inject tag before </head> if not exists, or replace if exists
function injectOrReplaceMeta(content, regex, newTag) {
  if (regex.test(content)) {
    return content.replace(regex, newTag);
  } else {
    return content.replace(/<\/head>/i, `  ${newTag}\n</head>`);
  }
}

// Helper to download an image and save it locally
async function downloadImage(url, pageKey) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const buffer = Buffer.from(await res.arrayBuffer());
    
    // Extract file extension cleanly
    const cleanUrl = url.split('?')[0];
    let ext = path.extname(cleanUrl).toLowerCase();
    if (!ext || ext.length > 5) ext = '.jpg'; // Fallback

    const relativeDir = path.join('images', 'seo');
    const localDir = path.join(__dirname, 'public', relativeDir);
    
    // Ensure directory exists
    fs.mkdirSync(localDir, { recursive: true });

    const fileName = `${pageKey}${ext}`;
    const localPath = path.join(localDir, fileName);
    fs.writeFileSync(localPath, buffer);

    console.log(`✓ Downloaded OG Image to: /${relativeDir}/${fileName}`);
    return `/${relativeDir}/${fileName}`;
  } catch (err) {
    console.error(`⚠ Failed to download image for "${pageKey}":`, err.message);
    return null;
  }
}

async function syncSEO() {
  try {
    console.log('Retrieving database structure from Notion...');
    const db = await notion.databases.retrieve({ database_id: DATABASE_ID });
    
    if (!db.data_sources || db.data_sources.length === 0) {
      throw new Error('No data sources found for this database.');
    }

    const dataSourceId = db.data_sources[0].id;
    console.log(`Querying data source (ID: ${dataSourceId}) associated with database...`);
    
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
    });

    console.log(`Found ${response.results.length} pages in database.`);

    for (const page of response.results) {
      const props = page.properties;

      // Extract basic page key
      const pageKeyProp = props['Name'] || props['Stranica'];
      const pageKey = getPlainText(pageKeyProp).trim();

      if (!pageKey) {
        console.warn('Skipping Notion entry: Page name property is empty.');
        continue;
      }

      // Extract all SEO properties
      const title = getPlainText(props['Naslov (title tag)'] || props['Naslov (Title Tag)']).trim();
      const description = getPlainText(props['Opis (Meta Description)']).trim();
      const keywords = getPlainText(props['Ključne riječi'] || props['Ključne riječi (Keywords)']).trim();
      
      const ogTitle = getPlainText(props['OG Title']).trim();
      const ogDesc = getPlainText(props['OG Description']).trim();
      const canonical = getPlainText(props['Canonical URL']).trim();

      // Extract Robots select property (convert index-follow to index, follow)
      let robots = '';
      if (props['Robots'] && props['Robots'].select && props['Robots'].select.name) {
        robots = props['Robots'].select.name.replace(/-/g, ', ');
      }

      // Extract OG Image from files property
      let ogImg = '';
      if (props['OG Image'] && props['OG Image'].files && props['OG Image'].files.length > 0) {
        const fileObj = props['OG Image'].files[0];
        const imageUrl = fileObj.file ? fileObj.file.url : fileObj.external?.url;
        
        if (imageUrl) {
          console.log(`Downloading OG Image for "${pageKey}"...`);
          const savedPath = await downloadImage(imageUrl, pageKey);
          if (savedPath) {
            ogImg = savedPath;
          }
        }
      }

      console.log(`Processing SEO for page key: "${pageKey}"...`);

      // Define possible paths for HTML files
      const filePaths = [
        path.join(__dirname, `${pageKey}.html`),
        path.join(__dirname, 'public', `${pageKey}.html`)
      ];

      let updatedCount = 0;

      for (const filePath of filePaths) {
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');

        // 1. Update Title tag
        if (title) {
          const titleRegex = /<title>[\s\S]*?<\/title>/i;
          if (titleRegex.test(content)) {
            content = content.replace(titleRegex, `<title>${title}</title>`);
          } else {
            content = content.replace(/<head>/i, `<head>\n  <title>${title}</title>`);
          }
        }

        // 2. Update Description meta tag
        if (description) {
          const descRegex = /<meta\s+[^>]*name=["']description["'][^>]*>/i;
          const newDescTag = `<meta name="description" content="${description}">`;
          content = injectOrReplaceMeta(content, descRegex, newDescTag);
        }

        // 3. Update Keywords meta tag
        if (keywords) {
          const keywRegex = /<meta\s+[^>]*name=["']keywords["'][^>]*>/i;
          const newKeywTag = `<meta name="keywords" content="${keywords}">`;
          content = injectOrReplaceMeta(content, keywRegex, newKeywTag);
        }

        // 4. Update Robots meta tag
        if (robots) {
          const robotsRegex = /<meta\s+[^>]*name=["']robots["'][^>]*>/i;
          const newRobotsTag = `<meta name="robots" content="${robots}">`;
          content = injectOrReplaceMeta(content, robotsRegex, newRobotsTag);
        }

        // 5. Update Canonical Link tag
        if (canonical) {
          const canonicalRegex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
          const newCanonicalTag = `<link rel="canonical" href="${canonical}">`;
          if (canonicalRegex.test(content)) {
            content = content.replace(canonicalRegex, newCanonicalTag);
          } else {
            content = content.replace(/<\/head>/i, `  ${newCanonicalTag}\n</head>`);
          }
        }

        // 6. Update OG Title
        if (ogTitle) {
          const ogTitleRegex = /<meta\s+[^>]*property=["']og:title["'][^>]*>/i;
          const twTitleRegex = /<meta\s+[^>]*name=["']twitter:title["'][^>]*>/i;
          content = injectOrReplaceMeta(content, ogTitleRegex, `<meta property="og:title" content="${ogTitle}">`);
          content = injectOrReplaceMeta(content, twTitleRegex, `<meta name="twitter:title" content="${ogTitle}">`);
        }

        // 7. Update OG Description
        if (ogDesc) {
          const ogDescRegex = /<meta\s+[^>]*property=["']og:description["'][^>]*>/i;
          const twDescRegex = /<meta\s+[^>]*name=["']twitter:description["'][^>]*>/i;
          content = injectOrReplaceMeta(content, ogDescRegex, `<meta property="og:description" content="${ogDesc}">`);
          content = injectOrReplaceMeta(content, twDescRegex, `<meta name="twitter:description" content="${ogDesc}">`);
        }

        // 8. Update OG Image URL
        if (ogImg) {
          // Use absolute path for social media metadata if domain is available, 
          // or fallback to local path (social crawlers prefer full URLs but local paths work relative to crawler host sometimes)
          const ogImgRegex = /<meta\s+[^>]*property=["']og:image["'][^>]*>/i;
          const twImgRegex = /<meta\s+[^>]*name=["']twitter:image["'][^>]*>/i;
          const twCardRegex = /<meta\s+[^>]*name=["']twitter:card["'][^>]*>/i;
          content = injectOrReplaceMeta(content, ogImgRegex, `<meta property="og:image" content="${ogImg}">`);
          content = injectOrReplaceMeta(content, twImgRegex, `<meta name="twitter:image" content="${ogImg}">`);
          content = injectOrReplaceMeta(content, twCardRegex, `<meta name="twitter:card" content="summary_large_image">`);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        updatedCount++;
      }

      if (updatedCount > 0) {
        console.log(`✓ Updated ${updatedCount} file(s) for "${pageKey}"`);
      } else {
        console.warn(`⚠ No local HTML file found matching "${pageKey}.html"`);
      }
    }

    console.log('SEO sync completed successfully!');
  } catch (error) {
    console.error('Error during SEO sync:', error.message);
  }
}

syncSEO();
