import { home, panel, place, cardAction } from './_local.mjs';
export default async ({ page, shot }) => {
  await home(page);
  await place(page, 'Search pickup location', 'Whitefield');
  await panel(page).getByRole('button', { name: 'Book Now!' }).click();
  await page.waitForURL(/send-inquiry/, { timeout: 30000 }); await page.waitForTimeout(4000);
  await cardAction(page, 'D SDN', 'View Full Vehicle Details');
  await page.waitForTimeout(3500);
  const url = page.url();
  const text = (await page.locator('body').innerText()).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>');
  const tabs = await page.locator('button, [role=tab], a.nav-link').allInnerTexts();
  return { url, tabs: [...new Set(tabs.map(s => s.trim()).filter(Boolean))].slice(0, 40), text: text.slice(0, 3000), shot: await shot('local/probe-details') };
};
