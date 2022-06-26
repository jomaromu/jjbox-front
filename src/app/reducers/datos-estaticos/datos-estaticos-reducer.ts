import { Action, createReducer, on } from '@ngrx/store';
import * as datosEstaticosActions from './datos-estaticos-actions';

const estadoInicial = {
  telefono: '6425-2114',
  correo: 'jjbox507@gmail.com',
  twitter: 'https://twitter.com',
  facebook: 'https://www.facebook.com/jjboxpty',
  instagram: 'https://www.instagram.com/jjbox_pty',
};
const _datosEstaticosReducer = createReducer(
  estadoInicial,
  on(datosEstaticosActions.obtenerDatos, (state, datos) => {
    return datos.datosEstaticos;
  })
);

export const datosEstaticosReducer = (state: any, action: Action) => {
  return _datosEstaticosReducer(state, action);
};
