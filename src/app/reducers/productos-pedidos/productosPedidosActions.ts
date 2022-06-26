import { createAction, props } from '@ngrx/store';
import { eInicial } from './productosPedidosReducer';

export const modalPPedido = createAction(
  '[Modal P. Pedido]',
  props<{ modal: eInicial }>()
);
