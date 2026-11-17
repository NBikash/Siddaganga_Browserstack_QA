/**
 * Login - Navigate, click Mobile Number, fill credentials, submit
 */
const { chromium } = require('playwright');

const credentials = {
  mobile: '9654245923',
  password: 'Test@1234'
};

(async () => {
  console.log('\n' + '='.repeat(50));
  console.log('🔐 LOGIN TO SIDDAGANGA TRAVELS PREPROD');
  console.log('='.repeat(50));

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    // Step 1: Navigate to login page
    console.log('\n1️⃣  Navigating to login page...');
    await page.goto('https://preprod.siddagangatravels.com/login', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    console.log('   ✅ Login page loaded');
    await page.waitForTimeout(1000);

    // Step 2: Click "Mobile Number" tab/button
    console.log('\n2️⃣  Clicking "Mobile Number" option...');

    // Try multiple selectors for Mobile Number option
    const mobileSelectors = [
      'text="Mobile Number"',
      'button:has-text("Mobile Number")',
      'a:has-text("Mobile Number")',
      '[role="tab"]:has-text("Mobile")',
      'label:has-text("Mobile Number")',
      '.tab:has-text("Mobile")',
      '[data-value="mobile"]'
    ];

    let clicked = false;
    for (const selector of mobileSelectors) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
        await element.click();
        clicked = true;
        console.log(`   ✅ Clicked: ${selector}`);
        break;
      }
    }

    if (!clicked) {
      console.log('   ℹ️  Mobile Number option not found as separate tab - proceeding with form');
    }

    await page.waitForTimeout(800);

    // Step 3: Fill Mobile Number
    console.log('\n3️⃣  Filling Mobile Number: ' + credentials.mobile);

    // Try multiple selectors for mobile input
    const mobileInputSelectors = [
      'input[type="tel"]',
      'input[name="mobile"]',
      'input[name="mobileNumber"]',
      'input[name="phone"]',
      'input[placeholder*="Mobile"]',
      'input[placeholder*="mobile"]',
      'input[placeholder*="Phone"]',
      'input[placeholder*="phone"]',
      'input[placeholder*="Enter your mobile"]',
      'input[placeholder*="Enter mobile"]',
      'input[id*="mobile"]',
      'input[id*="phone"]'
    ];

    let mobileFilled = false;
    for (const selector of mobileInputSelectors) {
      const input = page.locator(selector).first();
      if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
        await input.click();
        await input.clear();
        await input.fill(credentials.mobile);
        mobileFilled = true;
        console.log(`   ✅ Filled mobile using: ${selector}`);
        break;
      }
    }

    if (!mobileFilled) {
      // Try first visible text input
      const firstInput = page.locator('input:visible').first();
      await firstInput.click();
      await firstInput.fill(credentials.mobile);
      console.log('   ✅ Filled mobile in first input field');
    }

    await page.waitForTimeout(500);

    // Step 4: Fill Password
    console.log('\n4️⃣  Filling Password: ********');

    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible({ timeout: 3000 })) {
      await passwordInput.click();
      await passwordInput.fill(credentials.password);
      console.log('   ✅ Password entered');
    } else {
      console.log('   ⚠️  Password field not found');
    }

    await page.waitForTimeout(500);

    // Take screenshot before submit
    await page.screenshot({ path: 'screenshots/local/login-filled.png' });
    console.log('\n📸 Screenshot saved: screenshots/local/login-filled.png');

    // Step 5: Click Login/Submit button
    console.log('\n5️⃣  Clicking Login button...');

    const submitSelectors = [
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Submit")',
      'button:has-text("Continue")',
      'button[type="submit"]',
      'input[type="submit"]',
      'a:has-text("Login")'
    ];

    let submitted = false;
    for (const selector of submitSelectors) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await btn.click();
        submitted = true;
        console.log(`   ✅ Clicked: ${selector}`);
        break;
      }
    }

    if (!submitted) {
      console.log('   ⚠️  Login button not found');
    }

    // Wait for response
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // Step 6: Check result
    console.log('\n6️⃣  Checking login result...');
    const currentUrl = page.url();
    console.log(`   📍 Current URL: ${currentUrl}`);

    // Check for errors
    const errorElement = page.locator('[class*="error"], [class*="alert"], [role="alert"], .toast-error').first();
    const errorText = await errorElement.textContent({ timeout: 2000 }).catch(() => null);

    if (errorText && errorText.trim()) {
      console.log(`   ⚠️  Message: ${errorText.trim()}`);
    }

    // Check if logged in (redirected away from login)
    if (!currentUrl.includes('/login')) {
      console.log('   ✅ LOGIN SUCCESSFUL! Redirected to dashboard/home');
    } else {
      // Check for OTP
      const otpField = page.locator('input[name*="otp"], input[placeholder*="OTP"], input[placeholder*="code"], input[maxlength="6"]').first();
      if (await otpField.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('   📱 OTP verification required - please enter OTP manually');
      }
    }

    // Take final screenshot
    await page.screenshot({ path: 'screenshots/local/login-result.png' });
    console.log('\n📸 Screenshot saved: screenshots/local/login-result.png');

    console.log('\n' + '='.repeat(50));
    console.log('✅ LOGIN PROCESS COMPLETED');
    console.log('   Browser staying open for 30 seconds...');
    console.log('='.repeat(50) + '\n');

    // Keep browser open
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await page.screenshot({ path: 'screenshots/local/login-error.png' }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
