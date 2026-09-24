const fs = require('fs');
const path = require('path');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const root = path.join(__dirname, '..');
const files = walk(root).filter(f => f.endsWith('.html') && !f.includes('node_modules') && !f.includes('.git'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/(href|src)=["']([^"']+\.(?:css|js))\?v=[\d\.]+["']/g, '$1="$2?v=300.0.0"');
  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated version in:', path.relative(root, f));
});
