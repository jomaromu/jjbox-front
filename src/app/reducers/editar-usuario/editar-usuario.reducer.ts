import { Action, createReducer, on } from '@ngrx/store';
import * as editarUsuarioActions from './editar-usuario.actions';
import { Data } from '../../interface/usuario';

const estadoInicial: Data = {
  _id: null,
  idReferencia: '',
  nombre: '',
  correo: '',
  password: '',
  avatar: '',
  telefono: '',
  direccion: {
    provincia: {
      id: 0,
      name: '',
    },
    distrito: {
      id: 0,
      province_id: 0,
      name: '',
    },
    corregimiento: {
      id: 0,
      district_id: 0,
      name: '',
    },
    direccion: '',
  },
  fechaRegistro: '',
  role: 'cliente',
  contSesion: 0,
  estado: false,
};

const _editarUsuarioReducer = createReducer(
  estadoInicial,
  on(editarUsuarioActions.obtenerUsuario, (state, { usuario }) => {
    return usuario;
  })
);

export const editarUsuarioReducer = (state: Data, action: Action) => {
  return _editarUsuarioReducer(state, action);
};
