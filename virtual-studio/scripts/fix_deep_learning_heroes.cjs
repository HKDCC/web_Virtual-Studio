const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 675, deviceScaleFactor: 2 });

  const htmlContent = fs.readFileSync('public/articles/【读书笔记】Deep Learning_深度学习_OX Alpha.html', 'utf8');
  await page.setContent(htmlContent, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 600));

  // 1. Light Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: 'public/notes_heroes/3cb4b57f-e15a-816c-8841-f8ddbacd47c8_light.png', clip: { x: 0, y: 0, width: 1200, height: 675 } });
  console.log('✅ Generated Deep Learning Light Hero!');

  // 2. Dark Mode
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: 'public/notes_heroes/3cb4b57f-e15a-816c-8841-f8ddbacd47c8_dark.png', clip: { x: 0, y: 0, width: 1200, height: 675 } });
  console.log('✅ Generated Deep Learning Dark Hero!');

  await browser.close();
})();
