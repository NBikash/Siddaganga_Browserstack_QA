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
