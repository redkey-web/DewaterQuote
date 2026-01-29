import { defineConfig, devices } from '@playwright/test';
import { readFileSync } from 'fs';

function getPort(): string {
  try { return readFileSync('.port', 'utf-8').trim(); }
  catch { return '3000'; }
}

const port = process.env.PORT || getPort();
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:' + port;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npx vercel dev --port ' + port,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
