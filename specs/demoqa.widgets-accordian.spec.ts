import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, includes, isTrue, not } from '@serenity-js/assertions';
import { Attribute, Click, isVisible, Page, Text } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';

import { RemoveFixedOverlays } from '../src/utils/helperUtilities';

import { Accordion } from '../src/ui/Accordion';
import { ScrollTo } from '../src/tasks/ScrollTo';

test.describe('DemoQA - Widgets', () => {

  test('Case 5: Accordion expand/collapse | ES: Caso 5 - Widgets - Accordion', async ({ actor }) => {

    await actor.attemptsTo(
      NavigateTo('https://demoqa.com/accordian'),
      Wait.upTo(Duration.ofSeconds(30)).until(Page.current().title(), equals('DEMOQA')),

      // ✅ 1) Presencia primero (evita flakiness por render lento)
      Wait.upTo(Duration.ofSeconds(30)).until(Accordion.Root.isPresent(), isTrue()),

      // ✅ 2) Visibilidad después
      Wait.upTo(Duration.ofSeconds(30)).until(Accordion.Accordion, isVisible()),

      // ✅ 3) Overlays cuando ya existe DOM
      RemoveFixedOverlays(),
    );

    const cards = [
      { n: 1, title: 'What is Lorem Ipsum?' },
      { n: 2, title: 'Where does it come from?' },
      { n: 3, title: 'Why do we use it?' },
    ] as const;

    const clickableCount = await actor.answer(Accordion.Headings.count());
    await actor.attemptsTo(
      Ensure.that(clickableCount, equals(cards.length)),
    );

    const isOpen = async (n: 1 | 2 | 3) => {
      const cls = await actor.answer(Attribute.called('class').of(Accordion.SectionPanel(n)));
      return cls.includes('show');
    };

    const setPanelState = async (n: 1 | 2 | 3, target: 'open' | 'closed') => {
      const heading = Accordion.SectionHeading(n);
      const panel   = Accordion.SectionPanel(n);

      await actor.attemptsTo(
        ScrollTo(heading),
        Wait.upTo(Duration.ofSeconds(10)).until(heading, isVisible()),
      );

      const before = await actor.answer(Attribute.called('class').of(panel));
      const currentlyOpen = before.includes('show');

      const needsClick =
        (target === 'open' && !currentlyOpen) ||
        (target === 'closed' && currentlyOpen);

      if (needsClick) {
        await actor.attemptsTo(
          Click.on(heading),
          Wait.upTo(Duration.ofSeconds(7)).until(
            Attribute.called('class').of(panel),
            target === 'open' ? includes('show') : not(includes('show')),
          ),
        );
      }

      const after = await actor.answer(Attribute.called('class').of(panel));
      return { before, after };
    };

    const results: Array<{
      section: number;
      title: string;
      action: string;
      before: string;
      after: string;
      contentPreview: string;
    }> = [];

    // 1) Section 1: si está abierta, cerrarla
    {
      const r = await setPanelState(1, 'closed');
      const preview = (await actor.answer(Text.of(Accordion.SectionBody(1)))).trim().slice(0, 80);

      results.push({
        section: 1,
        title: cards[0].title,
        action: 'close if open',
        before: r.before,
        after: r.after,
        contentPreview: preview,
      });
    }

    // 2) Section 2: abrir => valida 1 cerrada => cerrar
    {
      const rOpen = await setPanelState(2, 'open');

      // Single-open rule: si abro 2, 1 debe estar cerrada
      await actor.attemptsTo(
        Ensure.that(Attribute.called('class').of(Accordion.SectionPanel(1)), not(includes('show'))),
      );

      const rClose = await setPanelState(2, 'closed');
      const preview = (await actor.answer(Text.of(Accordion.SectionBody(2)))).trim().slice(0, 80);

      results.push({
        section: 2,
        title: cards[1].title,
        action: 'open then close',
        before: rOpen.before,
        after: rClose.after,
        contentPreview: preview,
      });
    }

    // 3) Section 3: abrir => valida 2 cerrada => cerrar
    {
      const rOpen = await setPanelState(3, 'open');

      await actor.attemptsTo(
        Ensure.that(Attribute.called('class').of(Accordion.SectionPanel(2)), not(includes('show'))),
      );

      const rClose = await setPanelState(3, 'closed');
      const preview = (await actor.answer(Text.of(Accordion.SectionBody(3)))).trim().slice(0, 80);

      results.push({
        section: 3,
        title: cards[2].title,
        action: 'open then close',
        before: rOpen.before,
        after: rClose.after,
        contentPreview: preview,
      });
    }

    console.log('Case 5A - Accordion results:', results);

    // Breadcrumb: Sprint 5 | TODO:
    // Future optimisation: validate content text remains stable after repeated toggles (no unexpected DOM mutation).
  });

});