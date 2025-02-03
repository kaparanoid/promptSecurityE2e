import { Page } from '@playwright/test';

export class ExtensionLoginPage {
    constructor(public page: Page) { }

    async navigateToExtensionPopup() {
      await this.page.goto(`chrome-extension://${process.env.EXTENSION_ID}/html/popup.html`);
    }

    async setApiDomain(domain: string) {
      await this.page.locator('#apiDomain').click();
      await this.page.locator('#apiDomain').fill(domain);
    }

    async setApiKey(key: string) {
       await this.page.locator('#apiKey').click();
       await this.page.locator('#apiKey').fill(key);
    }
   
    async saveSettings(){
       await this.page.locator('#saveButton').click()
    }

   async login(domain:string,key:string) {
        await this.navigateToExtensionPopup();
        await this.setApiDomain(domain);
        await this.setApiKey(key);
        await this.saveSettings();
    }

}
