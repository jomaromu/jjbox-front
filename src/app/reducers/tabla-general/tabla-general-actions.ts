import { createAction, props } from '@ngrx/store';

export const dataTabla = createAction(
  '[DATA TABLA Obtener Data]',
  props<{ tipoItem: string; usuario: any }>()
);
