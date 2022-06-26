import { Action, createReducer, on } from '@ngrx/store';
import * as loadingActions from './loading-actions';

const estadoInicial: boolean = true;

const _loadingReducer = createReducer(
  estadoInicial,
  on(loadingActions.cargarLoading, (state) => {
    return true;
  }),

  on(loadingActions.quitarLoading, (state) => {
    return false;
  })
);

export const loadingReducer = (state: boolean, action: Action) => {
  return _loadingReducer(state, action);
};
