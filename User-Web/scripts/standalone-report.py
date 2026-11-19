# Makes a single self-contained HTML from a report that links screenshots: every <img>/<a href> to a local PNG is
# replaced by an embedded, compressed JPEG (data URI) and clicking a screenshot opens it full-size in an in-page viewer.
# Usage: python scripts/standalone-report.py <report.html> <out.html>
import re, sys, os, base64, io
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
base = os.path.dirname(os.path.abspath(src))
html = open(src, encoding='utf-8').read()
cache, missing = {}, []
def uri(rel):
    if rel in cache: return cache[rel]
    p = os.path.normpath(os.path.join(base, rel))
    if not os.path.exists(p): missing.append(rel); cache[rel] = rel; return rel
    im = Image.open(p).convert('RGB')
    if im.width > 1400: im = im.resize((1400, round(im.height * 1400 / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=72, optimize=True)
    cache[rel] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(); return cache[rel]
# <a href="x.png" target="_blank"><img src="x.png" ...></a>  →  <a href="#" class="zoom"><img src="data:..." ...></a>
html = re.sub(r'<a href="([^"]+\.png)" target="_blank"><img src="\1"', lambda m: f'<a href="#" class="zoom"><img src="{uri(m.group(1))}"', html)
html = re.sub(r'<img src="([^"]+\.png)"', lambda m: f'<img src="{uri(m.group(1))}"', html)
viewer = '''<div id="lb" onclick="this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:99;cursor:zoom-out;overflow:auto;padding:16px;text-align:center"><img id="lbi" style="max-width:100%;height:auto;border-radius:6px"><div id="lbc" style="color:#fff;font-size:13px;margin-top:6px"></div></div>
<script>document.addEventListener('click',e=>{const a=e.target.closest('a.zoom');if(!a)return;e.preventDefault();const i=a.querySelector('img');document.getElementById('lbi').src=i.src;document.getElementById('lbc').textContent=i.alt||'';document.getElementById('lb').style.display='block';});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('lb').style.display='none';});</script>'''
html = html.replace('</body>', viewer + '</body>').replace('figure img{', 'figure img{cursor:zoom-in;')
html = html.replace('<p class="muted">Legend:', '<p class="muted">Self-contained report: all screenshots are embedded (click to enlarge, Esc to close). Personal data in screenshots is masked.</p><p class="muted">Legend:')
open(out, 'w', encoding='utf-8').write(html)
print(f'images embedded: {len(cache) - len(missing)}; missing: {missing}; size: {os.path.getsize(out) / 1e6:.1f} MB')
