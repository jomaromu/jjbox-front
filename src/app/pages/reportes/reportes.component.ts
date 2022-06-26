import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { ChartType, ChartDataset } from 'chart.js';
import { forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import * as dataTablaActions from '../../reducers/tabla-general/tabla-general-actions';
import moment from 'moment';
import { UsuarioService } from '../../service/usuario.service';
import { ProductosPediosService } from '../../service/productos-pedios.service';
import { PPedidosSocketService } from '../../service/p-pedidos-socket.service';
import { UsuarioInterface } from '../../interface/usuario';
import { ProductosPedidos } from '../../interface/productosPedidos';
import { UsuarioSocketService } from 'src/app/service/usuario-socket.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  dataConteo = [
    {
      titulo: 'Clientes',
      tiempo: 'Todos',
      cantidad: 0,
      colorBarra: '#508ff4',
    },
    { titulo: 'Clientes', tiempo: 'Hoy', cantidad: 0, colorBarra: '#ffbf42' },
    {
      titulo: 'Pedidos',
      tiempo: 'Todos',
      cantidad: 0,
      colorBarra: '#4ae69d',
    },
    { titulo: 'Pedidos', tiempo: 'Hoy', cantidad: 0, colorBarra: '#1e3d73' },
  ];

  public barChartLabels = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiempre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataset[] = [
    {
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      label: 'VENTAS GENERAL',
    },
  ];

  // usuarios: UsuarioInterface;
  pedidos: Array<any>;
  totalVentas = 0;
  fechaDesde = '';
  fechaHasta = '';
  idSocket = '';

  constructor(
    private pPSocket: PPedidosSocketService,
    private usuarioSocketService: UsuarioSocketService,
    private usuarioService: UsuarioService,
    private pPedidoService: ProductosPediosService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.cargarUsuariosPedidos();
    this.fechaDesde = moment().format('YYYY-MM-DD');
    this.ventasGeneral();
    this.setItemTabla();
    this.cargarUsuariosSocket();
    this.cargarPedidosSocket();
    this.ventasGeneralSocket();
  }

  ngAfterViewInit(): void {
    // this.ventasBusqueda();
    this.obtenerBusquedaFechas();
  }

  ngAfterViewChecked(): void {
    this.idSocket = this.pPSocket.socketUsuario.id;
  }

  cargarUsuariosPedidos(): void {
    const usuarios = this.usuarioService.obtenerUsuarios();
    const pedidos = this.pPedidoService.obtenerPPedidos(this.idSocket);

    forkJoin([usuarios, pedidos]).subscribe((resp) => {
      const usuarios: UsuarioInterface = resp[0];
      const pedidos: ProductosPedidos = resp[1];

      this.dataConteo[0].cantidad = usuarios.datas!?.filter(
        (usuario) => usuario.role === 'cliente'
      ).length;

      this.dataConteo[1].cantidad = usuarios.datas!?.filter((usuario) => {
        return (
          usuario.fechaRegistro === moment().format('YYYY-MM-DD') &&
          usuario.role === 'cliente'
        );
      }).length;
      //   (usuario) =>  usuario.fechaRegistro === moment().format('YYYY-MM-DD')
      // ).length;

      this.dataConteo[2].cantidad = pedidos.datas!?.filter(
        (pedido) => pedido.tipo === 'Entregado'
      ).length;

      this.dataConteo[3].cantidad = pedidos.datas!?.filter(
        (pedido) =>
          pedido.fechaRegistro === moment().format('YYYY-MM-DD') &&
          pedido.tipo === 'Entregado'
      ).length;
    });
  }

  ventasGeneral(): void {
    const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // console.log(moment('22-06-2022', 'DD-MM-YYYY').month() + 1);
    // console.log(moment('2022-06-25').isSame('2022-06-23', 'month')); // año mes día

    this.pPedidoService
      .obtenerPedidosAnioActual()
      .subscribe((pPedidos: ProductosPedidos) => {
        // console.log(pPedidos);

        const mapMeses = meses.map((mes, index) => {
          const mapPPedido = pPedidos.datas?.map((pPedido, index) => {
            const formatDate = moment(
              pPedido.fechaRegistro,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD');

            // console.log(moment(`${formatDate}`, 'DD-MM-YYYY').month() + 1);

            if (moment(`${formatDate}`, 'YYYY-MM-DD').month() + 1 === mes) {
              return pPedido.precio + pPedido.delivery;
            } else {
              return 0;
            }
          });

          return mapPPedido;
        });

        const dataFinal: any = mapMeses.map((mes) => {
          return mes?.reduce((acc, curren): any => {
            if (acc !== undefined) {
              return acc + curren;
            }
            return 0;
          }, 0);
        });

        this.barChartData = [{ data: dataFinal, label: 'VENTAS GENERAL' }];
      });
  }

  obtenerBusquedaFechas(): void {
    const fDesde = moment(
      (document.getElementById('fechaDesde') as HTMLInputElement).value
    ).format('YYYY-MM-DD');

    const fHasta = moment(
      (document.getElementById('fechaHasta') as HTMLInputElement).value
    ).format('YYYY-MM-DD');

    const data = {
      fechaDesde: fDesde,
      fechaHasta: fHasta,
    };

    // console.log(data);

    this.pPedidoService
      .obtenerPedidosFecha(data)
      .subscribe((pedidos: ProductosPedidos) => {
        const mapPedidos = pedidos.datas?.map((pedido) => {
          const pedidoMap = {
            fecha: pedido.fechaRegistro,
            nombre: pedido.nombre,
            cliente: pedido.cliente.nombre,
            tipo: pedido.tipo,
            costo: pedido.precio + pedido.delivery,
          };
          return pedidoMap;
        });

        this.totalVentas = mapPedidos!?.reduce((acc, current): any => {
          if (acc !== undefined) {
            return acc + current.costo;
          } else {
            return 0;
          }
        }, 0);
        this.pedidos = mapPedidos!;
      });
  }

  setItemTabla(): void {
    this.store.dispatch(
      dataTablaActions.dataTabla({ tipoItem: 'reportes', usuario: null })
    );
  }

  cargarUsuariosSocket(): void {
    this.usuarioSocketService.escuchar('cargar-usuarios').subscribe((resp) => {
      const usuarios = this.usuarioService.obtenerUsuarios();

      forkJoin([usuarios]).subscribe((resp) => {
        const usuarios: UsuarioInterface = resp[0];

        this.dataConteo[0].cantidad = usuarios.datas!?.filter(
          (usuario) => usuario.role === 'cliente'
        ).length;

        this.dataConteo[1].cantidad = usuarios.datas!?.filter((usuario) => {
          return (
            usuario.fechaRegistro === moment().format('YYYY-MM-DD') &&
            usuario.role === 'cliente'
          );
        }).length;
      });
    });
  }

  cargarPedidosSocket(): void {
    this.pPSocket.escuchar('cargar-pedidos').subscribe((resp) => {
      const pedidos = this.pPedidoService.obtenerPPedidos(this.idSocket);

      forkJoin([pedidos]).subscribe((resp) => {
        const pedidos: ProductosPedidos = resp[0];

        this.dataConteo[2].cantidad = pedidos.datas!?.filter(
          (pedido) => pedido.tipo === 'Entregado'
        ).length;

        this.dataConteo[3].cantidad = pedidos.datas!?.filter(
          (pedido) =>
            pedido.fechaRegistro === moment().format('YYYY-MM-DD') &&
            pedido.tipo === 'Entregado'
        ).length;
      });
    });
  }

  ventasGeneralSocket(): void {
    this.pPSocket.escuchar('obtener-ventas').subscribe((resp) => {
      const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

      console.log('ok');

      this.pPedidoService
        .obtenerPedidosAnioActual()
        .subscribe((pPedidos: ProductosPedidos) => {
          // console.log(pPedidos);

          const mapMeses = meses.map((mes, index) => {
            const mapPPedido = pPedidos.datas?.map((pPedido, index) => {
              const formatDate = moment(
                pPedido.fechaRegistro,
                'YYYY-MM-DD'
              ).format('YYYY-MM-DD');

              // console.log(moment(`${formatDate}`, 'DD-MM-YYYY').month() + 1);

              if (moment(`${formatDate}`, 'YYYY-MM-DD').month() + 1 === mes) {
                return pPedido.precio + pPedido.delivery;
              } else {
                return 0;
              }
            });

            return mapPPedido;
          });

          const dataFinal: any = mapMeses.map((mes) => {
            return mes?.reduce((acc, curren): any => {
              if (acc !== undefined) {
                return acc + curren;
              }
              return 0;
            }, 0);
          });

          this.barChartData = [{ data: dataFinal, label: 'VENTAS GENERAL' }];
        });
    });
  }
}
