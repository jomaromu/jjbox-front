import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { first } from 'rxjs';
import { PPedidosSocketService } from '../../service/p-pedidos-socket.service';
import * as sidebarActions from '../../reducers/abrirCerrarSidebar/abrirCerrarSidebarActions';
import { ProductosPediosService } from '../../service/productos-pedios.service';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit {
  @ViewChild('inputBusqueda', { static: true })
  inputBusqueda: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<AppState>,
    private pPsocket: PPedidosSocketService,
    private pPedidoService: ProductosPediosService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // this.abrirCerrarMenu();
    // this.busqueda();
    this.cargarPlaceHoler();
  }

  abrirCerrarMenu(): void {
    this.store
      .select('sidebar')
      .pipe(first())
      .subscribe((data) => {
        // console.log(data);
        if (data) {
          this.store.dispatch(sidebarActions.cerrarSidebar());

          const wrapRutas: any = document.getElementById('wrap-rutas');

          wrapRutas.style.width = '100%';
        } else {
          this.store.dispatch(sidebarActions.abrirSidebar());
        }
      });
  }

  busqueda(): void {
    this.store.pipe(first()).subscribe((resp) => {
      const idSocket = this.pPsocket.socketUsuario.id;
      const tipoItem = resp.dataTabla.tipoItem;
      const idUsuario = resp.usuario.data._id;
      const role = resp.usuario.data.role;
      const limite = resp.limite;

      if (tipoItem === 'pPedidos' && role === 'admin') {
        const data = {
          idSocket,
          criterio: this.inputBusqueda.nativeElement.value,
        };

        // activar socket
        if (data.criterio != '') {
          this.pPedidoService.busquedaCriterioAdmin(data).subscribe();
        }

        if (data.criterio === '') {
          this.pPedidoService.obtenerPPedidos(idSocket).subscribe();
        }
      }

      if (tipoItem === 'pPedidos' && role === 'cliente') {
        const data = {
          idSocket,
          criterio: this.inputBusqueda.nativeElement.value,
          cliente: idUsuario,
        };

        // activar socket
        if (data.criterio != '') {
          this.pPedidoService.busquedaCriterioCliente(data).subscribe();
        }

        if (data.criterio === '') {
          this.pPedidoService.obtenerPPedidos(idSocket).subscribe();
        }
      }

      // console.log(tipoItem);

      if (tipoItem === 'clientes' && role === 'admin') {
        const criterio = this.inputBusqueda.nativeElement.value;

        if (criterio !== '') {
          this.usuarioService.busquedaClienteCriterio(criterio).subscribe();
        }

        if (criterio === '') {
          this.usuarioService.obtenerUsuarios().subscribe();
        }
      }
    });
  }

  cargarPlaceHoler(): void {
    const input = this.inputBusqueda.nativeElement;

    this.store
      .select('dataTabla')
      // .pipe(take(5))
      .subscribe((resp) => {
        const tipoItem: string = resp.tipoItem;

        // console.log(tipoItem);

        switch (tipoItem) {
          case 'pPedidos':
            input.placeholder = 'ID';
            input.style.cursor = 'default';
            input.removeAttribute('disabled');

            break;
          case 'clientes':
            input.placeholder = 'ID/Correo';
            input.style.cursor = 'default';
            input.removeAttribute('disabled');
            break;

          case 'reportes':
            input.style.cursor = 'no-drop';
            input.setAttribute('disabled', 'true');
            break;

          case 'mi-perfil':
            input.style.cursor = 'no-drop';
            input.setAttribute('disabled', 'true');
            break;
        }
      });
  }
}
