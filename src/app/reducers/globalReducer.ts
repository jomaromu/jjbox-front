import { ActionReducerMap } from '@ngrx/store';
import { sidebarReducer } from './abrirCerrarSidebar/abrirCerrarSidebarReducer';
import {
  eInicial,
  verEditarPerfilReducer,
} from './abrirCerrarVerEditarPerfil/abrirCerrarVerEditarPerfilReducer';
import { datosEstaticosReducer } from './datos-estaticos/datos-estaticos-reducer';
import { editarUsuarioReducer } from './editar-usuario/editar-usuario.reducer';
import { limiteReducer } from './limite/limite.reducer';
import { loadingReducer } from './loading/loading-reducer';
import {
  ModalGeneral,
  modalGeneralReducer,
} from './modal-general/modal-general-reducer';
import { modalPPedidosReducer } from './productos-pedidos/productosPedidosReducer';
import { signatureReducer } from './signature/signature.reducer';
import { dataTablaReducer } from './tabla-general/tabla-general-reducer';
import { usuarioReducer } from './usuario/usuarioReducer';

export interface AppState {
  modalGeneral: ModalGeneral;
  datosEstaticos: any;
  loading: any;
  sidebar: any;
  usuario: any;
  editarUsuario: any;
  dataTabla: any;
  verEditarPerfil: any;
  modalPPedidos: any;
  signature: any;
  limite: any;
}

export const globaReducerAPP: ActionReducerMap<AppState> = {
  modalGeneral: modalGeneralReducer,
  datosEstaticos: datosEstaticosReducer,
  loading: loadingReducer,
  sidebar: sidebarReducer,
  usuario: usuarioReducer,
  dataTabla: dataTablaReducer,
  verEditarPerfil: verEditarPerfilReducer,
  modalPPedidos: modalPPedidosReducer,
  editarUsuario: editarUsuarioReducer,
  signature: signatureReducer,
  limite: limiteReducer,
};
