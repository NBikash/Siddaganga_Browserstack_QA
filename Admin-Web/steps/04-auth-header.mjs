// Read-only: logged-out pages in a fresh incognito context (no input, no submit) + header bell / profile menu.
import fs from 'node:fs';
const BASE = 'https://dari-dev.siddagangatravels.com';

async function grab(p) {
  return p.evaluate(() => {
    const txt = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
    return {
      url: location.pathname, title: document.title,
      headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(txt).filter(Boolean),
      inputs: [...document.querySelectorAll('input,textarea')].filter(i => i.type !== 'hidden').map(i => ({ type: i.type, placeholder: i.placeholder, maxLength: i.maxLength > 0 ? i.maxLength : undefined, inputMode: i.inputMode || undefined })),
      labels: [...document.querySelectorAll('label')].map(txt).filter(Boolean),
      buttons: [...document.querySelectorAll('button')].map(b => txt(b) || b.getAttribute('aria-label') || '[icon]'),
      links: [...document.querySelectorAll('a[href]')].map(a => `${txt(a)} -> ${a.getAttribute('href')}`),
      text: txt(document.body).slice(0, 800),
    };
  });
}

export default async ({ page, context, shot }) => {
  const out = {};
  const browser = context.browser();
  const anon = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await anon.newPage();
  const ashot = async (rel) => {
    const file = `screenshots/${rel}.png`;
    fs.mkdirSync(file.split('/').slice(0, -1).join('/'), { recursive: true });
    await p.screenshot({ path: file });
    return file;
  };
  await p.goto(BASE + '/dashboard/client-management/contracted-clients', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3000);
  out.login = await grab(p); out.login.shot = await ashot('login/02-login-page');
  // password visibility toggle is a pure UI control (no submit) – observe its effect on the empty field
  const pwd = p.locator('input[type=password]');
  const toggle = p.locator('input[type=password] ~ * button, input[type=password] + div button').first();
  out.login.toggleFound = await toggle.count();
  if (out.login.toggleFound) { await toggle.click(); await p.waitForTimeout(300); out.login.afterToggleType = await p.locator('input[placeholder="Enter your password"]').getAttribute('type'); }
  await p.getByText('Forgot Password?').click(); await p.waitForTimeout(2500);
  out.forgot = await grab(p); out.forgot.shot = await ashot('login/03-forgot-password');
  await p.goto(BASE + '/login', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500);
  await p.getByText('Log in with OTP').click(); await p.waitForTimeout(2500);
  out.otp = await grab(p); out.otp.shot = await ashot('login/04-login-with-otp');
  await anon.close();

  // Header in the authenticated session
  await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000);
  const header = page.locator('header, [role=banner]').first();
  const vis = () => page.locator('button:visible, [role=menuitem]:visible, li:visible, a:visible, p:visible').evaluateAll(es => es.map(e => (e.innerText || '').trim().replace(/\s+/g, ' ')).filter(t => t && t.length < 120));
  let pre = new Set(await vis());
  await header.locator('button').nth(1).click().catch(() => {}); await page.waitForTimeout(1500);
  out.bell = [...new Set((await vis()).filter(t => !pre.has(t)))].slice(0, 40);
  out.bellShot = await shot('dashboard/03-notifications');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000);
  pre = new Set(await vis());
  await header.locator('img').last().click().catch(() => {}); await page.waitForTimeout(1200);
  out.profile = [...new Set((await vis()).filter(t => !pre.has(t)))];
  out.profileShot = await shot('dashboard/04-profile-menu');
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  // sidebar collapse controls (pure UI)
  await page.getByRole('button', { name: 'Hide sidebar' }).click().catch(() => {}); await page.waitForTimeout(800);
  out.collapsedShot = await shot('dashboard/05-sidebar-hidden');
  await page.getByRole('button', { name: /sidebar/i }).first().click().catch(() => {}); await page.waitForTimeout(800);
  out.restoredShot = await shot('dashboard/06-sidebar-restored');
  fs.writeFileSync('exploration-logs/raw/auth-header.json', JSON.stringify(out, null, 2));
  return out;
};
