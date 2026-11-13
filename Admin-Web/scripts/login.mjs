// Signs in to Admin Web. Credentials come only from Admin-Web/.env (ADMIN_WEB_USERNAME / ADMIN_WEB_PASSWORD).
// With --prompt they are read from the terminal instead (password input hidden, nothing stored).
// If they are absent, or OTP/CAPTCHA appears, it waits for the user to finish sign-in in the browser window.
import readline from 'node:readline';
import { connect, URL, STATE_FILE, isLoginPage } from './lib.mjs';

function ask(question, hidden = false) {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) rl._writeToOutput = s => { if (s.startsWith(question)) rl.output.write(question); };
    rl.question(question, answer => { rl.close(); if (hidden) process.stdout.write('\n'); resolve(answer); });
  });
}

if (process.argv.includes('--prompt')) {
  process.env.ADMIN_WEB_USERNAME = await ask('Admin Web username / email: ');
  process.env.ADMIN_WEB_PASSWORD = await ask('Admin Web password (hidden): ', true);
}

const { context, page } = await connect();
if (!page.url().startsWith('http')) await page.goto(URL, { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle').catch(() => {});

if (isLoginPage(page)) {
  const user = process.env.ADMIN_WEB_USERNAME, pass = process.env.ADMIN_WEB_PASSWORD;
  const pwd = page.locator('input[type="password"]').first();
  if (user && pass && await pwd.count()) {
    const userField = page.locator('input[type="email"], input[name*="user" i], input[name*="email" i], input[type="text"]').first();
    await userField.fill(user);
    await pwd.fill(pass);
    await page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first().click();
    console.log('[login] credentials submitted from .env (values not logged)');
  } else {
    console.log('[login] no .env credentials - please sign in manually in the Chrome window');
  }
  const captcha = await page.locator('iframe[src*="captcha"], [class*="captcha" i]').count();
  if (captcha) console.log('[login] CAPTCHA detected - please complete it in the Chrome window');
  console.log('[login] waiting up to 10 min for sign-in to finish (OTP etc. must be completed by the user)...');
  await page.waitForURL(u => !/login|sign[-_]?in|auth/i.test(u.toString()), { timeout: 600_000 });
}
await page.waitForLoadState('networkidle').catch(() => {});
await context.storageState({ path: STATE_FILE });
console.log(`[login] authenticated; landing URL: ${page.url()}`);
process.exit(0);
