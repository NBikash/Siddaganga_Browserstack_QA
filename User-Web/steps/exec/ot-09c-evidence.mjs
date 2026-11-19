// Evidence recapture for OUT-09 run C (Confirm screen only; nothing submitted, saves blocked).
import * as L from './ot-lib.mjs';
export default async ({ page }) => {
  await L.guard(page);
  await L.fill(page, { pickup: ['Sarjapur Road', 'Sarjapur'], dests: [['Kolar', 'Kolar']], dates: ['2026-12-17', '2026-12-18'], times: ['11:30 PM', '4:00 AM'], pax: 25 });
  await L.search(page, 'OUT-09-C-recheck');
  const { m, out } = await L.confirmScreen(page, 'D40NA', 'OUT-09-C-recheck');
  const tot = m.getByText('Estimated Grand Total', { exact: false }).last();
  await tot.scrollIntoViewIfNeeded(); await m.evaluate(el => { const b = el.querySelector('.modal-body') || el; b.scrollTop = b.scrollHeight; }); await page.waitForTimeout(800);
  const box = await tot.evaluate(el => { let p = el; for (let i = 0; i < 3; i++) p = p.parentElement; return p.innerText.replace(/\s+/g, ' '); });
  const shot = await L.snap(page, 'OUT-09-C-grand-total');
  await L.closeModal(page);
  return { cost: out.cost, box, shot };
};
