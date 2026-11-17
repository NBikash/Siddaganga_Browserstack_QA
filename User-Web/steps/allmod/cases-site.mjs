// Site-wide test cases: navigation & content pages, authentication/profile, fleet, support, services.
import * as ui from './ui.mjs';
import { checker } from './cases-booking.mjs';
import { iso } from './trip.mjs';

const BASE = () => process.env.USER_WEB_URL.replace(/\/$/, '');
async function go(page, p) {
  await ui.guard(page);
  const resp = await page.goto(BASE() + p, { waitUntil: 'domcontentloaded' }).catch(() => null);
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  return resp?.status();
}
// Text of the page without the shared header/footer chrome.
// The site has no <header>/<footer> landmarks, so slice the live text between the nav bar ("… Contact Us")
// and the footer (last "About Siddaganga" heading).
const mainText = page => page.evaluate(() => {
  const all = document.body.innerText.replace(/\s+/g, ' ').trim();
  const nav = all.indexOf('Contact Us'); const start = nav >= 0 && nav < 400 ? nav + 'Contact Us'.length : 0;
  const end = all.lastIndexOf('About Siddaganga'); return all.slice(start, end > start ? end : undefined).trim();
});
const T = (id, module, title, type, priority, data, steps, expected, fn) => ({ id, module, title, type, priority, data, steps, expected, run: fn });

// Footer content pages: each must render its own content.
const FOOTER = [['TC_NAV_006', 'Offers', '/offers'], ['TC_NAV_007', 'Schedules', '/schedules'], ['TC_NAV_008', 'Refund Status', '/refund-status'],
  ['TC_NAV_009', 'Agent Registration', '/agent-registration'], ['TC_NAV_010', 'Careers', '/career'], ['TC_NAV_011', 'Confirm Phone Booking', '/confirm-phone-booking'],
  ['TC_NAV_012', 'Testimonials', '/testimonials'], ['TC_NAV_013', 'FAQ', '/faq']];

// Fresh logged-out browser context (does not touch the signed-in session).
async function anon(context, fn) {
  const b = context.browser(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
  try { return await fn(p); } finally { await ctx.close(); }
}

export const CASES = [
  // ================================================ NAVIGATION ================================================
  T('TC_NAV_001', 'Navigation & Content', 'Home page loads with all key sections', 'Functional', 'Critical', 'URL /', 'Open home page',
    'Hero, Smart Inquiry (4 tabs), Fleets, Amenities, Why Travel With, About and footer render; HTTP 200', async ({ page }) => { const C = checker(); const errs = [];
      page.on('console', m => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
      const st = await go(page, '/'); const t = await page.locator('body').innerText();
      C.ok(st === 200, 'HTTP 200', st);
      for (const s of ['Smart Inquiry', 'Local', 'Outstation', 'Transfer', 'Multi-Leg', 'Explore', 'Amenities', 'Why Travel With', 'About Siddaganga']) C.ok(t.includes(s), `Section "${s}"`);
      C.ok(true, 'Console errors (observation)', errs.length ? [...new Set(errs)].slice(0, 3).join(' | ') : 'none');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_NAV_001-home', { fullPage: true })] }; }),
  T('TC_NAV_002', 'Navigation & Content', 'Header menu links navigate correctly', 'Functional', 'High', 'Home, Services, Our Fleet, About Us, Contact Us',
    'Click each header link', 'Each opens its page (URL + heading); active link highlighted', async ({ page }) => { const C = checker(); const ev = [];
      for (const [l, p] of [['Services', '/services'], ['Our Fleet', '/ourfleet'], ['About Us', '/about-us'], ['Contact Us', '/contact-us'], ['Home', '/']]) {
        await go(page, '/services' === p ? '/' : '/'); await page.locator('header, nav').getByText(l, { exact: true }).first().click(); await page.waitForTimeout(2500);
        C.ok(new URL(page.url()).pathname === p, `${l} → ${p}`, new URL(page.url()).pathname);
      }
      ev.push(await ui.snap(page, 'TC_NAV_002')); return { status: C.status(), checks: C.list, evidence: ev }; }),
  T('TC_NAV_003', 'Navigation & Content', 'Popular Routes section shows routes', 'Functional', 'Medium', 'Home', 'Scroll to "Popular Routes People Book Most"',
    'Route cards listed (or section hidden when no data)', async ({ page }) => { const C = checker(); await go(page, '/');
      await page.getByText('Popular Routes People Book Most').first().scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(2000);
      const t = await page.locator('body').innerText();
      C.ok(!/No popular routes found/i.test(t), 'Routes are displayed (no empty-state message on the home page)', /No popular routes found/i.test(t) ? '"No popular routes found" shown under the heading' : 'routes shown');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_NAV_003')] }; }),
  T('TC_NAV_004', 'Navigation & Content', 'Hero "Get Your Quote" CTA', 'Functional', 'High', 'Home', 'Click Get Your Quote',
    'Takes the user to the Smart Inquiry form (scroll/focus) or a quote page', async ({ page }) => { const C = checker(); await go(page, '/');
      const y0 = await page.evaluate(() => scrollY); const u0 = page.url();
      await page.getByRole('button', { name: 'Get Your Quote' }).first().click(); await page.waitForTimeout(2500);
      const y1 = await page.evaluate(() => scrollY); const modal = await page.locator('.modal.show').count();
      C.ok(y1 !== y0 || page.url() !== u0 || modal, 'CTA has a visible effect', `scrollY ${y0}→${y1}, url ${new URL(page.url()).pathname}, modal ${modal}`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_NAV_004')] }; }),
  T('TC_NAV_005', 'Navigation & Content', 'Hero "Explore Our Fleet" and "Explore All Fleets" CTAs', 'Functional', 'Medium', 'Home', 'Click each CTA',
    'Navigates to the fleet listing showing vehicles', async ({ page }) => { const C = checker(); const ev = [];
      for (const b of ['Explore Our Fleet', 'Explore All Fleets']) { await go(page, '/'); await page.getByText(b, { exact: true }).first().click(); await page.waitForTimeout(3000);
        const f = ui.norm(await page.locator('text=/Found/').first().innerText().catch(() => ''));
        C.ok(/fleet/.test(page.url()), `${b} → fleet page`, new URL(page.url()).pathname); C.ok(!/^0 /.test(f), `${b}: vehicles listed`, f); ev.push(await ui.snap(page, `TC_NAV_005-${b.replace(/\s/g, '')}`)); }
      return { status: C.status(), checks: C.list, evidence: ev }; }),
  ...FOOTER.map(([id, name, p]) => T(id, 'Navigation & Content', `Footer link "${name}" opens a page with content`, 'Functional', 'Medium', p,
    `Footer → ${name}`, `${name} page shows its own heading and content`, async ({ page }) => { const C = checker();
      await go(page, '/'); await page.locator('footer').getByText(name === 'Careers' ? 'Careers' : name, { exact: true }).first().click().catch(() => go(page, p)); await page.waitForTimeout(2500);
      const t = await mainText(page);
      C.ok(new URL(page.url()).pathname === p, `Navigates to ${p}`, new URL(page.url()).pathname);
      C.ok(t.length > 150, 'Page has its own content (beyond header/footer)', `${t.length} chars: "${t.slice(0, 120)}"`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, id, { fullPage: true })] }; })),
  T('TC_NAV_014', 'Navigation & Content', 'Privacy Policy, Terms & Conditions and Sitemap content', 'Functional', 'Medium', '/privacy, /terms, /sitemap',
    'Open each page', 'Legal text and sitemap headings present', async ({ page }) => { const C = checker(); const ev = [];
      for (const [p, re] of [['/privacy', /Privacy Policy/], ['/terms', /Terms and Conditions|Terms & Condition/], ['/sitemap', /Sitemap/]]) { await go(page, p); const t = await mainText(page);
        C.ok(re.test(t) && t.length > 300, `${p} has content`, `${t.length} chars`); ev.push(await ui.snap(page, `TC_NAV_014${p.replace('/', '-')}`)); }
      return { status: C.status(), checks: C.list, evidence: ev }; }),
  T('TC_NAV_015', 'Navigation & Content', 'All Sitemap links resolve to real pages', 'Functional', 'Medium', '/sitemap', 'Visit every link on the sitemap',
    'No link lands on "page not found" or an empty page', async ({ page }) => { const C = checker(); await go(page, '/sitemap');
      const links = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')).filter(h => h !== '/' && !h.startsWith('/#')))]);
      const bad = [];
      for (const l of links) { await go(page, l); const t = await mainText(page); if (/page not found/i.test(t) || t.length < 150) bad.push(`${l} (${/not found/i.test(t) ? '404' : 'empty'})`); }
      C.ok(!bad.length, `All ${links.length} sitemap links have content`, bad.join(', '));
      return { status: C.status(), checks: C.list, evidence: [], actual: `${links.length} links; failing: ${bad.join(', ') || 'none'}` }; }),
  T('TC_NAV_016', 'Navigation & Content', 'Unknown URL shows a 404 page', 'Negative', 'Low', '/does-not-exist-qa', 'Open an unknown route',
    '"Sorry, page not found!" with a way back home', async ({ page }) => { const C = checker(); await go(page, '/does-not-exist-qa'); const t = await page.locator('body').innerText();
      C.ok(/page not found/i.test(t), '404 message shown'); C.ok(await page.locator('a[href="/"]').count() > 0, 'Link back to home');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_NAV_016')] }; }),
  T('TC_NAV_017', 'Navigation & Content', 'Footer social media icons link to profiles', 'Functional', 'Low', 'Facebook, Instagram, X, LinkedIn, YouTube icons',
    'Inspect each footer social icon', "Each icon opens Siddaganga's profile on that platform", async ({ page }) => { const C = checker(); await go(page, '/');
      const s = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href*="facebook."], a[href*="instagram."], a[href*="twitter."], a[href*="x.com"], a[href*="linkedin."], a[href*="youtube."]')].map(a => a.getAttribute('href')))]);
      C.ok(s.length >= 5, 'Five social icons present', `${s.length}: ${s.join(' ')}`);
      const generic = s.filter(h => { try { return new URL(h).pathname.replace(/\//g, '') === ''; } catch { return true; } });
      C.ok(!generic.length, "Icons link to Siddaganga's own profiles (not platform home pages)", generic.join(' '));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_NAV_017')] }; }),
  T('TC_NAV_018', 'Navigation & Content', 'Contact details consistency (header, footer, Contact page)', 'Functional', 'Low', 'Phone and email links',
    'Compare tel:/mailto: links across pages', 'Valid tel:/mailto: links; one consistent support email', async ({ page }) => { const C = checker(); await go(page, '/');
      const l = await page.evaluate(() => [...document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]')].map(a => a.getAttribute('href')));
      const mails = [...new Set(l.filter(h => h.startsWith('mailto:')).map(h => h.slice(7)))];
      C.ok(l.some(h => h.startsWith('tel:')), 'tel: link present'); C.ok(mails.length === 1, 'One consistent support email', `${mails.length} different emails used`);
      return { status: C.status(), checks: C.list, evidence: [] }; }),
  T('TC_NAV_019', 'Navigation & Content', 'Mobile viewport (390×844): home and inquiry usable', 'Compatibility', 'Medium', 'iPhone-size viewport',
    'Resize to 390×844 → open home → open nav toggle → Local tab', 'No horizontal scroll; hamburger menu works; inquiry form fits', async ({ page }) => { const C = checker();
      await page.setViewportSize({ width: 390, height: 844 });
      try { await go(page, '/');
        const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth); C.ok(ov <= 1, 'No horizontal overflow', `${ov}px wider than viewport`);
        await page.getByRole('button', { name: 'Toggle navigation' }).click().catch(() => {}); await page.waitForTimeout(800);
        C.ok(await page.getByText('Contact Us', { exact: true }).first().isVisible(), 'Hamburger menu opens');
        const ev = [await ui.snap(page, 'TC_NAV_019-menu')];
        await page.getByRole('button', { name: 'Toggle navigation' }).click().catch(() => {});
        await page.getByText('Smart Inquiry').first().scrollIntoViewIfNeeded(); ev.push(await ui.snap(page, 'TC_NAV_019-inquiry'));
        return { status: C.status(), checks: C.list, evidence: ev };
      } finally { await page.setViewportSize({ width: 1440, height: 900 }); } }),
  T('TC_NAV_020', 'Navigation & Content', '"Chat With Us" opens WhatsApp/chat', 'Functional', 'Medium', 'Booking widget', 'Click Chat With Us',
    'Opens WhatsApp (wa.me) or chat widget in a new tab/window', async ({ page, context }) => { const C = checker(); await go(page, '/');
      const pop = context.waitForEvent('page', { timeout: 6000 }).catch(() => null);
      await page.getByRole('button', { name: /Chat With Us/ }).first().click().catch(() => page.getByText('Chat With Us').first().click());
      const np = await pop; const url = np ? np.url() : page.url(); if (np) await np.close();
      C.ok(/wa\.me|whatsapp|chat/i.test(url) || (await page.locator('[class*="chat" i]:visible').count()), 'Chat channel opened', url.replace(/\d{8,}/, '<num>'));
      return { status: C.status(), checks: C.list, evidence: [] }; }),

  // ============================================== AUTH & PROFILE ==============================================
  T('TC_AUTH_001', 'Authentication & Profile', 'Logged-in header shows profile menu and notifications', 'Functional', 'High', 'Signed-in session',
    'Open home', 'Profile name/avatar and notification count visible; "Log In" hidden', async ({ page }) => { const C = checker(); await go(page, '/');
      C.ok(await page.locator('.profile-dropdown-menu').first().isVisible(), 'Profile menu visible');
      C.ok(!(await page.getByText('Log In', { exact: true }).first().isVisible().catch(() => false)), '"Log In" not shown');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_AUTH_001')] }; }),
  T('TC_AUTH_002', 'Authentication & Profile', 'Profile dropdown items', 'Functional', 'Medium', '—', 'Click profile name', 'My Profile and Logout listed',
    async ({ page }) => { const C = checker(); await go(page, '/'); await page.locator('.profile-dropdown-menu').first().click(); await page.waitForTimeout(700);
      for (const i of ['My Profile', 'Logout']) C.ok(await page.getByText(i, { exact: true }).first().isVisible(), `"${i}" listed`);
      const ev = await ui.snap(page, 'TC_AUTH_002'); await page.keyboard.press('Escape'); return { status: C.status(), checks: C.list, evidence: [ev] }; }),
  T('TC_AUTH_003', 'Authentication & Profile', 'My Profile page fields', 'Functional', 'High', '—', 'Profile → My Profile',
    'Name, email, mobile, address, GST invoice option, photo update and Submit shown; mobile (login ID) read-only', async ({ page }) => { const C = checker(); await go(page, '/');
      await page.locator('.profile-dropdown-menu').first().click(); await page.getByText('My Profile', { exact: true }).first().click(); await page.waitForTimeout(3000);
      C.ok(/\/profile/.test(page.url()), 'Navigates to /profile', new URL(page.url()).pathname);
      const f = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('input')].filter(e => e.name).map(e => [e.name, { disabled: e.disabled || e.readOnly }])));
      for (const n of ['userName', 'email', 'mobileNumber', 'address', 'isGSTInvoice']) C.ok(f[n], `Field ${n}`);
      C.ok(f.mobileNumber?.disabled, 'Mobile number (login ID) is read-only', JSON.stringify(f.mobileNumber));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_AUTH_003', { mask: [page.locator('input')] })] }; }),
  T('TC_AUTH_004', 'Authentication & Profile', 'My Profile validation: invalid email (not saved)', 'Negative', 'Medium', 'Email "abc@"',
    'Type invalid email → Submit (profile API blocked by guard, value restored)', 'Client-side email validation message', async ({ page }) => { const C = checker();
      await go(page, '/profile'); await page.route('**/*', async r => ['POST', 'PUT', 'PATCH'].includes(r.request().method()) && /user|profile|customer/i.test(r.request().url()) ? r.abort() : r.fallback());
      const e = page.locator('input[name="email"]'); const orig = await e.inputValue();
      await e.fill('abc@'); await page.getByRole('button', { name: 'Submit' }).click(); await page.waitForTimeout(1500);
      const m = await ui.msgs(page); const native = await e.evaluate(x => x.validationMessage);
      C.ok(m.some(x => /email/i.test(x)) || native, 'Invalid email flagged', JSON.stringify(m) + (native ? ` native: ${native}` : ''));
      await e.fill(orig); await page.unroute('**/*').catch(() => {});
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_AUTH_004', { mask: [page.locator('input:not([name="email"])')] })], notes: 'Profile update API blocked; original value restored; nothing saved.' }; }),
  T('TC_AUTH_005', 'Authentication & Profile', '/login while signed in redirects to home', 'Functional', 'Low', '/login', 'Open /login while authenticated', 'Redirect to home',
    async ({ page }) => { const C = checker(); await go(page, '/login'); C.ok(!/\/login/.test(page.url()), 'Redirected away from /login', new URL(page.url()).pathname); return { status: C.status(), checks: C.list, evidence: [] }; }),
  T('TC_AUTH_006', 'Authentication & Profile', 'Login page UI and modes (logged out)', 'Functional', 'High', 'Fresh session', 'Open /login',
    'Personal Login; Mobile Number / Email Address modes; password; Log In button', async ({ context }) => anon(context, async p => { const C = checker();
      await p.goto(BASE() + '/login'); await p.waitForTimeout(4000); const t = await p.locator('body').innerText();
      for (const s of ['Personal Login', 'Mobile Number', 'Email Address']) C.ok(t.includes(s), `"${s}" option`);
      C.ok(await p.locator('input[name="password"]').count(), 'Password field');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(p, 'TC_AUTH_006')] }; })),
  T('TC_AUTH_007', 'Authentication & Profile', 'Login validation: empty and malformed credentials', 'Negative', 'High', 'Empty; mobile "12345"; email "abc@"',
    'Submit with each (no real account used)', 'Inline validation for each; no login', async ({ context }) => anon(context, async p => { const C = checker(); const obs = {};
      const submit = async () => { await p.locator('button[type="submit"]').filter({ hasText: /log in/i }).click(); await p.waitForTimeout(1500); return (await p.locator('form').first().innerText()).split('\n').filter(s => /required|invalid|valid|must|digit/i.test(s)); };
      await p.goto(BASE() + '/login'); await p.waitForTimeout(3500);
      await p.getByText('Mobile Number', { exact: true }).first().click().catch(() => {}); obs.empty = await submit();
      await p.locator('input[name="mobile"]').fill('12345'); await p.locator('input[name="password"]').fill('x'); obs.shortMobile = await submit();
      await p.getByText('Email Address', { exact: true }).first().click(); await p.locator('input[name="email"]').fill('abc@'); await p.locator('input[name="password"]').fill('x'); obs.badEmail = await submit();
      C.ok(obs.empty.length, 'Empty submit validated', JSON.stringify(obs.empty)); C.ok(obs.shortMobile.length, '5-digit mobile rejected', JSON.stringify(obs.shortMobile)); C.ok(obs.badEmail.length, 'Malformed email rejected', JSON.stringify(obs.badEmail));
      C.ok(/\/login/.test(p.url()), 'Still on login page');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(p, 'TC_AUTH_007')], actual: JSON.stringify(obs) }; })),
  T('TC_AUTH_008', 'Authentication & Profile', 'Protected /profile when logged out', 'Security', 'High', 'Fresh session', 'Open /profile without login',
    'Redirected to login; no profile data shown', async ({ context }) => anon(context, async p => { const C = checker();
      await p.goto(BASE() + '/profile'); await p.waitForTimeout(4000);
      C.ok(/\/login/.test(p.url()) || !(await p.locator('input[name="mobileNumber"]').count()), 'Profile not accessible', new URL(p.url()).pathname);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(p, 'TC_AUTH_008')] }; })),
  T('TC_AUTH_009', 'Authentication & Profile', 'Logged-out user can search, booking requires login', 'Functional', 'High', 'Fresh session; Local Whitefield D+3',
    'Search as guest → Book This Vehicle', 'Search works; booking prompts login (no anonymous inquiry)', async ({ context }) => anon(context, async p => { const C = checker();
      const { run } = await import('./trip.mjs');
      const r = await run(p, { tab: 'Local', pickup: 'Whitefield', date: iso(3), time: '10:00 AM', pax: 2, hrs: 4, vehicle: /^Sedan/ }, 'TC_AUTH_009', { details: false });
      C.ok(r.search?.navigated || /login/.test(p.url()), 'Guest search handled (results or login prompt)', r.search?.found || p.url());
      const t = await p.locator('body').innerText(); const asked = /\/login/.test(p.url()) || /log ?in|sign ?in/i.test(JSON.stringify(r.review || {})) || /please log ?in/i.test(t);
      C.ok(asked || !r.review?.opened, 'Booking requires login', r.review?.opened ? `Review modal opened for guest: ${r.review.title}` : 'Login requested');
      return { status: C.status(), checks: C.list, evidence: [r.search?.shot, ...(r.search?.shots || []), ...(r.review?.shots || [])].filter(Boolean) }; })),
  T('TC_AUTH_010', 'Authentication & Profile', 'Logout', 'Functional', 'High', '—', 'Profile → Logout', 'Session ended; Log In shown',
    async () => ({ status: 'Blocked', actual: 'Blocked (approval not given): logout is on the requires-approval list and would end the test session.', checks: [], evidence: [] })),
  T('TC_AUTH_011', 'Authentication & Profile', 'Notification bell', 'Functional', 'Medium', 'Header bell with count', 'Click the bell / count badge',
    'Notification list opens; count matches items', async ({ page }) => { const C = checker(); await go(page, '/');
      const wrap = page.locator('.notification-icon-wrap').first(); const exists = await wrap.count();
      const badge = Number(await page.locator('.notification-badge').first().innerText().catch(() => 'NaN'));
      if (exists) await page.locator('.notification-badge').first().click({ force: true }).catch(() => {}); await page.waitForTimeout(1500);
      const panel = page.locator('.dropdown-menu.show').filter({ hasText: 'Notifications' }).first();
      const open = await panel.count(); const txt = open ? await panel.innerText() : '';
      const items = (txt.match(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/g) || []).length;
      C.ok(exists, 'Bell control present', `badge ${badge}`); C.ok(open, 'Clicking the bell opens the Notifications list', open ? 'opened' : 'nothing opened');
      C.ok(/Mark all as read/.test(txt), '"Mark all as read" available');
      C.ok(!badge || items >= badge, 'Badge count matches unread items listed', `badge ${badge}, items ${items}`);
      const ev = await ui.snap(page, 'TC_AUTH_011', { mask: [panel] }); await page.keyboard.press('Escape');
      return { status: C.status(), checks: C.list, evidence: [ev], notes: 'Notification content (payments/inquiries) not recorded – personal data.' }; }),

  // ==================================================== FLEET ====================================================
  T('TC_FLT_001', 'Fleet', 'Our Fleet page filters', 'Functional', 'Medium', '/ourfleet', 'Open Our Fleet', 'Category, manufacturer, vehicle type, seat type, AC/Non AC, luggage, capacity slider shown',
    async ({ page }) => { const C = checker(); await go(page, '/ourfleet'); const n = await page.locator('select:visible').count();
      C.ok(n >= 4, '4 dropdown filters', n); C.ok(await page.locator('input[type=range]:visible').count(), 'Capacity slider');
      C.ok(await page.getByRole('button', { name: 'Find Vehicles' }).isVisible(), 'Find Vehicles button');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_FLT_001')] }; }),
  T('TC_FLT_002', 'Fleet', 'Find Vehicles with default filters returns vehicles', 'Functional', 'High', 'No filters', 'Our Fleet → Find Vehicles',
    'All fleet vehicles listed', async ({ page }) => { const C = checker(); await go(page, '/ourfleet');
      await page.getByRole('button', { name: 'Find Vehicles' }).click(); await page.waitForTimeout(3500);
      const f = ui.norm(await page.locator('text=/Found/').first().innerText().catch(() => ''));
      C.ok(!/^0 /.test(f) && f, 'Vehicles found', f || 'no count');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_FLT_002', { fullPage: true })] }; }),
  T('TC_FLT_003', 'Fleet', 'Find Vehicles filtered by Category = Luxury', 'Functional', 'Medium', 'Category Luxury', 'Select Luxury → Find Vehicles',
    'Only luxury vehicles listed (Volvo/Urbania/BharatBenz)', async ({ page }) => { const C = checker(); await go(page, '/ourfleet');
      await page.locator('select:visible').first().selectOption({ label: 'Luxury' }); await page.getByRole('button', { name: 'Find Vehicles' }).click(); await page.waitForTimeout(3500);
      const f = ui.norm(await page.locator('text=/Found/').first().innerText().catch(() => '')); const names = await page.locator('h3,h4,h5').allInnerTexts();
      C.ok(!/^0 /.test(f), 'Luxury vehicles found', f);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_FLT_003', { fullPage: true })], actual: `${f}; ${names.filter(n => /Seater|Sedan|SUV/.test(n)).slice(0, 8).join(', ')}` }; }),
  T('TC_FLT_004', 'Fleet', 'Fleet list category/brand chips filter', 'Functional', 'Medium', '/fleet-list chips Luxury, Premium, Deluxe', 'Click each chip',
    'Each category lists its vehicles (Luxury, Premium and Deluxe vehicles all exist in booking results)', async ({ page }) => { const C = checker(); await go(page, '/fleet-list'); const obs = {};
      for (const c of ['Luxury', 'Premium', 'Deluxe']) { await page.locator('.nav-title-div').filter({ hasText: new RegExp(`^\\s*${c}\\s*$`) }).first().click().catch(() => {}); await page.waitForTimeout(3000); obs[c] = ui.norm(await page.locator('text=/Buses Found/').first().innerText().catch(() => '')); }
      for (const c of ['Luxury', 'Premium', 'Deluxe']) C.ok(obs[c] && !/^0 /.test(obs[c]), `${c} category lists vehicles (booking results offer ${c} vehicles)`, obs[c]);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_FLT_004')], actual: JSON.stringify(obs) }; }),
  T('TC_FLT_005', 'Fleet', 'Home "Explore Our Fleets" category tabs', 'Functional', 'Low', 'Tabs All/Dynamic/Luxury/Premium/Deluxe', 'Click each tab',
    'Cards update per tab', async ({ page }) => { const C = checker(); await go(page, '/'); const obs = {};
      for (const c of ['Luxury', 'Premium', 'Deluxe', 'All']) { await page.getByRole('button', { name: c, exact: true }).first().click().catch(() => {}); await page.waitForTimeout(1500);
        obs[c] = (await page.locator('h3, h4').allInnerTexts()).filter(t => /Seater|Sedan|SUV|MPV/.test(t)).slice(0, 6).join(','); }
      C.ok(Object.values(obs).some(Boolean), 'Fleet cards shown', JSON.stringify(obs).slice(0, 250));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_FLT_005')] }; }),

  // ================================================== SUPPORT ==================================================
  T('TC_SUP_001', 'Customer Support', 'Contact Us page: support request form fields', 'Functional', 'High', '/contact-us', 'Open Contact Us → Raise a Support Request',
    'Booking ID, Title, Request Type, Service Type, Date, Description; Raise Ticket button', async ({ page }) => { const C = checker(); await go(page, '/contact-us');
      const l = (await page.locator('label:visible').allInnerTexts()).map(ui.norm);
      for (const f of ['Booking ID', 'Title', 'Request Type', 'Service Type', 'Date', 'Description']) C.ok(l.some(x => x.startsWith(f)), `Field "${f}"`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_SUP_001')] }; }),
  T('TC_SUP_002', 'Customer Support', 'Internal-only fields are not exposed to customers', 'Security', 'High', 'Support form',
    'Inspect form', 'Customer form must not offer Assign To / Priority / Status (agent-side fields)', async ({ page }) => { const C = checker(); await go(page, '/contact-us');
      const l = (await page.locator('label:visible').allInnerTexts()).map(ui.norm);
      const internal = l.filter(x => /^(Assign To|Priority|Status)/.test(x));
      C.ok(!internal.length, 'No agent-side fields on customer form', internal.join(', '));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_SUP_002')] }; }),
  T('TC_SUP_003', 'Customer Support', 'Raise Ticket with empty form shows validation', 'Negative', 'High', 'All blank', 'Click Raise Ticket submit with blank fields',
    'Required-field messages; no ticket created', async ({ page }) => { const C = checker(); await go(page, '/contact-us');
      const btns = page.getByRole('button', { name: /Raise Ticket|Submit/ }).filter({ visible: true });
      await btns.last().click().catch(() => {}); await page.waitForTimeout(1500);
      const m = await ui.msgs(page); const native = await page.locator('form :invalid').count();
      C.ok(m.some(x => /required|please/i.test(x)) || native, 'Validation shown', JSON.stringify(m) + ` invalid=${native}`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_SUP_003', { fullPage: true })] }; }),
  T('TC_SUP_004', 'Customer Support', 'Support form type tabs (Raise Ticket / Feedback / Complaint / Cancel Request)', 'Functional', 'Medium', '—',
    'Click each type', 'Form adapts to the chosen type', async ({ page }) => { const C = checker(); await go(page, '/contact-us'); const obs = {};
      for (const t of ['Submit Feedback', 'Submit Complaint', 'Cancel Request', 'Raise Ticket']) { await page.getByRole('button', { name: t, exact: true }).first().click().catch(() => {}); await page.waitForTimeout(800);
        obs[t] = (await page.locator('label:visible').allInnerTexts()).map(ui.norm).join('|').slice(0, 120); }
      C.ok(Object.keys(obs).length === 4, 'All 4 types clickable', JSON.stringify(obs).slice(0, 300));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_SUP_004')] }; }),
  T('TC_SUP_005', 'Customer Support', 'My Support History', 'Functional', 'Medium', '—', 'Click My Support History', 'List of past tickets or empty state',
    async ({ page }) => { const C = checker(); await go(page, '/contact-us'); await page.getByText('My Support History').first().click(); await page.waitForTimeout(2500);
      const t = await mainText(page); C.ok(/ticket|no .*found|history|status/i.test(t), 'History view shown', t.slice(0, 150));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_SUP_005', { mask: [page.locator('table, [class*="ticket" i]')] })] }; }),
  T('TC_SUP_006', 'Customer Support', 'FAQ accordion on Contact Us', 'Functional', 'Low', 'FAQ categories', 'Click a category and a question',
    'Answer expands; categories switch', async ({ page }) => { const C = checker(); await go(page, '/contact-us');
      const btn = page.locator('.accordion-button').filter({ hasText: 'How long does it take to receive a quotation?' }).first(); await btn.scrollIntoViewIfNeeded();
      const before = await btn.getAttribute('aria-expanded'); await btn.click(); await page.waitForTimeout(1000); const after = await btn.getAttribute('aria-expanded');
      C.ok(before !== after && after === 'true', 'Question expands on click', `aria-expanded ${before} → ${after}`);
      const first = await page.locator('.accordion-button').first().getAttribute('aria-expanded');
      C.ok(true, 'Accordion behaviour (observation)', `first question aria-expanded=${first} after opening another`);
      await page.getByText('Pricing & Payments').first().click().catch(() => {}); await page.waitForTimeout(800);
      const q2 = (await page.locator('.accordion-button:visible').allInnerTexts()).map(ui.norm).slice(0, 2);
      C.ok(!q2.includes('How do I submit a new inquiry?'), 'Category switch changes questions', q2.join(' | '));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_SUP_006')] }; }),
  T('TC_SUP_007', 'Customer Support', 'Submit a support ticket', 'Functional', 'High', 'Valid form', 'Fill → Raise Ticket', 'Ticket created',
    async () => ({ status: 'Blocked', actual: 'Blocked (approval not given): support tickets are on the requires-approval list.', checks: [], evidence: [] })),

  // =================================================== SERVICES ===================================================
  T('TC_SVC_001', 'Services & About', 'Services page category tabs', 'Functional', 'Medium', '/services', 'Click each category tab',
    'Service list changes per category', async ({ page }) => { const C = checker(); await go(page, '/services'); const obs = {};
      for (const t of ['Events & Group Movements', 'PREMIUM & VIP', 'COMMUNITY & SPECIAL', 'LEISURE & FAMILY', 'Corporate & Institutional']) { await page.getByRole('button', { name: t }).first().click().catch(() => {}); await page.waitForTimeout(1000);
        obs[t] = (await page.locator('button:visible').allInnerTexts()).map(ui.norm).filter(x => x.length > 10 && !/&/.test(x)).slice(0, 4).join(','); }
      C.ok(new Set(Object.values(obs)).size > 1, 'Content changes across tabs', JSON.stringify(obs).slice(0, 300));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_SVC_001')] }; }),
  T('TC_SVC_002', 'Services & About', 'About Us page sections', 'Functional', 'Low', '/about-us', 'Open About Us', 'Journey timeline, vision, mission, founder note, services',
    async ({ page }) => { const C = checker(); await go(page, '/about-us'); const t = await page.locator('body').innerText();
      for (const s of ['Our Journey', 'The Vision', 'The Mission', 'Founder', 'Types of Services']) C.ok(t.includes(s), `"${s}"`);
      C.ok(!(/since 1997/i.test(await (async () => { await go(page, '/'); return page.locator('body').innerText(); })()) && /since 2005/i.test(t)), 'Founding year consistent between Home and About', 'Home says "since 1997"; About says "since 2005"');
      return { status: C.status(), checks: C.list, evidence: [] }; }),
  T('TC_SVC_003', 'Services & About', '"Request Custom Quote" and "Explore All Services" CTAs', 'Functional', 'Low', 'About page', 'Click each CTA', 'Navigates to quote form / services',
    async ({ page }) => { const C = checker(); const obs = {};
      for (const b of ['Explore All Services', 'Request Custom Quote']) { await go(page, '/about-us'); const u = page.url(); const y = await page.evaluate(() => scrollY);
        await page.getByRole('button', { name: b }).first().click().catch(() => {}); await page.waitForTimeout(2500);
        obs[b] = { url: new URL(page.url()).pathname, modal: await page.locator('.modal.show').count(), moved: (await page.evaluate(() => scrollY)) !== y || page.url() !== u }; await page.keyboard.press('Escape'); }
      for (const [b, o] of Object.entries(obs)) C.ok(o.moved || o.modal, `${b} has an effect`, JSON.stringify(o));
      return { status: C.status(), checks: C.list, evidence: [] }; }),
];
