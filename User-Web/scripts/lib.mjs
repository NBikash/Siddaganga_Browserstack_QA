// Shared helpers for User-Web Playwright exploration (modelled on Admin-Web/scripts/lib.mjs).
// No local install: Playwright is loaded read-only from Admin-Web/node_modules, dotenv from the root node_modules.
// Credentials in User-Web/.env are NEVER read here: the user signs in manually in the Chrome window.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
dotenv.config({ path: path.join(ROOT, '.env'), quiet: true });

const PW_PATH = process.env.USER_WEB_PLAYWRIGHT_PATH
  || path.join(ROOT, '..', 'Admin-Web', 'node_modules', 'playwright');
export const { chromium } = require(PW_PATH);

export const URL = process.env.USER_WEB_URL;
if (!URL) throw new Error('USER_WEB_URL is not set in User-Web/.env');
export const CDP_PORT = Number(process.env.USER_WEB_CDP_PORT || 9334); // Admin-Web uses 9333
export const PROFILE_DIR = path.join(ROOT, '.auth', 'profile');

// Attach to the browser started by browser.mjs (keeps the user's manual login alive between steps).
export async function connect() {
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
  const context = browser.contexts()[0];
  const page = context.pages().find(p => p.url().startsWith('http')) || context.pages()[0] || await context.newPage();
  return { browser, context, page };
}

const PII = /[\w.+-]+@[\w-]+\.[\w.]+|(?:\+?91[\s-]?)?[6-9]\d{9}\b/;

// Screenshot into screenshots/<rel>.png, masking leaf elements whose text looks like an email or phone number.
export async function shot(page, rel, { fullPage = false, mask = [] } = {}) {
  let file = path.join(ROOT, 'screenshots', `${rel}.png`);
  for (let n = 2; fs.existsSync(file); n++) file = path.join(ROOT, 'screenshots', `${rel}-r${n}.png`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const pii = page.locator('body *:not(:has(*))').filter({ hasText: PII });
  const profile = page.locator('.profile-dropdown-menu'); // account name + avatar in the header
  await page.screenshot({ path: file, fullPage, mask: [pii, profile, ...mask], maskColor: '#888' });
  return path.relative(ROOT, file).split(path.sep).join('/');
}
