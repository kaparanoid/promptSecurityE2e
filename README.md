# AI Provider Access Tests

This test suite verifies access to various AI providers.

**Docker Execution:**

1.  Update `.env.example` to `.env`.
2.  Run `npm run docker:build`.
3.  Run `npm run docker:test`.

**Known Issues:**

*   Perplexity AI URLs may include a `www.` prefix, while other provider URLs do not.
*   Console errors may occur when downloading logs on blocked or extension pages.
*   API requests to blocked domains can bypass the UI block (e.g., using `fetch` from developer tools).
*   Log downloads are only available for the currently enabled provider page.