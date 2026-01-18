import { ScrollTo } from '../tasks/ScrollTo';
import { QuestionAdapter, Duration, Task, Wait } from '@serenity-js/core';
import { Ensure, equals, includes, isTrue } from '@serenity-js/assertions';
import {
  Attribute,
  By,
  Clear,
  Click,
  Enter,
  isVisible,
  Page,
  Scroll,
  Text,
  PageElement,
} from '@serenity-js/web';

import { ElementsSidebar } from '../ui/ElementsSidebar';

type WebElement = PageElement<unknown> | QuestionAdapter<PageElement<unknown>>;
type CollapseState = 'collapsed' | 'expanded';

const expectedClassFor = (state: CollapseState) =>
  state === 'expanded'
    ? 'element-list collapse show'
    : 'element-list collapse';

export const VerifySidebarGroupState = (groupName: string, expected: CollapseState) =>
  Task.where(
    `#actor verifies "${groupName}" group is ${expected}`,
    Ensure.that(
      Attribute.called('class').of(ElementsSidebar.GroupListFor(groupName)),
      includes(expectedClassFor(expected)),
    ),
  );

export const OpenSidebarItemAndVerifyRedirect = (
  itemLabel: string,
  expectedPathPart: string, // e.g. '/text-box'
) =>
  Task.where(
    `#actor opens "${itemLabel}" and verifies redirect`,
    Wait.until(ElementsSidebar.SidebarItem(itemLabel), isVisible()),
    Click.on(ElementsSidebar.SidebarItem(itemLabel)),
    Wait.until(Page.current().url().pathname, includes(expectedPathPart)),
  );

/**
 * Limpieza del cuadro de texto antes de llenarlo (para evitar flaky tests).
 */

export const VerifyPageHeaderIs = (expectedHeader: string) => {
  const HeaderH1 = PageElement.located(
    By.cssContainingText('h1.text-center', expectedHeader)
  ).describedAs(`Page H1 header: ${expectedHeader}`);

  return Task.where(
    `#actor verifies page header is "${expectedHeader}"`,

    Wait.upTo(Duration.ofSeconds(30)).until(HeaderH1.isPresent(), isTrue()),

    // Scroll: por si queda fuera de viewport
    ScrollTo(HeaderH1),

    Wait.upTo(Duration.ofSeconds(30)).until(HeaderH1.isVisible(), isTrue()),

    // Aserción
    Ensure.that(Text.of(HeaderH1), equals(expectedHeader)),
  );
};

/**
 * Limpieza del cuadro de texto antes de llenarlo (para evitar flaky tests).
 */
export const ClearAndTypeInto = (
  value: string,
  field: WebElement,
) =>
  Task.where(
    `#actor clears field and types "${value}"`,
    Clear.theValueOf(field),
    Enter.theValue(value).into(field),
  );

/**
 * Solo hacer click cuando el botón esté visible y su etiqueta sea la esperada.
 */
export const ClickButtonWhenReady = (
  button: WebElement,
  expectedLabel: string,
) =>
  Task.where(
    `#actor clicks "${expectedLabel}" button when ready`,
    Scroll.to(button),
    Wait.until(button, isVisible()),
    Ensure.that(Text.of(button), equals(expectedLabel)),
    Click.on(button),
  );