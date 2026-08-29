const puppeteer = require('puppeteer');

(async () => {
  // Poll until server is ready
  let ready = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:3000');
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }

  if (!ready) {
    console.error('Server not ready');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.stack || err.message));

  const targetUrl = 'http://localhost:3000/p/3cb4b57f-e15a-810d-b368-e2f729f90697';
  console.log('Navigating to:', targetUrl);
  await page.goto(targetUrl, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'scratch/detail_page_fixed.png' });
  console.log('Detail screenshot captured!');

  await browser.close();
})();
