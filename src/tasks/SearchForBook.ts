import { Duration, Task, Wait } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { Clear, Enter, isVisible, PageElement, PageElements, Text } from '@serenity-js/web';

import { BookStore } from '../ui/BookStore';

export const SearchForBook = (term: string, expectedCount = 4) =>
  Task.where(
    `#actor searches for book term "${ term }"`,
    Ensure.that(BookStore.SearchBox, isVisible()),
    Clear.theValueOf(BookStore.SearchBox),
    Enter.theValue(term).into(BookStore.SearchBox),

    /**
     * “Evento” Como la búsqueda es automática y el DOM se actualiza, esperamos hasta que el count sea el esperado".
     */
    Wait.upTo(Duration.ofSeconds(10)).until(
      BookStore.BookLinks.count(),
      equals(expectedCount),
    ),
  );