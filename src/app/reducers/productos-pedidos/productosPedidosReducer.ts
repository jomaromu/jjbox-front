import { Action, createReducer, on } from '@ngrx/store';
import * as verEditarPerfilActions from './productosPedidosActions';

const estadoInicial: eInicial = {
  abrirCerrarModal: false,
  tipo: '',
  idPedido: '',
};

const _modalPPedidosReducer = createReducer(
  estadoInicial,
  on(verEditarPerfilActions.modalPPedido, (state, { modal }) => {
    return modal;
  })
);

export const modalPPedidosReducer = (state: eInicial, action: Action) => {
  return _modalPPedidosReducer(state, action);
};

export interface eInicial {
  abrirCerrarModal: boolean;
  tipo: string;
  idPedido: string;
}
