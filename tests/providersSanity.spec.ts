import { test, expect } from './fixtures';
import fs from 'fs';
import 'dotenv/config'

// --- Types ---
interface Provider {
  name: string;
  domain: string;
  isBlocked: boolean;
  selectors: {
    accessDenied: string;
    textbox: string;
  };
}

// --- Constants ---
const UI_TIMEOUT = 10000;

const PROVIDERS: Provider[] = [
  {
    name: "Bing",
    domain: "copilot.microsoft.com",
    isBlocked: true,
    selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
  },
  {
    name: "Gemini",
    domain: "gemini.google.com",
    isBlocked: false,
    selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
  },
  {
    name: "GPT",
    domain: "chat.openai.com",
    isBlocked: false,
    selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
  },
  {
    name: "PerplexityAi",
    domain: "perplexity.ai",
    isBlocked: true,
    selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
  },
  {
    name: "Groq",
    domain: "groq.com",
    isBlocked: true,
    selectors: { accessDenied: "div:text('Access Denied')", textbox: 'textarea' }
  }
];

// --- Utility Functions ---
const setupPageListeners = (page: Page) => {
  const logs = {
    console: [] as Array<{ type: string; text: string }>,
    requests: [] as Array<{ method: string; url: string }>,
    responses: [] as Array<{ status: number; url: string; request: any }>
  };

  page.on('console', (msg) => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    logs.console.push({ type: msg.type().toUpperCase(), text: msg.text() });
  });

  page.on('request', (request) => {
    logs.requests.push({ method: request.method(), url: request.url() });
  });

  page.on('response', async (response) => {
    logs.responses.push({
      status: response.status(),
      url: response.url(),
      request: response.request(),
    });
  });

  return logs;
};

// --- Test Suite ---
test.describe('AI Provider Access Tests', async () => {
  
  PROVIDERS.forEach(provider => {
    test(`${provider.name} Access Tests`, async ({ page }, testInfo) => {


      await test.step('login to extention', async () => {
        test.setTimeout(120000)
        await page.goto(`chrome-extension://iidnankcocecmgpcafggbgbmkbcldmno/html/popup.html`);
        await page.locator('#apiDomain').click();
        await page.locator('#apiDomain').fill(process.env.DOMAIN);
        await page.locator('#apiKey').click();
        await page.locator('#apiKey').fill(process.env.KEY);
        await page.getByRole('button', { name: 'Save' }).click();
        await page.waitForTimeout(5000); // need chack network auth event
      });

      // Setup
      const logs = setupPageListeners(page);

      // Test Steps
      await test.step('open provider url', async () => {
        await page.goto(`http://${provider.domain}`);
      });

      await test.step('check access message', async () => {
        const accessDeniedLocator = page.locator('div:text("Access Denied")');
        console.log(await accessDeniedLocator.isVisible({ timeout: 5000 }), 11111);

        if (provider.isBlocked) {
          // Check blocked provider expectations
          await expect(accessDeniedLocator).toBeVisible({ timeout: UI_TIMEOUT });
          await expect(page.locator('html')).toMatchAriaSnapshot(`
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
          const searchParams = Object.fromEntries(new URL(page.url()).searchParams);
          expect(searchParams.domain).toContain(provider.domain);
          expect(searchParams.type).toBe('blockPage');
          expect(searchParams.canBypass).toBe('Allow');
          console.log(logs)
        } else {
          // Check unblocked provider expectations
          await expect(accessDeniedLocator).not.toBeVisible({ timeout: UI_TIMEOUT });
          expect(await page.locator(provider.selectors.textbox).first()).toBeVisible();
        }
      });
      await testInfo.attach('network_logs', {
        body: JSON.stringify(logs, null, 2),
        contentType: 'application/json'
      });
      // Cleanup
      // Uncomment these lines when ready to implement cleanup
      // await page?.close();  // Removing explicit close as Playwright handles it automatically
      // await browser?.close();  // Removing explicit close as Playwright handles it automatically
    });
  });
});