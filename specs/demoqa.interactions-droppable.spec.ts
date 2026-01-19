import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, includes, isTrue, not } from '@serenity-js/assertions';
import { Attribute, Click, isVisible, Page, Text } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';
import { PrintTable } from '../src/tasks/PrintTable';

import { RemoveFixedOverlays, DragAndDropNative } from '../src/utils/helperUtilities';

import { Accordion } from '../src/ui/Accordion';
import { Droppable } from '../src/ui/Droppable';
import { ScrollTo } from '../src/tasks/ScrollTo';

test.describe('DemoQA - Interactions', () => {

  test('Case 5B: Droppable drag & drop | ES: Caso 5 - Interactions / Droppable', async ({ actor }) => {

      await actor.attemptsTo(
          NavigateTo('https://demoqa.com/droppable'),
          Wait.upTo(Duration.ofSeconds(30)).until(Page.current().title(), equals('DEMOQA')),
          RemoveFixedOverlays(),

          Click.on(Droppable.SimpleTab),
          // Esperamos a que el pane Simple esté realmente activo (bootstrap)
          Wait.upTo(Duration.ofSeconds(10)).until(
              Attribute.called('class').of(Droppable.SimplePane),
              includes('active'),
          ),
          ScrollTo(Droppable.Draggable),
          Ensure.that(Droppable.Draggable, isVisible()),

          ScrollTo(Droppable.Target),
          Ensure.that(Droppable.Target, isVisible()),
      );

      // Drag
    const beforeText = await actor.answer(Text.of(Droppable.TargetText));

      await actor.attemptsTo(
          DragAndDropNative(Droppable.Draggable, Droppable.Target),

          Wait.upTo(Duration.ofSeconds(15)).until(
              Text.of(Droppable.TargetText),
              equals('Dropped!'),
          ),

          Ensure.that(Text.of(Droppable.TargetText), equals('Dropped!')),

      );

      const afterText = await actor.answer(Text.of(Droppable.TargetText));
      console.log('Before:', beforeText);
      console.log('After:', afterText);

    // Breadcrumb: Sprint 5B | TODO:
    // Validate CSS background-color change using computed style (ExecuteScript) if needed

  });
});