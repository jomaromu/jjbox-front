import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { UsuarioService } from '../../service/usuario.service';
import * as dataTablaActions from '../../reducers/tabla-general/tabla-general-actions';

import { UsuarioInterface } from '../../interface/usuario';

@Component({
  selector: 'app-productos-pedidos',
  templateUrl: './productos-pedidos.component.html',
  styleUrls: ['./productos-pedidos.component.scss'],
})
export class ProductosPedidosComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.setItemTabla();
  }

  setItemTabla(): void {
    this.usuarioService
      .cargarUsuario()
      .subscribe((usuario: UsuarioInterface) => {
        this.store.dispatch(
          dataTablaActions.dataTabla({
            tipoItem: 'pPedidos',
            usuario: usuario.data
          })
        );
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(dataTablaActions.dataTabla({ tipoItem: '', usuario: '' }));
  }
}
