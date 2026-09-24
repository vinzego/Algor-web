process.env.NODE_ENV = 'production';
process.env.NOTION_TOKEN ||= 'smoke-test-token';
process.env.NOTION_DATABASE_ID ||= 'smoke-test-database';

const app = require('../server');

const routes = [
  '/', '/kontakt', '/kontakt/hvala', '/izrada-web-stranica', '/chatgpt-ads', '/karijere',
  '/politika-privatnosti', '/uvjeti-koristenja', '/kolacici',
  '/admiral-studija-slucaja', '/family-park-studija-slucaja',
  '/eschengarten-studija-slucaja', '/supernova-studija-slucaja', '/hvala',
  '/robots.txt', '/sitemap.xml', '/style.css', '/Algor-theme.css', '/script.js'
];

async function smokeTest() {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  try {
    for (const route of routes) {
      const response = await fetch(`${baseUrl}${route}`);
      if (!response.ok) throw new Error(`${route} returned ${response.status}`);
    }

    const home = await fetch(baseUrl);
    const requiredHeaders = [
      'content-security-policy', 'strict-transport-security', 'x-content-type-options',
      'x-frame-options', 'referrer-policy', 'permissions-policy'
    ];
    for (const header of requiredHeaders) {
      if (!home.headers.has(header)) throw new Error(`Missing security header: ${header}`);
    }

    for (const privatePath of ['/server.js', '/design.md', '/data/upiti.csv', '/.env']) {
      const response = await fetch(`${baseUrl}${privatePath}`);
      if (response.status !== 404) throw new Error(`${privatePath} must return 404`);
    }

    const crossOrigin = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://untrusted.invalid' },
      body: '{}'
    });
    if (crossOrigin.status !== 403) throw new Error(`Cross-origin form request returned ${crossOrigin.status}`);

    const invalidForm = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{}'
    });
    if (invalidForm.status !== 400) throw new Error(`Invalid form request returned ${invalidForm.status}`);

    console.log(`Smoke test prošao: ${routes.length} javnih ruta i sigurnosne kontrole.`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}

smokeTest().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
