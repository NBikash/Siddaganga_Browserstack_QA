// AW-INQ-032 retry with full request/response capture for 60 s (recipient verified = test account, as in comms.mjs).
import fs from 'node:fs';
import { scrub, fsnap, toasts, save, load, closeDialogs } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
const env = Object.fromEntries(fs.readFileSync('../User-Web/.env', 'utf8').split(/\r?\n/).filter(l => /^\w+=/.test(l)).map(l => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const acct = (env.USER_WEB_USERNAME || '').replace(/\D/g, '').slice(-10);
export default async ({ page, shot }) => {
  const o = {}; const log = [];
  const { row } = await inqRow(page, 'QRY-194'); await menuOf(page, row);
  await page.locator('.MuiMenu-root:visible [role=menuitem]').filter({ hasText: /^\s*Send Quote\s*$/ }).click();
  const d = page.locator('[role=dialog]:visible').last(); await d.waitFor({ timeout: 15000 });
  const vals = await d.locator('input').evaluateAll(es => es.map(e => ({ type: e.type, v: e.value })));
  const phone = (vals.find(x => /\d{10}/.test(x.v.replace(/\D/g, ''))) || {}).v || '';
  o.recipientIsTestAccount = phone.replace(/\D/g, '').slice(-10) === acct; o.validity = (vals.find(x => x.type === 'date') || {}).v;
  if (!o.recipientIsTestAccount) throw new Error('recipient is not the test account: not sent');
  page.on('request', r => { if (/\/api\//.test(r.url())) log.push(`${(Date.now() / 1000 | 0) % 1000} → ${r.method()} ${new URL(r.url()).pathname}`); });
  page.on('response', r => { if (/\/api\//.test(r.url())) log.push(`${(Date.now() / 1000 | 0) % 1000} ← ${r.status()} ${new URL(r.url()).pathname}`); });
  page.on('requestfailed', r => log.push(`FAILED ${r.method()} ${new URL(r.url()).pathname} ${r.failure()?.errorText}`));
  await d.locator('button:visible').filter({ hasText: /^\s*Send Now\s*$/ }).click();
  o.buttonsAfterClick = (await d.locator('button:visible').allInnerTexts()).map(x => x.trim());
  o.toasts = await toasts(page, 60000);
  o.dialogOpen = await page.locator('[role=dialog]:visible').count();
  o.shot = await fsnap(shot, page, 'comms', 'COMM-Send-Quote-retry-after');
  o.requests = log.filter(x => !/crypto|fcm|notification$/.test(x));
  await closeDialogs(page);
  const all = load('comms.json'); all['COMM-Send-Quote-retry'] = o; save('comms.json', all); return o;
};
