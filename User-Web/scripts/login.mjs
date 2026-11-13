// Signs in to the User App (Preprod): Personal Login → Mobile Number (default) or Email Address mode.
// Mode: USER_WEB_LOGIN_MODE=mobile|email in User-Web/.env (default mobile).
// Credentials come only from User-Web/.env (USER_WEB_USERNAME / USER_WEB_PASSWORD) and are never printed or logged.
// Screenshots taken here mask the input fields. OTP is never invented: if one is requested, the script stops and reports it.
import { connect, shot, URL } from './lib.mjs';

const user = process.env.USER_WEB_USERNAME;
const pass = process.env.USER_WEB_PASSWORD;
const mode = (process.env.USER_WEB_LOGIN_MODE || 'mobile').toLowerCase();
if (!user || !pass) { console.log('[login] USER_WEB_USERNAME / USER_WEB_PASSWORD missing in User-Web/.env'); process.exit(2); }
if (!['mobile', 'email'].includes(mode)) { console.log(`[login] unsupported USER_WEB_LOGIN_MODE "${mode}" (use mobile or email)`); process.exit(2); }

const { page } = await connect();
const settle = async () => {
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(800);
};
const credInputs = 'input[name="mobile"], input[name="email"], input[name="password"]';
const scrub = s => s.split(user).join('<username>');

if (!page.url().startsWith('http')) await page.goto(URL, { waitUntil: 'domcontentloaded' });
await settle();

// Already signed in? (not on /login and no "Log In" link in the header)
const loginLink = page.getByText('Log In', { exact: true }).first();
if (!/\/login/.test(page.url()) && !(await loginLink.isVisible().catch(() => false))) {
  console.log(`[login] already authenticated; URL: ${page.url()}`);
  process.exit(0);
}
if (/\/login/.test(page.url())) await page.reload({ waitUntil: 'domcontentloaded' }); // start from a clean form
else { await loginLink.click(); await page.waitForURL(/\/login/, { timeout: 15000 }); }
await settle();

await page.getByText('Personal Login', { exact: true }).first().click().catch(() => {});
await page.getByText(mode === 'mobile' ? 'Mobile Number' : 'Email Address', { exact: true }).first().click();
const idField = page.locator(mode === 'mobile' ? 'input[name="mobile"]' : 'input[name="email"]');
const pwd = page.locator('input[name="password"]');
await idField.waitFor({ state: 'visible', timeout: 15000 });
await idField.fill(user);
await pwd.fill(pass);

// Client-side validation before submit (e.g. "Invalid email format")
const inlineErr = async () => (await page.locator('form').first().innerText().catch(() => ''))
  .split('\n').map(s => s.trim()).filter(s => /invalid|required|must|enter a valid|incorrect|not found|wrong/i.test(s));
await page.locator('button[type="submit"]').filter({ hasText: /log in/i }).click();
console.log(`[login] ${mode} credentials submitted from .env (values not logged)`);

const outcome = await Promise.race([
  page.waitForURL(u => !/\/login/.test(u.toString()), { timeout: 30000 }).then(() => 'redirected'),
  page.locator('input[autocomplete="one-time-code"], input[name*="otp" i], input[placeholder*="otp" i]').first()
    .waitFor({ state: 'visible', timeout: 30000 }).then(() => 'otp'),
  (async () => { for (let i = 0; i < 30; i++) { await page.waitForTimeout(1000); if ((await inlineErr()).length) return 'message'; } return 'timeout'; })(),
]).catch(() => 'timeout');
await settle();

const masked = await page.locator(credInputs).all();
const evidence = await shot(page, 'login/02-after-submit', { mask: masked });
if (outcome === 'redirected') {
  console.log(`[login] SUCCESS; landing URL: ${page.url()}; evidence: ${evidence}`);
  process.exit(0);
}
if (outcome === 'otp') {
  console.log(`[login] OTP requested; no authorised OTP source is configured for User-Web, so stopping here. Evidence: ${evidence}`);
  process.exit(3);
}
const toasts = await page.locator('[role="alert"], .Toastify__toast, [class*="toast" i]').allInnerTexts().catch(() => []);
const msgs = [...await inlineErr(), ...toasts].map(m => scrub(m).trim()).filter(Boolean).slice(0, 5);
console.log(`[login] NOT signed in (${outcome}); URL: ${page.url()}; messages: ${JSON.stringify(msgs)}; evidence: ${evidence}`);
process.exit(1);
