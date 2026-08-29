const puppeteer = require('puppeteer');

(async () => {
  console.log('Waiting for Next.js server to be ready on port 3000...');
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:3000');
      if (res.status < 500) {
        ready = true;
        console.log('Next.js server is ready!');
        break;
      }
    } catch {}
    await new Promise(r => setTimeout(r, 400));
  }

  if (!ready) {
    console.error('Server timed out');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 1.5 });

  const routes = ['/', '/archive', '/lab', '/pause', '/changelog', '/aievolutionlog'];
  for (const r of routes) {
    const url = 'http://localhost:3000' + r;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(res => setTimeout(res, 300));
    const title = await page.title();
    console.log(`✅ [${r}] loaded successfully. Title: ${title}`);
  }

  await browser.close();
})();
