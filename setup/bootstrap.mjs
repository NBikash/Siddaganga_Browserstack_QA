// Idempotent project bootstrap. Safe to run any number of times.
//  - installs npm dependencies only when missing or out of sync with the lockfile
//  - creates missing folders (.gitkeep) - never deletes anything
//  - creates .env from .env.example ONLY if .env does not exist (never edits an existing .env)
//  - appends missing .gitignore rules (never removes lines)
//  - re-runs the doctor at the end
// Usage: npm run setup   (or: node setup/bootstrap.mjs)
import { existsSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, appendFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { p, readJson } from './lib/common.mjs';

const project = readJson('config/project.json');
const log = (msg) => console.log(`[setup] ${msg}`);

// 1. Folders
let created = 0;
for (const dir of project.requiredPaths.dirs) {
    if (!existsSync(p(dir))) {
        mkdirSync(p(dir), { recursive: true });
        writeFileSync(p(dir, '.gitkeep'), '');
        created++;
        log(`created ${dir}/`);
    }
}
if (!created) log('folders: all present');

// 2. .env (never overwritten)
if (existsSync(p('.env'))) {
    log('.env: exists - left untouched');
} else if (existsSync(p('.env.example'))) {
    copyFileSync(p('.env.example'), p('.env'));
    log('.env: created from .env.example - fill in the values locally (see SETUP.md)');
} else {
    log('.env: missing and no .env.example to copy - restore .env.example from Git');
}

// 3. .gitignore (append-only)
const giPath = p('.gitignore');
const current = existsSync(giPath) ? readFileSync(giPath, 'utf8') : '';
const lines = current.split(/\r?\n/).map((l) => l.trim());
const missing = project.gitignoreRequired.filter((e) => !lines.includes(e));
if (missing.length) {
    const extra = [...missing];
    if (missing.some((m) => m.endsWith('evidence/*'))) extra.push('!android/evidence/.gitkeep', '!ios/evidence/.gitkeep');
    appendFileSync(giPath, `${current && !current.endsWith('\n') ? '\n' : ''}# added by setup\n${extra.join('\n')}\n`);
    log(`.gitignore: added ${missing.join(', ')}`);
} else {
    log('.gitignore: required rules present');
}

// 4. npm dependencies (only if needed)
// The doctor exits 1 when anything FAILs, so read its JSON from the error in that case.
const doctor = () => {
    const opts = { cwd: p(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] };
    try {
        return JSON.parse(execSync('node setup/doctor.mjs --json', opts));
    } catch (e) {
        return JSON.parse(e.stdout);
    }
};
const before = doctor();
const depFail = before.checks.some((c) => c.group === 'deps' && c.status === 'FAIL');
if (depFail) {
    const cmd = existsSync(p('package-lock.json')) ? 'npm ci' : 'npm install';
    log(`dependencies missing/out of sync - running ${cmd}`);
    execSync(cmd, { cwd: p(), stdio: 'inherit' });
} else {
    log('dependencies: installed and in sync - skipping npm install');
}

// 5. Verify
log('verifying environment...');
try {
    execSync('node setup/doctor.mjs', { cwd: p(), stdio: 'inherit' });
} catch {
    process.exitCode = 1;
}
