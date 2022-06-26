import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { first, take } from 'rxjs';
import { UsuarioService } from '../../service/usuario.service';
import { ProductosPediosService } from '../../service/productos-pedios.service';
import { UsuarioSocketService } from '../../service/usuario-socket.service';
import { PPedidosSocketService } from '../../service/p-pedidos-socket.service';

import Swal from 'sweetalert2';
import validator from 'validator';
import * as verEditarPerfilAction from '../../reducers/abrirCerrarVerEditarPerfil/abrirCerrarVerEditarPerfilActions';
import * as modalPPedidosActions from '../../reducers/productos-pedidos/productosPedidosActions';
import * as signatureActions from '../../reducers/signature/signature.actions';
import * as limiteActions from '../../reducers/limite/limite.actions';
import { Data, UsuarioInterface } from '../../interface/usuario';
import { ProductosPedidos } from '../../interface/productosPedidos';

@Component({
  selector: 'app-tabla-general',
  templateUrl: './tabla-general.component.html',
  styleUrls: ['./tabla-general.component.scss'],
})
export class TablaGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
  datosTabla: DatosTabla = {
    data: [],
    icon: '',
    tipoTabla: '',
    tituloTabla: '',
  };
  estadoUser: boolean;
  usuario: Data;
  mapAdmin: any;
  tipoTabla: string;

  flatSignature = false;
  arrayData: any;

  constructor(
    private usuarioService: UsuarioService,
    private pPedidoService: ProductosPediosService,
    private usuarioSocket: UsuarioSocketService,
    private store: Store<AppState>,
    private router: Router,
    private pPedidoSocketService: PPedidosSocketService
  ) {}

  ngOnInit(): void {
    this.dataStorage();
    this.obtenerPedidosPaginacion();
    this.obtenerCriterio();
    this.obtenerCriterioClientes();
  }

  ngAfterViewInit(): void {
    this.obtenerUsuarioSocket();
  }

  // Carga el tipo de item del sidebar
  dataStorage(): void {
    this.store
      .select('dataTabla')
      .pipe(take(3))
      .subscribe((data: any) => {
        const tipoTabla = data.tipoItem;
        const usuario = data.usuario;
        this.usuario = data.usuario;

        switch (tipoTabla) {
          case 'clientes':
            this.itemClientes(tipoTabla);
            break;
          case 'pPedidos':
            this.itemPPedidos(tipoTabla, usuario);
            this.obtenerPedidosSocket(tipoTabla, usuario);
            break;
        }
      });
  }

  // ========================= ITEM CLIENTES ========================= //
  itemClientes(data: string): void {
    this.store.select('limite').subscribe((limite) => {
      this.tipoTabla = data;
      this.usuarioService
        .obtenerUsuarios()
        .subscribe((usuarios: UsuarioInterface) => {
          // console.log(usuarios);
          const mapAdmin = usuarios.datas?.filter((usuario) => {
            return usuario.role !== 'admin';
          });
          this.datosTabla = {
            tipoTabla: data,
            icon: 'fas fa-users',
            tituloTabla: 'Mis clientes',
            data: mapAdmin,
          };
        });
    });
  }

  editarVerCliente(usuario: Data): void {
    // console.log(usuario);
    this.store.dispatch(
      verEditarPerfilAction.abrirVerEditarPerfil({
        modal: { idReferencia: usuario.idReferencia, abrirCerrarModal: true },
      })
    );
  }

  estadoUsuario(e: Event, usuario: Data) {
    const value = (e.target as HTMLInputElement).checked;
    // console.log(usuario);

    const data = {
      idUsuario: usuario._id,
      estado: value,
    };

    Swal.fire({
      title: 'Mensjae',
      text: '¿Desea editar el estado de este usuario?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, editar estado',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService
          .editarUsuario(data)
          .subscribe((usuario: UsuarioInterface) => {
            if (usuario.ok) {
              Swal.fire('Mensaje', 'Estado cambiado', 'success');

              // activar socket
              this.usuarioService.obtenerUsuarios().subscribe();
            } else {
              Swal.fire(
                'Mensaje',
                'Error al cambiar el estado del usuario',
                'error'
              );
            }
          });
      } else {
        // activar socket
        this.usuarioService.obtenerUsuarios().subscribe();
      }
    });
  }

  eliminarCliente(usuario: Data): void {
    if (usuario?.role === 'admin') {
      Swal.fire('Información', 'Este usuario no puede ser borrado', 'warning');
    } else {
      Swal.fire({
        title: 'Mensaje',
        text: '¿Desea borrar esta cuenta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrarla',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            idUsuario: usuario?._id,
            estado: false,
          };

          this.usuarioService
            .editarUsuario(data)
            .subscribe((usuario: UsuarioInterface) => {
              if (usuario.ok) {
                this.usuarioService
                  .cargarUsuario()
                  .pipe(first())
                  .subscribe((usuario: UsuarioInterface) => {
                    if (usuario.data?.role === 'admin') {
                      Swal.fire('Mensaje', `Usuario borrado`, 'success');
                    } else {
                      localStorage.removeItem('token');

                      Swal.fire('Mensaje', `Usuario borrado`, 'success');

                      setTimeout(() => {
                        window.location.reload();
                      }, 500);
                    }
                  });
              } else {
                Swal.fire('Mensaje', `Error al borrar usuario`, 'error');
              }
            });
        }
      });
    }
  }

  // ========================= TERMINA ITEM CLIENTE ========================= //

  // ========================= ITEM P. PEDIDOS ========================= //

  itemPPedidos(data: string, usuario: Data): void {
    const role = usuario.role;

    switch (role) {
      case 'admin':
        this.pPedidoService
          .obtenerProductosPedidosAdmin()
          .subscribe((pPedidos: ProductosPedidos) => {
            this.datosTabla = {
              tipoTabla: data,
              icon: 'fas fa-cart-arrow-down',
              tituloTabla: 'Productos Pedidos',
              data: pPedidos.datas,
            };
          });
        break;
      case 'cliente':
        this.pPedidoService
          .obtenerProductosPedidosCliente(usuario._id)
          .subscribe((pPedidos: ProductosPedidos) => {
            this.datosTabla = {
              tipoTabla: data,
              icon: 'fas fa-cart-arrow-down',
              tituloTabla: 'Productos Pedidos',
              data: pPedidos.datas,
            };
          });
        break;
    }
  }

  crearEditarPedido(tipo: string, idPedido: string): void {
    this.store.dispatch(
      modalPPedidosActions.modalPPedido({
        modal: { abrirCerrarModal: true, tipo, idPedido },
      })
    );
  }

  editarUsuario(usuario: Data): void {
    // console.log(usuario);
    // this.store.dispatch(editarUsuarioActions.obtenerUsuario({ usuario }));
    this.router.navigate(['admin/ver-cliente'], {
      queryParams: { cliente: usuario._id },
    });
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
        this.pPedidoService
          .eliminarPPedido(idPPedido)
          .subscribe((pPedido: ProductosPedidos) => {
            if (pPedido.ok) {
              Swal.fire('Mensaje', 'Producto pedido eliminado', 'info');

              // activar socket
              const idSocket = this.pPedidoSocketService.socketUsuario.id;
              this.pPedidoService.obtenerPPedidos(idSocket).subscribe();
            } else {
              Swal.fire('Mensaje', 'Error al elimianr pedido', 'error');
            }
          });
      }
    });
  }

  desde(e: Event): void {
    this.store
      .select('dataTabla')
      .pipe(first())
      .subscribe((dataTabla) => {
        const usuario = dataTabla.usuario;
        const role = dataTabla.usuario.role;
        const idUsuario = dataTabla.usuario._id;
        const data = dataTabla.tipoItem;
        const idSocket = this.pPedidoSocketService.socketUsuario.id;

        const desde = (e.target as HTMLInputElement).value;
        const hasta = (document.getElementById('hasta') as HTMLInputElement)
          .value;

        const castDesde = validator.isNumeric(desde);
        const castHasta = validator.isNumeric(hasta);

        if (castDesde && castHasta) {
          const filtros = {
            desde: this.transformarDesde(Number(desde)).toString(),
            hasta: this.transformHasta(Number(hasta)).toString(),
          };

          // activar socket
          this.pPedidoService
            .paginacionPedidos(filtros, idSocket, role, idUsuario)
            .subscribe((resp) => {
              // console.log(resp);
            });
        } else {
          return;
        }
      });
  }

  hasta(e: Event): void {
    this.store
      .select('dataTabla')
      .pipe(first())
      .subscribe((dataTabla) => {
        const usuario = dataTabla.usuario;
        const data = dataTabla.tipoItem;
        const role = dataTabla.usuario.role;
        const idUsuario = dataTabla.usuario._id;
        const idSocket = this.pPedidoSocketService.socketUsuario.id;

        const hasta = (e.target as HTMLInputElement).value;
        let desde = (document.getElementById('desde') as HTMLInputElement)
          .value;

        const castHasta = validator.isNumeric(hasta);
        const castDesde = validator.isNumeric(desde);

        if (castHasta && castDesde) {
          const filtros = {
            desde: this.transformarDesde(Number(desde)).toString(),
            hasta: this.transformHasta(Number(hasta)).toString(),
          };

          // activar socket
          this.pPedidoService
            .paginacionPedidos(filtros, idSocket, role, idUsuario)
            .subscribe((resp) => {
              // console.log(resp);
            });
        } else {
          return;
        }
      });
  }

  transformarDesde(valor: number): number {
    let castValor = 0;

    if (valor <= 1) {
      castValor = 0;
    } else if (valor > 1) {
      castValor = valor - 1;
    }

    return castValor;
  }

  transformHasta(valor: number): number {
    let castValor = 0;

    if (valor < 1) {
      castValor = 1;
    } else {
      castValor = valor;
    }

    return castValor;
  }
  // ========================= TERMINA ITEM P. PEDIDOS ========================= //

  obtenerUsuarioSocket(): void {
    switch (this.tipoTabla) {
      case 'clientes':
        this.usuarioSocket
          .escuchar('obtener-usuarios')
          .subscribe((usuarios: UsuarioInterface) => {
            const mapAdmin = usuarios.datas?.filter((usuario) => {
              return usuario.role !== 'admin';
            });

            if (this.datosTabla) {
              this.datosTabla.data = mapAdmin;
            }
          });
        break;
    }
  }

  obtenerCriterioClientes(): void {
    switch (this.tipoTabla) {
      case 'clientes':
        this.usuarioSocket
          .escuchar('obtener-usuarios-criterio')
          .subscribe((usuarios: UsuarioInterface) => {
            const mapAdmin = usuarios.datas?.filter((usuario) => {
              return usuario.role !== 'admin';
            });

            if (this.datosTabla) {
              this.datosTabla.data = mapAdmin;
            }
          });
        break;
    }
  }

  obtenerPedidosSocket(data: string, usuario: Data): any {
    this.pPedidoSocketService.escuchar('obtener-pedidos').subscribe(() => {
      const role = usuario.role;

      console.log('ok');

      switch (role) {
        case 'admin':
          this.pPedidoService
            .obtenerProductosPedidosAdmin()
            .subscribe((pPedidos: ProductosPedidos) => {
              this.datosTabla = {
                tipoTabla: data,
                icon: 'fas fa-cart-arrow-down',
                tituloTabla: 'Productos Pedidos',
                data: pPedidos.datas,
              };
            });
          break;
        case 'cliente':
          this.pPedidoService
            .obtenerProductosPedidosCliente(usuario._id)
            .subscribe((pPedidos: ProductosPedidos) => {
              this.datosTabla = {
                tipoTabla: data,
                icon: 'fas fa-cart-arrow-down',
                tituloTabla: 'Productos Pedidos',
                data: pPedidos.datas,
              };
            });
          break;
      }
    });
  }

  obtenerPedidosPaginacion(): void {
    this.pPedidoSocketService
      .escuchar('obtener-pedidos-paginacion')
      .subscribe((pPedidos: ProductosPedidos) => {
        this.store
          .select('dataTabla')
          .pipe(first())
          .subscribe((dataTabla) => {
            this.datosTabla = {
              tipoTabla: dataTabla.tipoItem,
              icon: 'fas fa-cart-arrow-down',
              tituloTabla: 'Productos Pedidos',
              data: pPedidos.datas,
            };
          });
      });
  }

  obtenerCriterio(): void {
    this.pPedidoSocketService
      .escuchar('obtener-pedidos-criterio')
      .subscribe((pPedidos: ProductosPedidos) => {
        this.store
          .select('dataTabla')
          .pipe(first())
          .subscribe((dataTabla) => {
            this.datosTabla = {
              tipoTabla: dataTabla.tipoItem,
              icon: 'fas fa-cart-arrow-down',
              tituloTabla: 'Productos Pedidos',
              data: pPedidos.datas,
            };
          });
      });
  }

  ngOnDestroy(): void {
    // this.usuarioSocket.quitarSubscripcion('obtener-usuarios');
    // this.pPedidoSocketService.quitarSubscripcion('obtener-pedidos');
  }
}

interface DatosTabla {
  tipoTabla: string;
  tituloTabla: string;
  icon: string;
  data: any;
}
