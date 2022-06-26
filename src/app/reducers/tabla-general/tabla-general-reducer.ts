import { Action, createReducer, on } from '@ngrx/store';
import * as dataTablaActions from './tabla-general-actions';

const estadoInicial = {
  tipoItem: '',
  usuario: null,
};

const _dataTablaReducer = createReducer(
  estadoInicial,
  on(dataTablaActions.dataTabla, (state, { tipoItem, usuario }) => {
    return { tipoItem, usuario };
  })
);

export const dataTablaReducer = (state: any, action: Action) => {
  return _dataTablaReducer(state, action);
};
