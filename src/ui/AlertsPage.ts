import { By, PageElement } from '@serenity-js/web';

export class AlertsPage {
  static AlertButton = PageElement.located(By.id('alertButton'))
    .describedAs('Alert button');
}