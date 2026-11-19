// Must be imported first: sets FRUN before ../inq2trip/_func.mjs evaluates (ESM evaluates imports in order).
import fs from 'node:fs';
process.env.FRUN = process.env.FRUN || fs.readFileSync('results/CURRENT_RUN_INQ', 'utf8').trim();
