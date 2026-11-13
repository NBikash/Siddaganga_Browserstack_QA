// Runs an exploration step against the live session.
//   node scripts/run.mjs path/to/step.mjs      (default export: async ({ page, context, shot }) => result)
//   node scripts/run.mjs -e "<async body using page, context, shot>"
//   node scripts/run.mjs --close-extra-tabs    (closes every tab except the first – cleanup between batches)
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { connect, shot } from './lib.mjs';

const { context, page } = await connect();
if (process.argv[2] === '--close-extra-tabs') {
  const pages = context.pages();
  for (const p of pages.slice(1)) await p.close().catch(() => {});
  console.log(`closed ${Math.max(pages.length - 1, 0)} extra tab(s)`);
  process.exit(0);
}
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
} finally {
  // own tabs are always closed, so failed steps do not leave orphan tabs that slow down CDP
  if (process.env.ADMIN_WEB_NEW_PAGE) await page.close().catch(() => {});
}
if (failed) {
  console.error(failed);
  process.exit(1);
}
if (result !== undefined) console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
process.exit(0);
