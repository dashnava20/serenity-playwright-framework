import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, includes } from '@serenity-js/assertions';
import { isVisible, Page, Text } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';
import { PrintTable } from '../src/tasks/PrintTable';

import { AlertsPage } from '../src/ui/AlertsPage';
import { BrowserWindowsPage } from '../src/ui/BrowserWindowsPage';

import {
  RemoveFixedOverlays,
  ClickAlertAndAccept,
  LastModalDialogMessage,
  NumberOfOpenPages,
  OpenNewTabAndVerifySample,
  CloseNewestTab,
} from '../src/utils/helperUtilities';

test.describe('DemoQA - Alerts & Browser Windows', () => {

  test('Case 4: Alerts and New Tab | ES: Caso 4 - Alerts + New Tab', async ({ actor }) => {

    // --- Alerts ---
    await actor.attemptsTo(
      NavigateTo('https://demoqa.com/alerts'),
      Wait.upTo(Duration.ofSeconds(30)).until(Page.current().url().pathname, includes('/alerts')),
      RemoveFixedOverlays(),

      Ensure.that(AlertsPage.AlertButton, isVisible()),
      Ensure.that(Text.of(AlertsPage.AlertButton), equals('Click me')),

      ClickAlertAndAccept(AlertsPage.AlertButton, 'Click me', 'You clicked a button'),

      // Quality check: seguimos en la misma URL
      Ensure.that(Page.current().url().pathname, includes('/alerts')),
    );

    const alertMessage = await actor.answer(LastModalDialogMessage());

    // --- Browser Windows (New Tab) ---
    const pagesBefore = await actor.answer(NumberOfOpenPages());

    await actor.attemptsTo(
      NavigateTo('https://demoqa.com/browser-windows'),
      Wait.upTo(Duration.ofSeconds(30)).until(Page.current().url().pathname, includes('/browser-windows')),
      RemoveFixedOverlays(),

      Ensure.that(BrowserWindowsPage.NewTabButton, isVisible()),
      Ensure.that(Text.of(BrowserWindowsPage.NewTabButton), equals('New Tab')),

      OpenNewTabAndVerifySample(BrowserWindowsPage.NewTabButton),

      //Aserción de antes y después de abrir la nueva pestaña
      Ensure.that(NumberOfOpenPages(), equals(2)),
      CloseNewestTab(),
      Ensure.that(NumberOfOpenPages(), equals(1)),


      PrintTable('Case 4 - Results', [
        { check: 'Alert', ok: true, details: alertMessage },
        { check: 'New Tab', ok: true, details: 'Sample page heading verified' },
      ]),
    );
  });

});
