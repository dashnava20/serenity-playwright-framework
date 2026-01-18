import { By, PageElement, PageElements } from '@serenity-js/web';

export class DemoQAMainMenu {

  //Checkpoint para contar las tarjetas del menú principal
  static AllCards = PageElements.located(
    By.css('.card.mt-4.top-card')
  ).describedAs('DemoQA main menu cards');

  private static TitleNamed = (title: string) =>
    PageElement.located(
      By.cssContainingText('.card-body h5', title)
    ).describedAs(`${ title } card title`);


  static Elements = DemoQAMainMenu.TitleNamed('Elements');
  static Forms = DemoQAMainMenu.TitleNamed('Forms');
  static AlertsFrameWindows = DemoQAMainMenu.TitleNamed('Alerts, Frame & Windows');
  static Widgets = DemoQAMainMenu.TitleNamed('Widgets');
  static Interactions = DemoQAMainMenu.TitleNamed('Interactions');
  static BookStore = DemoQAMainMenu.TitleNamed('Book Store Application');
}
