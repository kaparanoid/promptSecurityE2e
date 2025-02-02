import { defineConfig, devices } from '@playwright/test';
import path from 'path';


const extensionPath = path.resolve("./", './iidnankcocecmgpcafggbgbmkbcldmno/6.5.1_1/');


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: false, // Temporarily disable headless to debug
        userDataDir: path.resolve('./tmp/profile'), // Directly pass userDataDir here
        launchOptions: { 
          
              args: [
                     `--load-extension=${extensionPath}`,
                     '--disable-extensions-except=' + extensionPath,
                     '--disable-web-security',
                     '--enable-default-apps',
                     // `--user-data-dir=${path.resolve('./tmp/profile')}`
                    ] 
                    ,
        },
      },
    },
  ],

});