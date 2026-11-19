# Prints a case result compactly. Usage: python -X utf8 steps/exec/tr-show.py <RUN_ID> <TC> [maxchars]
import json, sys
run, tc = sys.argv[1], sys.argv[2]; mx = int(sys.argv[3]) if len(sys.argv) > 3 else 3000
d = json.load(open(f'results/{run}/{tc}.json', encoding='utf-8'))
DROP = {'fill', 'formShot', 'page1', 'route'}
def strip(o):
    if isinstance(o, dict): return {k: strip(v) for k, v in o.items() if k not in DROP and v not in (None, [], {}, '')}
    if isinstance(o, list): return [strip(x) for x in o]
    return o
for s in d['steps']:
    print(json.dumps(strip(s), ensure_ascii=False)[:mx]); print()
print('NET', [l for l in d.get('net', []) if 'save' in l or 'BLOCK' in l or 'update' in l])
