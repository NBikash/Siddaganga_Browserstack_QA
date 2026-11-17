// Generate documentation/All_Modules_Functional_Test_Cases.{csv,md} from the case metadata (single source of truth).
import fs from 'node:fs';
import { ALL } from './exec.mjs';
const csvq = s => `"${String(s ?? '').replace(/"/g, '""')}"`;
const cols = ['id', 'module', 'title', 'type', 'priority', 'data', 'steps', 'expected'];
const head = ['Test Case ID', 'Module', 'Title', 'Type', 'Priority', 'Test Data', 'Steps', 'Expected Result'];
fs.writeFileSync('documentation/All_Modules_Functional_Test_Cases.csv', [head.map(csvq).join(','), ...ALL.map(c => cols.map(k => csvq(c[k])).join(','))].join('\n') + '\n');
const mods = [...new Set(ALL.map(c => c.module))];
const count = (f) => ALL.filter(f).length;
let md = `# Siddaganga Travels User Web (Preprod) – Functional Test Cases, All Modules\n\n`;
md += `Generated ${new Date().toISOString().slice(0, 10)} from exploration of the Preprod site. Source of truth: \`steps/allmod/cases-*.mjs\` (each case is also the executable check).\n\n`;
md += `**Total:** ${ALL.length} cases · Critical ${count(c => c.priority === 'Critical')} · High ${count(c => c.priority === 'High')} · Medium ${count(c => c.priority === 'Medium')} · Low ${count(c => c.priority === 'Low')}\n\n`;
md += `| Module | Cases | Functional | Negative | Boundary | Edge/Other |\n|---|---|---|---|---|---|\n`;
for (const m of mods) { const L = ALL.filter(c => c.module === m); md += `| ${m} | ${L.length} | ${L.filter(c => c.type === 'Functional').length} | ${L.filter(c => c.type === 'Negative').length} | ${L.filter(c => c.type === 'Boundary').length} | ${L.filter(c => !['Functional', 'Negative', 'Boundary'].includes(c.type)).length} |\n`; }
md += `\nTest data comes from \`User_WEB_cases.xlsx\` (LOCAL, OUTSTATION, TRANSFER_P2P, TRANSFER_P2P+RETURN, TRANSFER_BYhr, ADDITIONAL_TEST_INFO). Dates are relative to the run date (D+n). Irreversible steps (Confirm & Submit, Save As Draft, tickets, profile save, logout) need explicit approval each time; without it they are recorded as *Blocked (approval not given)*.\n`;
for (const m of mods) {
  md += `\n## ${m}\n\n| ID | Title | Type | Priority | Test Data | Steps | Expected Result |\n|---|---|---|---|---|---|---|\n`;
  for (const c of ALL.filter(c => c.module === m)) md += `| ${c.id} | ${c.title} | ${c.type} | ${c.priority} | ${c.data} | ${c.steps} | ${c.expected} |\n`.replace(/\n(?!$)/g, ' ');
}
fs.writeFileSync('documentation/All_Modules_Functional_Test_Cases.md', md);
console.log(`wrote ${ALL.length} cases`);
