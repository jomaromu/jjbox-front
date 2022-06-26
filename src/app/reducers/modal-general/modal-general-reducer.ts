import { Action, createReducer, on } from '@ngrx/store';
import * as modalGeneralActions from './modal-general-actions';

const estadoInicial: ModalGeneral = {
  activo: false,
  icono: '',
  titulo: '',
  mensaje: '',
  mensajeBoton: '',
};

const _modalGeneralReducer = createReducer(
  estadoInicial,
  on(modalGeneralActions.modalInfo, (state, modalInfo) => {
    return modalInfo.modalInfo;
  }),

  on(modalGeneralActions.modalError, (state, modalError) => {
    return modalError.modalError;
  })
);

export const modalGeneralReducer = (state: any, action: Action) => {
  return _modalGeneralReducer(state, action);
};

export interface ModalGeneral {
  activo: boolean;
  icono: string;
  titulo: string;
  mensaje: string;
  mensajeBoton: string;
}
