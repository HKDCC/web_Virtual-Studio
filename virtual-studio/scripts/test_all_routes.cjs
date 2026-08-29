const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 1.5 });

  const routes = ['/', '/archive', '/lab', '/pause', '/changelog', '/aievolutionlog'];
  for (const r of routes) {
    const url = 'http://localhost:3000' + r;
    console.log('Testing route:', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
    await new Promise(res => setTimeout(res, 500));
    const title = await page.title();
    console.log(`✅ [${r}] loaded successfully. Title: ${title}`);
  }

  await browser.close();
})();
