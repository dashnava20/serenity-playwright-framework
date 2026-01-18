import { By, PageElement } from '@serenity-js/web';

export class ElementsSidebar {

  /*TODO: Pendiente implementación*/
  static GroupListFor = (groupName: string) =>
    PageElement.located(By.css('.element-list'))
      .of(
        PageElement.located(By.cssContainingText('.element-group', groupName))
          .describedAs(`Sidebar group: ${ groupName }`)
      )
      .describedAs(`Element list for group: ${ groupName }`);

  static SidebarItem = (label: string) =>
    PageElement.located(By.cssContainingText('.element-list li span', label))
      .describedAs(`Sidebar item: ${ label }`);

  static PageHeader = PageElement.located(By.css('.main-header'))
    .describedAs('Page header');
}
