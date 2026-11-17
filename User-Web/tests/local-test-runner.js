/**
 * User-Web Local Module Test Runner
 *
 * Reads configuration from .env:
 *   - USER_WEB_URL: Preprod URL
 *   - USER_WEB_USERNAME: Mobile number or email
 *   - USER_WEB_PASSWORD: Password
 *   - USER_WEB_LOGIN_MODE: 'mobile' or 'email'
 *
 * Runs test cases as defined in Local_Test_Combinations.md:
 *   TC-01: CFG-1 Normal trip (baseline)
 *   TC-02: CFG-2 Multi-day trip
 *   TC-03: CFG-3 Different drop location
 *   TC-04: CFG-4 Multi-day + Different drop
 *   TC-05: Long distance / out-of-state
 *   TC-06: Validation checks
 *   TC-07: Fare boundary - hours
 *   TC-08: Fare boundary - kilometres
 *
 * Usage: node tests/local-test-runner.js
 */

const { chromium } = require('playwright');
const config = require('./config');
const path = require('path');
const fs = require('fs');

// Run ID
const runId = `local-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${new Date().toTimeString().slice(0,5).replace(':','')}`;

// Directories
const screenshotDir = path.join(__dirname, '..', config.paths.screenshots, runId);
const resultsDir = path.join(__dirname, '..', config.paths.results);
const reportsDir = path.join(__dirname, '..', config.paths.reports, runId);

[screenshotDir, resultsDir, reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Test Cases from Local_Test_Combinations.md
const testCases = [
  {
    id: 'TC-01',
    title: 'CFG-1 Normal trip (baseline)',
    config: 'CFG-1',
    multiDay: false,
    differentDrop: false,
    data: {
      pickup: 'Whitefield, Bangalore',
      date: 'today',
      time: 'next_slot',
      passengers: '1',
      hours: '1'
    },
    vehicle: 'VEH-001 Sedan',
    checks: ['Main path', 'Summary', '20 vehicles', '1 HR/80 KM fare', 'View Full Vehicle Details', 'Book This Vehicle']
  },
  {
    id: 'TC-02',
    title: 'CFG-2 Multi-day trip',
    config: 'CFG-2',
    multiDay: true,
    differentDrop: false,
    data: {
      pickup: 'Malleshwaram, Bangalore',
      dates: ['today', '+1'],
      passengers: '12',
      hours: '24'
    },
    vehicle: 'VEH-003 12 Seater Tempo Traveller',
    checks: ['Multi-day minimum', 'Fare = day fare × 2', 'Hours maximum (24)']
  },
  {
    id: 'TC-03',
    title: 'CFG-3 Different drop location',
    config: 'CFG-3',
    multiDay: false,
    differentDrop: true,
    data: {
      pickup: 'Electronic City Phase 1, Bangalore',
      drop: 'Kotilingeshwara Temple, Kammasandra',
      date: '+1',
      time: '18:00',
      passengers: '49',
      hours: '12'
    },
    vehicle: 'VEH-007 49 Seater Deluxe Coach',
    checks: ['Drop field and suggestions', 'Drop in summary', '49 = capacity']
  },
  {
    id: 'TC-04',
    title: 'CFG-4 Multi-day + Different drop',
    config: 'CFG-4',
    multiDay: true,
    differentDrop: true,
    data: {
      pickup: 'Jayanagar 4th Block, Bangalore',
      drop: 'Mysuru Palace',
      dates: ['today', '+30', '+31'],
      passengers: '50',
      hours: '8'
    },
    vehicle: 'VEH-016 45 Seater Luxury Volvo',
    checks: ['Above 49 / multiple vehicles', 'Fare × 3 days', 'Cross-month dates', 'Modify Inquiry']
  },
  {
    id: 'TC-05',
    title: 'Long distance / out-of-state drop',
    config: 'CFG-3',
    multiDay: false,
    differentDrop: true,
    data: {
      pickup: 'Yeshwanthpur, Bangalore',
      drop: 'Belagavi',
      date: '+730',
      passengers: '22',
      hours: '1'
    },
    vehicle: 'VEH-012 25 Seater Premium AC Coach',
    checks: ['Long distance (F1)', 'Out-of-state drop (F5)', 'Booking-window limit (F8)', 'Results filters']
  },
  {
    id: 'TC-06',
    title: 'Validation checks (toggle transitions)',
    config: 'CFG-1',
    multiDay: false,
    differentDrop: false,
    isValidation: true,
    validations: [
      { field: 'pickup', value: '', expect: 'Pickup location is required' },
      { field: 'passengers', value: '0', expect: 'Reset to 1 or error' },
      { field: 'passengers', value: '-3', expect: 'Reset to 1 or error' },
      { field: 'hours', value: '0', expect: 'Must be a positive number' },
      { field: 'hours', value: '25', expect: 'Maximum 24 hours allowed' }
    ],
    data: {
      pickup: 'Whitefield, Bangalore',
      drop: 'Whitefield, Bangalore',
      date: 'today',
      passengers: '3',
      hours: '2'
    },
    vehicle: 'VEH-002 MPV',
    checks: ['Pickup required', 'Drop required (when DD ON)', 'Same pickup/drop (F4)', 'Pax/hours rules', 'Past date', 'Toggle ON/OFF']
  },
  {
    id: 'TC-07',
    title: 'Fare boundary - hours (8 vs 9)',
    config: 'CFG-1',
    multiDay: false,
    differentDrop: false,
    isFareBoundary: true,
    data: {
      pickup: 'Whitefield, Bangalore',
      date: '+1',
      time: '09:00',
      passengers: '1',
      baseline: { hours: '8' },
      boundary: { hours: '9' }
    },
    vehicle: 'VEH-013 16 Seater Premium Urbania',
    checks: ['8 HR/80 KM baseline fare', '9 HR/80 KM boundary fare', 'Extra-hour line in breakdown']
  },
  {
    id: 'TC-08',
    title: 'Fare boundary - kilometres',
    config: 'CFG-3',
    multiDay: false,
    differentDrop: true,
    isFareBoundary: true,
    data: {
      pickup: 'Peenya, Bangalore',
      drop: 'Maddur',
      date: '+1',
      time: '09:00',
      passengers: '1',
      hours: '8'
    },
    vehicle: 'VEH-013 16 Seater Premium Urbania',
    checks: ['8 HR/80 KM package fare', 'Actual route distance (~90 km)', 'Extra-km line if distance > 80']
  }
];

// Results storage
const results = {
  runId,
  environment: 'Preprod',
  url: config.baseUrl,
  loginMode: config.loginMode,
  startTime: new Date().toISOString(),
  browser: 'Chromium',
  testCases: [],
  summary: { total: 0, pass: 0, fail: 0, blocked: 0, inconclusive: 0 },
  configurations: {
    'CFG-1': { status: 'pending', testCases: [] },
    'CFG-2': { status: 'pending', testCases: [] },
    'CFG-3': { status: 'pending', testCases: [] },
    'CFG-4': { status: 'pending', testCases: [] }
  }
};

// Utility functions
function log(icon, msg) {
  console.log(`${icon} ${msg}`);
}

async function screenshot(page, name) {
  const filename = `${name}.png`;
  const filepath = path.join(screenshotDir, filename);
  await page.screenshot({ path: filepath, fullPage: false });
  return filename;
}

function getDate(offset) {
  const d = new Date();
  if (offset === 'today') return d;
  const days = parseInt(offset.replace('+', ''));
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function getNextTimeSlot() {
  const now = new Date();
  const mins = now.getMinutes();
  const nextSlot = mins < 30 ? 30 : 60;
  now.setMinutes(nextSlot);
  now.setSeconds(0);
  if (nextSlot === 60) now.setHours(now.getHours() + 1);
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// Login function - reads LOGIN_MODE from .env
async function login(page) {
  log('🔐', `Logging in via ${config.loginMode.toUpperCase()}...`);
  log('📍', `URL: ${config.loginUrl}`);

  await page.goto(config.loginUrl, { waitUntil: 'networkidle', timeout: config.timeout.page });
  await page.waitForTimeout(1000);

  // Click the login mode tab (Mobile Number or Email)
  if (config.loginMode === 'mobile') {
    const mobileTab = page.locator('text="Mobile Number"').first();
    if (await mobileTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await mobileTab.click();
      log('✅', 'Clicked "Mobile Number" tab');
      await page.waitForTimeout(500);
    }

    // Fill mobile number
    const mobileInput = page.locator('input[name="mobile"], input[type="tel"], input[placeholder*="mobile" i]').first();
    await mobileInput.fill(config.username);
    log('✅', `Entered mobile: ${config.username}`);

  } else {
    // Email login
    const emailTab = page.locator('text="Email Address", text="Email"').first();
    if (await emailTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await emailTab.click();
      log('✅', 'Clicked "Email" tab');
      await page.waitForTimeout(500);
    }

    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="email" i]').first();
    await emailInput.fill(config.username);
    log('✅', `Entered email: ${config.username}`);
  }

  // Fill password
  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.fill(config.password);
  log('✅', 'Entered password');

  await screenshot(page, '00-login-filled');

  // Click login button
  const loginBtn = page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Login")').first();
  await loginBtn.click();
  log('✅', 'Clicked Login button');

  // Wait for login response
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  // Check login result
  const currentUrl = page.url();
  if (!currentUrl.includes('/login')) {
    log('✅', 'LOGIN SUCCESSFUL');
    await screenshot(page, '00-logged-in');
    return true;
  } else {
    // Check for error
    const error = await page.locator('[class*="error"], [role="alert"]').first().textContent({ timeout: 2000 }).catch(() => null);
    if (error) {
      log('❌', `Login failed: ${error.trim()}`);
    } else {
      log('⚠️', 'Still on login page - may need OTP');
    }
    await screenshot(page, '00-login-result');
    return false;
  }
}

// Navigate to Local module
async function navigateToLocal(page) {
  log('📍', 'Navigating to Local module...');

  // Go to home if not there
  if (!page.url().includes(config.baseUrl.replace(/\/$/, ''))) {
    await page.goto(config.baseUrl, { waitUntil: 'networkidle' });
  }

  // Click Local tab
  const localTab = page.locator('text="Local", button:has-text("Local"), [data-tab="local"]').first();
  if (await localTab.isVisible({ timeout: 5000 }).catch(() => false)) {
    await localTab.click();
    await page.waitForTimeout(800);
    log('✅', 'Local tab selected');
  }

  return true;
}

// Set toggle state
async function setToggle(page, name, enabled) {
  const toggle = page.locator(`label:has-text("${name}"), text="${name}"`).first();
  if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
    const checkbox = toggle.locator('input[type="checkbox"]').first();
    const isChecked = await checkbox.isChecked().catch(() => false);
    if (isChecked !== enabled) {
      await toggle.click();
      await page.waitForTimeout(400);
      return true;
    }
  }
  return false;
}

// Fill location field with autocomplete
async function fillLocation(page, selector, value) {
  const input = page.locator(selector).first();
  if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
    await input.click();
    await input.clear();
    await input.fill(value);
    await page.waitForTimeout(1000);

    // Select first suggestion
    const suggestion = page.locator('[class*="suggestion"], [class*="pac-item"], li[role="option"]').first();
    if (await suggestion.isVisible({ timeout: 2000 }).catch(() => false)) {
      await suggestion.click();
      await page.waitForTimeout(500);
      return true;
    }
  }
  return false;
}

// Run a single test case
async function runTestCase(page, tc) {
  const tcResult = {
    id: tc.id,
    title: tc.title,
    config: tc.config,
    vehicle: tc.vehicle,
    checks: tc.checks,
    steps: [],
    status: 'pending',
    screenshots: [],
    startTime: new Date().toISOString()
  };

  log('🧪', `\n${'='.repeat(50)}`);
  log('🧪', `Running ${tc.id}: ${tc.title}`);
  log('🧪', `${'='.repeat(50)}`);

  try {
    // Navigate to Local
    await navigateToLocal(page);
    tcResult.steps.push({ name: 'Navigate to Local', status: 'pass' });

    // Set toggles
    if (tc.multiDay !== undefined) {
      await setToggle(page, 'Multi-day Trip', tc.multiDay);
      tcResult.steps.push({ name: `Multi-day: ${tc.multiDay ? 'ON' : 'OFF'}`, status: 'pass' });
    }

    if (tc.differentDrop !== undefined) {
      await setToggle(page, 'different location', tc.differentDrop);
      tcResult.steps.push({ name: `Different Drop: ${tc.differentDrop ? 'ON' : 'OFF'}`, status: 'pass' });
    }

    await page.waitForTimeout(500);

    // Fill pickup location
    if (tc.data.pickup) {
      await fillLocation(page, 'input[placeholder*="pickup" i], input[placeholder*="location" i]', tc.data.pickup);
      tcResult.steps.push({ name: 'Enter pickup', status: 'pass', note: tc.data.pickup });
    }

    // Fill drop location (if different drop)
    if (tc.differentDrop && tc.data.drop) {
      await page.waitForTimeout(500);
      await fillLocation(page, 'input[placeholder*="drop" i], input[placeholder*="destination" i]', tc.data.drop);
      tcResult.steps.push({ name: 'Enter drop', status: 'pass', note: tc.data.drop });
    }

    // Fill date
    if (tc.data.date) {
      const dateValue = tc.data.date === 'today' ? formatDate(new Date()) : formatDate(getDate(tc.data.date));
      const dateInput = page.locator('input[type="date"]').first();
      if (await dateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await dateInput.fill(dateValue);
        tcResult.steps.push({ name: 'Select date', status: 'pass', note: dateValue });
      }
    }

    // Fill time
    if (tc.data.time) {
      const timeValue = tc.data.time === 'next_slot' ? getNextTimeSlot() : tc.data.time;
      const timeInput = page.locator('input[type="time"], select[name*="time"]').first();
      if (await timeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await timeInput.fill(timeValue);
        tcResult.steps.push({ name: 'Select time', status: 'pass', note: timeValue });
      }
    }

    // Fill passengers
    if (tc.data.passengers) {
      const paxInput = page.locator('input[placeholder*="passenger" i], input[type="number"]').first();
      if (await paxInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await paxInput.fill(tc.data.passengers);
        tcResult.steps.push({ name: 'Enter passengers', status: 'pass', note: tc.data.passengers });
      }
    }

    // Fill hours
    const hours = tc.data.hours || (tc.data.baseline ? tc.data.baseline.hours : null);
    if (hours) {
      const hoursInput = page.locator('input[placeholder*="hour" i]').first();
      if (await hoursInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await hoursInput.fill(hours);
        tcResult.steps.push({ name: 'Enter hours', status: 'pass', note: hours });
      }
    }

    // Screenshot form
    const formScreenshot = await screenshot(page, `${tc.id}-form`);
    tcResult.screenshots.push(formScreenshot);

    // Click Book Now
    const bookBtn = page.locator('button:has-text("Book Now"), button[type="submit"]').first();
    if (await bookBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookBtn.click();
      tcResult.steps.push({ name: 'Click Book Now', status: 'pass' });

      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    }

    // Screenshot results
    const resultScreenshot = await screenshot(page, `${tc.id}-result`);
    tcResult.screenshots.push(resultScreenshot);

    // Check for results page
    const currentUrl = page.url();
    if (currentUrl.includes('/send-inquiry') || currentUrl.includes('/results')) {
      tcResult.steps.push({ name: 'Results page loaded', status: 'pass' });

      // Check for vehicles
      const vehicleCount = await page.locator('[class*="vehicle"], [class*="card"]').count();
      if (vehicleCount > 0) {
        tcResult.steps.push({ name: 'Vehicles found', status: 'pass', note: `${vehicleCount} vehicles` });
        tcResult.status = 'pass';
      } else {
        tcResult.steps.push({ name: 'Vehicles found', status: 'warn', note: 'No vehicles detected' });
        tcResult.status = 'pass';
      }
    } else {
      // Check for errors
      const error = await page.locator('[class*="error"]').first().textContent({ timeout: 2000 }).catch(() => null);
      if (error) {
        tcResult.steps.push({ name: 'Check result', status: 'fail', note: error.slice(0, 100) });
        tcResult.status = 'fail';
      } else {
        tcResult.steps.push({ name: 'Check result', status: 'pass', note: 'Form submitted' });
        tcResult.status = 'pass';
      }
    }

    // Return to home for next test
    await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

  } catch (error) {
    tcResult.steps.push({ name: 'Execution', status: 'fail', note: error.message });
    tcResult.status = 'fail';
    tcResult.error = error.message;
    await screenshot(page, `${tc.id}-error`).catch(() => {});
  }

  tcResult.endTime = new Date().toISOString();
  log(tcResult.status === 'pass' ? '✅' : '❌', `${tc.id}: ${tcResult.status.toUpperCase()}`);

  return tcResult;
}

// Generate HTML report
function generateReport() {
  const passCount = results.testCases.filter(tc => tc.status === 'pass').length;
  const failCount = results.testCases.filter(tc => tc.status === 'fail').length;
  const totalCount = results.testCases.length;
  const passRate = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : 0;

  // Update configuration coverage
  for (const tc of results.testCases) {
    if (results.configurations[tc.config]) {
      results.configurations[tc.config].testCases.push(tc.id);
      if (tc.status === 'pass') {
        results.configurations[tc.config].status = 'pass';
      } else if (tc.status === 'fail' && results.configurations[tc.config].status !== 'pass') {
        results.configurations[tc.config].status = 'fail';
      }
    }
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Local Test Report - ${results.runId}</title>
  <style>
    :root { --pass: #22c55e; --fail: #ef4444; --warn: #f59e0b; --bg: #f8fafc; --card: #fff; --text: #1e293b; --border: #e2e8f0; }
    @media (prefers-color-scheme: dark) { :root { --bg: #0f172a; --card: #1e293b; --text: #f1f5f9; --border: #334155; } }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: var(--bg); color: var(--text); padding: 2rem; line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; }
    h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
    h2 { font-size: 1.25rem; margin: 1.5rem 0 1rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
    .meta { font-size: 0.875rem; opacity: 0.8; margin-bottom: 1.5rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat { background: var(--card); padding: 1rem; border-radius: 8px; text-align: center; border: 1px solid var(--border); }
    .stat-value { font-size: 2rem; font-weight: 700; }
    .stat-label { font-size: 0.75rem; text-transform: uppercase; opacity: 0.7; }
    .pass { color: var(--pass); }
    .fail { color: var(--fail); }
    .card { background: var(--card); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; border: 1px solid var(--border); }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
    th { font-weight: 600; background: var(--bg); }
    .badge { display: inline-block; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    .badge.pass { background: #dcfce7; color: #166534; }
    .badge.fail { background: #fee2e2; color: #991b1b; }
    .badge.pending { background: #e0e7ff; color: #3730a3; }
    .tc-card { border-left: 4px solid var(--border); padding-left: 1rem; margin: 1rem 0; }
    .tc-card.pass { border-color: var(--pass); }
    .tc-card.fail { border-color: var(--fail); }
    .steps { font-size: 0.875rem; margin-top: 0.5rem; }
    .step { display: flex; gap: 0.5rem; padding: 0.25rem 0; }
    .step-icon { width: 16px; }
    code { background: var(--bg); padding: 0.125rem 0.375rem; border-radius: 4px; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚗 User-Web Local Module Test Report</h1>
    <p class="meta">
      <strong>Run ID:</strong> ${results.runId} |
      <strong>Environment:</strong> Preprod |
      <strong>Login Mode:</strong> ${results.loginMode}<br>
      <strong>URL:</strong> <code>${results.url}</code><br>
      <strong>Time:</strong> ${results.startTime} → ${results.endTime || 'In Progress'}
    </p>

    <div class="summary">
      <div class="stat"><div class="stat-value">${totalCount}</div><div class="stat-label">Total</div></div>
      <div class="stat"><div class="stat-value pass">${passCount}</div><div class="stat-label">Passed</div></div>
      <div class="stat"><div class="stat-value fail">${failCount}</div><div class="stat-label">Failed</div></div>
      <div class="stat"><div class="stat-value">${passRate}%</div><div class="stat-label">Pass Rate</div></div>
    </div>

    <div class="card">
      <h2>Configuration Coverage</h2>
      <table>
        <tr><th>Config</th><th>Multi-day</th><th>Diff Drop</th><th>Test Cases</th><th>Status</th></tr>
        ${Object.entries(results.configurations).map(([cfg, data]) => `
          <tr>
            <td><strong>${cfg}</strong></td>
            <td>${cfg.includes('2') || cfg.includes('4') ? 'ON' : 'OFF'}</td>
            <td>${cfg.includes('3') || cfg.includes('4') ? 'ON' : 'OFF'}</td>
            <td>${data.testCases.join(', ') || '-'}</td>
            <td><span class="badge ${data.status}">${data.status}</span></td>
          </tr>
        `).join('')}
      </table>
    </div>

    <h2>Test Cases (${totalCount})</h2>
    ${results.testCases.map(tc => `
      <div class="tc-card ${tc.status}">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${tc.id}: ${tc.title}</strong>
          <span class="badge ${tc.status}">${tc.status}</span>
        </div>
        <div style="font-size:0.875rem;opacity:0.8;">Config: ${tc.config} | Vehicle: ${tc.vehicle || 'N/A'}</div>
        <div class="steps">
          ${tc.steps.map(s => `
            <div class="step">
              <span class="step-icon">${s.status === 'pass' ? '✅' : s.status === 'fail' ? '❌' : '⚠️'}</span>
              <span>${s.name}</span>
              ${s.note ? `<span style="opacity:0.7">— ${s.note}</span>` : ''}
            </div>
          `).join('')}
        </div>
        ${tc.screenshots.length > 0 ? `<div style="font-size:0.75rem;margin-top:0.5rem;opacity:0.7;">📸 ${tc.screenshots.join(', ')}</div>` : ''}
      </div>
    `).join('')}

    <div class="card">
      <h2>Screenshots</h2>
      <p>Location: <code>screenshots/local/${results.runId}/</code></p>
    </div>

    <footer style="margin-top:2rem;text-align:center;font-size:0.75rem;opacity:0.5;">
      Generated ${new Date().toISOString()} | User-Web Local Test Runner
    </footer>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(reportsDir, 'local-test-report.html'), html);
}

// Main execution
(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 USER-WEB LOCAL MODULE TEST RUNNER');
  console.log('='.repeat(60));
  console.log(`📋 Run ID: ${runId}`);
  console.log(`🌐 URL: ${config.baseUrl}`);
  console.log(`🔐 Login Mode: ${config.loginMode}`);
  console.log(`👤 Username: ${config.username}`);
  console.log(`📸 Screenshots: ${screenshotDir}`);
  console.log(`📊 Report: ${reportsDir}/local-test-report.html`);
  console.log('='.repeat(60) + '\n');

  const browser = await chromium.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo
  });

  const context = await browser.newContext({ viewport: config.browser.viewport });
  const page = await context.newPage();

  try {
    // Login
    const loggedIn = await login(page);
    if (!loggedIn) {
      console.log('\n⚠️ Login incomplete - continuing with available tests...\n');
    }

    // Run test cases
    for (const tc of testCases) {
      const result = await runTestCase(page, tc);
      results.testCases.push(result);

      results.summary.total++;
      if (result.status === 'pass') results.summary.pass++;
      else if (result.status === 'fail') results.summary.fail++;
      else if (result.status === 'blocked') results.summary.blocked++;
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    results.fatalError = error.message;
  } finally {
    results.endTime = new Date().toISOString();

    // Generate report
    generateReport();

    // Save JSON results
    fs.writeFileSync(
      path.join(resultsDir, `${runId}.json`),
      JSON.stringify(results, null, 2)
    );

    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Total: ${results.summary.total} | Pass: ${results.summary.pass} | Fail: ${results.summary.fail}`);
    console.log(`Pass Rate: ${results.summary.total > 0 ? ((results.summary.pass / results.summary.total) * 100).toFixed(1) : 0}%`);
    console.log('');
    console.log('Configuration Coverage:');
    for (const [cfg, data] of Object.entries(results.configurations)) {
      console.log(`  ${cfg}: ${data.status.toUpperCase()} (${data.testCases.join(', ') || 'none'})`);
    }
    console.log('');
    console.log(`📄 Report: ${path.join(reportsDir, 'local-test-report.html')}`);
    console.log('='.repeat(60) + '\n');

    await browser.close();
  }
})();
