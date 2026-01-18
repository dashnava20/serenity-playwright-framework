import { By, PageElement } from '@serenity-js/web';

export class TextBoxForm {
  static UserName = PageElement.located(By.id('userName')).describedAs('User Name input');
  static UserEmail = PageElement.located(By.id('userEmail')).describedAs('User Email input');

  static CurrentAddress = PageElement.located(By.id('currentAddress')).describedAs('Current Address textarea');
  static PermanentAddress = PageElement.located(By.id('permanentAddress')).describedAs('Permanent Address textarea');

  static Submit = PageElement.located(By.css('button#submit')).describedAs('Submit button');

  static OutputPanel = PageElement.located(By.id('output')).describedAs('Output panel');

  //Se encontró una colisión en los IDs, por eso se usa el selector compuesto
  static OutputName = PageElement.located(By.css('#output #name')).describedAs('Output: Name');
  static OutputEmail = PageElement.located(By.css('#output #email')).describedAs('Output: Email');

  static OutputCurrentAddress = PageElement.located(By.css('#output #currentAddress')).describedAs('Output: Current Address');
  static OutputPermanentAddress = PageElement.located(By.css('#output #permanentAddress')).describedAs('Output: Permanent Address');
}
