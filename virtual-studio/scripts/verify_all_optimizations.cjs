const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 1.5 });

    // 1. Screenshot Lab subpage
    await page.goto('http://localhost:3000/lab', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'scratch/verified_subpage_lab.png' });
    console.log('✅ Lab subpage verified');

    // 2. Screenshot Pause subpage
    await page.goto('http://localhost:3000/pause', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'scratch/verified_subpage_pause.png' });
    console.log('✅ Pause subpage verified');

    // 3. Screenshot Changelog subpage
    await page.goto('http://localhost:3000/changelog', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'scratch/verified_subpage_changelog.png' });
    console.log('✅ Changelog subpage verified');

    // 4. Screenshot Detail page fallback
    await page.goto('http://localhost:3000/p/3cb4b57f-e15a-810d-b368-e2f729f90697', { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'scratch/verified_detail_page.png' });
    console.log('✅ Detail page verified');

    await browser.close();
  } catch (err) {
    console.log('Verification error:', err.message);
  }
})();
