import { createAction, props } from '@ngrx/store';
import { Signature } from './signature.reducer';

export const abrirSignature = createAction(
  '[SIGNATURE ABRIR]',
  props<{ firma: Signature }>()
);
export const cerrarSignature = createAction(
  '[SIGNATURE CERRAR]',
  props<{ firma: Signature }>()
);
