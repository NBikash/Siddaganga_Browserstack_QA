// WebdriverIO + Appium config for Android native apps on BrowserStack App Automate.
// Credentials and app come from environment variables — never hard-code them.
//   BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY  (required)
//   BROWSERSTACK_APP       bs://<app_id> from `npm run upload-app` (required)
//   BS_DEVICE, BS_OS_VERSION, BS_BUILD              (optional overrides)

const required = ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY', 'BROWSERSTACK_APP'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
}

export const config = {
    runner: 'local',
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    hostname: 'hub.browserstack.com',

    specs: ['./test/specs/**/*.js'],
    maxInstances: 1,

    capabilities: [{
        platformName: 'android',
        'appium:automationName': 'UiAutomator2',
        'appium:app': process.env.BROWSERSTACK_APP,
        'appium:deviceName': process.env.BS_DEVICE || 'Google Pixel 8',
        'appium:platformVersion': process.env.BS_OS_VERSION || '14.0',
        'appium:autoGrantPermissions': true,
        'bstack:options': {
            projectName: 'Siddaganga BrowserStack QA',
            buildName: process.env.BS_BUILD || 'android-exploration',
            sessionName: 'Android native exploration',
            appiumVersion: '2.11.2',
            debug: true,
            networkLogs: true,
            deviceLogs: true,
            video: true,
        },
    }],

    logLevel: 'warn',
    waitforTimeout: 15000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 2,

    services: [['browserstack', { browserstackLocal: false }]],

    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: { ui: 'bdd', timeout: 300000 },
};
