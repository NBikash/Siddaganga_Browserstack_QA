// Runs an exploration step against the live session (modelled on Admin-Web/scripts/run.mjs).
//   node scripts/run.mjs path/to/step.mjs   (default export: async ({ page, context, shot }) => result)
//   node scripts/run.mjs -e "<async body using page, context, shot>"
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { connect, shot } from './lib.mjs';

const { context, page } = await connect();
const helpers = { page, context, shot: (rel, opts) => shot(page, rel, opts) };
let result, failed;
try {
  if (process.argv[2] === '-e') {
    const AsyncFn = Object.getPrototypeOf(async () => {}).constructor;
    result = await new AsyncFn('page', 'context', 'shot', process.argv[3])(helpers.page, helpers.context, helpers.shot);
  } else {
    const mod = await import(pathToFileURL(path.resolve(process.argv[2])).href);
    result = await mod.default(helpers);
  }
} catch (e) {
  failed = e;
}
if (failed) { console.error(failed); process.exit(1); }
if (result !== undefined) console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
process.exit(0);
