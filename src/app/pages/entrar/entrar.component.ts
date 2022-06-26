import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../service/usuario.service';
import { UsuarioInterface } from '../../interface/usuario';
import * as usuarioActions from '../../reducers/usuario/usuarioActions';
import { Whatsapp } from '../../scripts/whatsapp';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrls: ['./entrar.component.scss'],
})
export class EntrarComponent implements OnInit {
  @ViewChild('btnEntrar', { static: true })
  btnEntrar: ElementRef<HTMLButtonElement>;
  forma: FormGroup;

  textoValidarCorreo: string;
  banderaCorreo = false;
  textoValidarPass1: string;
  banderaPass1 = false;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private store: Store<AppState>,
    private whatsapp: Whatsapp
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.whatsapp.hidewhatsapp();
  }

  crearFormulario(): void {
    this.forma = this.fb.group({
      correo: [
        null,
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  // Validar correo
  get validarCorreo(): boolean {
    /*
      Errores:
        pattern
        required
        null
     */
    const controlCorreo: any = this.forma.controls['correo'].errors;

    // caso null => todo bien
    if (!controlCorreo) {
      // console.log('error null');
      this.banderaCorreo = false;

      // caso errores
    } else {
      if (controlCorreo['pattern']) {
        // console.log('error pattern');
        this.banderaCorreo = true;
        this.textoValidarCorreo = '* Correo incorrecto';
      } else if (controlCorreo['required']) {
        // console.log('error required');
        this.textoValidarCorreo = '* Correo requerido';
        this.banderaCorreo = true;
      }
    }

    return this.banderaCorreo;
  }

  // Validar pass1
  get validarPass1(): boolean {
    /*
      Errores:
        minlength
        required
        null
     */
    const controlPass1: any = this.forma.get('password')?.errors;

    // caso null => todo bien
    if (!controlPass1) {
      // console.log('error null');
      this.banderaPass1 = false;

      // caso errores
    } else {
      if (controlPass1['minlength']) {
        // console.log('error pattern');
        this.banderaPass1 = true;
        this.textoValidarPass1 = '* Mínimo 8 carácteres';
      } else if (controlPass1['required']) {
        // console.log('error required');
        this.textoValidarPass1 = '* Contraseña requerida';
        this.banderaPass1 = true;
      }
    }

    return this.banderaPass1;
  }

  entrar(): void {
    if (!this.validarCorreo && !this.validarPass1) {
      const correo: string = this.forma.get('correo')?.value;
      const pass1: string = this.forma.get('password')?.value;

      const correoFinal = correo.trim().toLowerCase();

      const btnEntrar = this.btnEntrar.nativeElement;
      btnEntrar.innerText = 'Entrando...';

      const fd = new FormData();

      fd.append('correo', `${correoFinal}`);
      fd.append('password', `${pass1}`);

      this.usuarioService
        .loguearUsuario(fd)
        .subscribe((usuarioDB: UsuarioInterface) => {
          if (usuarioDB.ok) {
            Swal.fire('Mensaje', `${usuarioDB.mensaje}`, 'info');
            btnEntrar.innerText = 'Entrar';

            // console.log(usuarioDB);
            localStorage.setItem('token', `${usuarioDB.token}`);

            setTimeout(() => {
              this.router.navigate(['/admin']);
            }, 300);
          } else {
            // console.log(usuarioDB);
            Swal.fire('Mensaje', `${usuarioDB.mensaje}`, 'error');
            btnEntrar.innerText = 'Entrar';
          }
          // console.log(usuarioDB);
        });
    } else {
      this.validarCorreo;
      this.validarPass1;
    }
  }
}
