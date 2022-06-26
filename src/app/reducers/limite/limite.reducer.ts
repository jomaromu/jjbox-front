import { Action, createReducer, on } from '@ngrx/store';
import * as limiteActions from './limite.actions';

const estadoInicial = 10;

const _limiteReducer = createReducer(
  estadoInicial,
  on(limiteActions.acumularLimite, (state) => {
    return (state += estadoInicial);
  }),

  on(limiteActions.devolverLimite, (state) => {
    return state;
  }),

  on(limiteActions.resetLimite, (state) => {
    return estadoInicial;
  }),

  on(limiteActions.ajustarLimite, (state, { limit }) => {
    return (state = limit);
  })
);

export const limiteReducer = (state: number, action: Action) => {
  return _limiteReducer(state, action);
};
