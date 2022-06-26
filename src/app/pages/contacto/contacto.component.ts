import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { Whatsapp } from '../../scripts/whatsapp';
import * as loadingActions from '../../reducers/loading/loading-actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import validator from 'validator';
import Swal from 'sweetalert2';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent implements OnInit {
  @ViewChild('btnEnviarMSG', { static: true })
  btnEnviarMSG: ElementRef<HTMLButtonElement>;

  datosEstaticos = {
    telefono: null,
    correo: null,
    facebook: null,
    instagram: null,
    twitter: null,
  };

  forma: FormGroup;
  flagNombre = true;
  txtValidNombre = '';

  flagCorreo = true;
  txtValidCorreo = '';

  flagMensaje = true;
  txtValidMensaje = '';

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private whatsapp: Whatsapp,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadingEffect();
    this.cargarDatosEstaticos();

    scrollTo(0, 0);

    this.whatsapp.btnWhatsapp();

    this.cargarFormulario();
  }

  cargarFormulario(): void {
    this.forma = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });
  }

  validarNombre(): boolean {
    // const nombre = this.forma.controls['nombre'].value;
    const valida = this.forma.controls['nombre'].valid;

    if (!valida) {
      this.txtValidNombre = '* Campo requerido';
      this.flagNombre = false;
    } else {
      this.txtValidNombre = '';
      this.flagNombre = true;
    }

    return this.flagNombre;
  }

  validarCorreo(): boolean {
    const valido = this.forma.controls['correo'].valid;

    if (!valido) {
      this.txtValidCorreo = '* Campo requerido';
      this.flagCorreo = false;
    } else {
      if (validator.isEmail(this.forma.controls['correo'].value)) {
        this.txtValidCorreo = '';
        this.flagCorreo = true;
      } else {
        this.txtValidCorreo = '* Correo invalido';
        this.flagCorreo = false;
      }
    }

    return this.flagCorreo;
  }

  validarMensaje(): boolean {
    // const nombre = this.forma.controls['nombre'].value;
    const valida = this.forma.controls['mensaje'].valid;

    if (!valida) {
      this.txtValidMensaje = '* Campo requerido';
      this.flagMensaje = false;
    } else {
      this.txtValidMensaje = '';
      this.flagMensaje = true;
    }

    return this.flagMensaje;
  }

  loadingEffect(): void {
    this.store.dispatch(loadingActions.cargarLoading());
    const checkReadySt = setInterval(() => {
      const readySt = document.readyState;

      if (readySt === 'complete') {
        this.store.dispatch(loadingActions.quitarLoading());
        clearInterval(checkReadySt);
      }
    }, 500);
  }

  cargarDatosEstaticos(): void {
    this.store.select('datosEstaticos').subscribe((datos) => {
      this.datosEstaticos = datos;
    });
  }

  enviarMensaje(): void {
    this.validarNombre(), this.validarCorreo(), this.validarMensaje();
    if (!this.flagNombre || !this.flagCorreo || !this.flagMensaje) {
      return;
    }

    const data = {
      nombre: this.forma.controls['nombre'].value,
      correo: this.forma.controls['correo'].value.toLowerCase().trim(),
      mensaje: this.forma.controls['mensaje'].value,
    };

    const btnEnviarMSG = this.btnEnviarMSG.nativeElement;

    btnEnviarMSG.innerText = 'Enviando mensaje...';
    btnEnviarMSG.style.cursor = 'no-drop';
    btnEnviarMSG.setAttribute('enabled', 'false');

    this.usuarioService.mensajeContacto(data).subscribe((resp) => {
      if (resp.ok) {
        Swal.fire(
          'Mensaje',
          'Mensaje enviado, muy pronto nos pondrémos en contacto con usted',
          'info'
        );

        this.forma.reset();

        btnEnviarMSG.innerText = 'Enviar mensaje';
        btnEnviarMSG.style.cursor = 'default';
        btnEnviarMSG.setAttribute('enabled', 'true');
      } else {
        Swal.fire('Mensaje', 'Mensaje no enviado, intente más tarde', 'error');

        btnEnviarMSG.innerText = 'Enviar mensaje';
        btnEnviarMSG.style.cursor = 'default';
        btnEnviarMSG.setAttribute('enabled', 'true');
      }
    });
  }

  ngOnDestroy(): void {
    this.whatsapp.hidewhatsapp();
  }
}
