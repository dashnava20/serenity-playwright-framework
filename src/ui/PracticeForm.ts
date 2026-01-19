import { By, PageElement, PageElements } from '@serenity-js/web';

export class PracticeForm {

  static Form = PageElement.located(By.id('userForm'))
    .describedAs('Practice Form');

  static FirstName = PageElement.located(By.id('firstName'))
    .describedAs('First Name input');

  static LastName = PageElement.located(By.id('lastName'))
    .describedAs('Last Name input');

  static UserEmail = PageElement.located(By.id('userEmail'))
    .describedAs('User Email input');

  static GenderOption = (label: string) => {
  const forId: Record<string, string> = {
    Male: 'gender-radio-1',
    Female: 'gender-radio-2',
    Other: 'gender-radio-3',
  };

  return PageElement.located(
    By.css(`#genterWrapper label[for="${ forId[label] }"]`)
  ).describedAs(`Gender option: ${ label }`);
};

  static GenderInput = (label: string) =>
    PageElement.located(
        By.css(`#genterWrapper input[value="${label}"]`)
    ).describedAs(`Gender input: ${label}`);

  static GenderWrapper = PageElement.located(By.id('genterWrapper'))
    .describedAs('Gender radio group');

  static UserNumber = PageElement.located(By.id('userNumber'))
    .describedAs('Mobile Number input');

  static DateOfBirthInput = PageElement.located(By.id('dateOfBirthInput'))
    .describedAs('Date of Birth input');

  static MonthSelect = PageElement.located(By.css('.react-datepicker__month-select'))
    .describedAs('Month select');

  static YearSelect = PageElement.located(By.css('.react-datepicker__year-select'))
    .describedAs('Year select');

  static Day = (day: number) => {
    const padded = String(day).padStart(3, '0'); // 6 -> "006"
    return PageElement.located(
      By.css(`.react-datepicker__day--${ padded }:not(.react-datepicker__day--outside-month)`)
    ).describedAs(`Day ${ day }`);
  };

  static SubjectsInput = PageElement.located(By.id('subjectsInput'))
    .describedAs('Subjects input');

  static SubjectOption = (optionText: string) =>
    PageElement.located(By.cssContainingText('[id^="react-select-2-option-"]', optionText))
      .describedAs(`Subject option: ${ optionText }`);

  static HobbiesContainer = PageElement.located(By.css('#hobbiesWrapper .col-md-9.col-sm-12'))
    .describedAs('Hobbies container');

  static HobbiesOptions = PageElements.located(By.css('label.custom-control-label'))
    .of(PracticeForm.HobbiesContainer)
    .describedAs('Hobbies checkboxes');

  static UploadPicture = PageElement.located(By.id('uploadPicture'))
    .describedAs('Upload Picture input');

  static UploadedFileName = PageElement.located(By.id('uploadedPicture'))
    .describedAs('Uploaded file name');

  static CurrentAddress = PageElement.located(By.id('currentAddress'))
    .describedAs('Current Address textarea');

  static StateInput = PageElement.located(By.id('state'))
    .describedAs('State control');

  static CityInput = PageElement.located(By.id('city'))
    .describedAs('City control');

  static Submit = PageElement.located(By.id('submit'))
    .describedAs('Submit button');

  static CheckedGender = PageElements.located(
    By.css('#genterWrapper input[type="radio"]:checked')
  ).describedAs('Checked gender radio');

  static CheckedHobbies = PageElements.located(
    By.css('#hobbiesWrapper input[type="checkbox"]:checked')
  ).describedAs('Checked hobbies checkboxes');

  static StatePlaceholder = PageElement.located(
    By.css('#state div[class*="-placeholder"]')
  ).describedAs('State placeholder');

  static City = PageElement.located(By.id('city'))
    .describedAs('City wrapper');

  static CityInputDisabled = PageElement.located(
    By.css('#city input[id^="react-select-"][disabled]')
  ).describedAs('City react-select input (disabled)');

  static CitySingleValue = PageElement.located(
    By.css('#city div[class*="-singleValue"]')
  ).describedAs('City selected value (singleValue)');

  static CityPlaceholder = PageElement.located(
    By.css('#city div[class*="-placeholder"]')
  ).describedAs('City placeholder');
}
