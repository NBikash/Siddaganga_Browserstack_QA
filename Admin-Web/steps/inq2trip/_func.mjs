// Functional-QA helpers (admin-web-inquiry-to-trip skill, functional mode).
import fs from 'node:fs';
import path from 'node:path';
export const FRUN = process.env.FRUN || 'admin-web-20261113-1016-FUNC';
const RES = path.resolve('results', FRUN);
export { scrub, norm, settle, table, PII_INPUTS, FORBIDDEN, rowIndex, kebab, declineAdvance } from './_lib.mjs';
import { PII_INPUTS } from './_lib.mjs';
const upd = (f, fn) => { const p = path.join(RES, f); const a = JSON.parse(fs.readFileSync(p)); const r = fn(a); fs.writeFileSync(p, JSON.stringify(r ?? a, null, 2)); return r ?? a; };
export const rec = patch => upd('record.json', r => ({ ...r, ...(patch || {}) }));
// one entry per use case id (re-logging replaces)
export const uc = e => upd('usecases.json', a => [...a.filter(x => x.id !== e.id), { ts: new Date().toISOString(), ...e }]);
export const issue = e => upd('issues.json', a => [...a.filter(x => x.id !== e.id), { ts: new Date().toISOString(), ...e }]);
export const fsnap = (shot, page, mod, slug, opts = {}) => shot(`functional/${FRUN}/${mod}/${slug}`, { ...opts, mask: [...(opts.mask || []), page.locator(PII_INPUTS)] });
export const toasts = async (page, ms = 8000) => { const out = []; for (let i = 0; i < ms / 500; i++) { const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { out.push(...new Set(t)); break; } await page.waitForTimeout(500); } return out; };
export const netlog = page => { const n = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) n.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); }); return n; };
export const go = async (page, route) => { const base = /^https?:/.test(page.url()) ? page.url() : 'https://dari-preprod.siddagangatravels.com/'; await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(2500); };
