import path from 'node:path';
import type { Locator, Page as PWPage } from 'playwright';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { ScrollTo } from '../tasks/ScrollTo';
import { Ensure, equals, includes, isTrue, not } from '@serenity-js/assertions';
import {
  AnswersQuestions,
  Answerable,
  CollectsArtifacts,
  Interaction,
  Question,
  QuestionAdapter,
  Duration,
  Task,
  UsesAbilities,
  Wait 
} from '@serenity-js/core';

import {
  Attribute,
  By,
  Clear,
  Click,
  Enter,
  ExecuteScript,
  isVisible,
  Key,
  Page,
  Press,
  Scroll,
  Select,
  Switch,
  Text,
  Value,
  PageElement,
} from '@serenity-js/web';

import { ElementsSidebar } from '../ui/ElementsSidebar';
import { PracticeForm } from '../ui/PracticeForm';
import { PracticeFormModal } from '../ui/PracticeFormModal';
import { PracticeFormModalRows } from '../questions/PracticeFormModalRows';
import { SamplePage } from '../ui/SamplePage';


export type WebElement = PageElement<unknown> | QuestionAdapter<PageElement<unknown>>;
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
 * Título principal de la página (h1).
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

//Apoyo para el scroll + visibilidad
export const EnsureVisibleAfterScroll = (element: WebElement) =>
  Task.where(
    '#actor scrolls to element and ensures it is visible',
    ScrollTo(element),
    Ensure.that(element, isVisible()),
  );

  //Apoyo para esperar hasta que un elemento esté habilitado
export const WaitUntilEnabled = (control: WebElement) => {
  const EnabledInput = PageElement.located(
    By.css('input[id^="react-select-"][id$="-input"]:not([disabled])')
  ).of(control).describedAs('React-select input (enabled)');

  return Task.where(
    '#actor waits until react-select is enabled',
    ScrollTo(control),
    Click.on(control),
    Wait.upTo(Duration.ofSeconds(15)).until(EnabledInput.isPresent(), isTrue()),
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

  /**
 * Upload usando Playwright nativo (setInputFiles) sin depender de nativePage()
 */

export const UploadFileTo = (filePath: string, input: WebElement) =>
  Interaction.where(
    `#actor uploads "${path.basename(filePath)}"`,
    async (actor: UsesAbilities & AnswersQuestions & CollectsArtifacts) => {
      const native = await (input as any).nativeElement() as Locator;
      await native.setInputFiles(path.resolve(filePath));
    }
  );



export const SetDateOfBirth = (monthValue: string, yearText: string, day: number) =>
  Task.where(
    `#actor sets Date of Birth to ${ day }/${ monthValue }/${ yearText }`,
    Click.on(PracticeForm.DateOfBirthInput),
    Wait.upTo(Duration.ofSeconds(10)).until(PracticeForm.MonthSelect, isVisible()),
    Select.value(monthValue).from(PracticeForm.MonthSelect),
    Select.option(yearText).from(PracticeForm.YearSelect),
    Click.on(PracticeForm.Day(day)),
  );

export const SelectSubject = (typeValue: string, optionText: string) =>
  Task.where(
    `#actor selects subject "${ optionText }"`,
    Click.on(PracticeForm.SubjectsInput),
    Enter.theValue(typeValue).into(PracticeForm.SubjectsInput),
    Wait.upTo(Duration.ofSeconds(10)).until(PracticeForm.SubjectOption(optionText), isVisible()),
    Click.on(PracticeForm.SubjectOption(optionText)),
  );

const ReactSelectInputIn = (control: Answerable<PageElement<unknown>>) =>
  PageElement.located(By.css('input[id^="react-select-"][id$="-input"]:not([disabled])'))
    .of(control)
    .describedAs('React-select input (enabled)');

const ReactSelectOption = (optionText: string) =>
  PageElement.located(
    By.cssContainingText('div[id^="react-select-"][id*="-option-"]', optionText)
  ).describedAs(`React-select option: ${ optionText }`);

export const SelectFromReactSelect = (
  control: Answerable<PageElement<unknown>>,
  value: string,
) =>
  Task.where(
    `#actor selects "${ value }" from react-select`,
    ScrollTo(control),
    Wait.upTo(Duration.ofSeconds(10)).until(control, isVisible()),
    Click.on(control),

    // ✅ ahora es único porque está "dentro" del control + not disabled
    Wait.upTo(Duration.ofSeconds(10)).until(ReactSelectInputIn(control).isPresent(), isTrue()),
    Enter.theValue(value).into(ReactSelectInputIn(control)),

    Wait.upTo(Duration.ofSeconds(10)).until(ReactSelectOption(value), isVisible()),
    Click.on(ReactSelectOption(value)),
  );

export const CheckAllHobbies = () =>
  PracticeForm.HobbiesOptions.forEach(current =>
    current.actor.attemptsTo(
      Scroll.to(current.item),
      Wait.upTo(Duration.ofSeconds(10)).until(current.item, isVisible()),
      Click.on(current.item),
    )
  );


/**
 * Submit + sincronización:
 * En Playwright esto equivale a "capturar la promesa" del submit,
 * porque esperamos el evento observable (modal visible) para confirmar éxito.
 */
export const SubmitAndWaitForModal = () =>
  Task.where(
    '#actor submits the form and waits for the confirmation modal',
    Scroll.to(PracticeForm.Submit),
    Wait.upTo(Duration.ofSeconds(10)).until(PracticeForm.Submit, isVisible()),
    Ensure.that(Text.of(PracticeForm.Submit), equals('Submit')),
    Click.on(PracticeForm.Submit),
    Wait.upTo(Duration.ofSeconds(15)).until(PracticeFormModal.Content, isVisible()),
  );

export const CloseModalAndVerifyHidden = () =>
  Task.where(
    '#actor closes the modal and verifies it is hidden',
    Scroll.to(PracticeFormModal.Close),
    Wait.upTo(Duration.ofSeconds(10)).until(PracticeFormModal.Close, isVisible()),
    Ensure.that(Text.of(PracticeFormModal.Close), equals('Close')),
    Click.on(PracticeFormModal.Close),
    Ensure.that(PracticeFormModal.Content, not(isVisible())),
  );

/**
 * Mini util para validar que el archivo adjunto es el esperado
 * (en DemoQA normalmente devuelve "C:\\fakepath\\<file>")
 */

export const VerifyUploadedFileName = (expectedFileName: string) =>
  Task.where(
    `#actor verifies uploaded filename contains "${ expectedFileName }"`,
    Wait.upTo(Duration.ofSeconds(15)).until(PracticeFormModal.Content, isVisible()),
    Ensure.that(PracticeFormModalRows.valueFor('Picture'), includes(expectedFileName)),
  );

export const VerifyModalRowExists = (label: string) =>
  Task.where(
    `#actor verifies modal row "${label}" exists`,
    // Si la fila no existe, valueFor fallará/timeout; esto obliga a resolverla.
    Wait.upTo(Duration.ofSeconds(5)).until(
      PracticeFormModalRows.valueFor(label),
      not(equals('___ROW_NOT_FOUND___')),
    ),
  );


  /**
 * Removes fixed overlays (ads/footer) on DemoQA that can block clicks/visibility.
 *
 * Breadcrumb: Sprint 3 | TODO:
 * - Keep this as a DemoQA-only harness utility. Avoid using in real apps unless necessary.
 */
export const RemoveFixedOverlays = () =>
  Task.where(
    '#actor removes fixed overlays that can block interactions',
    ExecuteScript.sync(`
      const selectors = ['#fixedban', 'footer'];
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach(el => el.remove());
      }
    `),
  );

export const EnsureFileInputReady = (input: WebElement) =>
  Task.where(
    '#actor ensures file input is present',
    Ensure.that(input.isPresent(), isTrue()),
  );

  // Alertas y diálogos modales

export const AcceptNextModalDialog = () =>
  Interaction.where(
    '#actor prepares to accept the next modal dialog',
    async actor => {
      const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
      page.modalDialog().acceptNext();
    },
  );

export const LastModalDialogMessage = () =>
  Question.about<string>(
    'last modal dialog message',
    async actor => {
      const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
      const dialog = await page.modalDialog().last();
      return await dialog.message();
    },
  );

export const LastModalDialogState = () =>
  Question.about<string>(
    'last modal dialog state',
    async actor => {
      const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
      const dialog = await page.modalDialog().last();
      return await dialog.state(); // 'accepted' | 'dismissed' | 'absent'
    },
  );

export const ClickAlertAndAccept = (
  button: any,
  expectedButtonText: string,
  expectedMessage: string,
) =>
  Task.where(
    '#actor triggers an alert and accepts it',
    Ensure.that(button, isVisible()),
    Ensure.that(Text.of(button), equals(expectedButtonText)),

    AcceptNextModalDialog(),
    Click.on(button),

    Wait.upTo(Duration.ofSeconds(10)).until(LastModalDialogState(), not(equals('absent'))),
    Ensure.that(LastModalDialogMessage(), equals(expectedMessage)),
    Ensure.that(LastModalDialogState(), equals('accepted')),
  );

  // Navegación de ventanas/pestañas

export const NumberOfOpenPages = () =>
  Question.about('number of open pages', async (actor: UsesAbilities & AnswersQuestions) => {
    const serenityPage = await BrowseTheWebWithPlaywright.as(actor as any).currentPage();
    const nativePage: PWPage = await (serenityPage as any).nativePage();
    return nativePage.context().pages().length;
  });

export const CloseNewestTab = () =>
  Interaction.where('#actor closes the newest tab', async (actor: UsesAbilities & AnswersQuestions) => {
    const serenityPage = await BrowseTheWebWithPlaywright.as(actor as any).currentPage();
    const nativePage: PWPage = await (serenityPage as any).nativePage();
    const pages = nativePage.context().pages();
    if (pages.length > 1) {
      await pages[pages.length - 1].close();
    }
  });

export const OpenNewTabAndVerifySample = (button: WebElement) =>
  Task.where(
    '#actor opens a new tab and verifies the sample page',
    Ensure.that(button, isVisible()),
    Ensure.that(Text.of(button), equals('New Tab')),

    Interaction.where('#actor opens new tab (Playwright) and validates /sample', async (actor: UsesAbilities & AnswersQuestions) => {
      const serenityPage = await BrowseTheWebWithPlaywright.as(actor as any).currentPage();
      const nativePage: PWPage = await (serenityPage as any).nativePage();
      const context = nativePage.context();

      const beforePages = context.pages();

      const tryGetNewPage = async (): Promise<PWPage | null> => {
        // intentamos capturar por evento (rápido)
        const popupPromise = nativePage.waitForEvent('popup', { timeout: 4000 }).catch(() => null);

        // click “normal”
        await nativePage.locator('#tabButton').click().catch(async () => {
          // fallback: click via serenity element si el locator falla por algo raro
          const nativeButton = await (button as any).nativeElement();
          await nativeButton.click();
        });

        const popup = await popupPromise;
        if (popup) return popup;

        // fallback: detectar por incremento en context.pages()
        const deadline = Date.now() + 6000;
        while (Date.now() < deadline) {
          const pages = context.pages();
          const newOne = pages.find(p => !beforePages.includes(p)) ?? null;
          if (newOne) return newOne;
          await new Promise(r => setTimeout(r, 200));
        }
        return null;
      };

      // 1) intento normal
      let newPage = await tryGetNewPage();

      // 2) intento extra: click por JS (a veces window.open se “resiste”)
      if (!newPage) {
        const popupPromise = nativePage.waitForEvent('popup', { timeout: 6000 }).catch(() => null);

        await nativePage.evaluate(() => {
          const btn = document.querySelector('#tabButton') as HTMLButtonElement | null;
          btn?.click();
        });

        newPage = await popupPromise;
        if (!newPage) {
          const pages = context.pages();
          newPage = pages.find(p => !beforePages.includes(p)) ?? null;
        }
      }

      // 3) último fallback: por si navegó en la misma pestaña (poco común, pero posible)
      if (!newPage) {
        await nativePage.waitForLoadState('domcontentloaded');
        const url = nativePage.url();

        if (!url.includes('/sample')) {
          throw new Error(`No new tab detected and current tab did not navigate to "/sample". Current URL: ${ url }`);
        }

        const heading = (await nativePage.locator('#sampleHeading').innerText()).trim();
        if (heading !== 'This is a sample page') {
          throw new Error(`Expected heading "This is a sample page" but got: "${ heading }"`);
        }
        return;
      }

      await newPage.waitForLoadState('domcontentloaded');

      // espera “real” a /sample (a veces abre y navega milisegundos después)
      await newPage.waitForURL(/\/sample/, { timeout: 15000 });

      const heading = (await newPage.locator('#sampleHeading').innerText()).trim();
      if (heading !== 'This is a sample page') {
        throw new Error(`Expected heading "This is a sample page" but got: "${ heading }"`);
      }

      // opcional: cerrar la pestaña nueva para no dejar basura
      //await newPage.close().catch(() => void 0);
    }),
  );

