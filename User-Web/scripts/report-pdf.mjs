// Print an HTML QA report to a self-contained PDF (images embedded) for sharing, e.g. on Google Drive.
// Usage: node scripts/report-pdf.mjs <report.html> [out.pdf]
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.USER_WEB_PLAYWRIGHT_PATH || path.join(ROOT, '..', 'Admin-Web', 'node_modules', 'playwright'));
const src = path.resolve(process.argv[2]);
const out = path.resolve(process.argv[3] || src.replace(/\.html?$/i, '.pdf'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
await page.emulateMedia({ media: 'screen', colorScheme: 'light' });
await page.goto(pathToFileURL(src).href, { waitUntil: 'load' });
await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
await page.addStyleTag({ content: 'img{max-width:100%!important;break-inside:avoid;page-break-inside:avoid} figure,article,tr{break-inside:avoid} *{-webkit-print-color-adjust:exact;print-color-adjust:exact}' });
const img = await page.evaluate(async () => { const a = [...document.images]; await Promise.all(a.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); return { total: a.length, broken: a.filter(i => !i.naturalWidth).length }; });
await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
  displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8px;width:100%;text-align:center;color:#888">Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
await browser.close();
console.log(JSON.stringify({ out, images: img }));
