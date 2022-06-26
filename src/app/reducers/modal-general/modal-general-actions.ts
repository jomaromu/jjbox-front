import { createAction, props } from '@ngrx/store';
import { ModalGeneral } from './modal-general-reducer';

export const modalInfo = createAction(
  '[Modal General INFO]',
  props<{ modalInfo: ModalGeneral }>()
);

export const modalError = createAction(
  '[Modal General ERROR]',
  props<{ modalError: ModalGeneral }>()
);
