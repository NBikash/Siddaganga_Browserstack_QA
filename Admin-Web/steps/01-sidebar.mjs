// Read-only: expand each collapsible sidebar group and record its submenu links.
export default async ({ page, shot }) => {
  const groups = ['Fleet & Vehicle Management', 'Client Management', 'Vendor Management',
    'Category Management', 'Service & Maintenance', 'Content Management System'];
  const nav = page.locator('aside, [role=complementary]').first();
  const out = {};
  for (const g of groups) {
    const before = new Set(await nav.locator('a').evaluateAll(as => as.map(a => a.getAttribute('href'))));
    await nav.getByText(g, { exact: true }).first().click();
    await page.waitForTimeout(600);
    const links = await nav.locator('a').evaluateAll(as => as.map(a => ({ text: a.innerText.trim(), href: a.getAttribute('href') })));
    out[g] = links.filter(l => !before.has(l.href));
  }
  await page.mouse.move(700, 400);
  out._shot = await shot('dashboard/02-sidebar-expanded', { fullPage: false });
  out._allLinks = await nav.locator('a').evaluateAll(as => as.map(a => `${a.innerText.trim()} -> ${a.getAttribute('href')}`));
  return out;
};
