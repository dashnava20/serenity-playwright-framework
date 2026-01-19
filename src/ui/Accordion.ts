import { By, PageElement, PageElements } from '@serenity-js/web';

export class Accordion {

  // Contenedor con ID fijo (más estable)
  static Root = PageElement.located(
    By.id('accordianContainer')
  ).describedAs('Accordion root container');

  // El accordion real dentro del container (opcional pero útil)
  static Accordion = PageElement.located(
    By.css('#accordianContainer .accordion')
  ).describedAs('Accordion root');

  static SectionHeading = (n: 1 | 2 | 3) =>
    PageElement.located(By.id(`section${ n }Heading`))
      .describedAs(`Accordion section ${ n } heading`);

  // Panel que cambia: "collapse" <-> "collapse show"
  static SectionPanel = (n: 1 | 2 | 3) =>
    PageElement.located(By.css(`#section${ n }Heading + .collapse`))
      .describedAs(`Accordion section ${ n } panel`);

  // Body con texto (no cambia clases de show)
  static SectionBody = (n: 1 | 2 | 3) =>
    PageElement.located(By.id(`section${ n }Content`))
      .describedAs(`Accordion section ${ n } body`);

  static Headings = PageElements.located(
    By.css('#accordianContainer .card-header')
  ).describedAs('Accordion headings');
}