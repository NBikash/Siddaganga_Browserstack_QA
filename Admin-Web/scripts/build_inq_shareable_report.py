# Makes a single, self-contained (shareable) copy of the Inquiry Management run report:
# reports/<run>/admin-inquiry-management-qa-report.html -> ..._shareable.html, with every screenshot embedded and the
# proforma PDF embedded as page images with the QA account's name / phone / email masked. The original report,
# screenshots and PDF are only read. Run: python Admin-Web/scripts/build_inq_shareable_report.py
import base64, html, io, re
from pathlib import Path
import pymupdf
from PIL import Image

A = Path(__file__).resolve().parents[1]
RUN = (A / 'results/CURRENT_RUN_INQ').read_text().strip()
SRC = A / 'reports' / RUN / 'admin-inquiry-management-qa-report.html'
OUT = SRC.with_name('admin-inquiry-management-qa-report_shareable.html')
MAXW, Q = 1600, 78

env = {}
for l in (A.parent / 'User-Web/.env').read_text(encoding='utf-8').splitlines():
    if re.match(r'^\w+=', l):
        k, v = l.split('=', 1); env[k] = v.strip()
phone = re.sub(r'\D', '', env.get('USER_WEB_USERNAME', ''))[-10:]
PII = [s for s in {'Bikash N', 'Bikash', phone, phone[:5] + ' ' + phone[5:] if phone else ''} if s]

def jpeg(im):
    im = im.convert('RGB')
    if im.width > MAXW:
        im = im.resize((MAXW, round(im.height * MAXW / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=Q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()

cache = {}
def data_uri(p):
    p = p.resolve()
    if p not in cache:
        cache[p] = jpeg(Image.open(p))
    return cache[p]

def pdf_pages(p):
    doc = pymupdf.open(p); pages, hits = [], 0
    for pg in doc:
        rects = [r for s in PII for r in pg.search_for(s)]
        for w in pg.get_text('words'):
            t = w[4]; digits = re.sub(r'\D', '', t)
            customer_email = '@' in t and not re.search(r'@siddaganga', t, re.I)
            if customer_email or (phone and len(digits) >= 10 and digits[-10:] == phone):
                rects.append(pymupdf.Rect(w[:4]))
        for r in rects:
            pg.add_redact_annot(r, fill=(0, 0, 0))
        hits += len(rects); pg.apply_redactions()
        pix = pg.get_pixmap(dpi=150)
        pages.append(jpeg(Image.open(io.BytesIO(pix.tobytes('png')))))
    return pages, hits

h = SRC.read_text(encoding='utf-8'); base = SRC.parent; masked = 0
def img_link(m):
    p = base / html.unescape(m.group(1))
    return f'<img class="zoom" src="{data_uri(p)}" alt="{html.escape(p.name)}" title="Select to enlarge">'
h, n_img = re.subn(r'<a href="([^"]+\.png)" target="_blank"><img [^>]*></a>', img_link, h)
pdf_html = {}
def pdf_link(m):
    global masked
    p = (base / html.unescape(m.group(1))).resolve()
    if p not in pdf_html:
        pages, hits = pdf_pages(p); masked += hits
        pdf_html[p] = ''.join(f'<img class="zoom pdfpg" src="{u}" alt="{html.escape(p.name)} page {i+1}" title="{html.escape(p.name)}, page {i+1} (personal details masked)">' for i, u in enumerate(pages))
    return pdf_html[p]
h, n_pdf = re.subn(r'<a class="file" href="([^"]+\.pdf)" target="_blank">[^<]*</a>', pdf_link, h)
left = re.findall(r'(?:src|href)="(?!data:|#|https?:)[^"]+"', h)
assert not left, left[:5]

EXTRA = '''<style>.zoom{cursor:zoom-in}.pdfpg{border:1px solid #ccc;background:#fff}
#lb{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:99;cursor:zoom-out;padding:16px}
#lb.on{display:flex}#lb img{max-width:100%;max-height:100%;border-radius:6px;background:#fff}</style>
<div id="lb" role="dialog" aria-label="Evidence"><img alt=""></div>
<script>(function(){var lb=document.getElementById('lb'),i=lb.querySelector('img');
document.addEventListener('click',function(e){var t=e.target.closest('img.zoom');if(t){i.src=t.src;lb.classList.add('on');}});
lb.onclick=function(){lb.classList.remove('on');i.removeAttribute('src');};
document.addEventListener('keydown',function(e){if(e.key==='Escape')lb.onclick();});})();</script>
'''
h = h.replace('</body>', EXTRA + '</body>', 1)
OUT.write_text(h, encoding='utf-8')
print(f'written {OUT} ({OUT.stat().st_size/1e6:.1f} MB); screenshots embedded {n_img} ({len(cache)} unique); '
      f'proforma links {n_pdf}; PDF areas masked {masked}')
