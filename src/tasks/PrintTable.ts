import { Interaction } from '@serenity-js/core';

export const PrintTable = (title: string, rows: Array<Record<string, unknown>>) =>
  Interaction.where(`#actor prints console.table: ${title}`, async () => {
    console.log(`\n${title}`);
    console.table(rows);
  });
