import { Answerable, Duration, Task, Wait } from '@serenity-js/core';
import { Attribute, By, Click, Scroll, PageElement } from '@serenity-js/web';
import { equals } from '@serenity-js/assertions';

import { PracticeForm } from '../ui/PracticeForm';
import {
  ClearAndTypeInto,
  UploadFileTo,
  SetDateOfBirth,
  SelectSubject,
  SelectFromReactSelect,
  CheckAllHobbies,
  WaitUntilEnabled,
} from '../utils/helperUtilities';

export type PracticeFormData = {
  firstName: string;
  lastName: string;
  userEmail: string;
  gender: string;
  userNumber: string;

  dateOfBirth: { monthValue: string; yearText: string; day: number };

  subjects: ReadonlyArray<{ type: string; option: string }>;

  currentAddress: string;
  state: string;
  city: string;
};

export const CompletePracticeForm = (data: PracticeFormData, uploadFilePath: string) =>
  Task.where(
    '#actor completes the Practice Form',
    ClearAndTypeInto(data.firstName, PracticeForm.FirstName),
    ClearAndTypeInto(data.lastName, PracticeForm.LastName),
    ClearAndTypeInto(data.userEmail, PracticeForm.UserEmail),

    // Radio
    Click.on(PracticeForm.GenderOption(data.gender)),
    //Ensure.that(Attribute.called('checked').of(PracticeForm.GenderInput(data.gender)), equals('true')),

    ClearAndTypeInto(data.userNumber, PracticeForm.UserNumber),

    // Datepicker
    SetDateOfBirth(data.dateOfBirth.monthValue, data.dateOfBirth.yearText, data.dateOfBirth.day),

    // Subjects
    ...data.subjects.map(s => SelectSubject(s.type, s.option)),

    // Check all hobbies
    CheckAllHobbies(),

    // Scroll para localizar el input de upload
    Scroll.to(PracticeForm.UploadPicture),

    // Upload file
    UploadFileTo(uploadFilePath, PracticeForm.UploadPicture),

    // Address
    ClearAndTypeInto(data.currentAddress, PracticeForm.CurrentAddress),

    // State/City
    SelectFromReactSelect(PracticeForm.StateInput, data.state),
      /*Wait.upTo(Duration.ofSeconds(10)).until(
          Attribute.called('aria-disabled').of(PageElement.located(By.css('#city [aria-disabled]'))),
          equals('false'),
      ),*/
    WaitUntilEnabled(PracticeForm.CityInput),
    SelectFromReactSelect(PracticeForm.CityInput, data.city),
  );
