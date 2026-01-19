import { By, PageElement } from '@serenity-js/web';

export class Droppable {

  // Tabs
  static SimpleTab = PageElement.located(By.id('droppableExample-tab-simple'))
    .describedAs('Simple tab');

  // Tab pane (contenido visible del tab "Simple")
  static SimplePane = PageElement.located(By.id('droppableExample-tabpane-simple'))
    .describedAs('Simple tab pane');

  // Container del ejemplo simple (opcional pero útil)
  static SimpleContainer = PageElement.located(By.id('simpleDropContainer'))
    .of(Droppable.SimplePane)
    .describedAs('Simple drop container');

  // Draggable/Droppable ÚNICOS dentro del pane Simple
  static Draggable = PageElement.located(By.id('draggable'))
    .of(Droppable.SimplePane)
    .describedAs('Draggable box');

  static Target = PageElement.located(By.id('droppable'))
    .of(Droppable.SimplePane)
    .describedAs('Droppable target');

  static TargetText = PageElement.located(By.css('#droppable p'))
    .of(Droppable.SimplePane)
    .describedAs('Droppable text');
}
