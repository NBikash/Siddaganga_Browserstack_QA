import * as ui from '../allmod/ui.mjs';
export default async ({ page, shot, context }) => {
  const out = {}; const base = process.env.USER_WEB_URL.replace(/\/$/, '');
  await ui.guard(page);
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000);
  out.hrefs = await page.evaluate(() => {
    const f = re => [...document.querySelectorAll('a,button')].filter(e => re.test(e.innerText || e.getAttribute('aria-label') || '')).map(e => `${(e.innerText || '').trim()} -> ${e.getAttribute('href') || e.getAttribute('onclick') || ''}`);
    return { chat: f(/Chat With Us/), quote: f(/Get Your Quote/), fleet: f(/Explore Our Fleet|Explore All Fleets|Explore Now/), phone: [...document.querySelectorAll('a[href^="tel"],a[href^="mailto"],a[href*="wa.me"],a[href*="whatsapp"]')].map(a => a.getAttribute('href').replace(/\d{6,}/, '<num>')),
      social: [...document.querySelectorAll('footer a[href^="http"]')].map(a => a.getAttribute('href')) };
  });
  // Get Your Quote / Explore Our Fleet behaviour
  for (const b of ['Get Your Quote', 'Explore Our Fleet']) {
    await page.goto(base + '/'); await page.waitForTimeout(2500);
    await page.getByRole('button', { name: b }).first().click().catch(() => page.getByText(b).first().click()); await page.waitForTimeout(1500);
    out[b] = { url: new URL(page.url()).pathname, scrollY: await page.evaluate(() => scrollY) };
  }
  // notifications bell
  await page.goto(base + '/'); await page.waitForTimeout(2500);
  const bell = page.locator('header, nav').getByText('5', { exact: true }).first();
  await bell.click().catch(e => out.bellErr = String(e).slice(0, 80)); await page.waitForTimeout(1500);
  out.bell = { url: new URL(page.url()).pathname, panel: ui.PII(ui.norm(await page.locator('.dropdown-menu.show, .offcanvas.show, [class*="notification" i]:visible').first().innerText().catch(() => ''))).slice(0, 500), shot: await shot('explore/notifications') };
  await page.keyboard.press('Escape');
  // My Profile
  await page.goto(base + '/'); await page.waitForTimeout(2500);
  await page.locator('.profile-dropdown-menu').first().click(); await page.waitForTimeout(700);
  await page.getByText('My Profile', { exact: true }).first().click(); await page.waitForTimeout(2500);
  out.profile = { url: new URL(page.url()).pathname, headings: await page.locator('h1,h2,h3,h4,h5').allInnerTexts().then(a => a.map(ui.norm).filter(Boolean).slice(0, 20)),
    inputs: await page.evaluate(() => [...document.querySelectorAll('input,select,textarea')].filter(e => e.offsetParent).map(e => `${e.type}:${e.name || e.placeholder}:${e.disabled ? 'disabled' : ''}`)),
    buttons: (await page.locator('button:visible').allInnerTexts()).map(ui.norm).filter(Boolean).slice(0, 30) };
  out.profile.shot = await shot('explore/my-profile');
  // fleet finder
  await page.goto(base + '/ourfleet'); await page.waitForTimeout(3000);
  out.fleet = await page.evaluate(() => [...document.querySelectorAll('select')].filter(e => e.offsetParent).map(s => [...s.options].map(o => o.text).join('|')));
  await page.getByRole('button', { name: 'Find Vehicles' }).click().catch(() => {}); await page.waitForTimeout(2500);
  out.fleetFind = { url: new URL(page.url()).pathname, found: ui.norm(await page.locator('text=/Found/').first().innerText().catch(() => '')) };
  // contact us form options
  await page.goto(base + '/contact-us'); await page.waitForTimeout(3000);
  out.contact = { labels: await page.locator('label:visible').allInnerTexts().then(a => a.map(ui.norm).filter(Boolean)), shot: await shot('explore/contact-us', { fullPage: true }) };
  await page.getByRole('button', { name: 'Raise Ticket' }).first().click().catch(() => {}); await page.waitForTimeout(1200);
  out.contact.emptySubmit = await ui.msgs(page);
  await page.getByText('My Support History').first().click().catch(() => {}); await page.waitForTimeout(2000);
  out.contact.history = ui.PII(ui.norm(await page.locator('main, body').first().innerText()).slice(0, 400));
  return out;
};
