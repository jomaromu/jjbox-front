import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../reducers/globalReducer';
import { forkJoin } from 'rxjs';
import { ProductosPediosService } from '../../service/productos-pedios.service';
import { UsuarioService } from '../../service/usuario.service';

import { Data, UsuarioInterface } from '../../interface/usuario';
import { ProductosPedidos } from '../../interface/productosPedidos';
import * as modalPPedidosActions from '../../reducers/productos-pedidos/productosPedidosActions';
import * as signatureActions from '../../reducers/signature/signature.actions';
import Swal from 'sweetalert2';
import { PPedidosSocketService } from 'src/app/service/p-pedidos-socket.service';

@Component({
  selector: 'app-ver-cliente',
  templateUrl: './ver-cliente.component.html',
  styleUrls: ['./ver-cliente.component.scss'],
})
export class VerClienteComponent implements OnInit {
  usuario: UsuarioInterface; // no lo puedo tocar

  productosPedidos: ProductosPedidos;
  ocultarPass = true

  constructor(
    private pPService: ProductosPediosService,
    private usuarioService: UsuarioService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private pPedidosSocketService: PPedidosSocketService
  ) {}

  ngOnInit(): void {
    this.cargarPPedidos();
  }

  cargarPPedidos(): void {
    this.route.queryParams.subscribe((params) => {
      const cliente = params['cliente'];

      // console.log(cliente);

      // return
      if (!cliente) {
        this.router.navigate(['admin/clientes']);
      } else {
        const perfil = this.usuarioService.obtenerUsuarioID(cliente);
        const pPedidos = this.pPService.productosPedidosPorUser(cliente);

        forkJoin([perfil, pPedidos]).subscribe((resp: Array<any>) => {
          this.usuario = resp[0];
          this.productosPedidos = resp[1];
          // console.log(resp[1]);
        });
      }
    });
  }

  crearEditarPedido(tipo: string, idPedido: string): void {
    this.store.dispatch(
      modalPPedidosActions.modalPPedido({
        modal: { abrirCerrarModal: true, tipo, idPedido },
      })
    );
  }

  abrirSignature(idPPedido: string): void {
    this.store.dispatch(
      signatureActions.abrirSignature({
        firma: { estado: true, firma: '', idPPedido },
      })
    );
  }

  eliminarPpedido(idPPedido: string): void {
    Swal.fire({
      title: 'Mensaje',
      text: '¿Desea eliminar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pPService
          .eliminarPPedido(idPPedido)
          .subscribe((pPedido: ProductosPedidos) => {
            if (pPedido.ok) {
              Swal.fire('Mensaje', 'Producto pedido eliminado', 'info');

              // activar socket
              const idSocket = this.pPedidosSocketService.socketUsuario.id;
              this.pPService.obtenerPPedidos(idSocket).subscribe();
            } else {
              Swal.fire('Mensaje', 'Error al elimianr pedido', 'error');
            }
          });
      }
    });
  }

  // falta terminar
  historialComprasSocket(): void {
    this.pPedidosSocketService
      .escuchar('historial-compras')
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
