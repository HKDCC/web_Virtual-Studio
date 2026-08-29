const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateSplitHero(htmlFilePath, outputPngPath) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 675, deviceScaleFactor: 2 });

  const resolvedHtmlPath = path.resolve(htmlFilePath).replace(/\\/g, '/');
  const fileUrl = 'file:///' + resolvedHtmlPath;

  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // 1. Capture Light Mode Left Half (0..600)
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  });
  await new Promise(r => setTimeout(r, 200));
  const lightBase64 = await page.screenshot({
    encoding: 'base64',
    clip: { x: 0, y: 0, width: 1200, height: 675 }
  });

  // 2. Capture Dark Mode Right Half (600..1200)
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 200));
  const darkBase64 = await page.screenshot({
    encoding: 'base64',
    clip: { x: 0, y: 0, width: 1200, height: 675 }
  });

  // 3. Composite on Canvas
  const composeHtml = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#000;">
      <canvas id="c" width="2400" height="1350" style="width:1200px;height:675px;display:block;"></canvas>
      <script>
        const canvas = document.getElementById('c');
        const ctx = canvas.getContext('2d');

        const imgL = new Image();
        const imgD = new Image();

        let loaded = 0;
        function check() {
          loaded++;
          if (loaded === 2) {
            // Draw left half from Light image (0..1200 on 2x canvas)
            ctx.drawImage(imgL, 0, 0, 1200, 1350, 0, 0, 1200, 1350);
            // Draw right half from Dark image (1200..2400 on 2x canvas)
            ctx.drawImage(imgD, 1200, 0, 1200, 1350, 1200, 0, 1200, 1350);
            window.__READY = true;
          }
        }

        imgL.onload = check;
        imgD.onload = check;

        imgL.src = "data:image/png;base64,${lightBase64}";
        imgD.src = "data:image/png;base64,${darkBase64}";
      </script>
    </body>
    </html>
  `;

  await page.setContent(composeHtml);
  await page.waitForFunction(() => window.__READY === true);

  fs.mkdirSync(path.dirname(outputPngPath), { recursive: true });
  await page.screenshot({
    path: outputPngPath,
    clip: { x: 0, y: 0, width: 1200, height: 675 }
  });

  console.log(`🎉 Successfully generated dual-theme split hero: ${outputPngPath}`);
  await browser.close();
}

generateSplitHero(
  'public/articles/getting-to-yes-谈判力-glm-5.3.html',
  'public/notes_heroes/getting_to_yes_split.png'
).catch(console.error);
