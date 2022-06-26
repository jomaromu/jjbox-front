import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { first } from 'rxjs';

import { UsuarioSocketService } from '../../service/usuario-socket.service';
import { UsuarioService } from '../../service/usuario.service';
import * as dataTablaActions from '../../reducers/tabla-general/tabla-general-actions';
import Swal from 'sweetalert2';
import * as verEditarPerfilAction from '../../reducers/abrirCerrarVerEditarPerfil/abrirCerrarVerEditarPerfilActions';
import { UsuarioInterface } from '../../interface/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  // usuario: UsuarioInterface;

  @Input() usuario: UsuarioInterface;
  @Input() ocultarPass: boolean;
  provincias: Array<any> = [{ id: null, name: 'Provincia' }];
  distritos: Array<any> = [{ id: null, name: 'Distrito', province_id: 'null' }];
  corregimientos: Array<any> = [
    { id: null, name: 'Corregimiento', district_id: 'null' },
  ];

  objProvincia = {};
  data = {};

  @ViewChild('modal', { static: true }) modal: ElementRef<HTMLElement>;
  @ViewChild('form', { static: true }) form: ElementRef<HTMLElement>;

  forma: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private usuarioSocket: UsuarioSocketService
  ) {}

  ngOnInit(): void {
    // this.cargarUsuario();
    this.obtenerUsuarioSocket();
    this.setItemTabla();
  }

  abrirModal(): void {
    const idReferencia = this.usuario.data?.idReferencia || '';
    const modal = {
      abrirCerrarModal: true,
      idReferencia,
    };
    this.store.dispatch(verEditarPerfilAction.abrirVerEditarPerfil({ modal }));
    // console.log(this.usuario);
  }

  eliminarCuenta(usuario: UsuarioInterface): void {
    if (usuario.data?.role === 'admin') {
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
            idUsuario: usuario.data?._id,
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

  obtenerUsuarioSocket(): void {
    this.usuarioSocket
      .escuchar('obtener-usuario-editado')
      .subscribe((usuario: UsuarioInterface) => {
        this.usuario = usuario;
      });
  }

  validarPass(value: string): boolean {
    if (value.length < 8) {
      alert('Mínimo 8 carácteres');
      return false;
    } else {
      return true;
    }
  }

  cambiarPass(e: Event, idUsuario: string): void {
    const pPass = document.getElementById('pass') as HTMLDivElement;
    const span = document.querySelector('#pass span') as HTMLElement;
    const pen = document.querySelector('#i-boton') as HTMLElement;

    const inputPass = document.createElement('input');
    inputPass.setAttribute('type', 'password');
    inputPass.setAttribute('id', 'input-pass');
    inputPass.placeholder = 'Nueva contraseña';
    inputPass.style.padding = '5px';

    if (span) {
      pPass.removeChild(span);
    }

    if (document.querySelector('#pass #input-pass')) {
      const value = (document.querySelector('#input-pass') as HTMLInputElement)
        .value;

      if (this.validarPass(value)) {
        Swal.fire({
          title: 'Mensaje',
          text: 'Confirmar cambio de contraseña',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cambiar',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            const data = {
              idUsuario,
              password: value,
            };

            this.usuarioService
              .editarUsuario(data)
              .subscribe((usuario: UsuarioInterface) => {
                if (usuario.ok) {
                  Swal.fire('Mensaje', 'Contraseña cambiada', 'info');
                  pPass.removeChild(document.querySelector('#input-pass')!);
                  const spanNuevo = document.createElement(
                    'span'
                  ) as HTMLElement;

                  spanNuevo.innerText = '********';
                  pPass.appendChild(spanNuevo);

                  pen.classList.add('fa-pen-alt');
                  pen.classList.remove('fa-save');
                } else {
                  Swal.fire(
                    'Mensaje',
                    'Error al cambiar la contraseña',
                    'error'
                  );
                }
              });
          } else {
            pPass.removeChild(document.querySelector('#input-pass')!);
            const spanNuevo = document.createElement('span') as HTMLElement;

            spanNuevo.innerText = '********';
            pPass.appendChild(spanNuevo);

            pen.classList.add('fa-pen-alt');
            pen.classList.remove('fa-save');
          }
        });
      }
    } else {
      pPass.appendChild(inputPass);
      pen.classList.remove('fa-pen-alt');
      pen.classList.add('fa-save');
    }
  }

  setItemTabla(): void {
    this.store.dispatch(
      dataTablaActions.dataTabla({ tipoItem: 'mi-perfil', usuario: null })
    );
  }

  ngOnDestroy(): void {
    // this.usuarioSocket.quitarSubscripcion('obtener-usuario-editado');
  }
}
