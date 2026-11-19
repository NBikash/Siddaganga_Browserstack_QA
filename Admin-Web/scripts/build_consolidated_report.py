# Builds one self-contained HTML report covering every Admin-Web run.
# Reads (never modifies) the master inventory, the execution register and the four run reports; screenshots are
# embedded once each as compressed JPEG. Run from anywhere: python Admin-Web/scripts/build_consolidated_report.py
import base64, hashlib, html, io, json, os, re, sys
from collections import Counter, OrderedDict
from pathlib import Path
import openpyxl
from PIL import Image

A = Path(__file__).resolve().parents[1]
INV = A / 'documentation/01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx'
REG = A / 'documentation/04_Execution_Register/Execution_Register.md'
OUT_DIR = A / 'reports/admin-web-consolidated-20261119'
OUT = OUT_DIR / 'admin-web-consolidated-qa-report.html'
RUNS = [
    ('admin-web-20261112-2229-INQ2TRIP', 'inquiry-to-trip-report.html', 'End-to-end workflow · 12 Nov'),
    ('admin-web-20261113-1016-FUNC', 'admin-functional-qa-report.html', 'Functional Lead → Trip Closure · 13 Nov'),
    ('admin-web-20261116-1523-FUNC', 'admin-functional-qa-report.html', 'Lead Management · 16 Nov'),
    ('admin-web-20261119-1545-INQ', 'admin-inquiry-management-qa-report.html', 'Inquiry Management · 19 Nov'),
]
STATUSES = ['Pass', 'Fail', 'Blocked', 'Partial', 'Not Run', 'Never Executed']
MAXW, Q = 1280, 68

# ---------- master inventory ----------
wb = openpyxl.load_workbook(INV, read_only=True)
mods, per = [], {}
for r in wb['Master Inventory'].iter_rows(min_row=2, values_only=True):
    if not r[1]:
        continue
    m, st = r[2], (r[9] or 'Never Executed')
    if m not in per:
        mods.append(m); per[m] = Counter()
    per[m][st] += 1
tot = Counter()
for c in per.values():
    tot.update(c)
unknown = set(tot) - set(STATUSES)
if unknown:
    sys.exit(f'unexpected statuses: {unknown}')
N = sum(tot.values())

# ---------- execution register (first table) ----------
reg_rows = []
for line in REG.read_text(encoding='utf-8').splitlines():
    if line.startswith('| `admin-web-'):
        reg_rows.append([c.strip().strip('`') for c in line.strip('|').split('|')])
assert len(reg_rows) == len(RUNS), reg_rows

# ---------- images ----------
images, keyof = OrderedDict(), {}
def img_key(p: Path):
    p = p.resolve()
    if p in keyof:
        return keyof[p]
    im = Image.open(p)
    im = im.convert('RGB')
    if im.width > MAXW:
        im = im.resize((MAXW, round(im.height * MAXW / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=Q, optimize=True, progressive=True)
    k = 'i' + hashlib.sha1(str(p).encode()).hexdigest()[:10]
    images[k] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    keyof[p] = k
    return k

missing, run_docs = [], []
for run, fname, label in RUNS:
    src = A / 'reports' / run / fname
    h = src.read_text(encoding='utf-8')
    base = src.parent
    def sub_src(m):
        p = base / html.unescape(m.group(1))
        if not p.exists():
            missing.append(str(p)); return m.group(0)
        return f'src="" data-k="{img_key(p)}"'
    def sub_href(m):
        target = html.unescape(m.group(1))
        p = base / target
        if re.search(r'\.(png|jpe?g)$', target, re.I):
            if not p.exists():
                missing.append(str(p)); return m.group(0)
            return f'href="#" data-k="{img_key(p)}"'
        # other relative files (e.g. the proforma PDF): re-point relative to the consolidated report
        rel = os.path.relpath(p, OUT_DIR).replace(os.sep, '/')
        if not p.exists():
            missing.append(str(p))
        return f'href="{html.escape(rel)}" data-ext="1"'
    h = re.sub(r'src="(?!data:|https?:)([^"]+)"', sub_src, h)
    h = re.sub(r'href="(?!#|data:|https?:|mailto:)([^"]+)"', sub_href, h)
    run_docs.append((run, label, h))

# ---------- page ----------
e = html.escape
def bar(c, n):
    return ''.join(f'<span class="seg s-{s.lower().replace(" ", "-")}" style="width:{100*c[s]/n:.2f}%" title="{s}: {c[s]}"></span>' for s in STATUSES if c[s])
tiles = ''.join(f'<div class="tile s-{s.lower().replace(" ", "-")}"><b>{tot[s]}</b><span>{s}</span></div>' for s in STATUSES)
mod_rows = ''.join(
    f'<tr><td>{e(m)}</td>' + ''.join(f'<td class="num">{per[m][s] or ""}</td>' for s in STATUSES)
    + f'<td class="num"><b>{sum(per[m].values())}</b></td><td class="barcell"><div class="bar">{bar(per[m], sum(per[m].values()))}</div></td></tr>'
    for m in mods)
mod_rows += '<tr class="tot"><td>Total</td>' + ''.join(f'<td class="num">{tot[s]}</td>' for s in STATUSES) + f'<td class="num">{N}</td><td class="barcell"><div class="bar">{bar(tot, N)}</div></td></tr>'
executed = N - tot['Never Executed']
reg_html = ''.join(
    f'<tr><td><a href="#run{i+1}" data-tab="{i+1}" class="mono">{e(r[0])}</a></td><td>{e(r[1])}</td><td>{e(r[2])}</td><td>{e(r[3])}</td><td>{e(r[4])}</td><td>{e(r[5])}</td></tr>'
    for i, r in enumerate(reg_rows))
tabs = '<button class="tab on" data-tab="0">Overview</button>' + ''.join(
    f'<button class="tab" data-tab="{i+1}">{e(lbl)}</button>' for i, (_, lbl, _) in enumerate(run_docs))
panes = ''.join(
    f'<section class="pane" id="pane{i+1}" hidden><div class="runhead"><span class="mono">{e(run)}</span> · {e(lbl)}</div>'
    f'<iframe title="{e(lbl)}" data-doc="doc{i+1}"></iframe></section>'
    for i, (run, lbl, _) in enumerate(run_docs))
docs = ''.join(f'<script type="text/plain" id="doc{i+1}">{h.replace("</script", "<\\/script")}</script>' for i, (_, _, h) in enumerate(run_docs))

page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin-Web QA Report</title><style>
:root{{--bg:#f6f7f9;--card:#fff;--fg:#1d2330;--mut:#5e6777;--line:#dfe3ea;--acc:#1f3864;
--pass:#2e8b4f;--fail:#c2412d;--blocked:#c98a12;--partial:#7a5cc2;--notrun:#8a93a3;--never:#d5dae2}}
@media (prefers-color-scheme:dark){{:root:not([data-theme=light]){{--bg:#12151b;--card:#1b2029;--fg:#e6e9ef;--mut:#9aa3b2;--line:#2c3340;--acc:#8fb0ff;--never:#39414f}}}}
:root[data-theme=dark]{{--bg:#12151b;--card:#1b2029;--fg:#e6e9ef;--mut:#9aa3b2;--line:#2c3340;--acc:#8fb0ff;--never:#39414f}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}}
header.top{{background:var(--acc);color:#fff;padding:20px 24px}}:root[data-theme=dark] header.top{{color:#0d1220}}
@media (prefers-color-scheme:dark){{:root:not([data-theme=light]) header.top{{color:#0d1220}}}}
header.top h1{{margin:0;font-size:22px}}header.top p{{margin:4px 0 0;opacity:.85}}
nav{{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line);display:flex;gap:4px;overflow-x:auto;padding:0 16px}}
.tab{{border:0;background:none;color:var(--mut);padding:12px 14px;font:inherit;cursor:pointer;white-space:nowrap;border-bottom:3px solid transparent}}
.tab.on{{color:var(--fg);border-color:var(--acc);font-weight:600}}
main{{max-width:1280px;margin:0 auto;padding:20px 16px}}.card{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px;margin-bottom:18px}}
h2{{margin:0 0 12px;font-size:17px}}.mut{{color:var(--mut)}}.mono{{font-family:ui-monospace,Consolas,monospace;font-size:12.5px}}
.tiles{{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}}
.tile{{border:1px solid var(--line);border-left:5px solid var(--c);border-radius:8px;padding:10px 12px}}.tile b{{display:block;font-size:24px}}.tile span{{color:var(--mut)}}
.s-pass{{--c:var(--pass)}}.s-fail{{--c:var(--fail)}}.s-blocked{{--c:var(--blocked)}}.s-partial{{--c:var(--partial)}}.s-not-run{{--c:var(--notrun)}}.s-never-executed{{--c:var(--never)}}
.scroll{{overflow-x:auto}}table{{border-collapse:collapse;width:100%}}th,td{{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}}
th{{font-size:12px;color:var(--mut);font-weight:600}}.num{{text-align:right;font-variant-numeric:tabular-nums}}tr.tot td{{font-weight:600;border-top:2px solid var(--line)}}
.barcell{{min-width:160px}}.bar{{display:flex;height:12px;border-radius:6px;overflow:hidden;background:var(--never);margin-top:4px}}.seg{{background:var(--c)}}
.legend{{display:flex;flex-wrap:wrap;gap:12px;margin-top:10px;color:var(--mut);font-size:12px}}.legend i{{display:inline-block;width:10px;height:10px;border-radius:2px;background:var(--c);margin-right:5px}}
a{{color:var(--acc)}}ul.notes{{margin:0;padding-left:18px}}ul.notes li{{margin:4px 0}}
.runhead{{padding:0 0 10px;color:var(--mut)}}iframe{{width:100%;border:1px solid var(--line);border-radius:10px;background:#fff;min-height:400px;display:block}}
#lb{{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:20;cursor:zoom-out;padding:16px}}
#lb img{{max-width:100%;max-height:100%;border-radius:6px}}#lb.on{{display:flex}}
</style></head><body>
<header class="top"><h1>Admin-Web QA: consolidated report</h1><p>Preprod Admin portal · Superadmin · all runs from 12 to 19 Nov 2026 · built 19 Nov 2026 from the master inventory and the run reports</p></header>
<nav>{tabs}</nav>
<main>
<section class="pane" id="pane0">
<div class="card"><h2>Master inventory: {N} use cases</h2><div class="tiles">{tiles}</div>
<p class="mut">{executed} of {N} cases ({100*executed/N:.0f}%) have a recorded result; {tot["Never Executed"]} have never been executed. Each case shows its latest status from <span class="mono">Admin_Web_Master_Use_Case_Inventory.xlsx</span>, the single source of truth.</p></div>
<div class="card"><h2>Status by module</h2><div class="scroll"><table><thead><tr><th>Module</th>{"".join(f'<th class="num">{s}</th>' for s in STATUSES)}<th class="num">Total</th><th>Distribution</th></tr></thead><tbody>{mod_rows}</tbody></table></div>
<div class="legend">{"".join(f'<span class="s-{s.lower().replace(" ", "-")}"><i></i>{s}</span>' for s in STATUSES)}</div></div>
<div class="card"><h2>Execution runs</h2><div class="scroll"><table><thead><tr><th>Run ID</th><th>Date</th><th>Mode</th><th>Scope</th><th>Result</th><th>Defects / issues</th></tr></thead><tbody>{reg_html}</tbody></table></div>
<p class="mut">Run results are as reported at the time. A later run can supersede a case's status in the inventory (for example the 16 Nov Lead Management and 19 Nov Inquiry Management re-runs); the earlier result stays in the inventory remarks.</p></div>
<div class="card"><h2>About this report</h2><ul class="notes">
<li>Each run tab contains the original run report, unchanged except for the image links. Screenshots are embedded as compressed JPEG copies (max {MAXW} px wide). Select a screenshot to enlarge it.</li>
<li>The screenshots are the masked or redacted versions held in the project. The originals are under <span class="mono">Admin-Web/screenshots/</span>.</li>
<li>The proforma PDF (19 Nov run) is not embedded. It contains the QA account's name and phone number, so the link only works inside the project folder.</li>
<li>Ten catalogued modules are not yet consolidated into the master inventory and are not counted here (see <span class="mono">documentation/README.md</span>).</li></ul></div>
</section>
{panes}
</main>
<div id="lb" role="dialog" aria-label="Screenshot"><img alt=""></div>
<script type="application/json" id="imgs">{json.dumps(images)}</script>
{docs}
<script>
(function(){{
var IM=JSON.parse(document.getElementById('imgs').textContent),lb=document.getElementById('lb'),lbi=lb.querySelector('img');
function zoom(k){{lbi.src=IM[k];lb.classList.add('on');}}
lb.onclick=function(){{lb.classList.remove('on');lbi.removeAttribute('src');}};
document.addEventListener('keydown',function(e){{if(e.key==='Escape')lb.onclick();}});
function fit(f){{var d=f.contentDocument;if(d&&d.documentElement)f.style.height=(d.documentElement.scrollHeight+4)+'px';}}
function load(f){{
  if(f.dataset.ok)return;f.dataset.ok=1;
  f.onload=function(){{
    var d=f.contentDocument;
    d.querySelectorAll('img[data-k]').forEach(function(i){{i.src=IM[i.dataset.k];}});
    d.querySelectorAll('a[data-ext]').forEach(function(a){{a.target='_blank';}});
    d.addEventListener('click',function(e){{
      var t=e.target.closest('[data-k]');
      if(t){{e.preventDefault();zoom(t.dataset.k);return;}}
      var a=e.target.closest('a[href^="#"]');
      if(a&&a.getAttribute('href').length>1){{var el=d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
        if(el){{e.preventDefault();window.scrollTo({{top:f.getBoundingClientRect().top+window.scrollY+el.getBoundingClientRect().top-60,behavior:'smooth'}});}}}}
    }});
    fit(f);
    if(window.ResizeObserver)new ResizeObserver(function(){{fit(f);}}).observe(d.documentElement);
    d.querySelectorAll('img').forEach(function(i){{i.addEventListener('load',function(){{fit(f);}});}});
  }};
  f.srcdoc=document.getElementById(f.dataset.doc).textContent;
}}
function show(n){{
  document.querySelectorAll('.tab').forEach(function(b){{b.classList.toggle('on',b.dataset.tab==n);}});
  document.querySelectorAll('.pane').forEach(function(p){{p.hidden=p.id!=='pane'+n;}});
  var f=document.querySelector('#pane'+n+' iframe');if(f)load(f);
  window.scrollTo(0,0);try{{history.replaceState(null,'',n=='0'?'#':'#run'+n);}}catch(e){{}}
}}
document.querySelectorAll('[data-tab]').forEach(function(b){{b.addEventListener('click',function(e){{e.preventDefault();show(b.dataset.tab);}});}});
var m=/^#run(\\d)$/.exec(location.hash);show(m?m[1]:'0');
}})();
</script></body></html>'''

OUT_DIR.mkdir(parents=True, exist_ok=True)
OUT.write_text(page, encoding='utf-8')
print('written', OUT, f'{OUT.stat().st_size/1e6:.1f} MB')
print('images embedded', len(images), 'missing', len(missing))
for p in missing:
    print('  missing:', p)
print('inventory', dict(tot), 'total', N)
