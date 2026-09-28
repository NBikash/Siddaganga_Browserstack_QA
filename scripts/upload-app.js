// Uploads a QA build to BrowserStack and prints the bs:// app URL.
//   npm run upload:android -- path/to/app.apk      (App Live, Android)
//   npm run upload:ios -- path/to/app.ipa          (App Live, iOS)
//   npm run upload-app -- path/to/app.apk [--platform android|ios] [--target live|automate]
// Defaults: platform from the file extension, target = live (App Live is the current workflow).
// Reads BROWSERSTACK_USERNAME / BROWSERSTACK_ACCESS_KEY from the environment or .env; never prints them.
import { readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { loadEnv } from '../setup/lib/common.mjs';

loadEnv();

const args = process.argv.slice(2);
const opt = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : undefined;
};
const file = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!file) {
    console.error('Usage: npm run upload:android -- <app.apk>   |   npm run upload:ios -- <app.ipa>');
    process.exit(1);
}

const ext = extname(file).toLowerCase();
const platform = opt('platform') || (ext === '.ipa' ? 'ios' : 'android');
const target = opt('target') || 'live';
const allowed = { android: ['.apk', '.aab'], ios: ['.ipa'] };
if (!allowed[platform]?.includes(ext)) {
    console.error(`A ${platform} build must be one of: ${(allowed[platform] || []).join(', ')} (got "${ext}").`);
    process.exit(1);
}
if (!['live', 'automate'].includes(target)) {
    console.error('--target must be "live" or "automate".');
    process.exit(1);
}

const { BROWSERSTACK_USERNAME: user, BROWSERSTACK_ACCESS_KEY: key } = process.env;
if (!user || !key) {
    console.error('BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY are not set. Add them to .env locally (see SETUP.md),');
    console.error('or upload through the App Live web UI instead (Uploaded Apps > Upload).');
    process.exit(1);
}

const endpoint = target === 'live'
    ? 'https://api-cloud.browserstack.com/app-live/upload'
    : 'https://api-cloud.browserstack.com/app-automate/upload';

const form = new FormData();
form.append('file', new Blob([await readFile(file)]), basename(file));
if (target === 'automate') form.append('custom_id', `siddaganga-${platform}`);

const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${user}:${key}`).toString('base64') },
    body: form,
});
const body = await res.json().catch(() => ({}));

if (!res.ok || !body.app_url) {
    console.error(`Upload failed (HTTP ${res.status}):`, body.error || body.message || 'no details');
    process.exit(1);
}
const envName = target === 'automate' ? 'BROWSERSTACK_APP' : `${platform.toUpperCase()}_APP_LIVE_URL`;
console.log(`Uploaded ${basename(file)} to App ${target === 'live' ? 'Live' : 'Automate'} (${platform}).`);
console.log(`Optionally record it in your local .env:  ${envName}=${body.app_url}`);
