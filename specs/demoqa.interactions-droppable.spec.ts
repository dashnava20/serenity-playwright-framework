import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, includes } from '@serenity-js/assertions';
import { Attribute, Click, isVisible, Page, Text } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';
import { RemoveFixedOverlays, DragAndDropNative } from '../src/utils/helperUtilities';

import { Droppable } from '../src/ui/Droppable';
import { ScrollTo } from '../src/tasks/ScrollTo';

test.describe('DemoQA - Interactions', () => {

  test('Case 6: Droppable drag & drop | ES: Caso 6 - Interactions - Drag and Drop', async ({ actor }) => {

    await actor.attemptsTo(
      NavigateTo('https://demoqa.com/droppable'),
      Wait.upTo(Duration.ofSeconds(30)).until(Page.current().title(), equals('DEMOQA')),

      // kill overlays ASAP + keep killing
      RemoveFixedOverlays(),

      Click.on(Droppable.SimpleTab),
      Wait.upTo(Duration.ofSeconds(10)).until(Droppable.SimpleContainer, isVisible()),

      ScrollTo(Droppable.Draggable),
      Ensure.that(Droppable.Draggable, isVisible()),

      ScrollTo(Droppable.Target),
      Ensure.that(Droppable.Target, isVisible()),

      DragAndDropNative(Droppable.Draggable, Droppable.Target),

      Wait.upTo(Duration.ofSeconds(20)).until(
        Attribute.called('class').of(Droppable.Target),
        includes('ui-state-highlight'),
      ),

      Ensure.that(Text.of(Droppable.TargetText), equals('Dropped!')),
    );

  });

  // Breadcrumb: Sprint 3 | TODO:
  // - Validate the drop success also by CSS color change (computed style) on the droppable target.
  // - Boundary tests: tune/validate the pixel interception area required for a reliable drop (center hitbox thresholds).
  // - Pending coverage for additional tabs: "Accept", "Prevent Propogation", and "Revert Draggable".

});