import { createAction, props } from '@ngrx/store';

export const obtenerDatos = createAction(
  '[Obtener Datos Estaticos]',
  props<{ datosEstaticos: any }>()
);
