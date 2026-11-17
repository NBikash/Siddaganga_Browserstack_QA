/**
 * User-Web Test Configuration
 * Reads all settings from .env file
 */
require('dotenv').config();

module.exports = {
  // Environment
  baseUrl: process.env.USER_WEB_URL || 'https://preprod.siddagangatravels.com/',
  loginUrl: process.env.USER_WEB_URL ? `${process.env.USER_WEB_URL.replace(/\/$/, '')}/login` : 'https://preprod.siddagangatravels.com/login',

  // Credentials
  username: process.env.USER_WEB_USERNAME,
  password: process.env.USER_WEB_PASSWORD,
  loginMode: process.env.USER_WEB_LOGIN_MODE || 'mobile', // 'mobile' or 'email'

  // Browser settings
  browser: {
    headless: false,
    slowMo: 300,
    viewport: { width: 1440, height: 900 }
  },

  // Timeouts
  timeout: {
    page: 30000,
    element: 10000,
    network: 60000
  },

  // Paths
  paths: {
    screenshots: 'screenshots/local',
    results: 'results',
    reports: 'reports'
  }
};
