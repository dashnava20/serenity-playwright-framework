import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, isTrue } from '@serenity-js/assertions';
import { isVisible, Page } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';
import { OpenSidebarItemAndVerifyRedirect, VerifyPageHeaderIs } from '../src/utils/helperUtilities';
import { CompleteTextBoxForm } from '../src/tasks/CompleteTextBoxForm';
import { PrintTable } from '../src/tasks/PrintTable';

import { textBoxData } from '../data/textBox.data';
import { TextBoxForm } from '../src/ui/TextBoxForm';
import { TextBoxOutput } from '../src/questions/TextBoxOutput';

import { RemoveDemoQAOverlays } from '../src/tasks/RemoveDemoQAOverlays';
import { ScrollTo } from '../src/tasks/ScrollTo';


test.describe('DemoQA - Elements', () => {

  test('Case 2: Text Box form submit | ES: Caso 2 - Elements / Text Box', async ({ actor }) => {

    // Array requerido: elementos del userForm + tipo
    const userFormElements = [
      { name: 'userName', type: 'text', element: TextBoxForm.UserName },
      { name: 'userEmail', type: 'text', element: TextBoxForm.UserEmail },
      { name: 'currentAddress', type: 'textarea', element: TextBoxForm.CurrentAddress },
      { name: 'permanentAddress', type: 'textarea', element: TextBoxForm.PermanentAddress },
      { name: 'submit', type: 'button', element: TextBoxForm.Submit },
    ] as const;

    await actor.attemptsTo(
      // Puedes ir directo, pero esto te deja listo para escalar a más sidebars:
      NavigateTo('https://demoqa.com/elements'),
      Wait.upTo(Duration.ofSeconds(30)).until(Page.current().title(), equals('DEMOQA')),

      // Valida que existe el sub-item y redirige
      OpenSidebarItemAndVerifyRedirect('Text Box', '/text-box'),
      Wait.upTo(Duration.ofSeconds(30)).until(TextBoxForm.UserName.isPresent(), isTrue()),
      VerifyPageHeaderIs('Text Box'),
      RemoveDemoQAOverlays(),

      // Assert: inputs/textarea visibles (Submit se valida aparte porque suele quedar fuera de viewport)
    ...userFormElements
        .filter(f => f.name !== 'submit')
        .map(f => Ensure.that(f.element, isVisible())),

      // Submit: scroll + visible
      ScrollTo(TextBoxForm.Submit),
      Ensure.that(TextBoxForm.Submit, isVisible()),

      // helperUtilities
      CompleteTextBoxForm(textBoxData),

      // Output visible
      Wait.upTo(Duration.ofSeconds(15)).until(TextBoxForm.OutputPanel, isVisible()),
      ScrollTo(TextBoxForm.OutputPanel),

      // Validar output vs input (core del caso)
      Ensure.that(TextBoxOutput.userName(), equals(textBoxData.userName)),
      Ensure.that(TextBoxOutput.userEmail(), equals(textBoxData.userEmail)),
      Ensure.that(TextBoxOutput.currentAddress(), equals(textBoxData.currentAddress)),
      Ensure.that(TextBoxOutput.permanentAddress(), equals(textBoxData.permanentAddress)),

      // console.table() de resultados
      PrintTable('Case 2 - Text Box results', [
        { field: 'userName', type: 'text', expected: textBoxData.userName },
        { field: 'userEmail', type: 'text', expected: textBoxData.userEmail },
        { field: 'currentAddress', type: 'textarea', expected: textBoxData.currentAddress },
        { field: 'permanentAddress', type: 'textarea', expected: textBoxData.permanentAddress },
        { field: 'submit', type: 'button', expected: 'Submit' },
      ]),
    );

    // Breadcrumb: Sprint 2 | TODO:
    // - DemoQA has fixed overlays that can block Submit in smaller viewports; keep RemoveDemoQAOverlays() as a test-harness utility.
    // - Consider moving overlay removal into a dedicated Task executed in beforeEach for DemoQA-only suites.
    // - Additional test ideas:
    // - Boundary tests (min/max length)
    // - Negative paths (invalid email formats)
    // - Data-driven coverage (data/ folder)
    // - Refactor candidate: centralise locators + reuse Tasks


  });

});
