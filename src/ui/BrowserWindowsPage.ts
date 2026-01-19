import { By, PageElement } from '@serenity-js/web';

export class BrowserWindowsPage {
  static NewTabButton = PageElement.located(By.id('tabButton'))
    .describedAs('New Tab button');
}