import { Action, createReducer, on } from '@ngrx/store';
import * as verEditarPerfilActions from './abrirCerrarVerEditarPerfilActions';

const estadoInicial: eInicial = {
  abrirCerrarModal: false,
  idReferencia: '',
};

const _verEditarPerfilReducer = createReducer(
  estadoInicial,
  on(verEditarPerfilActions.abrirVerEditarPerfil, (state, { modal }) => {
    return modal;
  })
);

export const verEditarPerfilReducer = (state: eInicial, action: Action) => {
  return _verEditarPerfilReducer(state, action);
};

export interface eInicial {
  abrirCerrarModal: boolean;
  idReferencia: string;
}
