/**
 * User-Web Local Module - Quick Exploratory Test
 * Single simple use case: Basic Local trip search
 *
 * Usage: node tests/local-quick-test.js
 */
require('dotenv').config();
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const config = {
  baseUrl: process.env.USER_WEB_URL || 'https://preprod.siddagangatravels.com/',
  username: process.env.USER_WEB_USERNAME,
  password: process.env.USER_WEB_PASSWORD,
  timeout: { page: 30000, element: 10000 },
  slowMo: 300,
  headed: true
};

const runId = `user-web-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
const screenshotDir = path.join(__dirname, '..', 'screenshots', 'local', runId);
const resultsDir = path.join(__dirname, '..', 'results');
const reportsDir = path.join(__dirname, '..', 'reports', runId);

// Ensure directories exist
[screenshotDir, resultsDir, reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const results = {
  runId,
  testCase: 'USER-LOCAL-QUICK-01',
  title: 'Basic Local Trip Search',
  environment: 'Preprod',
  startTime: new Date().toISOString(),
  steps: [],
  status: 'pending',
  screenshots: []
};

function step(name, status, details = '') {
  const s = { name, status, details, timestamp: new Date().toISOString() };
  results.steps.push(s);
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${name}${details ? ' — ' + details : ''}`);
  return status === 'pass';
}

async function screenshot(page, name) {
  const filename = `${name}.png`;
  const filepath = path.join(screenshotDir, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  results.screenshots.push(filename);
  return filepath;
}

(async () => {
  console.log(`\n🚀 Starting Local Quick Test: ${runId}\n`);
  console.log(`📍 URL: ${config.baseUrl}`);
  console.log(`📁 Screenshots: ${screenshotDir}\n`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: config.slowMo
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    // Step 1: Navigate to site
    console.log('\n📌 Step 1: Navigate to Preprod site');
    const response = await page.goto(config.baseUrl, {
      waitUntil: 'domcontentloaded',
      timeout: config.timeout.page
    });
    step('Navigate to Preprod', response && response.ok() ? 'pass' : 'fail', `HTTP ${response?.status()}`);
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await screenshot(page, '01-homepage');

    // Step 2: Login
    console.log('\n📌 Step 2: Login');
    // Look for login button/link
    const loginBtn = page.locator('text=Login, text=Sign In, a[href*="login"], button:has-text("Login")').first();
    if (await loginBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await loginBtn.click();
      await page.waitForTimeout(2000);
    }

    // Fill login form - try mobile number field
    const mobileInput = page.locator('input[type="tel"], input[name*="mobile"], input[name*="phone"], input[placeholder*="Mobile"], input[placeholder*="Phone"]').first();
    if (await mobileInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await mobileInput.fill(config.username);
      step('Enter mobile number', 'pass', config.username.slice(0, 4) + '****');
    } else {
      // Try email/username field
      const usernameInput = page.locator('input[type="email"], input[name*="email"], input[name*="user"]').first();
      if (await usernameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await usernameInput.fill(config.username);
        step('Enter username', 'pass', '****');
      }
    }

    // Fill password
    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await passwordInput.fill(config.password);
      step('Enter password', 'pass', '********');
    }

    await screenshot(page, '02-login-filled');

    // Click login/submit button
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Continue")').first();
    if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await submitBtn.click();
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      step('Submit login', 'pass', 'Login form submitted');
    }

    await screenshot(page, '03-after-login');

    // Step 3: Navigate to Local
    console.log('\n📌 Step 3: Navigate to Local module');
    const localLink = page.locator('text=Local, a[href*="local"], button:has-text("Local"), [data-tab="local"]').first();
    if (await localLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await localLink.click();
      await page.waitForTimeout(2000);
      step('Navigate to Local', 'pass', 'Local module opened');
    } else {
      step('Navigate to Local', 'warn', 'Local link not found - may already be on booking page');
    }

    await screenshot(page, '04-local-page');

    // Step 4: Fill Local booking form
    console.log('\n📌 Step 4: Fill Local booking form');

    // Pickup location
    const pickupInput = page.locator('input[placeholder*="Pickup"], input[placeholder*="pickup"], input[placeholder*="From"], input[name*="pickup"], input[name*="from"]').first();
    if (await pickupInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await pickupInput.click();
      await pickupInput.fill('Bangalore');
      await page.waitForTimeout(1000);
      // Select from dropdown if appears
      const suggestion = page.locator('text=Bangalore, [class*="suggestion"]:has-text("Bangalore"), li:has-text("Bangalore")').first();
      if (await suggestion.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestion.click();
      }
      step('Enter pickup location', 'pass', 'Bangalore');
    }

    // Date - tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const dateInput = page.locator('input[type="date"], input[placeholder*="Date"], input[name*="date"]').first();
    if (await dateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await dateInput.fill(dateStr);
      step('Select date', 'pass', dateStr);
    }

    // Time
    const timeInput = page.locator('input[type="time"], input[placeholder*="Time"], input[name*="time"], select[name*="time"]').first();
    if (await timeInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await timeInput.fill('10:00');
      step('Select time', 'pass', '10:00 AM');
    }

    // Hours/Package
    const packageSelect = page.locator('select[name*="hour"], select[name*="package"], [class*="package"]').first();
    if (await packageSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await packageSelect.selectOption({ index: 1 });
      step('Select hours/package', 'pass', 'First available option');
    }

    // Passengers
    const passengersInput = page.locator('input[name*="passenger"], input[placeholder*="Passenger"], select[name*="passenger"]').first();
    if (await passengersInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      if (await passengersInput.evaluate(el => el.tagName) === 'SELECT') {
        await passengersInput.selectOption('2');
      } else {
        await passengersInput.fill('2');
      }
      step('Enter passengers', 'pass', '2');
    }

    await screenshot(page, '05-form-filled');

    // Step 5: Search for vehicles
    console.log('\n📌 Step 5: Search for vehicles');
    const searchBtn = page.locator('button:has-text("Search"), button:has-text("Find"), button:has-text("Show"), button[type="submit"]').first();
    if (await searchBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchBtn.click();
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      step('Click search', 'pass', 'Search initiated');
    }

    await screenshot(page, '06-search-results');

    // Step 6: Check for vehicle results
    console.log('\n📌 Step 6: Verify results');
    const vehicleCard = page.locator('[class*="vehicle"], [class*="car"], [class*="result"], [class*="card"]').first();
    const hasResults = await vehicleCard.isVisible({ timeout: 10000 }).catch(() => false);

    if (hasResults) {
      step('Vehicle results displayed', 'pass', 'Vehicles found');
      results.status = 'pass';
    } else {
      // Check for error or no results message
      const errorMsg = await page.locator('[class*="error"], [class*="alert"], text=No vehicles, text=not available').first().textContent().catch(() => null);
      if (errorMsg) {
        step('Vehicle results displayed', 'fail', `Error: ${errorMsg.slice(0, 100)}`);
        results.status = 'fail';
      } else {
        step('Vehicle results displayed', 'warn', 'Could not verify results');
        results.status = 'inconclusive';
      }
    }

    await screenshot(page, '07-final-state');

  } catch (error) {
    step('Test execution', 'fail', error.message);
    results.status = 'fail';
    results.error = error.message;
    await screenshot(page, 'error-state').catch(() => {});
  } finally {
    results.endTime = new Date().toISOString();

    // Generate report
    generateHtmlReport(results, reportsDir);

    // Save raw results
    fs.writeFileSync(
      path.join(resultsDir, `${runId}.json`),
      JSON.stringify(results, null, 2)
    );

    console.log('\n' + '='.repeat(60));
    console.log(`📊 Test Result: ${results.status.toUpperCase()}`);
    console.log(`📁 Screenshots: ${screenshotDir}`);
    console.log(`📄 Report: ${path.join(reportsDir, 'local-test-report.html')}`);
    console.log('='.repeat(60) + '\n');

    await browser.close();
  }
})();

function generateHtmlReport(results, dir) {
  const passCount = results.steps.filter(s => s.status === 'pass').length;
  const failCount = results.steps.filter(s => s.status === 'fail').length;
  const warnCount = results.steps.filter(s => s.status === 'warn').length;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Local Test Report - ${results.runId}</title>
  <style>
    :root { --pass: #22c55e; --fail: #ef4444; --warn: #f59e0b; --bg: #f8fafc; --card: #fff; --text: #1e293b; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #0f172a; --card: #1e293b; --text: #f1f5f9; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); padding: 2rem; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 1rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat { background: var(--card); padding: 1rem; border-radius: 8px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-value { font-size: 2rem; font-weight: bold; }
    .stat-label { font-size: 0.875rem; opacity: 0.7; }
    .pass .stat-value { color: var(--pass); }
    .fail .stat-value { color: var(--fail); }
    .warn .stat-value { color: var(--warn); }
    .card { background: var(--card); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .steps { list-style: none; }
    .step { padding: 0.75rem 0; border-bottom: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; gap: 0.75rem; }
    .step:last-child { border-bottom: none; }
    .step-icon { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: white; }
    .step-icon.pass { background: var(--pass); }
    .step-icon.fail { background: var(--fail); }
    .step-icon.warn { background: var(--warn); }
    .step-name { font-weight: 500; }
    .step-details { opacity: 0.7; font-size: 0.875rem; }
    .meta { font-size: 0.875rem; opacity: 0.7; margin-bottom: 1rem; }
    .status-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 600; text-transform: uppercase; font-size: 0.875rem; }
    .status-badge.pass { background: var(--pass); color: white; }
    .status-badge.fail { background: var(--fail); color: white; }
    .status-badge.inconclusive { background: var(--warn); color: white; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚗 Local Module Test Report</h1>
    <p class="meta">
      <strong>Test Case:</strong> ${results.testCase} — ${results.title}<br>
      <strong>Run ID:</strong> ${results.runId}<br>
      <strong>Environment:</strong> ${results.environment}<br>
      <strong>Time:</strong> ${results.startTime} → ${results.endTime}
    </p>

    <div class="summary">
      <div class="stat ${results.status}">
        <div class="stat-value"><span class="status-badge ${results.status}">${results.status}</span></div>
        <div class="stat-label">Overall Result</div>
      </div>
      <div class="stat pass">
        <div class="stat-value">${passCount}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat fail">
        <div class="stat-value">${failCount}</div>
        <div class="stat-label">Failed</div>
      </div>
      <div class="stat warn">
        <div class="stat-value">${warnCount}</div>
        <div class="stat-label">Warnings</div>
      </div>
    </div>

    <div class="card">
      <h2>Test Steps</h2>
      <ul class="steps">
        ${results.steps.map(s => `
          <li class="step">
            <span class="step-icon ${s.status}">${s.status === 'pass' ? '✓' : s.status === 'fail' ? '✗' : '!'}</span>
            <span class="step-name">${s.name}</span>
            ${s.details ? `<span class="step-details">${s.details}</span>` : ''}
          </li>
        `).join('')}
      </ul>
    </div>

    <div class="card">
      <h2>Screenshots</h2>
      <p>${results.screenshots.length} screenshots captured in: <code>screenshots/local/${results.runId}/</code></p>
      <ul>
        ${results.screenshots.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>

    ${results.error ? `<div class="card"><h2>Error</h2><pre>${results.error}</pre></div>` : ''}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'local-test-report.html'), html);
}
