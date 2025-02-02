# AI Provider Access Tests

This test suite verifies access to various AI providers.

**Local execution:**
1. Ensure Playwright and dependencies are installed.
2. Start a Chrome instance with remote debugging enabled (e.g., `chrome --remote-debugging-port=9222`).
3. Run `npx playwright test`.

**Known Bugs:**
- Perplexity AI URLs may include `www.` prefix, while others don't.
- Console errors can occur when downloading logs on blocked or extension pages.
- API requests to blocked domains can bypass the UI block (e.g., `fetch` from devtools).
- Log download is only available for enabled provider page.