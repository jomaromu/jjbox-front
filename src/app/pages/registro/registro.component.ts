import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../service/usuario.service';
import { UsuarioInterface } from '../../interface/usuario';
import Swal from 'sweetalert2';
import { Whatsapp } from 'src/app/scripts/whatsapp';
import validator from 'validator';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  @ViewChild('btnRegistro', { static: true })
  btnRegistro: ElementRef<HTMLButtonElement>;

  forma: FormGroup;

  textoValidarCorreo: string;
  banderaCorreo = false;
  textoValidarPass1: string;
  banderaPass1 = false;
  textoValidarPass2: string;
  banderaPass2 = false;

  provincias: Array<Provincia>;
  distritos: Array<Distrito>;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private whatsapp: Whatsapp,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.whatsapp.hidewhatsapp();
    this.cargarProvincias();
  }

  crearFormulario(): void {
    this.forma = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      provincia: ['8', [Validators.required]],
      distrito: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: this.fb.group({
        pass1: ['', [Validators.required, Validators.minLength(8)]],
        pass2: ['', [Validators.required, Validators.minLength(8)]],
      }),
      direccion: ['', [Validators.required]],
    });
  }

  get validarNombre(): ObjResp {
    const resp: ObjResp = {
      estado: false,
      mensaje: '',
    };

    const isValid = this.forma.controls['nombre'].valid;
    const isTouched = this.forma.controls['nombre'].touched;

    if (!isValid && isTouched) {
      (resp.estado = false), (resp.mensaje = 'Ingrese un nombre');
    } else {
      (resp.estado = true), (resp.mensaje = '');
    }

    return resp;
  }

  get validarApellido(): ObjResp {
    const resp: ObjResp = {
      estado: false,
      mensaje: '',
    };

    const isValid = this.forma.controls['apellido'].valid;
    const isTouched = this.forma.controls['apellido'].touched;

    if (!isValid && isTouched) {
      (resp.estado = false), (resp.mensaje = 'Ingrese un apellido');
    } else {
      (resp.estado = true), (resp.mensaje = '');
    }

    return resp;
  }

  get validarTelefono(): ObjResp {
    const resp: ObjResp = {
      estado: false,
      mensaje: '',
    };

    const isValid = this.forma.controls['telefono'].valid;
    const isTouched = this.forma.controls['telefono'].touched;

    const value: string = this.forma.controls['telefono'].value;
    const isNumber = validator.isNumeric(value);

    if (!isValid && isTouched) {
      (resp.estado = false), (resp.mensaje = 'Ingrese un teléfono');
    }

    if (isTouched && isValid && !isNumber) {
      (resp.estado = false), (resp.mensaje = 'Ingrese sólo números');
    }

    return resp;
  }

  cargarProvincias(): void {
    this.http
      .get<Array<Provincia>>('../assets/rest-direccion/provincias.json')
      .subscribe((provincias) => {
        this.provincias = provincias;

        this.cargarDistritos(this.forma.controls['provincia'].value);
      });
  }

  cargarDistritos(idProvincia: string): void {
    this.http
      .get<Array<Distrito>>('../assets/rest-direccion/distritos.json')
      .subscribe((distritos) => {
        const filterDistritos = distritos.filter((distrito) => {
          return distrito.province_id === idProvincia;
        });
        this.forma.controls['distrito'].setValue(filterDistritos[0].id);
        this.distritos = filterDistritos;
      });
  }

  get validarCorreo(): ObjResp {
    const resp: ObjResp = {
      estado: false,
      mensaje: '',
    };

    const isValid = this.forma.controls['correo'].valid;
    const isTouched = this.forma.controls['apellido'].touched;
    const value = this.forma.controls['correo'].value;

    if (!isValid && isTouched && value) {
      resp.estado = false;
      resp.mensaje = 'Correo incorrecto';
    } else if (!isValid && isTouched && !value) {
      resp.estado = false;
      resp.mensaje = 'Ingrese un correo';
    }
    return resp;
  }

  get validarPass(): ObjResp {
    const resp: ObjResp = {
      estado: false,
      mensaje: '',
    };

    const value1: string = this.forma.get('password.pass1')?.value;
    const value2: string = this.forma.get('password.pass2')?.value;

    const isValid1 = this.forma.get('password.pass1')?.valid;
    const isValid2 = this.forma.get('password.pass2')?.valid;

    const isTouched1 = this.forma.get('password.pass1')?.touched;
    const isTouched2 = this.forma.get('password.pass2')?.touched;

    const errorsPass1 = this.forma.get('password.pass1')?.errors;
    const errorsPass2 = this.forma.get('password.pass2')?.errors;

    if ((!isValid1 && isTouched1) || (!isValid2 && isTouched2)) {
      if (errorsPass1 && errorsPass2) {
        // console.log('Error en los dos');

        if (errorsPass1['required'] || errorsPass2['required']) {
          // console.log('uno de los dos esta vacio');
          resp.estado = false;
          resp.mensaje = 'Debe llenar los campos';
        }

        if (errorsPass1['minlength'] || errorsPass1['minlength']) {
          // console.log('tienen caracteres, pero no 8');
          resp.estado = false;
          resp.mensaje = 'Mínimo 8 carácteres';
        }
      } else if (errorsPass1 && !errorsPass2) {
        // console.log('Error en pass 1');
        if (errorsPass1['required']) {
          resp.estado = false;
          resp.mensaje = 'Debe escribir una contrasña';
        }

        if (errorsPass1['minlength']) {
          resp.estado = false;
          resp.mensaje = 'Mínimo 8 carácteres';
        }
      } else if (!errorsPass1 && errorsPass2) {
        // console.log('Error en pass 2');

        if (errorsPass2['required']) {
          resp.estado = false;
          resp.mensaje = 'Debe confirmar contrasña';
        }

        if (errorsPass2['minlength']) {
          resp.estado = false;
          resp.mensaje = 'Mínimo 8 carácteres';
        }
      }
    }

    if (isValid1 && isTouched1 && isValid2 && isTouched2) {
      if (value2 === value1) {
        resp.estado = true;
        resp.mensaje = '';
      } else {
        resp.estado = false;
        resp.mensaje = 'Las contraseñas no coinciden';
      }
    }
    // console.log(resp);
    return resp;
  }

  get validarDireccion(): ObjResp {
    const resp: ObjResp = {
      estado: false,
      mensaje: '',
    };

    const isValid = this.forma.controls['direccion'].valid;
    const isTouched = this.forma.controls['direccion'].touched;

    if (!isValid && isTouched) {
      (resp.estado = false), (resp.mensaje = 'Ingrese un dirección');
    } else {
      (resp.estado = true), (resp.mensaje = '');
    }

    return resp;
  }

  registro(): void {
    // console.log(this.validarPass.estado);
    if (!this.forma.valid || !this.validarPass.estado) {
      this.forma.markAllAsTouched();
      // console.log(this.forma.controls);
    } else {
      const nombre = this.forma.controls['nombre'].value;
      const apellido = this.forma.controls['apellido'].value;
      const telefono = this.forma.controls['telefono'].value;
      const provincia = Number(this.forma.controls['provincia'].value);
      const distrito = Number(this.forma.controls['distrito'].value);
      const correo: string = this.forma.get('correo')?.value;
      const pass2: string = this.forma.get('password.pass2')?.value;
      const direccion = this.forma.controls['direccion'].value;
      // const pass2: string = this.forma.get('password.pass2')?.value;

      const correoFinal = correo.trim().toLowerCase();
      const pass2Final = pass2.trim();

      const btnRegistro = this.btnRegistro.nativeElement;

      btnRegistro.innerText = 'Registrando...';

      const data = {
        nombre: `${nombre} ${apellido}`,
        telefono,
        direccion: {
          provincia: {
            id: provincia,
            name: this.provincias.find(
              (provincia) =>
                provincia.id === this.forma.controls['provincia'].value
            )?.name,
          },
          distrito: {
            id: distrito,
            name: this.distritos.find(
              (distrito) =>
                distrito.id === this.forma.controls['distrito'].value
            )?.name,
            province_id: this.distritos.find(
              (distrito) =>
                distrito.id === this.forma.controls['distrito'].value
            )?.province_id,
          },
          direccion,
        },
        correo: correoFinal,
        password: pass2Final,
      };

      // console.log(data);
      // return;

      this.usuarioService
        .registroUsuario(data)
        .subscribe((usuario: UsuarioInterface) => {
          if (usuario.ok) {
            Swal.fire({
              title: 'Mensaje',
              text: `${usuario.mensaje}`,
              icon: 'info',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                btnRegistro.innerText = 'Registrarme';
                this.router.navigate(['/entrar']);
              }
            });
          } else {
            Swal.fire('Mensaje', `${usuario.err.message}`, 'error');
            btnRegistro.innerText = 'Registrarme';
          }
          // console.log(usuario);
        });
    }
  }
}

export interface ObjResp {
  estado: boolean;
  mensaje: string;
}

export interface Provincia {
  id: number;
  name: string;
}

export interface Distrito {
  id: number;
  name: string;
  province_id: string;
}
