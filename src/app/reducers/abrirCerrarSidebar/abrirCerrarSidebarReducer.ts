import { Action, createReducer, on } from '@ngrx/store';
import * as sidebarActions from './abrirCerrarSidebarActions';

const estadoInicial: boolean = true;

const _sidebarReducer = createReducer(
  estadoInicial,
  on(sidebarActions.abrirSidebar, (state) => {
    return true;
  }),

  on(sidebarActions.cerrarSidebar, (state) => {
    return false;
  })
);

export const sidebarReducer = (state: boolean, action: Action) => {
  return _sidebarReducer(state, action);
};
