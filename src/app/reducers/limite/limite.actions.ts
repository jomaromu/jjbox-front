import { createAction, props } from '@ngrx/store';

export const acumularLimite = createAction('[LIMITE ACUMULAR LIMITE]');

export const devolverLimite = createAction('[LIMITE DEVOLVER LIMITE]');

export const resetLimite = createAction('[LIMITE RESET LIMITE]');

export const ajustarLimite = createAction(
  '[LIMITE AJUSTAR LIMITE]',
  props<{ limit: number }>()
);
