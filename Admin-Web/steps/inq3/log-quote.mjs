// Log the QRY-194 quote cases (AW-INQ-004, 018, 014, 019, 005, 013, 011, 017, 012) and their issues. No browser actions.
import { uc, issue, load } from './_i.mjs';
export default async () => {
  const R = load('quote-read.json')['QRY-194'], E = load('quote-edit.json'), V = load('vq-check.json'), DD = load('dd.json');
  const pnr = 'UMNF499106 (LD-414 → QRY-194, quote 1781)';
  const pre = 'Superadmin, Preprod. QRY-194 created 19 Nov from User-Web PNR UMNF499106 (Outstation, 24–25 Nov 2026, 20 pax, 28 Seater Premium AC Coach, ₹34,200). Form opened via row menu → Edit (/update-inquiry/bea778b7-…).';
  const vq = t => (t || '').replace(/.*COSTING /, '');
  uc({ id: 'AW-INQ-004', module: 'Inquiry Management', title: 'View Quote: content and values vs Update Quote form', pnr, objective: 'View Quote shows the same quote as the form', pre,
    steps: ['Total Inquiries → search "Bikash" → QRY-194 row → View Quote', 'Read the dialog', 'Row menu → Edit → read form costs'],
    expected: 'Same quote ID, trip type, vehicle and total as the form',
    actual: `View Quote "Quotation Summary": ${vq(R.viewQuote.dialog.text)}. Form: Booking Type Outstation, 28 Seater Premium AC Coach, Total Approx Cost ${R.costs.totalApproxCost} (600 km × 52 + driver 1000 × 2 + night 1000 = 34,200). Consistent.`,
    status: 'Pass', evidence: [R.viewQuote.shot, R.shotForm] });
  uc({ id: 'AW-INQ-018', module: 'Inquiry Management', title: 'Preview Quote Summary: content and values vs form', pnr, objective: 'Preview shows the form values', pre,
    steps: ['Update Quote form → Preview Quote Summary', 'Compare with form and View Quote'],
    expected: 'Quote ID, trip type, vehicle, costing equal to the form', actual: `Preview: ${vq(R.preview.text)}; buttons ${R.preview.buttons.join(', ')}. Same as form and View Quote. (Combined/Detailed Quotes are downloads: see AW-INQ-034.)`,
    status: 'Pass', evidence: [R.preview.shot] });
  uc({ id: 'AW-INQ-014', module: 'Inquiry Management', title: 'Booking Type / Month / Trip Description dropdowns', pnr, objective: 'Option lists are complete; a new description can be typed', pre,
    steps: ['Open Select Booking Type', 'Open Select Month', 'Open Trip Description (cleared, then refilled, not saved)'],
    expected: 'Booking types Local/Outstation/Transfer/(Dynamic); 12 months; Trip Description accepts free text',
    actual: `Booking Type (${DD.selects[0].value}): ${DD.selects[0].options.join(', ')}. Month (${DD.selects[1].value}): ${DD.selects[1].options.length} months January–December. Trip Description is free text with suggestions; suggestions come from OTHER inquiries, including one with contact details (INQ-ISS-09).`,
    status: 'Pass', issues: ['INQ-ISS-09'], evidence: [DD.shotSelect, DD.shotDesc] });
  const A = E.A;
  uc({ id: 'AW-INQ-019', module: 'Inquiry Management', title: 'Arrival/Departure time fields (12:00 AM): editable?', pnr, objective: 'The wrong 12:00 AM times can be corrected', pre: pre + ' User-Web submission: 24 Nov 9:00 AM → 25 Nov 8:00 PM; Admin showed 12:00 AM / 12:00 AM.',
    steps: ['Edit form → click Select Arrival Time → picker Hour 09, Min 00, AM', 'Select Departure Time → 08, 00, PM', 'Update Quote', 'Re-open the form and refresh'],
    expected: 'Times can be set and are kept after save',
    actual: `Fields are not typeable (read-only input) but open an Hour/Min/AM-PM picker (changed since 13 Nov, when they were not editable). Set ${A.arr} / ${A.dep}; toast "${A.save.toasts[0]}", update-inquiry 200; after re-open + refresh: ${A.after.times.join(' / ')}. The original 12:00 AM still comes from User-Web (INQ-ISS-06).`,
    status: 'Pass', evidence: [A.shotBefore, A.shotEdited, A.shotAfter] });
  uc({ id: 'AW-INQ-005', module: 'Inquiry Management', title: 'Edit inquiry: Trip Description saved, re-opened, refreshed → persisted', pnr, objective: 'Edited non-financial field is saved', pre,
    steps: ['Row menu → Edit', `Trip Description = "${A.descTyped}" (Tab, not Enter)`, 'Update Quote', 'Re-open via URL and refresh'],
    expected: 'Description kept after re-open and refresh; costs unchanged',
    actual: `Before: "${A.before.desc}". Saved: toast "${A.save.toasts[0]}", POST update-inquiry 200. After re-open + refresh: "${A.after.desc}", total ${A.after.costs.totalApproxCost} (unchanged).`,
    status: 'Pass', evidence: [A.shotBefore, A.shotEdited, A.shotAfter] });
  const B = E.B;
  uc({ id: 'AW-INQ-013', module: 'Inquiry Management', title: 'GST "Change" control: options; change and revert', pnr, objective: 'GST can be changed and reverted', pre,
    steps: ['Edit form → GST Value → Change', 'Open GST Value select; choose 0% → Save', 'Change → 5% → Save', 'Reload the form (no Update Quote)'],
    expected: 'Options listed; chosen GST applied; revert restores 5%',
    actual: `Dialog "Change GST Value" (select). Options: 0%, 5%, 18%. 0% → Save: toast "Customer info updated successfully." and GST field 0% (saved at once, without Update Quote). Reverted to 5% the same way; after reload GST ${B.afterReload.gst}. Total Approx Cost stayed ${B.afterReload.costs.totalApproxCost} at 0% and 5% (GST not part of the total).`,
    status: 'Pass', issues: ['INQ-ISS-10'], evidence: [B.shotDlg, B.shotChanged] });
  const C = E.C;
  uc({ id: 'AW-INQ-011', module: 'Inquiry Management', title: 'Cost recalculation when extra km / toll / extras change', pnr, objective: 'Total Approx Cost recomputes', pre,
    steps: ['Edit form → Vehicle Costs: Extra KM 0 → 50', 'Toll & Parking 0 → 500', "Any Extra's 0 → 250", 'Read Total Approx Cost (live)', 'Update Quote', 'Re-open + refresh'],
    expected: `Total = 34,200 + 50 × 52 + 500 + 250 = ${C.expected.toLocaleString('en-IN')}`,
    actual: `Live total after Extra KM 50: ${C.liveAfterExtraKm.totalApproxCost}; after toll/extras: ${C.live.totalApproxCost}. Saved ("${C.save.toasts[0]}"); after re-open: extra km ${C.after.costs.extraKms}, toll ${C.after.costs.toll}, extras ${C.after.costs.extra}, total ${C.after.costs.totalApproxCost}. Total never recalculated (recurrence of 13 Nov ISS-06).`,
    status: 'Fail', issues: ['INQ-ISS-08'], evidence: [C.shotBefore, C.shotEdited, C.shotAfter] });
  uc({ id: 'AW-INQ-017', module: 'Inquiry Management', title: 'Update Quote with edited values → re-open → persisted; list and View Quote show the new value', pnr, objective: 'Saved values persist and are reflected in list and View Quote', pre,
    steps: ['After AW-INQ-011 save: re-open + refresh the form', 'Total Inquiries row', 'View Quote', 'Preview Quote Summary'],
    expected: 'Edited values persisted; View Quote/Preview show the updated quote',
    actual: `Persisted: extra km ${C.after.costs.extraKms}, toll ${C.after.costs.toll}, extras ${C.after.costs.extra}; description and times (AW-INQ-005/019) persisted. Not reflected: View Quote ${vq(V['after-C'].viewQuote.text)}; Preview ${vq(V['after-C'].preview.text)} (₹500 toll, ₹250 extras and 50 extra km missing). List row has no amount column.`,
    status: 'Fail', issues: ['INQ-ISS-08'], evidence: [C.shotAfter, V['after-C'].shotVQ, V['after-C'].shotPV] });
  const D = E.D;
  uc({ id: 'AW-INQ-012', module: 'Inquiry Management', title: 'Apply Final Quote checkbox and Fixed Cost field', pnr, objective: 'Fixed Cost enabled only when applied; applied fixed cost becomes the final quote', pre,
    steps: ['Edit form → Fixed Cost (disabled?)', 'Tick "Apply fixed cost"', 'Fixed Cost = 36000', 'Update Quote', 'Re-open; View Quote'],
    expected: 'Field enabled after tick; final quote / total = 36,000 after save and in View Quote',
    actual: `Fixed Cost disabled before tick: ${D.fixedDisabledBefore}; after tick: disabled ${D.fixedDisabledAfterTick}. Live total with 36000: ${D.live.totalApproxCost}. Saved ("${D.save.toasts[0]}"); after re-open fixed cost ${D.after.costs.fixedCost}, total ${D.after.costs.totalApproxCost}; View Quote ${vq(V['after-D'].viewQuote.text)}. Fixed cost never applied. Restored afterwards (stage E: fixed cost 0, unticked, extra km/toll/extras 0, total ${E.E.after.costs.totalApproxCost}).`,
    status: 'Fail', issues: ['INQ-ISS-11'], evidence: [D.shotEdited, D.shotAfter, V['after-D'].shotVQ, E.E.shotAfter] });
  issue({ id: 'INQ-ISS-08', module: 'Inquiry Management', screen: 'Update Quote – Vehicle Costs', title: 'Total Approx Cost is not recalculated when extra km, toll or extras change (also after saving); View Quote/Preview keep the old total', classification: 'Functional (recurrence of 13 Nov ISS-06)', severity: 'High', record: 'QRY-194',
    steps: ['Edit QRY-194', 'Extra KM 50, Toll 500, Extras 250', 'Update Quote; re-open; View Quote'], expected: '₹37,550', actual: '₹34,200 in form, View Quote and Preview; components saved', evidence: [C.shotEdited, C.shotAfter, V['after-C'].shotVQ] });
  issue({ id: 'INQ-ISS-09', module: 'Inquiry Management', screen: 'Update Quote – Trip Description', title: 'Trip Description suggestions show other inquiries\' descriptions, including contact details', classification: 'Data privacy', severity: 'Medium', record: 'QRY-194',
    steps: ['Edit QRY-194', 'Clear Trip Description to open its suggestions'], expected: 'Only generic presets, or this client\'s own descriptions', actual: 'Suggestions include descriptions from other inquiries; one contains an email and a phone number (QA test data of another session). Masked in evidence', evidence: [DD.shotDesc] });
  issue({ id: 'INQ-ISS-10', module: 'Inquiry Management', screen: 'Update Quote – Change GST Value', title: 'GST change is saved immediately ("Customer info updated successfully") without Update Quote, and does not affect Total Approx Cost', classification: 'Functional (clarification)', severity: 'Low', record: 'QRY-194',
    steps: ['Edit QRY-194 → GST Change → 0% → Save'], expected: 'GST change applied with the quote (Update Quote/Cancel) and reflected in the quote amount', actual: 'Saved at once (form Cancel cannot undo it); total unchanged at 0% and 5%. Reverted to 5%', evidence: [B.shotChanged] });
  issue({ id: 'INQ-ISS-11', module: 'Inquiry Management', screen: 'Update Quote – Fixed Cost / Apply Final Quote', title: 'Applied Fixed Cost is saved but not used as the final quote', classification: 'Functional (recurrence of 13 Nov QT-05)', severity: 'High', record: 'QRY-194',
    steps: ['Edit QRY-194', 'Tick Apply fixed cost; Fixed Cost 36000', 'Update Quote; re-open; View Quote'], expected: 'Final quote ₹36,000', actual: 'Fixed cost 36000.00 saved; total and View Quote ₹34,200', evidence: [D.shotEdited, D.shotAfter, V['after-D'].shotVQ] });
  return 'logged';
};
