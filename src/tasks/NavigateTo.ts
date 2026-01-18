import { Task } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';

export const NavigateTo = (url: string) =>
  Task.where(
    `#actor navigates to ${ url }`,
    Navigate.to(url),
  );
