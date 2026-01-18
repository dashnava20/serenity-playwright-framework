import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, isPresent } from '@serenity-js/assertions';
import { Page, isVisible } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';
import { ScrollTo } from '../src/tasks/ScrollTo';
import { DemoQAMainMenu } from '../src/ui/DemoQAMainMenu';

test.describe('DemoQA - Home', () => {

  test('Case 1: DemoQA home page | ES: Caso 1 - Navegar a la página principal', async ({ actor }) => {

    await actor.attemptsTo(
      NavigateTo('https://demoqa.com'),

      // Checkpoint: título de la página
      Wait.upTo(Duration.ofSeconds(45)).until(Page.current().title(), equals('DEMOQA')),

      // Checkpoint: deben existir 6 tarjetas en el menú principal
      Wait.upTo(Duration.ofSeconds(45)).until(DemoQAMainMenu.AllCards.count(), equals(6)),

      // Espera explícita antes de aserciones
      Wait.upTo(Duration.ofSeconds(45)).until(DemoQAMainMenu.Elements, isPresent()),
      ScrollTo(DemoQAMainMenu.Elements),
      Wait.upTo(Duration.ofSeconds(45)).until(DemoQAMainMenu.Elements, isVisible()),

      // Aserciones
      Ensure.that(DemoQAMainMenu.Elements, isVisible()),
      Ensure.that(DemoQAMainMenu.Forms, isVisible()),
      Ensure.that(DemoQAMainMenu.AlertsFrameWindows, isVisible()),
      Ensure.that(DemoQAMainMenu.Widgets, isVisible()),
      Ensure.that(DemoQAMainMenu.Interactions, isVisible()),
      
      ScrollTo(DemoQAMainMenu.BookStore),
      Ensure.that(DemoQAMainMenu.BookStore, isVisible()),
    );
  });
});