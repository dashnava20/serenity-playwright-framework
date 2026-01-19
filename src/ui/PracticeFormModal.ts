import { By, PageElement, PageElements } from '@serenity-js/web';

export class PracticeFormModal {

  static Content = PageElement.located(By.css('.modal-content'))
    .describedAs('Practice Form confirmation modal');

  static Labels = PageElements.located(By.css('tbody tr th'))
    .of(PracticeFormModal.Content)
    .describedAs('Modal labels');

  static Values = PageElements.located(By.css('tbody tr td'))
    .of(PracticeFormModal.Content)
    .describedAs('Modal values');

  static Close = PageElement.located(By.id('closeLargeModal'))
    .describedAs('Close modal button');

  static Backdrop = PageElement.located(By.css('.modal-backdrop'))
  .describedAs('Modal backdrop');

}
