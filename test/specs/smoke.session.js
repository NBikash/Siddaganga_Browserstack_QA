// Setup check only: confirms a BrowserStack Android session starts and the app launches.
describe('BrowserStack Android session', () => {
    it('launches the app on a real device', async () => {
        const pkg = await driver.getCurrentPackage();
        const activity = await driver.getCurrentActivity();
        console.log(`Launched package=${pkg} activity=${activity}`);
        await expect(pkg).toBeTruthy();
    });
});
