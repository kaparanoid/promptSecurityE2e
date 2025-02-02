# AI Provider Access Tests

This test suite verifies access to various AI providers.

**Docker execution:**
1. update .env.example to .env
2. npm docker:build
3. npm docker:test

**Known Bugs:**
- Perplexity AI URLs may include `www.` prefix, while others don't.
- Console errors can occur when downloading logs on blocked or extension pages.
- API requests to blocked domains can bypass the UI block (e.g., `fetch` from devtools).
- Log download is only available for enabled provider page.