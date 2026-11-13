// Read-only deep inspection of one screen.
// Usage: INSPECT='{"key":"..","folder":"..","route":"..","open":["+ Add X"],"rowActions":true,"click":["Tab"]}' node scripts/run.mjs steps/inspect.mjs
//  - lists dropdown options (opens and Escapes), sortable headers, first-row action controls
//  - opens the given "open" buttons / first-row View & Edit icons ONLY to read the form, then closes without submitting
import fs from 'node:fs';

const BASE = 'https://dari-dev.siddagangatravels.com';
const DENY = /save|submit|send|delete|remove|sync|clear|confirm|approve|reject|cancel trip|update|activate|logout|upload|record payment|assign|apply/i;
const cfg = JSON.parse(process.env.INSPECT);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);

async function settle(page) {
  await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
  await page.waitForTimeout(900);
}

async function readForm(scope) {
  return scope.evaluate(root => {
    const txt = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
    const fields = [];
    for (const el of root.querySelectorAll('input, textarea, select, [role=combobox]')) {
      if (el.type === 'hidden') continue;
      if (el.tagName === 'INPUT' && el.getAttribute('aria-hidden') === 'true') continue;
      if (el.tagName === 'INPUT' && el.closest('[role=combobox]')) continue;
      let label = '';
      if (el.type === 'checkbox' || el.type === 'radio') label = txt(el.closest('label'));
      if (!label && el.id) label = txt(root.querySelector(`label[for="${CSS.escape(el.id)}"]`));
      if (!label) label = el.getAttribute('aria-label') || '';
      if (!label) {
        let p = el.parentElement;
        for (let i = 0; i < 4 && p && !label; i++, p = p.parentElement) {
          const l = p.querySelector('label');
          if (l && txt(l).length < 80) label = txt(l);
        }
      }
      if (!label) {
        let p = el.parentElement;
        for (let i = 0; i < 3 && p && !label; i++, p = p.parentElement) {
          const prev = p.previousElementSibling;
          if (prev && txt(prev).length && txt(prev).length < 60) label = txt(prev);
        }
      }
      fields.push({
        label: label.replace(/\s*\*\s*$/, ''),
        required: el.required || el.getAttribute('aria-required') === 'true' || /\*\s*$/.test(label),
        tag: el.tagName.toLowerCase(), type: el.type || el.getAttribute('role') || '',
        placeholder: el.placeholder || '', disabled: el.disabled || el.getAttribute('aria-disabled') === 'true',
        readOnly: el.readOnly || undefined,
        value: el.type === 'password' ? '[hidden]' : (el.value || (el.getAttribute('role') === 'combobox' ? txt(el) : '')).slice(0, 40),
        maxLength: el.maxLength > 0 ? el.maxLength : undefined, min: el.min || undefined, max: el.max || undefined,
        inputMode: el.inputMode || undefined, accept: el.accept || undefined, multiple: el.multiple || undefined,
        checked: (el.type === 'checkbox' || el.type === 'radio') ? el.checked : undefined,
      });
    }
    const buttons = [...new Set([...root.querySelectorAll('button')].map(b => txt(b) || b.getAttribute('aria-label') || b.querySelector('svg')?.getAttribute('data-testid') || '[icon]'))];
    const headings = [...new Set([...root.querySelectorAll('h1,h2,h3,h4,h5,h6,legend')].map(txt).filter(Boolean))].slice(0, 30);
    const helper = [...new Set([...root.querySelectorAll('.MuiFormHelperText-root')].map(txt).filter(Boolean))].slice(0, 20);
    const tabs = [...root.querySelectorAll('[role=tab]')].map(txt);
    return { headings, tabs, fields, buttons, helper, text: txt(root).slice(0, 2500) };
  });
}

async function dropdownOptions(page, scope, max = 12) {
  const out = [];
  const combos = scope.locator('[role=combobox]');
  const n = Math.min(await combos.count(), max);
  for (let i = 0; i < n; i++) {
    const c = combos.nth(i);
    if (!await c.isVisible().catch(() => false)) continue;
    if (await c.getAttribute('aria-disabled') === 'true') continue;
    const name = ((await c.getAttribute('aria-label')) || (await c.innerText().catch(() => '')) || (await c.getAttribute('placeholder')) || `combo${i}`).trim();
    await c.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(800);
    const opts = await page.locator('[role=listbox] [role=option], .MuiAutocomplete-popper li, .MuiMenu-paper li').allInnerTexts().catch(() => []);
    out.push({ name, options: opts.map(s => s.trim()).filter(Boolean).slice(0, 40), optionCount: opts.length });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
  return out;
}

async function closeOverlay(page) {
  // only buttons named exactly Cancel / Close (or the close icon) – never "Cancel Booking" etc.
  const overlay = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible, .MuiModal-root:visible').last();
  const cands = [overlay.getByRole('button', { name: /^(cancel|close)$/i }), overlay.locator('button:has(svg[data-testid=CloseIcon]), button[aria-label="close" i]')];
  for (const c of cands) {
    const b = c.first();
    if (await b.count() && await b.isVisible().catch(() => false)) {
      await b.click().catch(() => {});
      await page.waitForTimeout(600);
      if (!await page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').count()) return 'closed';
    }
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  return await page.locator('[role=dialog]:visible').count() ? 'still-open' : 'closed-esc';
}

async function captureOpened(page, shot, label, folder, startUrl) {
  await settle(page);
  if (cfg.openWait) await page.waitForTimeout(cfg.openWait);
  const dialog = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible, .MuiModal-root:visible .MuiPaper-root:visible').last();
  const isDialog = (await dialog.count()) > 0;
  const urlChanged = page.url() !== startUrl;
  const scope = isDialog ? dialog : page.locator('main');
  const form = await readForm(scope);
  const dd = await dropdownOptions(page, scope, 15);
  const shots = [await shot(`${folder}/${slug(cfg.key)}-${slug(label)}`, { fullPage: !isDialog })];
  if (isDialog) {
    await dialog.evaluate(d => { const sc = d.querySelector('.MuiDialogContent-root') || d; sc.scrollTop = sc.scrollHeight; }).catch(() => {});
    await page.waitForTimeout(300);
    shots.push(await shot(`${folder}/${slug(cfg.key)}-${slug(label)}-bottom`));
  }
  const closed = isDialog ? await closeOverlay(page) : 'n/a';
  return { opened: label, container: isDialog ? 'dialog' : (urlChanged ? 'page:' + page.url().replace(BASE, '') : 'inline'), ...form, dropdowns: dd, shots, closed };
}

async function gotoStart(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await settle(page);
  // wait for real content (tables/cards load after network-idle on this app)
  await page.locator('main table tbody tr, main h4, main h5').first().waitFor({ timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(800);
  for (const c of cfg.click || []) {
    await page.locator('main').getByText(c, { exact: true }).first().click().catch(() => {});
    await settle(page);
  }
  for (const sel of cfg.clickSel || []) {
    await page.locator(sel).first().click({ timeout: 5000 }).catch(() => {});
    await settle(page);
  }
  if (cfg.openWait) await page.waitForTimeout(cfg.openWait);
}

export default async ({ page, shot }) => {
  const T0 = Date.now();
  const BUDGET = cfg.budget || 300000; // per-view time budget: stop opening more forms and save a partial result
  const overBudget = () => Date.now() - T0 > BUDGET;
  const folder = cfg.folder;
  const res = { key: cfg.key, route: cfg.route };
  await gotoStart(page, BASE + cfg.route);
  const start = page.url();
  res.url = start.replace(BASE, '');
  res.page = await readForm(page.locator('main'));
  res.pageDropdowns = await dropdownOptions(page, page.locator('main'));
  res.table = await page.locator('main').evaluate(m => [...m.querySelectorAll('table')].map(t => ({
    columns: [...t.querySelectorAll('thead th')].map(th => ({ name: th.innerText.trim(), sortable: !!th.querySelector('.MuiTableSortLabel-root, [class*=sort i], svg') })),
    firstRowActions: [...(t.querySelector('tbody tr')?.querySelectorAll('button, a, [role=button], input[type=checkbox], .MuiSwitch-root') || [])].map(b => b.innerText.trim() || b.getAttribute('aria-label') || b.getAttribute('title') || b.querySelector('svg')?.getAttribute('data-testid') || (b.className.toString().match(/MuiSwitch|Checkbox|Chip/) || ['[icon]'])[0]),
    rows: t.querySelectorAll('tbody tr').length,
  })));
  res.pageShot = await shot(`${folder}/${slug(cfg.key)}-00-page`, { fullPage: true });
  res.opened = [];

  const AUTO = /^\+|^add\b|^new\b|^view\b|details|quotation|^manage\b|availability|^access$|permissions|^revised/i;
  const openList = [...(cfg.open || [])];
  if (cfg.autoOpen) {
    for (const b of res.page.buttons) if (AUTO.test(b) && !openList.includes(b) && !/^view all/i.test(b)) openList.push(b);
  }
  res.openList = openList;
  for (const label of openList) {
    if (overBudget()) { res.truncated = 'time budget reached before: ' + label; break; }
    if (DENY.test(label)) { res.opened.push({ opened: label, skipped: 'deny-list' }); continue; }
    await gotoStart(page, BASE + cfg.route);
    const b = page.locator('main').getByRole('button', { name: label }).first();
    await b.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
    const target = (await b.count()) ? b : page.locator('main').getByText(label, { exact: true }).first();
    if (!await target.count()) { res.opened.push({ opened: label, error: 'not found' }); continue; }
    try { await target.click({ timeout: 5000 }); } catch (e) { res.opened.push({ opened: label, error: e.message.split('\n')[0] }); continue; }
    res.opened.push(await captureOpened(page, shot, label, folder, start));
  }

  if (cfg.rowActions) {
    // first-row non-destructive icons only (view / edit / more); delete and status switches are never clicked
    const icons = cfg.rowIcons || ['VisibilityIcon', 'VisibilityOutlinedIcon', 'RemoveRedEyeIcon', 'RemoveRedEyeOutlinedIcon', 'EditIcon', 'EditOutlinedIcon', 'ModeEditIcon', 'ModeEditOutlineOutlinedIcon', 'BorderColorOutlinedIcon', 'MoreVertIcon', 'MoreHorizIcon'];
    for (const ic of icons) {
      if (overBudget()) { res.truncated = res.truncated || 'time budget reached in row actions'; break; }
      await gotoStart(page, BASE + cfg.route);
      await page.locator('main table tbody tr').first().waitFor({ timeout: 10000 }).catch(() => {});
      const el = page.locator(`main table tbody tr`).first().locator(`svg[data-testid="${ic}"]`).first();
      if (!await el.count()) continue;
      const before = page.url();
      const visibleItems = () => page.locator('button:visible, [role=menuitem]:visible, li:visible').evaluateAll(es => es.map(e => (e.innerText || '').trim()).filter(t => t && t.length < 50));
      const pre = new Set(await visibleItems());
      await el.click({ timeout: 4000 }).catch(() => {});
      await page.waitForTimeout(800);
      const isMenuIcon = /More/.test(ic);
      const menu = isMenuIcon ? [...new Set((await visibleItems()).filter(t => !pre.has(t)))] : [];
      if (isMenuIcon) {
        res.opened.push({ opened: 'row:' + ic, menu });
        await page.keyboard.press('Escape');
        for (const item of menu) {
          if (DENY.test(item) || !/^(edit|view|details|manage|show|open|history|track|preview)/i.test(item)) continue;
          await gotoStart(page, BASE + cfg.route);
          await page.locator('main table tbody tr').first().locator(`svg[data-testid="${ic}"]`).first().click({ timeout: 4000 }).catch(() => {});
          await page.waitForTimeout(700);
          const mi = page.getByText(item, { exact: true }).last();
          if (!await mi.count()) continue;
          const b2 = page.url();
          await mi.click({ timeout: 4000 }).catch(() => {});
          res.opened.push(await captureOpened(page, shot, 'row-menu-' + item, folder, b2));
        }
        continue;
      }
      res.opened.push(await captureOpened(page, shot, 'row-' + ic, folder, before));
    }
    for (const t of cfg.rowButtons || []) {
      if (DENY.test(t) || overBudget()) continue;
      await gotoStart(page, BASE + cfg.route);
      await page.locator('main table tbody tr').first().waitFor({ timeout: 10000 }).catch(() => {});
      const el = page.locator('main table tbody tr').first().getByText(t).first();
      await el.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (!await el.count()) { res.opened.push({ opened: 'row:' + t, error: 'not found' }); continue; }
      const before = page.url();
      await el.click({ timeout: 4000 }).catch(() => {});
      res.opened.push(await captureOpened(page, shot, 'row-' + t, folder, before));
    }
  }

  fs.mkdirSync('exploration-logs/raw/inspect', { recursive: true });
  let out = `exploration-logs/raw/inspect/${slug(cfg.key)}.json`;
  for (let n = 2; fs.existsSync(out); n++) out = `exploration-logs/raw/inspect/${slug(cfg.key)}-r${n}.json`; // never overwrite
  fs.writeFileSync(out, JSON.stringify(res, null, 2));
  const brief = o => o.skipped ? `${o.opened}: SKIPPED(${o.skipped})`
    : o.error ? `${o.opened}: ERR ${o.error}`
    : o.menu ? `${o.opened}: MENU[${o.menu.join('|')}]`
    : `${o.opened}: ${o.container} fields=${o.fields?.length} [${(o.fields || []).map(f => (f.label || f.placeholder || '?') + (f.required ? '*' : '') + ':' + f.type + (f.disabled ? '(dis)' : '')).join('; ').slice(0, 900)}] dd[${(o.dropdowns || []).map(d => d.name + '=' + d.options.slice(0, 8).join('/')).join(' ; ').slice(0, 500)}] btns[${(o.buttons || []).join('|').slice(0, 250)}] ${o.closed}`;
  return `${res.key} ${res.url}\n page fields: ${(res.page.fields || []).map(f => (f.label || f.placeholder) + ':' + f.type).join('; ').slice(0, 400)}\n tables: ${JSON.stringify(res.table).slice(0, 1000)}\n dropdowns: ${res.pageDropdowns.map(d => d.name + '=' + d.options.join('/')).join(' ; ').slice(0, 800)}\n` + res.opened.map(brief).join('\n');
};
