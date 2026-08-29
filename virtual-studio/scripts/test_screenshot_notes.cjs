const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1600, deviceScaleFactor: 1.5 });
    
    // 1. Screenshot Notes section in Light Mode
    await page.goto('http://localhost:3000/#notes', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await new Promise(r => setTimeout(r, 500));
    
    const notesElem = await page.$('#notes');
    if (notesElem) {
      await notesElem.screenshot({ path: 'scratch/notes_grid_light.png' });
    }

    // 2. Screenshot Notes section in Dark Mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await new Promise(r => setTimeout(r, 500));
    if (notesElem) {
      await notesElem.screenshot({ path: 'scratch/notes_grid_dark.png' });
    }

    console.log('🎉 Light & Dark mode screenshots captured successfully!');
    await browser.close();
  } catch (err) {
    console.log('Puppeteer error:', err.message);
  }
})();
