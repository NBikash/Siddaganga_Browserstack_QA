// READ-ONLY probe with the execution guard (reads allowed, all saves blocked): inquiry details + edit form of an
// existing inquiry, and map presence on the Outstation form / results. No Save / Submit / Update is clicked.
import fs from 'node:fs';
import * as L from './ot-lib.mjs';
export default async ({ page }) => {
  const out = {}; const ID = process.env.INQ || 'DDEV675048';
  await L.guard(page);
  out.list = await L.myInquiries(page, 'X0');
  out.quote = await L.openQuotation(page, ID, 'X0');
  out.list2 = await L.myInquiries(page);
  out.edit = await L.openEdit(page, ID, 'X0');
  out.editNet = L.netLog.slice(-15);
  // map presence on the form
  await L.fill(page, { pickup: ['Whitefield', 'Whitefield'], dests: [['Mysuru', 'Mysuru']] });
  out.formMap = await L.mapInfo(page, null, 'X0-form');
  out.formMapFields = await L.active(page).evaluate(r => r.querySelectorAll('.gm-style').length);
  fs.writeFileSync('exploration-logs/raw/ot-explore3.json', JSON.stringify(out, null, 2));
  return { quote: out.quote.text.slice(0, 2500), quoteModal: out.quote.modal, edit: { url: out.edit.url, text: out.edit.text.slice(0, 2000), inputs: out.edit.inputs }, editNet: out.editNet, formMap: out.formMap };
};
