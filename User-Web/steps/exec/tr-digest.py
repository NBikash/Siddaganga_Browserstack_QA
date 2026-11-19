# Compact digest per step: route, band, summary bits, fare breakup amounts, confirm cost, messages, errors.
# Usage: python -X utf8 steps/exec/tr-digest.py <RUN_ID> <TC> [<TC> ...]
import json, sys, re
run = sys.argv[1]
def money(lines):
    out, prev = [], None
    for l in lines or []:
        if re.match(r'^₹[\d,]+|^Actuals|^Additional', l) and prev: out.append(f'{prev}={l}')
        prev = l
    return out
for tc in sys.argv[2:]:
    try: d = json.load(open(f'results/{run}/{tc}.json', encoding='utf-8'))
    except Exception as e: print(tc, 'MISSING', e); continue
    print('#####', tc)
    for s in d['steps']:
        r = s.get('res') or {}
        st = (s.get('fill') or {}).get('state') or s.get('state')
        bits = {k: v for k, v in dict(
            err=s.get('error'), skipped=s.get('skipped'),
            from_to=(st or {}).get('from', '')[:28] + ' -> ' + (st or {}).get('to', '')[:28] if st else None,
            ret=[(st or {}).get('rfrom'), (st or {}).get('rto')] if st and st.get('rfrom') is not None else None,
            dt=(st or {}).get('dt') if st else None, pax=(st or {}).get('pax') if st else None,
            nav=r.get('navigated'), msgs=r.get('msgs'), found=r.get('found'), band=r.get('band'), dates=r.get('dates'), dur=r.get('durationTxt'), rpax=r.get('pax'),
            breakup=money((s.get('details') or {}).get('pricing')),
            confirm=((s.get('confirm') or {}).get('cost'), (s.get('confirm') or {}).get('dates'), (s.get('confirm') or {}).get('popup'), (s.get('confirm') or {}).get('selected')) if s.get('confirm') else None,
        ).items() if v not in (None, [], {}, '', (None, None, None, None))}
        extra = {k: v for k, v in s.items() if k not in ('label', 'res', 'fill', 'state', 'details', 'confirm', 'error', 'skipped', 'formShot', 'shot', 'shots', 'errorShot')}
        print(' ', s['label'], json.dumps(bits, ensure_ascii=False))
        if extra: print('     extra', json.dumps(extra, ensure_ascii=False)[:1500])
