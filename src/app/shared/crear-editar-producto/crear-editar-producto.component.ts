import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../reducers/globalReducer';
import { first } from 'rxjs';

import { eInicial } from '../../reducers/productos-pedidos/productosPedidosReducer';
import * as modalPPedidosActions from '../../reducers/productos-pedidos/productosPedidosActions';
import { UsuarioService } from '../../service/usuario.service';
import { Data, UsuarioInterface } from '../../interface/usuario';
import { ProductosPediosService } from '../../service/productos-pedios.service';
import { PPedidosSocketService } from '../../service/p-pedidos-socket.service';
import { ProductosPedidos } from '../../interface/productosPedidos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-editar-producto',
  templateUrl: './crear-editar-producto.component.html',
  styleUrls: ['./crear-editar-producto.component.scss'],
})
export class CrearEditarProductoComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: true }) modal: ElementRef<HTMLElement>;
  @ViewChild('form', { static: true }) form: ElementRef<HTMLElement>;
  @ViewChild('inputCliente', { static: true })
  inputCliente: ElementRef<HTMLElement>;
  @ViewChild('placeCliente', { static: true })
  placeCliente: ElementRef<HTMLElement>;
  @ViewChild('wrapBotones', { static: true })
  wrapBotones: ElementRef<HTMLElement>;

  usuarios: UsuarioInterface;
  usuario: Data;
  forma: FormGroup;
  tituloForma = '';

  flagCliente = false;
  txtValidaCliente = '';

  flagNombreProd = false;
  txtValidaNombreProd = '';

  flagDesc = false;
  txtValidaDes = '';

  flagPrecio = false;
  txtValidaPrecio = '';

  flagDelivery = false;
  txtValidaDelivery = '';

  constructor(
    private usuarioService: UsuarioService,
    private pPedidoService: ProductosPediosService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private pPedidoSocket: PPedidosSocketService
  ) {}

  ngOnInit(): void {
    this.cargarFormulario();
    this.abrirModal();
  }

  cargarFormulario(): void {
    this.forma = this.fb.group({
      nombre: [],
      cliente: [],
      descripcion: [],
      precio: [],
      delivery: [],
      tipo: ['Pendiente'],
    });
  }

  // vaidaciones
  validarCliente(): boolean {
    const value =
      this.inputCliente.nativeElement.getAttribute('data-idUsuario');

    if (value === 'null' || !value) {
      this.flagCliente = false;
      this.txtValidaCliente = 'Cliente inválido';
    } else {
      this.flagCliente = true;
      this.txtValidaCliente = '';
    }

    return this.flagCliente;
  }

  validarNombreProd(): boolean {
    const value = this.forma.controls['nombre'].value;

    if (value === '' || !value) {
      this.flagNombreProd = false;
      this.txtValidaNombreProd = 'Nombre es necesario';
    } else {
      this.flagNombreProd = true;
      this.txtValidaNombreProd = '';
    }

    return this.flagNombreProd;
  }

  validarDescripcion(): boolean {
    const value = this.forma.controls['descripcion'].value;

    if (value === '' || !value) {
      this.flagDesc = false;
      this.txtValidaDes = 'Descripción es necesaria';
    } else {
      this.flagDesc = true;
      this.txtValidaDes = '';
    }

    return this.flagDesc;
  }

  validaPrecio(): boolean {
    const value = this.forma.controls['precio'].value;

    if (typeof value === 'object') {
      this.flagPrecio = false;
      this.txtValidaPrecio = 'Sólo números';
    } else {
      if (value < 0) {
        this.flagPrecio = false;
        this.txtValidaPrecio = 'El precio no puede ser negativo';
      } else {
        this.flagPrecio = true;
        this.txtValidaPrecio = '';
      }
    }

    return this.flagPrecio;
  }

  validaDelivery(): boolean {
    const value = this.forma.controls['delivery'].value;

    if (typeof value === 'object') {
      this.flagDelivery = false;
      this.txtValidaDelivery = 'Sólo números';
    } else {
      if (value < 0) {
        this.flagDelivery = false;
        this.txtValidaDelivery = 'El valor no puede ser negativo';
      } else {
        this.flagDelivery = true;
        this.txtValidaDelivery = '';
      }
    }

    return this.flagDelivery;
  }

  abrirModal(): void {
    this.store.select('modalPPedidos').subscribe((modal: eInicial) => {
      if (modal.abrirCerrarModal) {
        if (modal.tipo === 'crear') {
          this.tituloForma = 'Crear producto';
          this.forma.reset();
          this.inputCliente.nativeElement.removeAttribute('data-idUsuario');
          this.forma.controls['tipo'].setValue('Pendiente');
          habilitarTodos();
          this.modal.nativeElement.style.display = 'flex';
          this.form.nativeElement.classList.add('animate__slideInDown');
          this.form.nativeElement.classList.remove('animate__slideOutUp');

          return;
        }
        if (modal.tipo === 'editar') {
          this.tituloForma = 'Editar producto';
          this.modal.nativeElement.style.display = 'flex';
          this.form.nativeElement.classList.add('animate__slideInDown');
          this.form.nativeElement.classList.remove('animate__slideOutUp');

          this.pPedidoService
            .obtenerPPedido(modal.idPedido)
            .subscribe((pPedido: ProductosPedidos) => {
              this.forma.controls['nombre'].setValue(pPedido.data?.nombre);
              this.forma.controls['cliente'].setValue(
                pPedido.data?.cliente.nombre
              );
              this.inputCliente.nativeElement.setAttribute(
                'data-idUsuario',
                pPedido.data?.cliente._id
              );

              this.forma.controls['descripcion'].setValue(
                pPedido.data?.descripcion
              );
              this.forma.controls['precio'].setValue(pPedido.data?.precio);
              this.forma.controls['delivery'].setValue(pPedido.data?.delivery);
              this.forma.controls['tipo'].setValue(pPedido.data?.tipo);

              if (pPedido.data?.tipo === 'Entregado') {
                this.tituloForma = 'Ver producto';
                inhabilitarTodos();
              } else {
                habilitarTodos();
              }
            });
        }
      }
    });

    const habilitarTodos = () => {
      this.wrapBotones.nativeElement.style.display = 'flex';
      this.forma.controls['nombre'].enable();
      this.forma.controls['cliente'].enable();
      this.forma.controls['descripcion'].enable();
      this.forma.controls['precio'].enable();
      this.forma.controls['delivery'].enable();
      this.forma.controls['tipo'].enable();
    };

    const inhabilitarTodos = () => {
      this.wrapBotones.nativeElement.style.display = 'none';
      this.forma.controls['nombre'].disable();
      this.forma.controls['cliente'].disable();
      this.forma.controls['descripcion'].disable();
      this.forma.controls['precio'].disable();
      this.forma.controls['delivery'].disable();
      this.forma.controls['tipo'].disable();
    };
  }

  cerrarModal(): void {
    const modal = this.modal.nativeElement;
    const form = this.form.nativeElement;

    form.classList.remove('animate__slideInDown');
    form.classList.add('animate__slideOutUp');

    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);

    this.store.dispatch(
      modalPPedidosActions.modalPPedido({
        modal: { abrirCerrarModal: false, tipo: '', idPedido: '' },
      })
    );

    this.txtValidaCliente = '';
    this.txtValidaNombreProd = '';
    this.txtValidaDes = '';
    this.txtValidaPrecio = '';
    this.txtValidaDelivery = '';
  }

  obtenerClientesCriterio(e: Event): void {
    this.txtValidaCliente = '';
    const value = (e.target as HTMLInputElement).value;
    const placeCliente = this.placeCliente.nativeElement;

    if (value === '' || this.usuarios?.datas?.length === 0) {
      placeCliente.style.display = 'none';
      this.inputCliente.nativeElement.setAttribute('data-idUsuario', 'null');
    } else {
      placeCliente.style.display = 'flex';
    }

    this.usuarioService
      .obtenerUsuariosCriterio(value)
      .subscribe((usuarios: UsuarioInterface) => {
        this.usuarios = usuarios;
      });
  }

  selCliente(usuario: Data): void {
    if (usuario) {
      // console.log(usuario);
      this.usuario = usuario;
      this.forma.controls['cliente'].setValue(usuario?.nombre);
      this.inputCliente.nativeElement.setAttribute(
        'data-idUsuario',
        this.usuario?._id
      );
      this.placeCliente.nativeElement.style.display = 'none';
    }
  }

  crearPPedido(): void {
    if (
      !this.validarCliente() ||
      !this.validarNombreProd() ||
      !this.validarDescripcion() ||
      !this.validaPrecio() ||
      !this.validaDelivery()
    ) {
      return;
    }

    const data = {
      nombre: this.forma.controls['nombre'].value,
      cliente: this.inputCliente.nativeElement.getAttribute('data-idUsuario'),
      descripcion: this.forma.controls['descripcion'].value,
      precio: this.forma.controls['precio'].value,
      delivery: this.forma.controls['delivery'].value,
      tipo: this.forma.controls['tipo'].value,
    };

    this.store
      .select('modalPPedidos')
      .pipe(first())
      .subscribe((modal: eInicial) => {
        if (modal.tipo === 'crear') {
          this.pPedidoService
            .nuevoPPedido(data)
            .subscribe((productos: ProductosPedidos) => {
              if (productos.ok) {
                Swal.fire('Mensaje', `${productos.mensaje}`, 'info');

                this.modal.nativeElement.style.display = 'none';
                this.store.dispatch(
                  modalPPedidosActions.modalPPedido({
                    modal: { abrirCerrarModal: false, tipo: '', idPedido: '' },
                  })
                );

                // activar socket
                const idSocket = this.pPedidoSocket.socketUsuario.id;
                this.pPedidoService.obtenerPPedidos(idSocket).subscribe();
              } else {
                Swal.fire('Mensaje', `Error al crear producto pedido`, 'error');
              }
            });

          return;
        }

        if (modal.tipo === 'editar') {
          Object.assign(data, { idPPedido: modal.idPedido });

          this.pPedidoService
            .editarProductoPedido(data)
            .subscribe((producto: ProductosPedidos) => {
              if (producto.ok) {
                Swal.fire('Mensaje', `${producto.mensaje}`, 'info');

                this.modal.nativeElement.style.display = 'none';
                this.store.dispatch(
                  modalPPedidosActions.modalPPedido({
                    modal: { abrirCerrarModal: false, tipo: '', idPedido: '' },
                  })
                );

                // activar socket
                const idSocket = this.pPedidoSocket.socketUsuario.id;
                this.pPedidoService.obtenerPPedidos(idSocket).subscribe();
              } else {
                Swal.fire('Mensaje', `Error al crear producto pedido`, 'error');
              }
            });

          return;
        }
      });
  }

  ngOnDestroy(): void {}
}
