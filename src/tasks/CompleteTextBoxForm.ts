import { Task } from '@serenity-js/core';
import { ClearAndTypeInto, ClickButtonWhenReady } from '../utils/helperUtilities';
import { TextBoxForm } from '../ui/TextBoxForm';

export interface TextBoxData {
  userName: string;
  userEmail: string;
  currentAddress: string;
  permanentAddress: string;
}

export const CompleteTextBoxForm = (data: TextBoxData) =>
  Task.where(
    '#actor completes the Text Box form',
    ClearAndTypeInto(data.userName, TextBoxForm.UserName),
    ClearAndTypeInto(data.userEmail, TextBoxForm.UserEmail),
    ClearAndTypeInto(data.currentAddress, TextBoxForm.CurrentAddress),
    ClearAndTypeInto(data.permanentAddress, TextBoxForm.PermanentAddress),

    ClickButtonWhenReady(TextBoxForm.Submit, 'Submit'),
  );
