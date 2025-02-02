import { test, expect } from './fixtures';
import { config } from 'dotenv';
import 'dotenv/config';

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
const UI_TIMEOUT = 20000;

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
    isBlocked: true,
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
test.describe('AI Provider Access Tests', () => {
  for (const provider of PROVIDERS) {
    test(`${provider.name} Provider Access Test`, async ({ page }, testInfo) => {
      // Step 1: Login to the extension before validating provider
      await test.step('Login to extension', async () => {
        await page.goto(`chrome-extension://iidnankcocecmgpcafggbgbmkbcldmno/html/popup.html`);
        await page.locator('#apiDomain').click({ timeout: 15000 });
        await page.locator('#apiDomain').fill(process.env.DOMAIN as string);
        await page.locator('#apiKey').click({ timeout: 15000 });
        await page.locator('#apiKey').fill(process.env.KEY as string);
        await page.locator('#saveButton').click({ timeout: 15000 });
      });

      // Step 2: Setup logs for debugging
      const logs = setupPageListeners(page);

      // Step 3: Open provider URL
      await test.step(`Open ${provider.name} URL`, async () => {
        await page.goto(`http://${provider.domain}`, { timeout: 15000 });
      });

      // Step 4: Validate access
      await test.step(`Validate access for ${provider.name}`, async () => {
        const accessDeniedLocator = page.locator('div:text("Access Denied")');
        console.log(await accessDeniedLocator.isVisible({ timeout: 5000 }), `Checking ${provider.name}`);

        if (provider.isBlocked) {
          // Expectations for blocked providers
          await expect(accessDeniedLocator, `Expected "${provider.name}" to display the access denied message`).toBeVisible({ timeout: UI_TIMEOUT });
          await expect(page.locator('html'), `Expected "${provider.name}" to have specific aria snapshot`).toMatchAriaSnapshot(`
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
          expect(searchParams.domain, `Expected URL for "${provider.name}" to contain domain`).toContain(provider.domain);
          expect(searchParams.type, `Expected URL for "${provider.name}" to contain type "blockPage"`).toBe('blockPage');
          expect(searchParams.canBypass, `Expected URL for "${provider.name}" to contain canBypass "Allow"`).toBe('Allow');
        } else {
          // Expectations for unblocked providers
          await expect(accessDeniedLocator, `Expected "${provider.name}" to NOT display the access denied message`).not.toBeVisible({ timeout: UI_TIMEOUT });
          expect(await page.locator(provider.selectors.textbox).first(), `Expected textbox for "${provider.name}" to be visible`).toBeVisible();
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