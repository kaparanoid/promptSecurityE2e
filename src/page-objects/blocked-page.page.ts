import { Page, Locator, expect } from '@playwright/test';
import { Provider } from '../test-data/providers';


export class BlockedPage {

    constructor(public page: Page) { }

    readonly accessDeniedLocator : Locator = this.page.locator('div:text("Access Denied")');


   async validateBlockedPage(provider:Provider) {
       
      // Expectations for blocked providers
          await expect(this.accessDeniedLocator, `Expected "${provider.name}" to display the access denied message`).toBeVisible({ timeout: 30000 });
          await expect(this.page.locator('html'), `Expected "${provider.name}" to have specific aria snapshot`).toMatchAriaSnapshot(`
              - document:
                - img
                - text: Access Denied
                - img
                - img
                - text: The domain ${provider.domain} was blocked by your administrator For more information visit the
                - link "guidelines"
                - text: "If you are sure this domain is safe, you can click “Access” and enter it Powered by:"
                - link:
                  - img
                - button "Access"
            `);
        
          // Validate URL parameters
           const searchParams = Object.fromEntries(new URL(this.page.url()).searchParams);
            expect(searchParams.domain, `Expected URL for "${provider.name}" to contain domain`).toContain(provider.domain);
            expect(searchParams.type, `Expected URL for "${provider.name}" to contain type "blockPage"`).toBe('blockPage');
             expect(searchParams.canBypass, `Expected URL for "${provider.name}" to contain canBypass "Allow"`).toBe('Allow');
        
        }

    }
