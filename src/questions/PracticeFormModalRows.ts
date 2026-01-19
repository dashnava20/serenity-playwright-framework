import { Question } from '@serenity-js/core';
import { By, PageElement, Text } from '@serenity-js/web';
import { PracticeFormModal } from '../ui/PracticeFormModal';

export type ModalRow = { label: string; value: string };

const ModalValueCellFor = (label: string) =>
  PageElement.located(
    By.xpath(
      `//div[contains(@class,"modal-content")]//table//tr[td[1][normalize-space(.)="${ label }"]]/td[2]`
    )
  ).describedAs(`Modal value cell for: ${ label }`);

/**
 * Reads Practice Form modal table rows and returns them as { label, value } objects.
 */
export const PracticeFormModalRows = {
  displayed: () =>
    Question.about<ModalRow[]>('Practice Form modal rows', async actor => {
      const labels = await Text.ofAll(PracticeFormModal.Labels).answeredBy(actor);
      const values = await Text.ofAll(PracticeFormModal.Values).answeredBy(actor);

      return labels.map((rowLabel, i) => ({
        label: rowLabel,
        value: values[i] ?? '',
      }));
    }),

  valueFor: (label: string) =>
    Question.about<string>(`Practice Form modal row value for "${ label }"`, actor =>
      // ✅ IMPORTANT: return the value (no block without return)
      Text.of(ModalValueCellFor(label)).answeredBy(actor)
    ),
};