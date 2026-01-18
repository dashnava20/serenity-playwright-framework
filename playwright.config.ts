import { defineConfig } from '@playwright/test'
import type { SerenityFixtures, SerenityWorkerFixtures } from '@serenity-js/playwright-test'
import { serenityCrew } from './serenity.conf'

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

    // Screenshots por step (Serenity/JS)
    crew: [
      [ '@serenity-js/web:Photographer', { strategy: 'TakePhotosOfInteractions' } ],
    ],

    defaultActorName: 'Daniel',
  },
})