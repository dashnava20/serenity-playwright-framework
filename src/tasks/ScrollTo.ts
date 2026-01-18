import { Task } from '@serenity-js/core';
import { Scroll } from '@serenity-js/web';
import type { Answerable } from '@serenity-js/core';
import type { PageElement } from '@serenity-js/web';

export const ScrollTo = (element: Answerable<PageElement<unknown>>) =>
  Task.where(
    '#actor scrolls to the target element',
    Scroll.to(element),
  );
