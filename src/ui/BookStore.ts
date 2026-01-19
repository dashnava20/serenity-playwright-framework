import { By, PageElement, PageElements } from '@serenity-js/web';

export class BookStore {

  static SearchBox = PageElement.located(By.id('searchBox'))
    .describedAs('Book search box');

  // Títulos (links) dentro de la tabla: selector pedido "mr-2 a"
  static BookLinks = PageElements.located(By.css('.mr-2 a'))
    .describedAs('Book title links');
}