import { defineConfig } from '@playwright/test';
import type { SerenityFixtures, SerenityWorkerFixtures } from '@serenity-js/playwright-test';
import { serenityCrew } from './serenity.conf';

const isDebug = !!process.env.PWDEBUG || process.argv.includes('--debug');

export default defineConfig<SerenityFixtures, SerenityWorkerFixtures>({
  timeout: 90_000,
  testDir: './specs',

  reporter: [
    // Serenity/JS adapter + reporting services
    [ '@serenity-js/playwright-test', { crew: serenityCrew } ],

    // Reporters nativos Playwright (opcionales)
    [ 'list' ],
    [ 'html', { open: 'never' } ],
  ],

  // Evidencias nativas Playwright
  use: {
    headless: true,
    viewport: { width: 1366, height: 900 },
    screenshot: 'on',
    trace: 'on',
    video: 'on',

    /**
     * Fix for --debug: Al usar el --debug se presentaban errores, por lo que se brindó un mini-fix.
     */
    cueTimeout: isDebug ? 60_000 : 5_000,
    interactionTimeout: isDebug ? 60_000 : 5_000,

    // Screenshots por step (Serenity/JS)
    crew: isDebug
      ? [ [ '@serenity-js/web:Photographer', { strategy: 'TakePhotosOfFailures' } ] ]
      : [ [ '@serenity-js/web:Photographer', { strategy: 'TakePhotosOfInteractions' } ] ],

    defaultActorName: 'Daniel',
  },

  // Cross-browser
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  use: { browserName: 'firefox' } },
    { name: 'webkit',   use: { browserName: 'webkit' } },
  ],
});