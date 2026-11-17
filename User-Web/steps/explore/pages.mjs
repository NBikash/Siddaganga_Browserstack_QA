// Read-only: visit every internal route, record structure and console/HTTP errors. Profile dropdown items too.
const ROUTES = ['/', '/services', '/ourfleet', '/fleet-list', '/about-us', '/contact-us', '/sitemap', '/privacy', '/terms', '/offers',
  '/schedules', '/refund-status', '/agent-registration', '/career', '/confirm-phone-booking', '/testimonials', '/faq', '/login', '/does-not-exist-qa'];
export default async ({ page, shot }) => {
  const base = process.env.USER_WEB_URL.replace(/\/$/, '');
  const out = {};
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  page.on('response', r => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url().slice(0, 120)}`); });
  // profile menu
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const prof = page.locator('.profile-dropdown-menu, [class*="profile" i]').first();
  out.profileVisible = await prof.isVisible().catch(() => false);
  if (out.profileVisible) {
    await prof.click().catch(() => {});
    await page.waitForTimeout(800);
    out.profileMenu = await page.evaluate(() => [...document.querySelectorAll('.dropdown-menu a, .dropdown-menu button, [role=menu] a, [role=menuitem]')]
      .filter(e => e.offsetParent).map(e => `${e.innerText.trim()} -> ${e.getAttribute('href') || ''}`));
    await page.keyboard.press('Escape');
  }
  for (const r of ROUTES) {
    errs.length = 0;
    const resp = await page.goto(base + r, { waitUntil: 'domcontentloaded' }).catch(e => null);
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => {
      const t = e => (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70);
      const vis = e => !!e.offsetParent;
      return {
        url: location.pathname, title: document.title,
        h: [...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map(t).filter(Boolean).slice(0, 25),
        inputs: [...document.querySelectorAll('input,select,textarea')].filter(vis).map(e => `${e.tagName.toLowerCase()}:${e.type || ''}:${e.name || e.id || ''}:${e.placeholder || ''}`).slice(0, 30),
        buttons: [...new Set([...document.querySelectorAll('button,[role=tab]')].filter(vis).map(t).filter(Boolean))].slice(0, 30),
        textLen: document.body.innerText.length,
        bodyStart: document.body.innerText.replace(/\s+/g, ' ').slice(0, 300),
        empties: [...document.body.innerText.matchAll(/(No [a-z ]{3,30} found|not found|coming soon|lorem ipsum)/gi)].map(m => m[0]).slice(0, 5),
      };
    });
    info.status = resp ? resp.status() : 'nav-failed';
    info.errors = [...new Set(errs)].slice(0, 8);
    info.ev = await shot(`explore/page${r.replace(/\//g, '_') || '_home'}`, { fullPage: true });
    out[r] = info;
  }
  return out;
};
