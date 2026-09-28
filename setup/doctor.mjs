// Read-only environment check. Never modifies anything and never prints secret values.
// Usage: npm run doctor            (human-readable)
//        npm run doctor -- --json  (machine-readable, used by Claude Code)
// Exit code: 0 = no FAIL (WARN allowed), 1 = at least one FAIL.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import { ROOT, p, readJson, parseEnvFile, isSet, run, cmpVersion, satisfies } from './lib/common.mjs';

const checks = [];
const add = (group, name, status, detail = '', fix = '') => checks.push({ group, name, status, detail, fix });

const project = readJson('config/project.json');
const platforms = { android: readJson('config/android.json'), ios: readJson('config/ios.json') };

// ---------- System ----------
add('system', 'Operating system', 'INFO', `${os.type()} ${os.release()} (${process.platform}/${process.arch})`);
if (process.platform !== 'win32') {
    add('system', 'Windows host', 'WARN', 'Project is documented for Windows; other OSes are untested.');
}

const nodeV = process.versions.node;
const { minimum: nodeMin, recommended: nodeRec } = project.prerequisites.node;
if (cmpVersion(nodeV, nodeMin) < 0) {
    add('system', 'Node.js', 'FAIL', `v${nodeV} < required ${nodeMin}`, 'winget install -e --id OpenJS.NodeJS.LTS');
} else if (cmpVersion(nodeV, nodeRec) < 0) {
    add('system', 'Node.js', 'WARN', `v${nodeV} (recommended >= ${nodeRec})`, 'winget upgrade -e --id OpenJS.NodeJS.LTS');
} else {
    add('system', 'Node.js', 'PASS', `v${nodeV}`);
}

const npmV = run('npm -v');
if (!npmV) add('system', 'npm', 'FAIL', 'not found on PATH', 'Reinstall Node.js LTS (npm ships with it)');
else if (cmpVersion(npmV, project.prerequisites.npm.minimum) < 0) add('system', 'npm', 'FAIL', `${npmV} < ${project.prerequisites.npm.minimum}`, 'npm install -g npm@latest');
else add('system', 'npm', 'PASS', npmV);

const gitV = run('git --version');
add('system', 'git', gitV ? 'PASS' : 'WARN', gitV || 'not found (only needed to clone/push)', gitV ? '' : 'winget install -e --id Git.Git');

const chromePaths = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
];
if (process.platform === 'win32') {
    const chrome = chromePaths.some((c) => c && existsSync(c));
    add('system', 'Google Chrome', chrome ? 'PASS' : 'WARN', chrome ? 'installed' : 'not found in default locations', chrome ? '' : 'winget install -e --id Google.Chrome');
}

// ---------- Dependencies ----------
const pkg = readJson('package.json');
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const hasLock = existsSync(p('package-lock.json'));
add('deps', 'package-lock.json', hasLock ? 'PASS' : 'WARN', hasLock ? 'present' : 'missing (npm install will create it)');
if (!existsSync(p('node_modules'))) {
    add('deps', 'node_modules', 'FAIL', 'not installed', 'npm run setup');
} else {
    const lock = hasLock ? JSON.parse(readFileSync(p('package-lock.json'), 'utf8')) : null;
    const problems = [];
    for (const [name, range] of Object.entries(deps)) {
        const f = p('node_modules', ...name.split('/'), 'package.json');
        if (!existsSync(f)) { problems.push(`${name} missing`); continue; }
        const v = JSON.parse(readFileSync(f, 'utf8')).version;
        const locked = lock?.packages?.[`node_modules/${name}`]?.version;
        if (!satisfies(v, range)) problems.push(`${name}@${v} does not satisfy ${range}`);
        else if (locked && locked !== v) problems.push(`${name}@${v} differs from lockfile ${locked}`);
    }
    add('deps', `npm packages (${Object.keys(deps).length} direct)`, problems.length ? 'FAIL' : 'PASS',
        problems.length ? problems.join('; ') : 'all installed and in sync with lockfile', problems.length ? 'npm run setup' : '');
    add('deps', 'Appium / App Automate', 'INFO', 'wdio.conf.js present; NOT required for the current App Live workflow');
}

// ---------- Project structure ----------
const missingFiles = project.requiredPaths.files.filter((f) => !existsSync(p(f)));
add('structure', 'Required files', missingFiles.length ? 'FAIL' : 'PASS',
    missingFiles.length ? `missing: ${missingFiles.join(', ')}` : `${project.requiredPaths.files.length} present`,
    missingFiles.length ? 'Restore from Git (these are versioned project files)' : '');
const missingDirs = project.requiredPaths.dirs.filter((d) => !existsSync(p(d)));
add('structure', 'Required folders', missingDirs.length ? 'FAIL' : 'PASS',
    missingDirs.length ? `missing: ${missingDirs.join(', ')}` : `${project.requiredPaths.dirs.length} present`,
    missingDirs.length ? 'npm run setup' : '');

// ---------- Test-case inventories ----------
for (const [name, cfg] of Object.entries(platforms)) {
    const tc = cfg.testCases;
    if (!existsSync(p(tc.inventoryCsv))) {
        add('testcases', `${name} inventory`, name === 'ios' ? 'INFO' : 'FAIL',
            name === 'ios' ? 'not created yet (expected until an IPA is available)' : `missing ${tc.inventoryCsv}`,
            name === 'ios' ? '' : 'Restore from Git - never regenerate the baseline');
        continue;
    }
    const buf = readFileSync(p(tc.inventoryCsv));
    const count = buf.toString('utf8').split(/\r?\n/).filter((l) => /^"?TC_/.test(l)).length;
    const sha = createHash('sha256').update(buf).digest('hex');
    let status = 'PASS';
    let detail = `${count} test cases (${tc.inventoryCsv})`;
    if (tc.expectedCount && count !== tc.expectedCount) {
        status = 'WARN';
        detail += ` - expected ${tc.expectedCount}`;
    }
    if (tc.inventorySha256 && tc.inventorySha256 !== sha) {
        status = 'WARN';
        detail += ' - content changed since baseline (confirm it was an approved update)';
    }
    add('testcases', `${name} inventory`, status, detail);
    if (tc.inventoryXlsx && !existsSync(p(tc.inventoryXlsx))) add('testcases', `${name} workbook`, 'WARN', `missing ${tc.inventoryXlsx}`);
}

// ---------- Platform build sources ----------
for (const [name, cfg] of Object.entries(platforms)) {
    const qb = cfg.qaBuild;
    add('platform', `${name} QA build source`, qb.status === 'available' ? 'PASS' : 'INFO',
        `${qb.source} - ${qb.status}${qb.currentBuild ? ` (${qb.currentBuild.file} v${qb.currentBuild.version})` : ''}`);
    add('platform', `${name} production regression`, 'INFO', `${cfg.productionRegression.source} - ${cfg.productionRegression.enabled ? 'enabled' : 'future / disabled'}`);
}

// ---------- Configuration & secrets (names only, never values) ----------
const env = parseEnvFile();
if (!env) {
    add('config', '.env', 'FAIL', 'missing', 'npm run setup (creates it from .env.example), then fill it in locally');
} else {
    add('config', '.env', 'PASS', 'present (values not shown)');
    // Shell/system environment wins over .env (same precedence as loadEnv). Report the source, never the value.
    const merged = (k) => process.env[k] ?? env[k];
    const source = (k) => (isSet(process.env[k]) ? 'system env' : '.env');
    const describe = (keys) => keys.map((k) => `${k} (${source(k)})`).join(', ');
    const exec = project.env.requiredForExecution.filter((k) => !isSet(merged(k)));
    add('config', 'Test account variables', exec.length ? 'WARN' : 'PASS',
        exec.length ? `not set: ${exec.join(', ')} (needed before authenticated runs)` : `set: ${describe(project.env.requiredForExecution)}`,
        exec.length ? 'Edit .env locally and add the values (do not paste them in chat)' : '');
    const api = project.env.requiredForApiUpload.filter((k) => !isSet(merged(k)));
    add('config', 'BrowserStack API variables', api.length ? 'WARN' : 'PASS',
        api.length ? `not set: ${api.join(', ')} (needed only for command-line uploads; App Live UI works without them)` : `set: ${describe(project.env.requiredForApiUpload)}`,
        api.length ? 'Edit .env locally: https://www.browserstack.com/accounts/profile/details' : '');
    const opt = project.env.optional.filter((k) => isSet(merged(k)));
    add('config', 'Optional variables', 'INFO', opt.length ? `set: ${opt.join(', ')}` : 'none set');
}

// ---------- Git hygiene ----------
const gi = existsSync(p('.gitignore')) ? readFileSync(p('.gitignore'), 'utf8').split(/\r?\n/).map((l) => l.trim()) : [];
const missingIgnore = project.gitignoreRequired.filter((e) => !gi.includes(e));
add('security', '.gitignore rules', missingIgnore.length ? 'FAIL' : 'PASS',
    missingIgnore.length ? `missing: ${missingIgnore.join(', ')}` : '.env, builds and evidence ignored', missingIgnore.length ? 'npm run setup' : '');
if (existsSync(p('.git'))) {
    const tracked = run('git ls-files -- .env');
    add('security', '.env not tracked by Git', tracked ? 'FAIL' : 'PASS', tracked ? '.env is committed!' : 'not tracked',
        tracked ? 'git rm --cached .env  (then rotate the exposed credentials)' : '');
} else {
    add('security', 'Git repository', 'INFO', 'not initialised yet');
}

// ---------- Manual prerequisites (verified by Claude Code in the session) ----------
for (const m of project.prerequisites.manual) add('manual', m, 'MANUAL', 'verified interactively by Claude Code at the start of /qa-run');

// ---------- Output ----------
const fails = checks.filter((c) => c.status === 'FAIL').length;
const warns = checks.filter((c) => c.status === 'WARN').length;
const summary = { root: ROOT, ready: fails === 0, fails, warns, checks };

if (process.argv.includes('--json')) {
    console.log(JSON.stringify(summary, null, 2));
} else {
    const icon = { PASS: '[ OK ]', WARN: '[WARN]', FAIL: '[FAIL]', INFO: '[INFO]', MANUAL: '[USER]' };
    let group = '';
    console.log(`\nSiddaganga BrowserStack QA - environment doctor\n${ROOT}`);
    for (const c of checks) {
        if (c.group !== group) { group = c.group; console.log(`\n${group.toUpperCase()}`); }
        console.log(`  ${icon[c.status]} ${c.name}${c.detail ? ' - ' + c.detail : ''}`);
        if (c.fix) console.log(`         fix: ${c.fix}`);
    }
    console.log(`\nResult: ${fails ? 'NOT READY' : 'READY'} (${fails} fail, ${warns} warn)\n`);
}
process.exit(fails ? 1 : 0);
