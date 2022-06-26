import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { first, take } from 'rxjs';
import { AppState } from '../../reducers/globalReducer';
import { ModalGeneral } from 'src/app/reducers/modal-general/modal-general-reducer';
import * as modalGeneralAction from '../../reducers/modal-general/modal-general-actions';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @ViewChild('btnEntrarSalir', { static: true })
  btnEntrarSalir: ElementRef<HTMLElement>;

  anio: Number = new Date().getUTCFullYear();
  datosEstaticos = {
    telefono: null,
    correo: null,
    facebook: null,
    instagram: null,
    twitter: null,
  };

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatosEstaticos();
  }

  cargarModalGeneral(
    icono: string,
    titulo: string,
    mensaje: string,
    mensajeBoton: string
  ): void {
    const modalInfo: ModalGeneral = {
      activo: true,
      icono,
      titulo,
      mensaje,
      mensajeBoton,
    };

    this.store.dispatch(modalGeneralAction.modalInfo({ modalInfo }));
  }

  cargarDatosEstaticos(): void {
    this.store.pipe(take(3)).subscribe((datos) => {
      const datosEstaticos = datos.datosEstaticos;
      const user = datos.usuario;
      this.datosEstaticos = datosEstaticos;

      if (user.ok) {
        this.btnEntrarSalir.nativeElement.innerText = 'SALIR';

        this.btnEntrarSalir.nativeElement.addEventListener('click', (e) => {
          localStorage.removeItem('token');
          window.location.reload();
        });
      } else {
        this.btnEntrarSalir.nativeElement.innerText = 'ENTRAR';
        this.btnEntrarSalir.nativeElement.addEventListener('click', (e) => {
          this.router.navigate(['entrar']);
        });
      }
    });
  }
}
