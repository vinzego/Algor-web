const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const { minify: minifyJs } = require('terser');
const CleanCSS = require('clean-css');
const { runChecks } = require('./check');

const root = path.join(__dirname, '..');
const source = path.join(root, 'public');
const destination = path.join(root, 'dist');
const excludedNames = new Set(['server.js', 'design.md']);
const excludedExtensions = new Set(['.md', '.map', '.log', '.csv', '.env']);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

async function build() {
  runChecks(source);
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(destination, { recursive: true });

  let sourceBytes = 0;
  let outputBytes = 0;
  for (const file of walk(source)) {
    const relative = path.relative(source, file);
    const extension = path.extname(file).toLowerCase();
    if (excludedNames.has(relative.toLowerCase()) || excludedExtensions.has(extension)) continue;

    const output = path.join(destination, relative);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    sourceBytes += fs.statSync(file).size;

    if (extension === '.html') {
      const html = fs.readFileSync(file, 'utf8');
      const result = await minifyHtml(html, {
        collapseWhitespace: 'conservative',
        conservativeCollapse: true,
        removeComments: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true
      });
      fs.writeFileSync(output, result);
    } else if (extension === '.css') {
      const result = new CleanCSS({ level: 2 }).minify(fs.readFileSync(file, 'utf8'));
      if (result.errors.length) throw new Error(result.errors.join('\n'));
      fs.writeFileSync(output, result.styles);
    } else if (extension === '.js') {
      const result = await minifyJs(fs.readFileSync(file, 'utf8'), {
        compress: true,
        mangle: true,
        format: { comments: false }
      });
      if (!result.code) throw new Error(`Minifikacija nije proizvela izlaz za ${relative}`);
      fs.writeFileSync(output, result.code);
    } else {
      fs.copyFileSync(file, output);
    }
    outputBytes += fs.statSync(output).size;
  }

  runChecks(destination);
  const saving = sourceBytes ? Math.round((1 - outputBytes / sourceBytes) * 100) : 0;
  console.log(`Produkcijski build završen: dist/ (${saving}% manje bajtova).`);
}

build().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
