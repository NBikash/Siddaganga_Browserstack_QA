// AW-INQ-032/033/035 (send) and 034 (download) on QRY-194. env ACTION = menu item text, MODE = inspect | send.
// Recipient check: digits/email shown in the dialog (or the inquiry form) are compared in-process with the User-Web test
// account (User-Web/.env USER_WEB_USERNAME); only booleans are recorded. Send only when the recipient is the test account.
import fs from 'node:fs';
import path from 'node:path';
import { settle, scrub, fsnap, toasts, save, load, evidence, closeDialogs, closeMenu, RUNID } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
const { ACTION, MODE } = process.env;
const env = Object.fromEntries(fs.readFileSync('../User-Web/.env', 'utf8').split(/\r?\n/).filter(l => /^\w+=/.test(l)).map(l => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const acct = (env.USER_WEB_USERNAME || '').replace(/\D/g, '').slice(-10);
const digits = s => [...new Set((s.match(/(?:\+?91[\s-]?)?[6-9]\d{9}/g) || []).map(x => x.replace(/\D/g, '').slice(-10)))];
const emails = s => [...new Set(s.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || [])];
export default async ({ page, shot }) => {
  const tag = `COMM-${ACTION.replace(/\W+/g, '-')}-${MODE}`; const o = { action: ACTION, mode: MODE };
  const all = (() => { try { return load('comms.json'); } catch { return {}; } })();
  try {
    if (!acct || acct.length !== 10) throw new Error('test account number not available');
    const { row, text } = await inqRow(page, 'QRY-194'); o.row = text;
    // row contact (masked in output) vs test account
    const rawRow = await row.innerText(); o.rowContactIsTestAccount = digits(rawRow).length ? digits(rawRow).every(d => d === acct) : null;
    o.menu = await menuOf(page, row);
    const ev = evidence(page);
    const it = page.locator('.MuiMenu-root:visible [role=menuitem]').filter({ hasText: new RegExp('^\\s*' + ACTION + '\\s*$') });
    if ((await it.count()) !== 1) throw new Error(`${ACTION} count ${await it.count()}`);
    let download = null;
    if (/Download/.test(ACTION)) {
      const dl = page.waitForEvent('download', { timeout: 30000 }).catch(() => null);
      await it.click(); download = await dl;
      if (download) { const f = path.join('results', RUNID, 'downloads', `QRY-194-${download.suggestedFilename()}`); fs.mkdirSync(path.dirname(f), { recursive: true }); await download.saveAs(f); o.file = f.split(path.sep).join('/'); o.size = fs.statSync(f).size; }
      o.toasts = await toasts(page, 5000); await settle(page, 2000);
      o.newTabs = page.context().pages().map(p => p.url().replace(/\?.*/, '')).filter(u => !/total-inquiries/.test(u));
    } else {
      await it.click(); await page.waitForTimeout(2000);
      const d = page.locator('[role=dialog]:visible').last();
      for (let i = 0; i < 12 && !(await d.count()); i++) await page.waitForTimeout(500);
      if (await d.count()) {
        const raw = await d.innerText();
        const inputs = await d.locator('input:visible, textarea:visible').evaluateAll(es => es.map(e => e.value));
        const all = raw + ' ' + inputs.join(' ');
        o.dialog = { text: scrub(raw).replace(/\s+/g, ' ').slice(0, 1500), buttons: (await d.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean), fields: (await d.locator('input:visible, textarea:visible').evaluateAll(es => es.map(e => e.name || e.placeholder || e.type))) };
        o.recipientPhones = digits(all).length; o.recipientEmails = emails(all).length;
        o.phonesAreTestAccount = digits(all).length ? digits(all).every(x => x === acct) : null;
        o.shotDialog = await fsnap(shot, page, 'comms', `${tag}-dialog`, { mask: [d.locator('input:visible, textarea:visible')] });
        if (MODE === 'send') {
          if (o.phonesAreTestAccount === false) throw new Error('recipient is NOT the test account: not sent');
          if (o.phonesAreTestAccount === null && o.rowContactIsTestAccount !== true) throw new Error('recipient could not be verified: not sent');
          const dt = d.locator('input[type=date]:visible');
          if ((await dt.count()) && !(await dt.first().inputValue())) { await dt.first().fill('2026-11-23'); o.validity = '2026-11-23'; }
          const cbs = d.locator('input[type=checkbox]');
          o.channelsBefore = await cbs.evaluateAll(es => es.map(e => ({ label: (e.closest('label') || e.parentElement.parentElement).innerText.trim(), checked: e.checked })));
          if ((await cbs.count()) && !o.channelsBefore.some(c => c.checked)) { await cbs.first().check(); }
          o.channelsUsed = await cbs.evaluateAll(es => es.map(e => ({ label: (e.closest('label') || e.parentElement.parentElement).innerText.trim(), checked: e.checked })));
          o.shotFilled = await fsnap(shot, page, 'comms', `${tag}-filled`, { mask: [d.locator('input[type=text]:visible')] });
          const send = d.locator('button:visible').filter({ hasText: /^\s*(Send|Send Quote|Send Invoice|Send Images|Submit|Yes|Confirm)\b/i });
          if ((await send.count()) !== 1) throw new Error('send button count ' + await send.count() + ' in ' + o.dialog.buttons.join('/'));
          o.sentWith = (await send.innerText()).trim(); await send.click();
          o.toasts = await toasts(page, 10000); await settle(page, 3000);
          o.dialogsAfter = await page.locator('[role=dialog]:visible').count();
          if (o.dialogsAfter) o.dialogAfter = scrub(await page.locator('[role=dialog]:visible').last().innerText()).replace(/\s+/g, ' ').slice(0, 500);
          o.shotAfter = await fsnap(shot, page, 'comms', `${tag}-after`);
        }
        await closeDialogs(page);
      } else { o.dialog = null; o.toasts = await toasts(page, 8000); o.shotNoDialog = await fsnap(shot, page, 'comms', `${tag}-no-dialog`); }
    }
    o.net = ev.net; o.console = ev.cons.filter(x => !/AWS/.test(x));
    await closeMenu(page).catch(() => {});
  } finally { all[tag] = o; save('comms.json', all); }
  return o;
};
