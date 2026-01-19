import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, isTrue, isGreaterThan } from '@serenity-js/assertions';
import { Page, Text } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';
import { PrintTable } from '../src/tasks/PrintTable';
import { RemoveFixedOverlays } from '../src/utils/helperUtilities';

import { BookStore } from '../src/ui/BookStore';
import { SearchForBook } from '../src/tasks/SearchForBook';

test.describe('DemoQA - Book Store', () => {

  test('Case 7: Book Store search | ES: Caso 7 - Book Store - Book Search', async ({ actor }) => {

    // Término de búsqueda
    const bookName = 'JavaScript';

    // Dataset esperado (Breadcrumb: validar directo con API, en esta prueba se hardcodeó el expected dataset)
    const expectedBooks = [
      'Learning JavaScript Design Patterns',
      'Speaking JavaScript',
      'Programming JavaScript Applications',
      'Eloquent JavaScript, Second Edition',
    ] as const;

    await actor.attemptsTo(
      NavigateTo('https://demoqa.com/books'),
      Wait.upTo(Duration.ofSeconds(30)).until(Page.current().title(), equals('DEMOQA')),
      RemoveFixedOverlays(),
    );

    // Array de books inicial
    const allBooksRaw = await actor.answer(Text.ofAll(BookStore.BookLinks));
    const allBooks = allBooksRaw.map(t => t.trim());
    const allCount = allBooks.length;

    await actor.attemptsTo(
      Ensure.that(allCount > 0, isTrue()),
      SearchForBook(bookName, 4),
    );

    // Array de books filtrado (después de la búsqueda)
    const filteredBooksRaw = await actor.answer(Text.ofAll(BookStore.BookLinks));
    const filteredBooks = filteredBooksRaw.map(t => t.trim());
    const filteredCount = filteredBooks.length;

    // “Evento” simple: el count esperado se cumplió
    const autoSearchEvent = filteredCount === 4;

    // Comparamos ambos arrays con un Loop
    const max = Math.max(allBooks.length, filteredBooks.length);
    for (let i = 0; i < max; i++) {
      console.log(`[${ i }] before="${ allBooks[i] ?? '' }" | after="${ filteredBooks[i] ?? '' }"`);
    }

    // En caso de que existan missing expected titles (books)
    const missing = expectedBooks.filter(title => !filteredBooks.includes(title));

    console.log(`Auto-search event (DOM updated to expected count): ${ autoSearchEvent }`);
    console.log(`Expected: 4 | Found: ${ filteredCount }`);
    if (missing.length > 0) {
      console.log(`Fail: ${ missing.length } Missing Elements:`, missing);
    }

    // Aserciones
    await actor.attemptsTo(
        Ensure.that(allCount, isGreaterThan(0)),
        Ensure.that(filteredCount, equals(4)),
        Ensure.that(missing.length, equals(0)),
    );

    // Console.table para log con encabezado
    await actor.attemptsTo(
      PrintTable(`Books that matches with the search: ${ bookName }`, filteredBooks.map((title, i) => ({
        index: i + 1,
        title,
      }))),
      PrintTable('Case 7 - Summary', [
        { metric: 'Initial books in DOM', value: allCount },
        { metric: 'Expected results', value: 4 },
        { metric: 'Found results', value: filteredCount },
        { metric: 'Auto-search event (true/false)', value: String(autoSearchEvent) },
        { metric: 'Missing titles', value: missing.join(' | ') || 'None' },
      ]),
    );

    // Breadcrumb: Sprint 7 | TODO:
    // - Future optimisation: validate "rows per page" select when the table has > 10 rows.
    // - Future optimisation: validate results directly against the API (for this test we hardcoded expected titles based on the programmed search).
    // - Optionally assert additional fields (Author, Publisher, Image visibility) for richer UI coverage.

  });

});