import { Page, Locator, expect } from '@playwright/test';
import { Provider } from '../test-data/providers';

export class UnblockedPage {

    constructor(public page: Page) { }
    readonly accessDeniedLocator: Locator =  this.page.locator('div:text("Access Denied")');

    async validateUnblockedPage(provider: Provider) {
       // Expectations for unblocked providers
       await expect(this.accessDeniedLocator, `Expected "${provider.name}" to NOT display the access denied message`).not.toBeVisible({ timeout: 30000 });
      // expect(await this.page.locator(provider.selectors.textbox).first(), `Expected textbox for "${provider.name}" to be visible`).toBeVisible();
    }


}
