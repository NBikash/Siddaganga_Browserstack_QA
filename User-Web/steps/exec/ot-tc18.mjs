// OUT-18: edit the inquiry submitted by OUT-17 (PNR passed as INQ). Approved Save = "Update Inquiry" for the valid date edit only.
// Invalid edit is NEVER saved: values are typed, messages recorded, then the page is left by URL (no Back/Update click).
import * as L from './ot-lib.mjs';
const { snap, norm } = L;
async function setDateInput(page, ph, ddmmyyyy) {
  const i = page.locator(`input[placeholder="${ph}"]`).first();
  await i.click(); await page.keyboard.press('Control+A'); await page.keyboard.type(ddmmyyyy, { delay: 40 }); await page.keyboard.press('Enter');
  await page.waitForTimeout(600); await page.mouse.click(5, 300); await page.waitForTimeout(400);
  return i.inputValue();
}
const inputs = page => page.locator('main input:visible, form input:visible, main select:visible, form select:visible').evaluateAll(els => els.map(e => [e.placeholder || e.name, e.tagName === 'SELECT' ? e.options[e.selectedIndex]?.text : e.value]));
export default async ({ page }) => {
  const ID = process.env.INQ; const rec = { id: 'OUT-18', pnr: ID, started: new Date().toISOString(), steps: [] };
  const run = async (label, fn) => { const s = { label }; try { Object.assign(s, await fn()); } catch (e) { s.error = String(e).split('\n')[0].slice(0, 300); s.errorShot = await snap(page, `OUT-18-${label}-error`).catch(() => null); } rec.steps.push(s); };
  await L.guard(page);
  await run('1-dependency', async () => { const l = await L.myInquiries(page, 'OUT-18-list'); return { listed: l.parsed.find(r => r.id === ID) || null }; });
  await run('2-3-baseline-and-editable', async () => {
    const e = await L.openEdit(page, ID, 'OUT-18-baseline');
    const destInputs = await page.locator('input[placeholder*="destination" i], input[placeholder*="pickup" i], input[placeholder*="drop" i]').count();
    return { text: e.text.slice(0, 1800), inputs: e.inputs, destinationOrLocationInputs: destInputs, shot: e.shot };
  });
  await run('4-invalid-not-saved', async () => {
    const v = await setDateInput(page, 'Select end date', '10/01/2027');
    const msgs = (norm(await page.locator('body').innerText()).match(/[^.]{0,60}(must|invalid|before|after|required|cannot)[^.]{0,60}/gi) || []).slice(0, 5);
    const shot = await snap(page, 'OUT-18-invalid-end-date-not-saved', { fullPage: true });
    await page.goto(new URL('/dashboard', process.env.USER_WEB_URL).href); await page.waitForTimeout(2000);   // leave WITHOUT saving
    const l = await L.myInquiries(page); const e = await L.openEdit(page, ID, 'OUT-18-after-cancel');
    return { typedEnd: v, msgs, shot, afterCancel: e.inputs, unchanged: JSON.stringify(e.inputs).includes('13/01/2027') };
  });
  await run('5-edit-dates-save', async () => {
    const endV = await setDateInput(page, 'Select end date', '14/01/2027');
    const dur = page.locator('input[name=tripDuration]'); await dur.fill('4'); await page.waitForTimeout(500);
    const before = await inputs(page); const shotBefore = await snap(page, 'OUT-18-edit-before-save', { fullPage: true });
    L.allowList.push(/update-inquiry|inquiry\/update|edit-inquiry/); const n0 = L.netLog.length;
    await page.getByRole('button', { name: 'Update Inquiry' }).first().click(); await page.waitForTimeout(6000);
    L.allowList.length = 0;
    const toasts = (await page.locator('.Toastify__toast, [role=alert], .swal2-popup, .modal.show').allInnerTexts().catch(() => [])).map(norm).map(L.PII);
    return { endV, before, calls: L.netLog.slice(n0), toasts, url: page.url().replace(/[0-9a-f-]{36}/, '<id>'), shotBefore, shotAfter: await snap(page, 'OUT-18-after-update') };
  });
  await run('6-7-persistence', async () => {
    const l = await L.myInquiries(page, 'OUT-18-list-after'); const row = l.parsed.filter(r => r.id === ID);
    const e1 = await L.openEdit(page, ID, 'OUT-18-reopen');
    await page.reload(); await page.waitForTimeout(5000); const e2 = await L.readEdit(page, 'OUT-18-reload');
    return { rows: row, total: l.total, reopen: e1.inputs, reopenText: e1.text.match(/Journey Details.{0,400}/)?.[0], reload: e2.inputs };
  });
  rec.steps.push({ label: '8-pickup-destination-drop-edit', notPossible: 'Edit Inquiry page shows pickup, destinations and drop only as read-only text; no control exists to change them (Edit 1 and pickup part of Edit 2 cannot be executed).' });
  rec.finished = new Date().toISOString(); rec.net = L.netLog.filter(l => !/GetViewportInfo|crypto|fcm|popular|explore-fleet/.test(l));
  L.save('OUT-18', rec);
  return rec.steps.map(s => ({ label: s.label, err: s.error }));
};
