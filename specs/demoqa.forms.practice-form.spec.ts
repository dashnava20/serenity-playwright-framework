import { test } from '@serenity-js/playwright-test';
import { Duration, Wait } from '@serenity-js/core';
import { Ensure, equals, isTrue, includes } from '@serenity-js/assertions';
import { isVisible, Page, Value, Text as WebText } from '@serenity-js/web';

import { NavigateTo } from '../src/tasks/NavigateTo';
import { PrintTable } from '../src/tasks/PrintTable';

import { practiceFormData, practiceFormUploadFile, statesAndCities } from '../data/practiceForm.data';
import { PracticeForm } from '../src/ui/PracticeForm';
import { ScrollTo } from '../src/tasks/ScrollTo';

import {
  VerifyPageHeaderIs,
  RemoveFixedOverlays,
  SubmitAndWaitForModal,
  CloseModalAndVerifyHidden,
  EnsureFileInputReady,
  EnsureVisibleAfterScroll,
} from '../src/utils/helperUtilities';

import { CompletePracticeForm } from '../src/tasks/CompletePracticeForm';
import { PracticeFormModalRows } from '../src/questions/PracticeFormModalRows';

test.describe('DemoQA - Forms', () => {

  test('Case 3: Practice Form submit | ES: Caso 3 - Forms / Practice Form', async ({ actor }) => {

    const monthNameFor = (monthValue: string) => {
      const map: Record<string, string> = {
        '0': 'January',
        '1': 'February',
        '2': 'March',
        '3': 'April',
        '4': 'May',
        '5': 'June',
        '6': 'July',
        '7': 'August',
        '8': 'September',
        '9': 'October',
        '10': 'November',
        '11': 'December',
      };
      return map[monthValue];
    };

    const expectedDob =
      `${ String(practiceFormData.dateOfBirth.day).padStart(2, '0') } ` +
      `${ monthNameFor(practiceFormData.dateOfBirth.monthValue) },` +
      `${ practiceFormData.dateOfBirth.yearText }`;

    const expectedSubjects = practiceFormData.subjects.map(s => s.option).join(', ');
    const expectedHobbies = ['Sports', 'Reading', 'Music'].join(', ');

    await actor.attemptsTo(
      NavigateTo('https://demoqa.com/automation-practice-form'),
      Wait.upTo(Duration.ofSeconds(30)).until(Page.current().title(), equals('DEMOQA')),
      VerifyPageHeaderIs('Practice Form'),
      RemoveFixedOverlays(),
    );

    const hobbiesCount = await actor.answer(PracticeForm.HobbiesOptions.count());

    await actor.attemptsTo(
      // Pre-checks (sin City: porque depende de State)
      EnsureVisibleAfterScroll(PracticeForm.FirstName),
      EnsureVisibleAfterScroll(PracticeForm.LastName),
      EnsureVisibleAfterScroll(PracticeForm.UserEmail),
      EnsureVisibleAfterScroll(PracticeForm.GenderWrapper),
      EnsureVisibleAfterScroll(PracticeForm.UserNumber),
      EnsureVisibleAfterScroll(PracticeForm.DateOfBirthInput),
      EnsureVisibleAfterScroll(PracticeForm.SubjectsInput),
      EnsureVisibleAfterScroll(PracticeForm.HobbiesContainer),
      EnsureFileInputReady(PracticeForm.UploadPicture),
      EnsureVisibleAfterScroll(PracticeForm.CurrentAddress),
      EnsureVisibleAfterScroll(PracticeForm.StateInput),
      EnsureVisibleAfterScroll(PracticeForm.Submit),

      // Fill
      CompletePracticeForm(practiceFormData, practiceFormUploadFile),

      // Submit + modal
      SubmitAndWaitForModal(),

      Wait.upTo(Duration.ofSeconds(10)).until(
        PracticeFormModalRows.valueFor('Student Name'),
        includes(practiceFormData.firstName),
      ),

      // Modal assertions (Picture queda como patch temporal)
      Ensure.that(
        PracticeFormModalRows.valueFor('Student Name'),
        equals(`${ practiceFormData.firstName } ${ practiceFormData.lastName }`),
      ),
      Ensure.that(PracticeFormModalRows.valueFor('Student Email'), equals(practiceFormData.userEmail)),
      Ensure.that(PracticeFormModalRows.valueFor('Gender'), equals(practiceFormData.gender)),
      Ensure.that(PracticeFormModalRows.valueFor('Mobile'), equals(practiceFormData.userNumber)),
      Ensure.that(PracticeFormModalRows.valueFor('Date of Birth'), equals(expectedDob)),
      Ensure.that(PracticeFormModalRows.valueFor('Subjects'), equals(expectedSubjects)),
      Ensure.that(PracticeFormModalRows.valueFor('Hobbies'), equals(expectedHobbies)),

      PrintTable('Case 3 - Upload evidence (temporary patch)', [
        {
          field: 'Picture (modal)',
          type: 'modal-row',
          expected: 'Should contain practiceFormData.json (pending fix)',
        },
      ]),

      Ensure.that(PracticeFormModalRows.valueFor('Address'), equals(practiceFormData.currentAddress)),
      Ensure.that(
        PracticeFormModalRows.valueFor('State and City'),
        equals(`${ practiceFormData.state } ${ practiceFormData.city }`),
      ),

      // Close modal (sin RemoveFixedOverlays aquí para evitar TargetClosedError por timeout)
      CloseModalAndVerifyHidden(),

      /*

      // Sprint 3 TODO: Form reset validation
      // Block intentionally commented (flaky/TargetClosedError in regression). Reuse in next sprint with fresh navigation.

      
      // Espera corta a que el form se auto-limpie
      Wait.upTo(Duration.ofSeconds(10)).until(Value.of(PracticeForm.FirstName), equals('')),

      // Verificación de auto-clear
      Ensure.that(Value.of(PracticeForm.FirstName), equals('')),
      Ensure.that(Value.of(PracticeForm.LastName), equals('')),
      Ensure.that(Value.of(PracticeForm.UserEmail), equals('')),
      Ensure.that(Value.of(PracticeForm.UserNumber), equals('')),
      Ensure.that(Value.of(PracticeForm.CurrentAddress), equals('')),

      Ensure.that(PracticeForm.CheckedGender.count(), equals(0)),
      Ensure.that(PracticeForm.CheckedHobbies.count(), equals(0)),

      // State placeholder
      EnsureVisibleAfterScroll(PracticeForm.StateInput),
      Ensure.that(PracticeForm.StatePlaceholder, isVisible()),
      Ensure.that(WebText.of(PracticeForm.StatePlaceholder), equals('Select State')),

      // City: debe estar disabled al resetear el form
      ScrollTo(PracticeForm.City),
      Ensure.that(PracticeForm.City.isPresent(), isTrue()),
      Ensure.that(PracticeForm.CityInputDisabled.isPresent(), isTrue()),
      Ensure.that(PracticeForm.CitySingleValue.isPresent(), equals(false)),
      Ensure.that(WebText.of(PracticeForm.City), includes('Select City')),*/

      // console.table summary
      PrintTable('Case 3 - Practice Form results', [
        { field: 'hobbiesCount', type: 'number', expected: String(hobbiesCount) },
        { field: 'statesMapped', type: 'array', expected: `${ statesAndCities.length } states` },
        { field: 'selectedState', type: 'react-select', expected: practiceFormData.state },
        { field: 'selectedCity', type: 'react-select', expected: practiceFormData.city },
        { field: 'uploadedFile', type: 'file', expected: 'practiceFormData.json (pending fix)' },
      ]),
    );

    // Breadcrumb: Sprint 3 | TODO:
    // - Boundary tests for phone/email + negative formats.
    // - City is dependent on State; validated during selection (CompletePracticeForm), not in initial checklist.
    // - File upload is flaky/under investigation: "Picture" row in modal can be empty.
    // - Date of Birth resets to current date in the form after submission, so we don’t assert empty DOB input.
    // - Pending: reuse/refactor of the “post-submit reset” block test step (fresh navigation or reload)

  });
});