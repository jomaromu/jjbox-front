import { createAction, props } from '@ngrx/store';
import { Data, UsuarioInterface } from '../../interface/usuario';

export const obtenerUsuario = createAction(
  '[EDITAR USUARIO - OBTENER USUAROI]',
  props<{ usuario: Data }>()
);
