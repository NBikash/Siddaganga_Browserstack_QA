import 'dotenv/config';
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const URL = process.env.ADMIN_WEB_URL
  || 'https://dari-dev.siddagangatravels.com/dashboard/client-management/contracted-clients';
export const CDP_PORT = Number(process.env.ADMIN_WEB_CDP_PORT || 9333);
export const PROFILE_DIR = path.join(ROOT, '.auth', 'profile');
export const STATE_FILE = path.join(ROOT, '.auth', 'state.json');

// Attach to the browser started by browser.mjs (keeps the authenticated session alive between steps).
export async function connect() {
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const context = browser.contexts()[0];
  // ADMIN_WEB_NEW_PAGE=1 gives each process its own tab (parallel read-only inspection shards share the session).
  const page = process.env.ADMIN_WEB_NEW_PAGE ? await context.newPage()
    : context.pages().find(p => !p.url().startsWith('chrome')) || context.pages()[0] || await context.newPage();
  if (process.env.ADMIN_WEB_NEW_PAGE) await page.setViewportSize({ width: 1440, height: 900 });
  return { browser, context, page };
}

const PII = /[\w.+-]+@[\w-]+\.[\w.]+|(?:\+?91[\s-]?)?[6-9]\d{9}\b/;

// Screenshot into screenshots/<rel>.png, masking leaf elements whose text looks like an email or phone number.
export async function shot(page, rel, { fullPage = false, mask = [] } = {}) {
  let file = path.join(ROOT, 'screenshots', `${rel}.png`);
  // never overwrite existing evidence: add -r2, -r3 … suffixes
  for (let n = 2; fs.existsSync(file); n++) file = path.join(ROOT, 'screenshots', `${rel}-r${n}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const pii = page.locator('body *:not(:has(*))').filter({ hasText: PII });
  await page.screenshot({ path: file, fullPage, mask: [pii, ...mask], maskColor: '#888' });
  return path.relative(ROOT, file).split(path.sep).join('/');
}

export function isLoginPage(page) {
  return /login|sign[-_]?in|auth/i.test(page.url());
}
