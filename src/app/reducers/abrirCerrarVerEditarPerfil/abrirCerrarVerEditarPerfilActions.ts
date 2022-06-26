import { createAction, props } from '@ngrx/store';
import { eInicial } from './abrirCerrarVerEditarPerfilReducer';

export const abrirVerEditarPerfil = createAction(
  '[VerEditar Abrir VerEditar]',
  props<{ modal: eInicial }>()
);
