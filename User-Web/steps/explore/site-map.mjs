// Read-only: map header/footer navigation, booking tabs and all internal links on the home page.
export default async ({ page, shot }) => {
  await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  const ev = await shot('explore/00-home', { fullPage: true });
  const data = await page.evaluate(() => {
    const txt = e => (e.innerText || e.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60);
    const links = [...document.querySelectorAll('a[href]')].map(a => ({ t: txt(a), h: a.getAttribute('href') }));
    const header = [...document.querySelectorAll('header a, header button, nav a, nav button')].map(txt).filter(Boolean);
    const footer = [...document.querySelectorAll('footer a')].map(a => txt(a) + ' -> ' + a.getAttribute('href'));
    const buttons = [...document.querySelectorAll('button, [role=tab]')].map(txt).filter(Boolean);
    const inputs = [...document.querySelectorAll('input, select, textarea')].filter(e => e.offsetParent).map(e => `${e.tagName}[${e.type}] name=${e.name} ph=${e.placeholder}`);
    const headings = [...document.querySelectorAll('h1,h2,h3')].map(txt).filter(Boolean);
    return { title: document.title, url: location.href, header: [...new Set(header)], footer: [...new Set(footer)], buttons: [...new Set(buttons)].slice(0, 80), inputs, headings: headings.slice(0, 40), internal: [...new Set(links.filter(l => l.h.startsWith('/') || l.h.includes(location.host)).map(l => l.h))] };
  });
  return { ev, ...data };
};
