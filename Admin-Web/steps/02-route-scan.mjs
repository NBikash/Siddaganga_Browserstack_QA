// Read-only: visit each sidebar route (plus the brief's Contracted Clients URL) and record its surface.
import fs from 'node:fs';
const BASE = 'https://dari-dev.siddagangatravels.com';
const routes = [
  ['dashboard', 'Dashboard', '/dashboard'],
  ['role-permission', 'Role & Permission', '/dashboard/user-management'],
  ['employee-management', 'Employee Management', '/dashboard/employee-management'],
  ['fleet-vehicle', 'Fleet & Vehicles', '/dashboard/fleet-vehicle-management'],
  ['fleet-vehicle', 'Bus Types', '/dashboard/fleet-vehicle-management/bus-types'],
  ['fleet-vehicle', 'Bus Manufacturers', '/dashboard/fleet-vehicle-management/bus-manufacturer'],
  ['fleet-vehicle', 'Bus Models', '/dashboard/fleet-vehicle-management/bus-modal-page'],
  ['fleet-vehicle', 'Seat Types', '/dashboard/fleet-vehicle-management/seat-type'],
  ['booking-operations', 'Booking & Operations', '/dashboard/booking-management/total-booking'],
  ['inquiry-management', 'Inquiry Management', '/dashboard/inquiry-management/total-inquiries'],
  ['lead-management', 'Lead Management', '/dashboard/lead-management/total-lead'],
  ['client-management', 'Client Management', '/dashboard/client-management/regular-clients'],
  ['client-management', 'Contracted Clients (brief URL)', '/dashboard/client-management/contracted-clients'],
  ['client-management', 'Trip Wise Client', '/dashboard/client-management/trip-wise-client'],
  ['client-management', 'Manage Client', '/dashboard/client-management/manage-client'],
  ['client-management', 'Request Category', '/dashboard/client-management/request-category'],
  ['vendor-management', 'Vendor Management', '/dashboard/vendor-management/vendors'],
  ['vendor-management', 'Manage Request Type', '/dashboard/vendor-management/manage-request-type'],
  ['vendor-management', 'Deactivated Vendors', '/dashboard/vendor-management/deactivated-vendors'],
  ['category-management', 'Main Category', '/dashboard/category-management/main-category'],
  ['category-management', 'Sub Category', '/dashboard/category-management/sub-category'],
  ['category-management', 'Manage Unit Type', '/dashboard/category-management/manage-unit-type'],
  ['service-maintenance', 'Service & Maintenance', '/dashboard/service-maintenance/service-requests'],
  ['service-maintenance', 'Manage Service Type', '/dashboard/service-maintenance/manage-service-type'],
  ['financial-management', 'Financial Management', '/dashboard/financial-management'],
  ['inventory-management', 'Inventory Management', '/dashboard/inventory-management/dashboard'],
  ['cms', 'Popular Routes', '/dashboard/content-management-system/popular-routes'],
  ['cms', 'Popular Service Category', '/dashboard/content-management-system/popular-service-category'],
  ['cms', 'Popular Service Sub Category', '/dashboard/content-management-system/popular-service-sub-category'],
  ['cms', 'Popular Service Route', '/dashboard/content-management-system/popular-service-route'],
  ['cms', 'Popular Service Why Required', '/dashboard/content-management-system/popular-service-why-required'],
  ['cms', 'Popular Service Required For', '/dashboard/content-management-system/popular-service-required-for'],
  ['cms', 'WhatsApp FAQ', '/dashboard/content-management-system/whatsapp-faq'],
  ['cms', 'App Force Update', '/dashboard/content-management-system/app-force-update'],
  ['cms', 'Marketing Notification', '/dashboard/content-management-system/marketing-notification'],
  ['cms', 'Privacy & Terms', '/dashboard/content-management-system/policies-and-info'],
  ['payment-refund', 'Payment And Refund Management', '/dashboard/payment-management'],
];
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default async ({ page, shot }) => {
  const results = [];
  for (const [folder, name, route] of routes) {
    await page.goto(BASE + route, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const main = page.locator('main');
    const info = await main.evaluate(m => {
      const txt = e => (e.innerText || e.getAttribute('aria-label') || e.getAttribute('title') || '').trim().replace(/\s+/g, ' ');
      const uniq = a => [...new Set(a.filter(Boolean))];
      return {
        headings: uniq([...m.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(txt)).slice(0, 30),
        tabs: uniq([...m.querySelectorAll('[role=tab]')].map(txt)),
        inPageLinks: uniq([...m.querySelectorAll('a[href]')].map(a => `${txt(a)} -> ${a.getAttribute('href')}`)).slice(0, 40),
        buttons: uniq([...m.querySelectorAll('button')].filter(b => !b.closest('nav[aria-label*=pagination]')).map(b => txt(b) || (b.querySelector('svg') ? '[icon]' : ''))).slice(0, 40),
        inputs: uniq([...m.querySelectorAll('input,select,textarea,[role=combobox]')].map(i => `${i.tagName.toLowerCase()}[${i.type || i.getAttribute('role') || ''}] ${i.placeholder || i.getAttribute('aria-label') || i.name || txt(i)}`)).slice(0, 30),
        tables: [...m.querySelectorAll('table')].map(t => ({
          columns: [...t.querySelectorAll('thead th')].map(txt),
          rows: t.querySelectorAll('tbody tr').length,
          firstRowEmpty: /no data|no record|not found|please select/i.test(t.querySelector('tbody')?.innerText || ''),
        })),
        pagination: uniq([...m.querySelectorAll('p')].map(txt).filter(t => /^Showing /.test(t))),
      };
    }).catch(e => ({ error: e.message }));
    const title = (await page.locator('header h1, [role=banner] h1').first().innerText().catch(() => '')).trim();
    const s = await shot(`${folder}/${slug(name)}-01-landing`);
    results.push({ folder, name, route, finalUrl: page.url().replace(BASE, ''), title, shot: s, ...info });
  }
  fs.writeFileSync('exploration-logs/raw/route-scan.json', JSON.stringify(results, null, 2));
  return results.map(r => `${r.name} | ${r.finalUrl} | h1="${r.title}" | tabs=${r.tabs?.length ?? '?'} | tables=${r.tables?.length ?? '?'} | btns=${r.buttons?.length ?? '?'}${r.error ? ' | ERR ' + r.error : ''}`).join('\n');
};
