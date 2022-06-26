import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './reducers/globalReducer';
import * as usuarioActions from './reducers/usuario/usuarioActions';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { ModalGeneral } from './reducers/modal-general/modal-general-reducer';
import { UsuarioInterface } from './interface/usuario';
import { UsuarioService } from './service/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'jjboxpty';

  constructor(
    private store: Store<AppState>,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.cargarModal();
    this.decodificarToken();
  }

  cargarModal(): void {
    this.store.select('modalGeneral').subscribe((dataModal: ModalGeneral) => {
      if (dataModal.activo) {
        let icono: SweetAlertIcon = 'info';

        switch (dataModal.icono) {
          case 'info':
            icono = 'info';
            break;
          case 'error':
            icono = 'error';
            break;
        }

        Swal.fire({
          icon: icono,
          title: dataModal.titulo,
          text: dataModal.mensaje,
          confirmButtonText: dataModal.mensajeBoton,
        });
      }
    });
  }

  decodificarToken(): any {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        const token: any = localStorage.getItem('token');

        // console.log(token);

        if (!token) {
          return;
        } else {
          // console.log(token);
          this.usuarioService
            .decodificarToken(token)
            .subscribe((usuario: UsuarioInterface) => {
              // console.log(usuario);
              if (usuario.ok) {
                this.store.dispatch(usuarioActions.obtenerUsuario({ usuario }));
              }
            });
        }
      }
    });
  }
}
