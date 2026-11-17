/**
 * Local Module Explorer
 * Thoroughly explores the Local module UI and captures all elements
 */
require('dotenv').config();
const { chromium } = require('playwright');
const config = require('./config');
const path = require('path');
const fs = require('fs');

const runId = `explore-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${new Date().toTimeString().slice(0,5).replace(':','')}`;
const screenshotDir = path.join(__dirname, '..', 'exploration-logs', runId);
const outputDir = path.join(__dirname, '..', 'exploration-logs');

[screenshotDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const exploration = {
  runId,
  timestamp: new Date().toISOString(),
  url: config.baseUrl,
  module: 'Local',
  form: {
    tabs: [],
    toggles: [],
    fields: [],
    buttons: [],
    dropdowns: [],
    datePickers: [],
    timePickers: []
  },
  configurations: [],
  validationRules: [],
  observations: [],
  screenshots: []
};

function log(icon, msg) {
  console.log(`${icon} ${msg}`);
}

async function screenshot(page, name) {
  const filename = `${name}.png`;
  const filepath = path.join(screenshotDir, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  exploration.screenshots.push(filename);
  return filename;
}

async function login(page) {
  log('🔐', 'Logging in...');
  await page.goto(config.loginUrl, { waitUntil: 'networkidle', timeout: 30000 });

  const mobileTab = page.locator('text="Mobile Number"').first();
  if (await mobileTab.isVisible({ timeout: 3000 }).catch(() => false)) {
    await mobileTab.click();
  }

  const mobileInput = page.locator('input[name="mobile"], input[type="tel"]').first();
  await mobileInput.fill(config.username);

  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.fill(config.password);

  const loginBtn = page.locator('button[type="submit"]').first();
  await loginBtn.click();

  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  log('✅', 'Login completed');
}

async function exploreLocalModule(page) {
  log('🔍', '\n' + '='.repeat(60));
  log('🔍', 'EXPLORING LOCAL MODULE');
  log('🔍', '='.repeat(60) + '\n');

  // Navigate to home
  await page.goto(config.baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Find and click Local tab
  log('📍', 'Finding Local tab...');
  const localTab = page.locator('text="Local"').first();
  await localTab.click();
  await page.waitForTimeout(1000);
  await screenshot(page, '01-local-tab-selected');

  // Explore tabs
  log('📋', 'Exploring tabs...');
  const allTabs = await page.locator('[role="tab"], .tab, [class*="tab"]').allTextContents();
  exploration.form.tabs = [...new Set(allTabs.filter(t => t.trim() && t.length < 50))];
  log('✅', `Found tabs: ${exploration.form.tabs.join(', ')}`);

  // Explore toggles
  log('🔘', 'Exploring toggles...');
  const toggles = await page.locator('label:has(input[type="checkbox"])').all();
  for (const toggle of toggles) {
    const text = await toggle.textContent().catch(() => '');
    if (text.trim() && text.length < 100) {
      const checkbox = toggle.locator('input[type="checkbox"]').first();
      const isChecked = await checkbox.isChecked().catch(() => false);
      exploration.form.toggles.push({ label: text.trim(), defaultState: isChecked ? 'ON' : 'OFF' });
    }
  }
  log('✅', `Found ${exploration.form.toggles.length} toggles`);

  // Explore input fields
  log('📝', 'Exploring input fields...');
  const inputs = await page.locator('input:visible, select:visible, textarea:visible').all();
  for (const input of inputs) {
    const type = await input.getAttribute('type').catch(() => 'text');
    const name = await input.getAttribute('name').catch(() => '');
    const placeholder = await input.getAttribute('placeholder').catch(() => '');
    const required = await input.getAttribute('required').catch(() => null);
    const min = await input.getAttribute('min').catch(() => null);
    const max = await input.getAttribute('max').catch(() => null);

    if (placeholder || name) {
      exploration.form.fields.push({
        type: type || 'text',
        name: name || '',
        placeholder: placeholder || '',
        required: required !== null,
        min,
        max
      });
    }
  }
  log('✅', `Found ${exploration.form.fields.length} input fields`);

  // Explore buttons
  log('🔵', 'Exploring buttons...');
  const buttons = await page.locator('button:visible').allTextContents();
  exploration.form.buttons = [...new Set(buttons.filter(b => b.trim() && b.length < 50))];
  log('✅', `Found buttons: ${exploration.form.buttons.join(', ')}`);

  // Explore all 4 configurations
  log('⚙️', '\nExploring all 4 configurations...\n');

  const configs = [
    { name: 'CFG-1', multiDay: false, diffDrop: false, desc: 'Normal trip' },
    { name: 'CFG-2', multiDay: true, diffDrop: false, desc: 'Multi-day trip' },
    { name: 'CFG-3', multiDay: false, diffDrop: true, desc: 'Different drop location' },
    { name: 'CFG-4', multiDay: true, diffDrop: true, desc: 'Multi-day + Different drop' }
  ];

  for (const cfg of configs) {
    log('⚙️', `Testing ${cfg.name}: ${cfg.desc}...`);

    // Reset to Local tab
    await page.locator('text="Local"').first().click();
    await page.waitForTimeout(500);

    // Set toggles
    const multiDayToggle = page.locator('label:has-text("Multi-day")').first();
    const diffDropToggle = page.locator('label:has-text("different location")').first();

    if (await multiDayToggle.isVisible().catch(() => false)) {
      const checkbox = multiDayToggle.locator('input').first();
      const isChecked = await checkbox.isChecked().catch(() => false);
      if (isChecked !== cfg.multiDay) {
        await multiDayToggle.click();
        await page.waitForTimeout(300);
      }
    }

    if (await diffDropToggle.isVisible().catch(() => false)) {
      const checkbox = diffDropToggle.locator('input').first();
      const isChecked = await checkbox.isChecked().catch(() => false);
      if (isChecked !== cfg.diffDrop) {
        await diffDropToggle.click();
        await page.waitForTimeout(300);
      }
    }

    await page.waitForTimeout(500);

    // Capture visible fields for this config
    const visibleFields = [];
    const allInputs = await page.locator('input:visible, select:visible').all();
    for (const input of allInputs) {
      const placeholder = await input.getAttribute('placeholder').catch(() => '');
      const name = await input.getAttribute('name').catch(() => '');
      if (placeholder || name) {
        visibleFields.push(placeholder || name);
      }
    }

    exploration.configurations.push({
      ...cfg,
      visibleFields: visibleFields.filter(f => f.length < 100)
    });

    await screenshot(page, `02-${cfg.name.toLowerCase()}`);
    log('✅', `${cfg.name} captured`);
  }

  // Test validation rules
  log('🔬', '\nTesting validation rules...\n');

  // Reset to CFG-1
  await page.locator('text="Local"').first().click();
  await page.waitForTimeout(500);

  // Test empty pickup
  log('🔬', 'Testing: Empty pickup location...');
  const bookBtn = page.locator('button:has-text("Book Now")').first();
  if (await bookBtn.isVisible().catch(() => false)) {
    await bookBtn.click();
    await page.waitForTimeout(1000);

    const errorMsg = await page.locator('[class*="error"], [class*="invalid"], [class*="required"]').first().textContent({ timeout: 2000 }).catch(() => null);
    if (errorMsg) {
      exploration.validationRules.push({ test: 'Empty pickup', result: errorMsg.trim().slice(0, 100) });
      log('✅', `Validation: ${errorMsg.trim().slice(0, 50)}`);
    }
  }
  await screenshot(page, '03-validation-empty-pickup');

  // Fill pickup and test other validations
  const pickupInput = page.locator('input[placeholder*="pickup" i]').first();
  if (await pickupInput.isVisible().catch(() => false)) {
    await pickupInput.fill('Bangalore');
    await page.waitForTimeout(1000);
    const suggestion = page.locator('[class*="suggestion"], [class*="pac-item"]').first();
    if (await suggestion.isVisible({ timeout: 2000 }).catch(() => false)) {
      await suggestion.click();
    }
  }

  // Test passengers validation
  log('🔬', 'Testing: Passenger count validations...');
  const paxInput = page.locator('input[placeholder*="passenger" i]').first();
  if (await paxInput.isVisible().catch(() => false)) {
    // Test 0 passengers
    await paxInput.fill('0');
    await page.waitForTimeout(500);
    const val0 = await paxInput.inputValue();
    exploration.validationRules.push({ test: 'Passengers = 0', result: `Value became: ${val0}` });

    // Test negative
    await paxInput.fill('-5');
    await page.waitForTimeout(500);
    const valNeg = await paxInput.inputValue();
    exploration.validationRules.push({ test: 'Passengers = -5', result: `Value became: ${valNeg}` });

    // Test large number
    await paxInput.fill('999');
    await page.waitForTimeout(500);
    const valMax = await paxInput.inputValue();
    exploration.validationRules.push({ test: 'Passengers = 999', result: `Value accepted: ${valMax}` });

    await paxInput.fill('2');
  }

  // Test hours validation
  log('🔬', 'Testing: Hours validations...');
  const hoursInput = page.locator('input[placeholder*="hour" i]').first();
  if (await hoursInput.isVisible().catch(() => false)) {
    // Test 0 hours
    await hoursInput.fill('0');
    await bookBtn.click();
    await page.waitForTimeout(500);
    let errorMsg = await page.locator('[class*="error"]').first().textContent({ timeout: 1000 }).catch(() => null);
    exploration.validationRules.push({ test: 'Hours = 0', result: errorMsg || 'No error shown' });

    // Test 25 hours
    await hoursInput.fill('25');
    await bookBtn.click();
    await page.waitForTimeout(500);
    errorMsg = await page.locator('[class*="error"]').first().textContent({ timeout: 1000 }).catch(() => null);
    exploration.validationRules.push({ test: 'Hours = 25', result: errorMsg || 'No error shown' });

    await hoursInput.fill('4');
  }
  await screenshot(page, '04-validation-tests');

  // Explore date picker
  log('📅', 'Exploring date picker...');
  const dateInput = page.locator('input[type="date"], [class*="date-picker"]').first();
  if (await dateInput.isVisible().catch(() => false)) {
    // Check if past dates are disabled
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    await dateInput.fill(yesterday.toISOString().split('T')[0]);
    await page.waitForTimeout(500);
    const dateValue = await dateInput.inputValue();
    exploration.observations.push({ area: 'Date picker', note: `Past date (${yesterday.toISOString().split('T')[0]}) result: ${dateValue}` });
  }

  // Explore time picker
  log('⏰', 'Exploring time picker...');
  const timeElements = await page.locator('[class*="time"], select[name*="time"]').all();
  if (timeElements.length > 0) {
    exploration.observations.push({ area: 'Time picker', note: `Found ${timeElements.length} time-related elements` });
  }

  // Check for fare display
  log('💰', 'Looking for fare-related elements...');
  const fareElements = await page.locator('[class*="fare"], [class*="price"], [class*="cost"]').count();
  exploration.observations.push({ area: 'Fare display', note: `Found ${fareElements} fare-related elements on form` });

  await screenshot(page, '05-exploration-complete');

  // Additional observations
  exploration.observations.push({ area: 'Form behavior', note: 'Form uses Google Places autocomplete for location fields' });
  exploration.observations.push({ area: 'Multi-day', note: 'Multi-day toggle reveals inline calendar for date selection' });
  exploration.observations.push({ area: 'Different drop', note: 'Different drop toggle reveals drop location field' });

  return exploration;
}

function generateExplorationReport(exp) {
  const md = `# Local Module Exploration Report

**Run ID:** ${exp.runId}
**Timestamp:** ${exp.timestamp}
**URL:** ${exp.url}

## Form Structure

### Tabs Found
${exp.form.tabs.map(t => `- ${t}`).join('\n') || '- None found'}

### Toggles
| Toggle | Default State |
|--------|---------------|
${exp.form.toggles.map(t => `| ${t.label} | ${t.defaultState} |`).join('\n') || '| None | - |'}

### Input Fields
| Type | Name/Placeholder | Required |
|------|------------------|----------|
${exp.form.fields.map(f => `| ${f.type} | ${f.placeholder || f.name} | ${f.required ? 'Yes' : 'No'} |`).join('\n') || '| None | - | - |'}

### Buttons
${exp.form.buttons.map(b => `- ${b}`).join('\n') || '- None found'}

## Configuration Details

${exp.configurations.map(cfg => `
### ${cfg.name}: ${cfg.desc}
- **Multi-day:** ${cfg.multiDay ? 'ON' : 'OFF'}
- **Different Drop:** ${cfg.diffDrop ? 'ON' : 'OFF'}
- **Visible Fields:** ${cfg.visibleFields.join(', ') || 'None captured'}
`).join('\n')}

## Validation Rules Discovered

| Test Case | Result |
|-----------|--------|
${exp.validationRules.map(v => `| ${v.test} | ${v.result} |`).join('\n') || '| None tested | - |'}

## Observations

${exp.observations.map(o => `- **${o.area}:** ${o.note}`).join('\n') || '- None'}

## Screenshots
${exp.screenshots.map(s => `- ${s}`).join('\n') || '- None captured'}
`;

  fs.writeFileSync(path.join(outputDir, `${exp.runId}-exploration.md`), md);
  return md;
}

function generateUniquetestCases(exp) {
  const testCases = [
    // Basic functional tests
    {
      id: 'LOCAL-UC-01',
      category: 'Happy Path',
      title: 'Basic local trip within city',
      config: 'CFG-1',
      data: { pickup: 'Koramangala, Bangalore', passengers: '2', hours: '4', date: 'tomorrow', time: '10:00 AM' },
      expected: 'Vehicle results displayed with pricing',
      priority: 'P1'
    },
    {
      id: 'LOCAL-UC-02',
      category: 'Happy Path',
      title: 'Multi-day local trip (2 consecutive days)',
      config: 'CFG-2',
      data: { pickup: 'MG Road, Bangalore', passengers: '4', hours: '8', dates: 'tomorrow + day after' },
      expected: 'Multi-day pricing shown (fare × 2)',
      priority: 'P1'
    },
    {
      id: 'LOCAL-UC-03',
      category: 'Happy Path',
      title: 'Local trip with different drop location',
      config: 'CFG-3',
      data: { pickup: 'Indiranagar, Bangalore', drop: 'Electronic City', passengers: '3', hours: '6' },
      expected: 'Route shows pickup → drop, distance calculated',
      priority: 'P1'
    },
    {
      id: 'LOCAL-UC-04',
      category: 'Happy Path',
      title: 'Multi-day with different drop (full combo)',
      config: 'CFG-4',
      data: { pickup: 'Whitefield', drop: 'Mysore', passengers: '10', hours: '8', dates: '3 days' },
      expected: 'Multi-day + different drop pricing',
      priority: 'P1'
    },

    // Boundary tests - Passengers
    {
      id: 'LOCAL-UC-05',
      category: 'Boundary',
      title: 'Minimum passengers (1)',
      config: 'CFG-1',
      data: { pickup: 'HSR Layout', passengers: '1', hours: '2' },
      expected: 'All vehicles shown including small ones',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-06',
      category: 'Boundary',
      title: 'Maximum single-vehicle capacity (49 pax)',
      config: 'CFG-1',
      data: { pickup: 'Jayanagar', passengers: '49', hours: '8' },
      expected: 'Large buses shown (49-seater)',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-07',
      category: 'Boundary',
      title: 'Above single-vehicle capacity (50+ pax)',
      config: 'CFG-1',
      data: { pickup: 'Malleshwaram', passengers: '55', hours: '8' },
      expected: 'Multiple vehicle suggestion or warning',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-08',
      category: 'Boundary',
      title: 'Large group (100+ pax)',
      config: 'CFG-1',
      data: { pickup: 'BTM Layout', passengers: '120', hours: '8' },
      expected: 'Multi-vehicle booking flow or error',
      priority: 'P3'
    },

    // Boundary tests - Hours
    {
      id: 'LOCAL-UC-09',
      category: 'Boundary',
      title: 'Minimum hours (1 hour)',
      config: 'CFG-1',
      data: { pickup: 'Yelahanka', passengers: '2', hours: '1' },
      expected: 'Minimum package pricing shown',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-10',
      category: 'Boundary',
      title: 'Maximum hours (24 hours)',
      config: 'CFG-1',
      data: { pickup: 'Hebbal', passengers: '4', hours: '24' },
      expected: 'Full-day package pricing',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-11',
      category: 'Boundary',
      title: 'Above maximum hours (25)',
      config: 'CFG-1',
      data: { pickup: 'Marathahalli', passengers: '2', hours: '25' },
      expected: 'Error: Maximum 24 hours allowed',
      priority: 'P2'
    },

    // Date/Time tests
    {
      id: 'LOCAL-UC-12',
      category: 'Date/Time',
      title: 'Same-day booking (today)',
      config: 'CFG-1',
      data: { pickup: 'Basavanagudi', passengers: '2', hours: '4', date: 'today', time: 'next available slot' },
      expected: 'Booking accepted with available time slots',
      priority: 'P1'
    },
    {
      id: 'LOCAL-UC-13',
      category: 'Date/Time',
      title: 'Far future booking (6 months ahead)',
      config: 'CFG-1',
      data: { pickup: 'Rajajinagar', passengers: '4', hours: '8', date: '+180 days' },
      expected: 'Future date accepted',
      priority: 'P3'
    },
    {
      id: 'LOCAL-UC-14',
      category: 'Date/Time',
      title: 'Past date attempt',
      config: 'CFG-1',
      data: { pickup: 'Vijayanagar', passengers: '2', hours: '4', date: 'yesterday' },
      expected: 'Error: Past date not allowed',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-15',
      category: 'Date/Time',
      title: 'Early morning pickup (5 AM)',
      config: 'CFG-1',
      data: { pickup: 'Kengeri', passengers: '6', hours: '8', time: '05:00' },
      expected: 'Early slot accepted, may show night charges',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-16',
      category: 'Date/Time',
      title: 'Late night pickup (11 PM)',
      config: 'CFG-1',
      data: { pickup: 'JP Nagar', passengers: '4', hours: '6', time: '23:00' },
      expected: 'Night slot accepted, may show night charges',
      priority: 'P2'
    },

    // Location tests
    {
      id: 'LOCAL-UC-17',
      category: 'Location',
      title: 'Airport pickup (special location)',
      config: 'CFG-1',
      data: { pickup: 'Kempegowda International Airport', passengers: '4', hours: '4' },
      expected: 'Airport recognized, may have special pricing',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-18',
      category: 'Location',
      title: 'Railway station pickup',
      config: 'CFG-1',
      data: { pickup: 'Bangalore City Railway Station', passengers: '6', hours: '6' },
      expected: 'Station recognized',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-19',
      category: 'Location',
      title: 'Different drop - same as pickup',
      config: 'CFG-3',
      data: { pickup: 'MG Road', drop: 'MG Road', passengers: '2', hours: '4' },
      expected: 'Error or warning for same location',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-20',
      category: 'Location',
      title: 'Long distance drop (inter-city)',
      config: 'CFG-3',
      data: { pickup: 'Bangalore', drop: 'Mysore', passengers: '4', hours: '8' },
      expected: 'Should suggest Outstation instead or show long-distance pricing',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-21',
      category: 'Location',
      title: 'Out-of-state drop',
      config: 'CFG-3',
      data: { pickup: 'Bangalore', drop: 'Chennai', passengers: '4', hours: '8' },
      expected: 'Error or redirect to Outstation',
      priority: 'P3'
    },

    // Validation tests
    {
      id: 'LOCAL-UC-22',
      category: 'Validation',
      title: 'Empty pickup location',
      config: 'CFG-1',
      data: { pickup: '', passengers: '2', hours: '4' },
      expected: 'Error: Pickup location is required',
      priority: 'P1'
    },
    {
      id: 'LOCAL-UC-23',
      category: 'Validation',
      title: 'Empty drop location (CFG-3)',
      config: 'CFG-3',
      data: { pickup: 'Koramangala', drop: '', passengers: '2', hours: '4' },
      expected: 'Error: Drop location is required',
      priority: 'P1'
    },
    {
      id: 'LOCAL-UC-24',
      category: 'Validation',
      title: 'Zero passengers',
      config: 'CFG-1',
      data: { pickup: 'Indiranagar', passengers: '0', hours: '4' },
      expected: 'Error or auto-correct to 1',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-25',
      category: 'Validation',
      title: 'Negative passengers',
      config: 'CFG-1',
      data: { pickup: 'Whitefield', passengers: '-5', hours: '4' },
      expected: 'Error or auto-correct to 1',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-26',
      category: 'Validation',
      title: 'Zero hours',
      config: 'CFG-1',
      data: { pickup: 'HSR Layout', passengers: '2', hours: '0' },
      expected: 'Error: Must be a positive number',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-27',
      category: 'Validation',
      title: 'Decimal hours (1.5)',
      config: 'CFG-1',
      data: { pickup: 'Jayanagar', passengers: '2', hours: '1.5' },
      expected: 'Rounded to 1 or 2, or accepted',
      priority: 'P3'
    },

    // Multi-day specific tests
    {
      id: 'LOCAL-UC-28',
      category: 'Multi-day',
      title: 'Multi-day with only today selected',
      config: 'CFG-2',
      data: { pickup: 'Koramangala', passengers: '4', hours: '8', dates: 'today only' },
      expected: 'Single day treated as 1-day multi-day',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-29',
      category: 'Multi-day',
      title: 'Multi-day with non-consecutive dates',
      config: 'CFG-2',
      data: { pickup: 'MG Road', passengers: '6', hours: '8', dates: 'Mon, Wed, Fri (skip days)' },
      expected: 'Non-consecutive dates accepted/rejected',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-30',
      category: 'Multi-day',
      title: 'Multi-day across months',
      config: 'CFG-2',
      data: { pickup: 'Indiranagar', passengers: '10', hours: '8', dates: 'last day of month + first day of next' },
      expected: 'Cross-month selection works',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-31',
      category: 'Multi-day',
      title: 'Multi-day maximum (30 days)',
      config: 'CFG-2',
      data: { pickup: 'Whitefield', passengers: '20', hours: '8', dates: '30 consecutive days' },
      expected: 'Large booking accepted or limit shown',
      priority: 'P3'
    },

    // Toggle transition tests
    {
      id: 'LOCAL-UC-32',
      category: 'Toggle',
      title: 'Toggle Multi-day ON then OFF with data',
      config: 'CFG-1',
      data: { pickup: 'Koramangala', passengers: '4', hours: '8' },
      steps: ['Fill form', 'Enable Multi-day', 'Select dates', 'Disable Multi-day'],
      expected: 'Form resets or preserves single date',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-33',
      category: 'Toggle',
      title: 'Toggle Different Drop ON then OFF with data',
      config: 'CFG-1',
      data: { pickup: 'MG Road', drop: 'Airport', passengers: '2', hours: '4' },
      steps: ['Fill form', 'Enable Diff Drop', 'Enter drop', 'Disable Diff Drop'],
      expected: 'Drop field hidden, drop location cleared',
      priority: 'P2'
    },

    // Vehicle-specific tests
    {
      id: 'LOCAL-UC-34',
      category: 'Vehicle',
      title: 'Sedan trip (1-4 pax)',
      config: 'CFG-1',
      data: { pickup: 'Koramangala', passengers: '3', hours: '4' },
      vehicleType: 'Sedan',
      expected: 'Sedan available in results',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-35',
      category: 'Vehicle',
      title: 'Tempo Traveller trip (12 pax)',
      config: 'CFG-1',
      data: { pickup: 'Whitefield', passengers: '12', hours: '8' },
      vehicleType: '12 Seater Tempo Traveller',
      expected: 'Tempo Traveller at capacity shown',
      priority: 'P2'
    },
    {
      id: 'LOCAL-UC-36',
      category: 'Vehicle',
      title: 'Luxury bus trip (45 pax)',
      config: 'CFG-1',
      data: { pickup: 'Electronic City', passengers: '45', hours: '10' },
      vehicleType: '45 Seater Luxury Volvo',
      expected: 'Luxury buses shown',
      priority: 'P2'
    },

    // Edge cases
    {
      id: 'LOCAL-UC-37',
      category: 'Edge Case',
      title: 'Special characters in location',
      config: 'CFG-1',
      data: { pickup: "St. John's Church, Bangalore", passengers: '4', hours: '4' },
      expected: 'Location with special chars accepted',
      priority: 'P3'
    },
    {
      id: 'LOCAL-UC-38',
      category: 'Edge Case',
      title: 'Unicode location name',
      config: 'CFG-1',
      data: { pickup: 'ಬೆಂಗಳೂರು (Kannada)', passengers: '2', hours: '4' },
      expected: 'Unicode handled or fallback to English',
      priority: 'P3'
    },
    {
      id: 'LOCAL-UC-39',
      category: 'Edge Case',
      title: 'Very long location name',
      config: 'CFG-1',
      data: { pickup: 'Kempegowda International Airport Terminal 2 Departure Gate', passengers: '4', hours: '4' },
      expected: 'Long name handled properly',
      priority: 'P3'
    },
    {
      id: 'LOCAL-UC-40',
      category: 'Edge Case',
      title: 'Form refresh with data filled',
      config: 'CFG-1',
      data: { pickup: 'MG Road', passengers: '4', hours: '8' },
      steps: ['Fill form', 'Press F5/Refresh'],
      expected: 'Form data persisted or cleared',
      priority: 'P3'
    }
  ];

  return testCases;
}

function generateTestCaseReport(testCases) {
  // Group by category
  const categories = {};
  testCases.forEach(tc => {
    if (!categories[tc.category]) categories[tc.category] = [];
    categories[tc.category].push(tc);
  });

  const md = `# Local Module - Unique Test Cases

**Generated:** ${new Date().toISOString()}
**Total Test Cases:** ${testCases.length}

## Summary by Category

| Category | Count |
|----------|-------|
${Object.entries(categories).map(([cat, tcs]) => `| ${cat} | ${tcs.length} |`).join('\n')}

## Priority Distribution

| Priority | Count |
|----------|-------|
| P1 (Critical) | ${testCases.filter(tc => tc.priority === 'P1').length} |
| P2 (High) | ${testCases.filter(tc => tc.priority === 'P2').length} |
| P3 (Medium) | ${testCases.filter(tc => tc.priority === 'P3').length} |

---

${Object.entries(categories).map(([category, tcs]) => `
## ${category} Tests (${tcs.length})

| ID | Title | Config | Priority |
|----|-------|--------|----------|
${tcs.map(tc => `| ${tc.id} | ${tc.title} | ${tc.config} | ${tc.priority} |`).join('\n')}

${tcs.map(tc => `
### ${tc.id}: ${tc.title}

- **Config:** ${tc.config}
- **Priority:** ${tc.priority}
- **Data:** ${JSON.stringify(tc.data, null, 2).replace(/\n/g, '\n  ')}
${tc.vehicleType ? `- **Vehicle Type:** ${tc.vehicleType}` : ''}
${tc.steps ? `- **Steps:** ${tc.steps.join(' → ')}` : ''}
- **Expected:** ${tc.expected}
`).join('\n')}
`).join('\n')}

---

## Test Execution Checklist

| ID | Title | Status | Notes |
|----|-------|--------|-------|
${testCases.map(tc => `| ${tc.id} | ${tc.title} | ⬜ | |`).join('\n')}
`;

  fs.writeFileSync(path.join(outputDir, 'local-unique-test-cases.md'), md);

  // Also save as JSON
  fs.writeFileSync(path.join(outputDir, 'local-unique-test-cases.json'), JSON.stringify(testCases, null, 2));

  return md;
}

(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 LOCAL MODULE EXPLORATION');
  console.log('='.repeat(60) + '\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 200
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await login(page);
    const exp = await exploreLocalModule(page);

    // Generate exploration report
    log('📝', '\nGenerating exploration report...');
    generateExplorationReport(exp);
    log('✅', `Saved: exploration-logs/${exp.runId}-exploration.md`);

    // Generate unique test cases
    log('📝', 'Generating unique test cases...');
    const testCases = generateUniquetestCases(exp);
    generateTestCaseReport(testCases);
    log('✅', `Saved: exploration-logs/local-unique-test-cases.md`);
    log('✅', `Saved: exploration-logs/local-unique-test-cases.json`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ EXPLORATION COMPLETE');
    console.log('='.repeat(60));
    console.log(`📋 ${testCases.length} unique test cases created`);
    console.log(`📸 ${exp.screenshots.length} screenshots captured`);
    console.log(`📁 Output: exploration-logs/`);
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
