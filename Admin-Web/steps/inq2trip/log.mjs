// node steps/inq2trip/log.mjs '<json step>' ['<json record patch>']
import { logStep, record } from './_lib.mjs';
logStep(JSON.parse(process.argv[2])); if (process.argv[3]) record(JSON.parse(process.argv[3]));
