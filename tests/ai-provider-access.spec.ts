import { test, expect } from '../src/fixtures';
import { PROVIDERS } from '../src/test-data/providers';
import { ExtensionLoginPage } from '../src/page-objects/extension-login.page';
import { BlockedPage } from '../src/page-objects/blocked-page.page';
import { UnblockedPage } from '../src/page-objects/unblocked-page.page';
import { setupPageListeners } from '../src/utils/logger';

test.describe('AI Provider Access Tests', () => {
  for (const provider of PROVIDERS) {
    test(`${provider.name} Provider Access Test`, async ({ page }, testInfo) => {

      const extensionLoginPage = new ExtensionLoginPage(page);
      const blockedPage = new BlockedPage(page);
      const unblockedPage = new UnblockedPage(page)

      // Step 1: Login to the extension before validating provider
      await test.step('Login to extension', async () => {
        await extensionLoginPage.login(process.env.DOMAIN as string, process.env.KEY as string);
      });

      // Step 2: Setup logs for debugging
      const logs = setupPageListeners(page);


      // Step 3: Open provider URL
      await test.step(`Open ${provider.name} URL`, async () => {
        await page.goto(`http://${provider.domain}`, { timeout: 15000 });
      });

      // Step 4: Validate access
      await test.step(`Validate access for ${provider.name}`, async () => {
        if (provider.isBlocked) {
          await blockedPage.validateBlockedPage(provider);
        }
        else {
          await unblockedPage.validateUnblockedPage(provider)
        }
      });

      // Step 5: Attach logs for debugging
      await testInfo.attach('network_logs', {
        body: JSON.stringify(logs, null, 2),
        contentType: 'application/json'
      });
    });
  }
});
