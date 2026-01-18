import { Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';
import { TextBoxForm } from '../ui/TextBoxForm';

const clean = (prefix: string) => (raw: string) =>
  raw.replace(prefix, '').trim().replace(/\s+/g, ' ');

export const TextBoxOutput = {
  userName: () =>
    Question.about('Text Box output: userName', async actor => {
      const raw = await Text.of(TextBoxForm.OutputName).answeredBy(actor);
      return clean('Name:')(raw);
    }),

  userEmail: () =>
    Question.about('Text Box output: userEmail', async actor => {
      const raw = await Text.of(TextBoxForm.OutputEmail).answeredBy(actor);
      return clean('Email:')(raw);
    }),

  currentAddress: () =>
    Question.about('Text Box output: currentAddress', async actor => {
      const raw = await Text.of(TextBoxForm.OutputCurrentAddress).answeredBy(actor);
      // DemoQA suele usar "Current Address :" con espacios raros
      return raw.replace(/Current Address\s*:\s*/i, '').trim().replace(/\s+/g, ' ');
    }),

  permanentAddress: () =>
    Question.about('Text Box output: permanentAddress', async actor => {
      const raw = await Text.of(TextBoxForm.OutputPermanentAddress).answeredBy(actor);
      return raw.replace(/Permananet Address\s*:\s*/i, '').trim().replace(/\s+/g, ' ');
    }),
};
