//TODO: Pendiente de integración y pruebas

import { Task, Wait } from '@serenity-js/core';
import { Ensure, equals, includes, isTrue } from '@serenity-js/assertions';
import {
  Attribute,
  Clear,
  Click,
  Enter,
  Page,
  Text,
  type PageElement,
} from '@serenity-js/web';

import { ElementsSidebar } from '../ui/ElementsSidebar';

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
  expectedPathPart: string, // Ejemplo: '/text-box'
) =>
  Task.where(
    `#actor opens "${itemLabel}" and verifies redirect`,
    Wait.until(ElementsSidebar.SidebarItem(itemLabel).isVisible(), isTrue()),
    Click.on(ElementsSidebar.SidebarItem(itemLabel)),
    Wait.until(Page.current().url().pathname, includes(expectedPathPart)),
  );

export const VerifyPageHeaderIs = (expectedHeader: string) =>
  Task.where(
    `#actor verifies page header is "${expectedHeader}"`,
    Wait.until(ElementsSidebar.PageHeader.isVisible(), isTrue()),
    Ensure.that(Text.of(ElementsSidebar.PageHeader), equals(expectedHeader)),
  );

/**
 * Limpieza del cuadro de texto antes de llenarlo para evitar flaky tests.
 */
export const ClearAndTypeInto = (
  value: string,
  field: PageElement<unknown>,
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
  button: PageElement<unknown>,
  expectedLabel: string,
) =>
  Task.where(
    `#actor clicks "${expectedLabel}" button when ready`,
    Wait.until(button.isVisible(), isTrue()),
    Ensure.that(Text.of(button), equals(expectedLabel)),
    Click.on(button),
  );
