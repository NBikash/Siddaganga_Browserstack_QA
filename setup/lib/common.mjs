// Shared helpers for doctor/bootstrap. Node built-ins only, so they run before `npm install`.
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const p = (...parts) => join(ROOT, ...parts);

export function readJson(rel) {
    return JSON.parse(readFileSync(p(rel), 'utf8'));
}

// Parses a .env file into { KEY: value }. Values are only ever used for presence checks or
// passed to child processes — callers must never print them.
export function parseEnvFile(rel = '.env') {
    const file = p(rel);
    if (!existsSync(file)) return null;
    const out = {};
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (!m) continue;
        out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    }
    return out;
}

// Loads .env into process.env without overriding variables already set in the shell.
export function loadEnv() {
    const env = parseEnvFile() || {};
    for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) process.env[k] = v;
    }
}

const PLACEHOLDER = /^(|your[_-].*|changeme|<.*>|xxx+|todo)$/i;
export const isSet = (v) => typeof v === 'string' && !PLACEHOLDER.test(v.trim());

export function run(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
        return null;
    }
}

export function cmpVersion(a, b) {
    const pa = String(a).replace(/^v/, '').split('.').map(Number);
    const pb = String(b).replace(/^v/, '').split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        const d = (pa[i] || 0) - (pb[i] || 0);
        if (d) return Math.sign(d);
    }
    return 0;
}

// Minimal range check for the forms used in package.json ("^x.y.z", "~x.y.z", "x.y.z").
export function satisfies(version, range) {
    const base = range.replace(/^[\^~>=]+/, '');
    if (cmpVersion(version, base) < 0) return false;
    const [vMaj, vMin] = version.split('.').map(Number);
    const [bMaj, bMin] = base.split('.').map(Number);
    if (range.startsWith('^')) return vMaj === bMaj;
    if (range.startsWith('~')) return vMaj === bMaj && vMin === bMin;
    if (range.startsWith('>=')) return true;
    return cmpVersion(version, base) === 0;
}

// ---------- Apps (config/project.json -> apps). Banni is the default and keeps its original layout. ----------
export const DEFAULT_APP = 'banni';

// Value of --app <name> (or --app=<name>) from argv; defaults to Banni.
export function appArg(argv = process.argv) {
    const i = argv.findIndex((a) => a === '--app' || a.startsWith('--app='));
    if (i === -1) return DEFAULT_APP;
    const v = argv[i].includes('=') ? argv[i].split('=')[1] : argv[i + 1];
    return String(v || DEFAULT_APP).toLowerCase();
}

// Registry entry for an app; throws for unknown names so a typo never falls back to Banni silently.
export function appInfo(app = DEFAULT_APP) {
    const apps = readJson('config/project.json').apps || {};
    const info = apps[app];
    if (!info || typeof info !== 'object' || !info.configs) {
        const known = Object.keys(apps).filter((k) => apps[k]?.configs);
        throw new Error(`unknown app "${app}" (known: ${known.join(', ') || DEFAULT_APP})`);
    }
    return { id: app, ...info };
}

// Platform config for an app, e.g. appConfig('saagane', 'android') -> config/saagane/android.json.
export function appConfig(app, platform) {
    const rel = appInfo(app).configs[platform];
    if (!rel) throw new Error(`app "${app}" has no ${platform} configuration`);
    return readJson(rel);
}

// Artifact folders (relative to ROOT) for a run. Banni keeps <platform>/{results,reports,evidence};
// other apps use the paths in their own config (e.g. android/results/saagane, reports/saagane).
export function runPaths(platform, app = DEFAULT_APP) {
    if (app === DEFAULT_APP) return { results: `${platform}/results`, reports: `${platform}/reports`, evidence: `${platform}/evidence` };
    const { results, reports, evidence } = appConfig(app, platform).paths || {};
    if (!results || !reports || !evidence) throw new Error(`config for ${app}/${platform} needs paths.results, paths.reports and paths.evidence`);
    return { results, reports, evidence };
}

// Locates <results>/<run-id>/run-log.json across registered apps (Banni first). Pass app to restrict the search.
// Returns null when not found; throws if the same run ID exists for more than one app/platform.
export function findRunLogFile(runId, app) {
    const apps = readJson('config/project.json').apps || { [DEFAULT_APP]: { configs: { android: 1, ios: 1 } } };
    const hits = [];
    for (const [id, info] of Object.entries(apps)) {
        if (!info?.configs || (app && id !== app)) continue;
        for (const platform of Object.keys(info.configs)) {
            const f = p(runPaths(platform, id).results, runId, 'run-log.json');
            if (existsSync(f)) hits.push(f);
        }
    }
    if (hits.length > 1) throw new Error(`run "${runId}" exists in several places (${hits.join(', ')}); pass --app <id>`);
    return hits[0] || null;
}
