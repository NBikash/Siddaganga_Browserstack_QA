// Log AW-INQ-032/033/034/035/037 and issues. No browser actions.
import { uc, issue, load } from './_i.mjs';
export default async () => {
  const C = load('comms.json');
  const q1 = C['COMM-Send-Quote-send'], q2 = C['COMM-Send-Quote-retry'], p = C['COMM-Send-Proforma-Invoice-send'], b = C['COMM-Send-Bus-Images-inspect'], dl = C['COMM-Download-Proforma-Invoice-send'];
  const pnr = 'UMNF499106 (LD-414 → QRY-194, quote 1781, ₹34,200)';
  const pre = 'Superadmin, Preprod. QRY-194 after the AW-INQ-005/019 edits (costs restored to ₹34,200). Recipient check: the contact number in the row/dialog was compared in-process with the User-Web test account login (match recorded as true/false only; number masked in evidence).';
  uc({ id: 'AW-INQ-032', module: 'Inquiry Management', title: 'Send Quote to the customer: channel and content match the saved quote', pnr, objective: 'Quote is sent to the customer test account', pre,
    steps: ['QRY-194 row menu → Send Quote', 'Dialog: Customer Name, Mobile Number (optional), Quote Validity Date (pre-filled 26/11/2026)', 'Verify recipient = test account', 'Send Now', 'Second attempt (first one sent no request)'],
    expected: 'Quote sent to the test account; success message; content = saved quote',
    actual: `Recipient = test account: ${q2.recipientIsTestAccount}. Attempt 1: Send Now → button turned to a spinner, no API request within 13 s, no toast (nothing sent). Attempt 2: POST inquiry/send-quote-follow-up-whatsapp 200 in ~1 s, toast "${q2.toasts[0]}". Channel: WhatsApp (dialog has no channel choice). Message content could not be viewed in Admin; receipt on the test phone to be confirmed by the team.`,
    status: 'Pass', issues: ['INQ-ISS-20'], evidence: [q1.shotDialog, q1.shotAfter, q2.shot] });
  uc({ id: 'AW-INQ-033', module: 'Inquiry Management', title: 'Send Proforma Invoice: recipient and content', pnr, objective: 'Proforma invoice sent to the customer test account', pre,
    steps: ['QRY-194 row menu → Send Proforma Invoice', `Dialog: Customer Name, Mobile Number; Send Via ${p.channelsBefore.map(c => `${c.label} ${c.checked ? '☑' : '☐'}`).join(', ')}`, 'Verify recipient = test account', 'Send Now'],
    expected: 'Proforma sent; success message',
    actual: `Recipient = test account: ${p.phonesAreTestAccount}. Both channels pre-ticked (no email address on the inquiry). POST inquiry/send-proforma-invoice 200, toast "${p.toasts[0]}". Content as in the downloaded proforma (AW-INQ-034). Receipt on WhatsApp/email to be confirmed on the test account.`,
    status: 'Pass', evidence: [p.shotDialog, p.shotFilled] });
  uc({ id: 'AW-INQ-034', module: 'Inquiry Management', title: 'Download Proforma Invoice: amounts, GST and IDs match the quote', pnr, objective: 'Downloaded proforma matches the saved quote', pre,
    steps: ['QRY-194 row menu → Download Proforma Invoice', 'Open the PDF (PI-B-1003_proforma.pdf)', 'Compare with the quote (1781, ₹34,200, GST 5%)'],
    expected: 'Amounts = quote; GST shown consistently; IDs refer to the inquiry/quote',
    actual: `Downloaded ${dl.file} (${dl.size} bytes; APIs invoice/document-details, proforma-breakdown-preview 200). PI No. PI-B-1003, date 19/11/2026; Trip Description and dates 24–25/11/2026 Whitefield → Mysuru, 28 Seater Premium AC Coach, 600 km: Base 600 × 52 = 31,200 + Driver Bata 1,000 × 2 + Night Bata 1,000 × 1 = Sub Total / Total Rs. 34,200.00 (matches the quote). BUT amount in words "Thirty Five Thousand Nine Hundred Ten" (= 34,200 + 5% GST 1,710) while no GST line is shown and the total is 34,200; and it shows "Booking ID B-194" although the inquiry is not converted to a booking.`,
    status: 'Fail', issues: ['INQ-ISS-21'], evidence: [dl.file] });
  uc({ id: 'AW-INQ-035', module: 'Inquiry Management', title: 'Send Bus Images to the customer for the quoted vehicle type', pnr, objective: 'Bus images of the 28 Seater Premium AC Coach are sent to the test account', pre,
    steps: ['Verify row contact = test account', 'QRY-194 row menu → Send Bus Images'],
    expected: 'Confirmation, then images sent; success message',
    actual: `Row contact = test account: ${b.rowContactIsTestAccount}. No confirmation dialog: the menu click sends at once. POST inquiry/send-bus-images-whatsapp 400; toast "${b.toasts[0]}"; console "Failed to load resource: 400". Nothing sent.`,
    status: 'Fail', issues: ['INQ-ISS-22'], evidence: [b.shotNoDialog] });
  uc({ id: 'AW-INQ-037', module: 'Inquiry Management', title: 'Create an inquiry with valid data via + Add inquiry (Generate Quote)', pnr: '— (none: would need a new non-User-Web inquiry)', objective: 'Admin-created inquiry is saved and listed', pre: 'Approval condition: run only if it can use approved User-Web test data without creating an artificial PNR.',
    steps: ['Not executed'], expected: 'Inquiry created from Admin with valid data',
    actual: '+ Add inquiry creates a new inquiry/PNR entered in Admin, not one submitted through User-Web. Using an existing User-Web PNR is not possible on this form, so the case would violate the "no artificial PNRs / no unrelated records" rule. Blocked pending a decision (e.g. approve one Admin-created QA inquiry with a cleanup agreement). Form was inspected on 13 Nov (IM-06).',
    status: 'Blocked', evidence: [] });
  issue({ id: 'INQ-ISS-20', module: 'Inquiry Management', screen: 'Send Quote', title: 'Send Now sometimes hangs (spinner, no request sent); a second attempt sends immediately', classification: 'Functional (intermittent)', severity: 'Low', record: 'QRY-194',
    steps: ['QRY-194 → Send Quote → Send Now'], expected: 'Request sent and result shown', actual: 'Attempt 1: spinner, no API call in 13 s, no message. Attempt 2: sent (200) in 1 s', evidence: [q1.shotAfter, q2.shot] });
  issue({ id: 'INQ-ISS-21', module: 'Inquiry Management', screen: 'Download Proforma Invoice (PDF)', title: 'Proforma: amount in words (₹35,910 incl. GST) differs from the total (₹34,200) and no GST line is shown; shows Booking ID B-194 for an unconverted inquiry', classification: 'Functional / Document content', severity: 'High', record: 'QRY-194, PI-B-1003',
    steps: ['QRY-194 → Download Proforma Invoice', 'Read Total Amount and Amount (in words)'], expected: 'Words = figures; GST shown if charged; reference = inquiry/quote', actual: 'Total Rs. 34,200.00; words "Thirty Five Thousand Nine Hundred Ten Only"; no GST row; Booking ID B-194', evidence: [dl.file] });
  issue({ id: 'INQ-ISS-22', module: 'Inquiry Management', screen: 'Send Bus Images', title: 'Send Bus Images fails ("Failed to generate bus images PDF", HTTP 400) and sends without any confirmation', classification: 'Functional', severity: 'High', record: 'QRY-194 (28 Seater Premium AC Coach)',
    steps: ['QRY-194 row menu → Send Bus Images'], expected: 'Confirmation dialog; images sent', actual: 'Immediate POST send-bus-images-whatsapp 400; toast "Failed to generate bus images PDF"', evidence: [b.shotNoDialog] });
  return 'logged';
};
