const fs = require('fs');
const path = require('path');

const forbiddenNames = new Set(['server.js', 'design.md']);
const forbiddenExtensions = new Set(['.env', '.csv', '.log', '.md', '.map']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function runChecks(directory = path.join(__dirname, '..', 'public')) {
  const errors = [];
  const files = walk(directory);

  for (const file of files) {
    const relative = path.relative(directory, file);
    const extension = path.extname(file).toLowerCase();
    if (forbiddenNames.has(relative.toLowerCase()) || forbiddenExtensions.has(extension)) {
      errors.push(`${relative}: interna ili osjetljiva datoteka ne smije biti javna`);
      continue;
    }

    if (!['.html', '.js'].includes(extension)) continue;
    const contents = fs.readFileSync(file, 'utf8');
    if (extension === '.html' && /\son[a-z]+\s*=/i.test(contents)) {
      errors.push(`${relative}: inline event handler nije dopušten CSP pravilima`);
    }
    if (extension === '.js' && /\beval\s*\(|\bnew\s+Function\s*\(/.test(contents)) {
      errors.push(`${relative}: dinamičko izvršavanje koda nije dopušteno`);
    }
    if (extension === '.html') {
      if (!/<html\b[^>]*\blang=/i.test(contents)) errors.push(`${relative}: nedostaje html lang`);
      if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(contents)) errors.push(`${relative}: nedostaje viewport`);
      if (!/<title>[\s\S]*?<\/title>/i.test(contents)) errors.push(`${relative}: nedostaje title`);

      const ids = [...contents.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length) errors.push(`${relative}: ponovljeni id atributi: ${[...new Set(duplicates)].join(', ')}`);
    }
  }

  if (errors.length) {
    throw new Error(`Provjera nije prošla:\n- ${errors.join('\n- ')}`);
  }
  console.log(`Provjera prošla: ${files.length} javnih datoteka.`);
}

if (require.main === module) runChecks();

module.exports = { runChecks };
