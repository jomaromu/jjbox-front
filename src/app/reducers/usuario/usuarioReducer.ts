import { Action, createReducer, on } from '@ngrx/store';
import * as usuarioActions from './usuarioActions';
import { UsuarioInterface } from '../../interface/usuario';

const estadoInicial: UsuarioInterface = {
  data: {
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
  },
  ok: false,
  mensaje: '',
};

const _usuarioReducer = createReducer(
  estadoInicial,
  on(usuarioActions.obtenerUsuario, (state, { usuario }) => {
    return usuario;
  })
);

export const usuarioReducer = (state: UsuarioInterface, action: Action) => {
  return _usuarioReducer(state, action);
};
