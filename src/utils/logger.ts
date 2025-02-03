import { Page } from '@playwright/test';

export const setupPageListeners = (page: Page) => {
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
