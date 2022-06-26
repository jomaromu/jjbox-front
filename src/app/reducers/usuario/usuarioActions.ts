import { createAction, props } from '@ngrx/store';
import { UsuarioInterface } from '../../interface/usuario';

export const obtenerUsuario = createAction(
  '[Usuario Obtener Usuario]',
  props<{ usuario: UsuarioInterface }>()
);
