import { Task } from '@serenity-js/core';
import { ExecuteScript } from '@serenity-js/web';

export const RemoveDemoQAOverlays = () =>
  Task.where(
    '#actor removes DemoQA fixed overlays that can block interactions',
    ExecuteScript.sync(`
      const selectors = ['#fixedban', 'footer'];
      for (const sel of selectors) {
        document.querySelectorAll(sel).forEach(el => el.remove());
      }
    `),
  );
