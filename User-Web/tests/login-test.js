/**
 * Login Test - Navigate to login page and fill credentials
 */
require('dotenv').config();
const { chromium } = require('playwright');

const config = {
  baseUrl: 'https://preprod.siddagangatravels.com/login',
  username: process.env.USER_WEB_USERNAME || '9654245923',
  password: process.env.USER_WEB_PASSWORD || 'Test@1234'
};

(async () => {
  console.log('\n🚀 Starting Login Test');
  console.log(`📍 URL: ${config.baseUrl}`);
  console.log(`📱 Mobile: ${config.username}`);
  console.log('');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 400
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  try {
    // Step 1: Navigate to login page
    console.log('1️⃣ Navigating to login page...');
    await page.goto(config.baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    console.log('   ✅ Login page loaded');

    // Step 2: Click on "Mobile Number" tab/option if available
    console.log('2️⃣ Looking for Mobile Number option...');
    const mobileTab = page.locator('text=Mobile Number, text=Mobile, button:has-text("Mobile"), [data-tab="mobile"]').first();
    if (await mobileTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await mobileTab.click();
      await page.waitForTimeout(500);
      console.log('   ✅ Clicked Mobile Number tab');
    } else {
      console.log('   ℹ️ Mobile Number tab not found (may already be selected)');
    }

    // Step 3: Fill Mobile Number
    console.log('3️⃣ Filling Mobile Number...');
    const mobileInput = page.locator('input[type="tel"], input[name*="mobile"], input[name*="phone"], input[placeholder*="Mobile"], input[placeholder*="Phone"], input[placeholder*="mobile"], input[placeholder*="phone"]').first();

    if (await mobileInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await mobileInput.click();
      await mobileInput.fill(config.username);
      console.log(`   ✅ Entered mobile: ${config.username}`);
    } else {
      // Try generic text input
      const textInput = page.locator('input[type="text"]').first();
      if (await textInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await textInput.fill(config.username);
        console.log(`   ✅ Entered mobile in text field: ${config.username}`);
      }
    }

    // Step 4: Fill Password
    console.log('4️⃣ Filling Password...');
    const passwordInput = page.locator('input[type="password"]').first();
    if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await passwordInput.click();
      await passwordInput.fill(config.password);
      console.log('   ✅ Entered password: ********');
    }

    await page.waitForTimeout(1000);

    // Step 5: Click Login/Submit button
    console.log('5️⃣ Clicking Login button...');
    const loginBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Continue"), input[type="submit"]').first();

    if (await loginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginBtn.click();
      console.log('   ✅ Clicked Login button');

      // Wait for navigation/response
      await page.waitForTimeout(3000);
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    }

    // Step 6: Check login result
    console.log('6️⃣ Checking login result...');
    const currentUrl = page.url();

    // Check for error messages
    const errorMsg = await page.locator('[class*="error"], [class*="alert-danger"], .error-message, [role="alert"]').first().textContent({ timeout: 2000 }).catch(() => null);

    if (errorMsg) {
      console.log(`   ⚠️ Error message: ${errorMsg.trim()}`);
    } else if (!currentUrl.includes('/login')) {
      console.log('   ✅ Login successful! Redirected to:', currentUrl);
    } else {
      console.log('   ℹ️ Still on login page - checking for OTP or additional steps...');

      // Check if OTP field appeared
      const otpInput = page.locator('input[name*="otp"], input[placeholder*="OTP"], input[placeholder*="code"]').first();
      if (await otpInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('   📱 OTP field detected - waiting for user to enter OTP...');
      }
    }

    console.log('\n✅ Login process completed. Browser will stay open for verification.');
    console.log('   Press Ctrl+C to close when done.\n');

    // Keep browser open for user verification
    await page.waitForTimeout(60000);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
