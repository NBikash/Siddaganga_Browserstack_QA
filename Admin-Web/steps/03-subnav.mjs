// Read-only: click navigation-only cards/toggles and record the destination (URL / heading / popup menu items).
import fs from 'node:fs';
const BASE = 'https://dari-dev.siddagangatravels.com';
const UNSAFE = /add|save|send|delete|sync|clear|export|upload|activate|bulk|record|create|approve|reject|cancel|update|submit|remove|logout|reset|adjust/i;
const plan = [
  ['/dashboard/user-management', ['User Management', 'Role Management', 'Deleted Users']],
  ['/dashboard/employee-management', ['Total Employees', 'All Drivers and Helpers Count', 'Client Request Portal', 'Incentive Programs', 'Sales Incentive Programs', 'Employee Onboarding', 'Employee Tracker', 'View All Employees', 'Operations Roster', 'Client Request', 'HR Overview']],
  ['/dashboard/fleet-vehicle-management', ['Total Buses / Active', 'Approved & Track Live Trips', 'Vehicle Allocation Portal', 'Tarrif Management']],
  ['/dashboard/booking-management/total-booking', ['Total Bookings', 'Live Trips', 'Upcoming Trips', 'Pending Vehicle Allocations', 'Pre-Bookings', 'Booked', 'Completed']],
  ['/dashboard/inquiry-management/total-inquiries', ['Total Inquiries', 'Conversion Rate', 'Pending Approvals', 'Total Quote Value']],
  ['/dashboard/client-management/regular-clients', ['All Bookings', 'Invoice & Payment', 'Customer Requests', 'Regular Customers', 'Contracted Client', 'International Client', 'All Customers', 'Active Customers']],
  ['/dashboard/client-management/contracted-clients', ['User Management', 'Invoice Management', 'Client Requests', 'New Clients/Onboard']],
  ['/dashboard/vendor-management/vendors', ['All Vendors', 'Manage Vendor Requests', 'Vehicles Onboarded', 'Products Linked']],
  ['/dashboard/service-maintenance/service-requests', ['Service Requests', 'All Service and Maintenance', 'Job Tracker', 'Cost Analytics', 'All Requests', 'Under Review', 'Parts Request', 'Approved Requests', 'Rejected Requests']],
  ['/dashboard/service-maintenance/manage-service-type', ['All Service Type', 'Pre-Departure Checklist', 'Post-arrival Checklist']],
  ['/dashboard/financial-management', ['Dashboard', 'Masters', 'Income', 'Expenses', 'Receivables', 'Payables', 'Banking', 'Assets', 'Compliance', 'Profitability', 'Reports', 'More']],
  ['/dashboard/inventory-management/dashboard', ['Dashboard', 'Manage Inventory', 'Purchasing', 'Settings', 'Reports & Analytics']],
  ['/dashboard/payment-management', ['Penalty Slabs', 'B2B Rebate Tiers', 'B2C Rebate Tiers']],
];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default async ({ page, shot }) => {
  const out = [];
  for (const [route, targets] of plan) {
    for (const t of targets) {
      if (UNSAFE.test(t)) { out.push({ route, target: t, skipped: 'unsafe-word' }); continue; }
      await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(800);
      const el = page.locator('main').getByText(t, { exact: true }).first();
      if (!await el.count()) { out.push({ route, target: t, error: 'not found' }); continue; }
      const beforeH = await page.locator('main h4, main h5, main h3').allInnerTexts().catch(() => []);
      await el.click({ timeout: 5000 }).catch(e => out.push({ route, target: t, error: 'click: ' + e.message.split('\n')[0] }));
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1000);
      const menu = await page.locator('[role=menu] [role=menuitem], [role=listbox] [role=option], .MuiPopover-paper a, .MuiPopover-paper li').allInnerTexts().catch(() => []);
      const afterH = await page.locator('main h4, main h5, main h3').allInnerTexts().catch(() => []);
      const dialog = await page.locator('[role=dialog]').count();
      const rec = {
        route, target: t, url: page.url().replace(BASE, ''),
        menu: menu.map(s => s.trim()).filter(Boolean),
        newHeadings: afterH.filter(h => !beforeH.includes(h)).map(s => s.trim()).filter(Boolean).slice(0, 15),
        dialog,
      };
      const folder = route.split('/')[2] || 'dashboard';
      rec.shot = await shot(`${folder}/subnav-${slug(route.split('/').pop())}-${slug(t)}`);
      if (menu.length || dialog) await page.keyboard.press('Escape');
      out.push(rec);
    }
  }
  fs.writeFileSync('exploration-logs/raw/subnav-scan.json', JSON.stringify(out, null, 2));
  return out.map(r => `${r.route} :: ${r.target} -> ${r.error || r.skipped || r.url}${r.menu?.length ? ' MENU[' + r.menu.join(' | ') + ']' : ''}${r.dialog ? ' DIALOG' : ''}${r.newHeadings?.length ? ' H[' + r.newHeadings.join(' | ').slice(0, 200) + ']' : ''}`).join('\n');
};
