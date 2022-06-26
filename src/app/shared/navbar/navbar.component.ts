import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { ModalGeneral } from '../../reducers/modal-general/modal-general-reducer';
import { UsuarioService } from '../../service/usuario.service';

import { UsuarioInterface } from '../../interface/usuario';
import * as modalGeneralAction from '../../reducers/modal-general/modal-general-actions';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('navbarMovil', { static: true })
  navbarMovil: ElementRef<HTMLElement>;

  @ViewChild('fondo', { static: true })
  fondo: ElementRef<HTMLElement>;

  @ViewChild('btnRegistro', { static: true })
  btnRegistro: ElementRef<HTMLElement>;

  @ViewChild('btnNavReg', { static: true })
  btnNavReg: ElementRef<HTMLElement>;

  @ViewChild('btnSalir', { static: true })
  btnSalir: ElementRef<HTMLElement>;

  @ViewChild('btnNavSalir', { static: true })
  btnNavSalir: ElementRef<HTMLElement>;

  datosEstaticos = {
    telefono: null,
    correo: null,
    facebook: null,
    instagram: null,
    twitter: null,
  };
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarDatosEstaticos();
    this.itemsMenu();
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
    this.store.select('datosEstaticos').subscribe((datos) => {
      this.datosEstaticos = datos;
    });
  }

  menuBars(): void {
    const fondo = this.fondo.nativeElement;
    fondo.style.display = 'flex';

    fondo.classList.remove('animate__slideOutLeft');
    fondo.classList.add('animate__slideInLeft');
  }

  cerrarMenuMovil(): void {
    const fondo = this.fondo.nativeElement;

    setTimeout(() => {
      fondo.style.display = 'none';
    }, 800);

    fondo.classList.remove('animate__slideInLeft');
    fondo.classList.add('animate__slideOutLeft');
  }

  itemsMenu(): void {
    const token = localStorage.getItem('token');
    const btnRegistro = this.btnRegistro.nativeElement;
    const btnSalir = this.btnSalir.nativeElement;
    const btnNavSalir = this.btnNavSalir.nativeElement;
    const btnNavReg = this.btnNavReg.nativeElement;

    if (!token) {
      // btnRegistro
      btnRegistro.innerHTML = 'REGISTRARME';
      btnRegistro.addEventListener('click', (e) => {
        this.router.navigate(['/registro']);
      });

      // btnRegistro
      btnNavReg.innerHTML = 'REGISTRARME';
      btnNavReg.addEventListener('click', (e) => {
        this.router.navigate(['/registro']);
      });

      // bntSalir
      btnSalir.innerText = 'ENTRAR';
      btnSalir.addEventListener('click', (e) => {
        this.router.navigate(['/entrar']);
      });

      // bntSalir
      btnNavSalir.innerText = 'ENTRAR';
      btnNavSalir.addEventListener('click', (e) => {

        this.router.navigate(['/entrar']);
      });
    } else {
      this.usuarioService
        .decodificarToken(token)
        .subscribe((usuario: UsuarioInterface) => {
          if (usuario.ok) {
            // btnRegistro
            btnRegistro.innerText = 'DASHBOARD';
            btnRegistro.addEventListener('click', (e) => {
              this.router.navigate(['/admin']);
            });

            // btnRegistro
            btnNavReg.innerText = 'DASHBOARD';
            btnNavReg.addEventListener('click', (e) => {
              this.router.navigate(['/admin']);
            });

            // bntSalir
            btnSalir.innerText = 'SALIR';
            btnSalir.addEventListener('click', (e) => {
              localStorage.removeItem('token');
              window.location.reload();
            });

            // bntSalir
            btnNavSalir.innerText = 'SALIR';
            btnNavSalir.addEventListener('click', (e) => {
              localStorage.removeItem('token');
              window.location.reload();
            });
          } else {
            // btnRegistro
            localStorage.removeItem('token');
            btnRegistro.innerHTML = 'REGISTRARME';
            btnRegistro.addEventListener('click', (e) => {
              this.router.navigate(['/registro']);
            });

            // btnRegistro
            localStorage.removeItem('token');
            btnNavReg.innerHTML = 'REGISTRARME';
            btnNavReg.addEventListener('click', (e) => {
              this.router.navigate(['/registro']);
            });

            // bntSalir
            btnSalir.innerText = 'ENTRAR';
            btnSalir.addEventListener('click', (e) => {
              this.router.navigate(['/entrar']);
            });

            // bntSalir
            btnNavSalir.innerText = 'ENTRAR';
            btnNavSalir.addEventListener('click', (e) => {
              this.router.navigate(['/entrar']);
            });
          }
        });
    }
  }
}
