// Starts a headed Chrome (isolated profile in .auth/profile) and keeps it running.
// Other scripts attach over CDP, so the login session is reused across exploration steps.
import { chromium } from 'playwright';
import { PROFILE_DIR, CDP_PORT, URL } from './lib.mjs';

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  channel: 'chrome',
  headless: false,
  viewport: { width: 1440, height: 900 },
  args: [`--remote-debugging-port=${CDP_PORT}`],
});
const page = context.pages()[0] || await context.newPage();
await page.goto(URL, { waitUntil: 'domcontentloaded' });
console.log(`[browser] ready on CDP port ${CDP_PORT}; current URL: ${page.url()}`);
context.on('close', () => process.exit(0));
