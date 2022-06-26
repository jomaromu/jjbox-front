import { Action, createReducer, on } from '@ngrx/store';
import * as signatureActions from './signature.actions';
const estadoInicial: Signature = {
  estado: false,
  firma: '',
  idPPedido: '',
};

const _signatureReducer = createReducer(
  estadoInicial,
  on(signatureActions.abrirSignature, (state, { firma }) => {
    const abrirFirma: Signature = {
      estado: true,
      firma: firma.firma,
      idPPedido: firma.idPPedido,
    };
    return abrirFirma;
  }),

  on(signatureActions.cerrarSignature, (state, { firma }) => {
    const abrirFirma: Signature = {
      estado: false,
      firma: '',
      idPPedido: '',
    };
    return abrirFirma;
  })
);

export const signatureReducer = (state: Signature, action: Action) => {
  return _signatureReducer(state, action);
};

export interface Signature {
  estado: boolean;
  firma: string;
  idPPedido: string;
}
