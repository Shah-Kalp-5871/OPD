const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/opd/reception/dashboard/');
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.tabulator-header', { timeout: 10000 });

  // Let's get the bounding box of the first column
  const col = await page.locator('.tabulator-col').first();
  const colBox = await col.boundingBox();
  console.log('Column 1 Bounding Box:', colBox);

  // Let's check if the resize handle exists
  const handle = col.locator('.tabulator-col-resize-handle');
  const count = await handle.count();
  console.log('Resize handle count in column 1:', count);

  if (count > 0) {
    const handleBox = await handle.boundingBox();
    console.log('Resize handle Bounding Box:', handleBox);
    const display = await handle.evaluate((el) => window.getComputedStyle(el).display);
    const zIndex = await handle.evaluate((el) => window.getComputedStyle(el).zIndex);
    const position = await handle.evaluate((el) => window.getComputedStyle(el).position);
    console.log('Handle styles:', { display, zIndex, position });
  }

  await browser.close();
})();
