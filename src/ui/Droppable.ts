import { By, PageElement } from '@serenity-js/web';

export class Droppable {

  static SimpleTab = PageElement.located(By.id('droppableExample-tab-simple'))
    .describedAs('Simple tab');

  static SimpleContainer = PageElement.located(By.id('simpleDropContainer'))
    .describedAs('Simple drop container');

  static Draggable = PageElement.located(By.id('draggable'))
    .of(Droppable.SimpleContainer)
    .describedAs('Draggable box');

  static Target = PageElement.located(By.id('droppable'))
    .of(Droppable.SimpleContainer)
    .describedAs('Droppable target');

  static TargetText = PageElement.located(By.css('p'))
    .of(Droppable.Target)
    .describedAs('Droppable text');
}