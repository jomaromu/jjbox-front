import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UsuarioService } from '../../service/usuario.service';
import { UsuarioInterface } from '../../interface/usuario';
import * as verEditarPerfilAction from '../../reducers/abrirCerrarVerEditarPerfil/abrirCerrarVerEditarPerfilActions';
import { UsuarioSocketService } from '../../service/usuario-socket.service';

import validator from 'validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-ver-perfil',
  templateUrl: './editar-ver-perfil.component.html',
  styleUrls: ['./editar-ver-perfil.component.scss'],
})
export class EditarVerPerfilComponent implements OnInit {
  usuario: UsuarioInterface;
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

  validaTel = false;
  objValTel = '';
  constructor(
    private usuarioService: UsuarioService,
    private usuarioSocketService: UsuarioSocketService,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.cargarFormulario();
    this.cargarUsuario();
    this.cargarProvincias();
    this.abrirModal();
  }

  cargarUsuario(): void {}

  cargarFormulario(): void {
    this.forma = this.fb.group({
      nombre: [],
      telefono: [],
      provincia: [],
      distrito: [],
      corregimiento: [],
      direccion: [],
    });
  }

  // VALIDACIONES
  validarTelefono(): boolean {
    const value = this.forma.controls['telefono'].value;

    if (validator.isNumeric(value.trim())) {
      this.objValTel = '';
      this.validaTel = true;
    } else {
      this.objValTel = 'Escriba sólo números';
      this.validaTel = false;
    }

    return this.validaTel;
  }

  cargarProvincias(): void {
    this.usuarioService
      .cargarProvincias('provincias')
      .subscribe((provincias) => {
        this.provincias = provincias;
        this.forma.controls['provincia'].setValue(null);
      });
  }

  abrirModal(): void {
    this.store
      .select('verEditarPerfil')
      // .pipe(first())
      .subscribe((respReducer) => {
        if (respReducer.abrirCerrarModal) {
          this.usuarioService
            .obtenerUsuario(respReducer.idReferencia)
            .pipe(first())
            .subscribe((usuario: UsuarioInterface) => {
              this.usuario = usuario;
              const modal = this.modal.nativeElement;
              const form = this.form.nativeElement;

              modal.style.display = 'flex';

              form.classList.add('animate__slideInDown');
              form.classList.remove('animate__slideOutUp');

              if (!this.usuario.data?.direccion.provincia.id) {
                this.forma.controls['provincia'].setValue(null);
              } else {
                this.usuarioService
                  .cargarProvincias('provincias')
                  .subscribe((provincias: Array<any>) => {
                    const objProvincia = provincias.find(
                      (provincia) =>
                        Number(provincia.id) ===
                        Number(this.usuario.data?.direccion.provincia.id)
                    );
                    this.forma.controls['provincia'].setValue(objProvincia.id);
                  });
              }

              if (!this.usuario.data?.direccion.distrito.id) {
                this.distritos = [{ id: null, name: 'Distrito' }];
                this.forma.controls['distrito'].setValue(this.distritos[0].id);
              } else {
                this.usuarioService
                  .cargarProvincias('distritos')
                  .subscribe((distritos: Array<any>) => {
                    const objDistritos = distritos.filter(
                      (distrito) =>
                        Number(distrito.province_id) ===
                        Number(
                          this.usuario.data?.direccion.distrito.province_id
                        )
                    );

                    const objDistrito = objDistritos.find(
                      (distrito) =>
                        Number(distrito.id) ===
                        Number(this.usuario.data?.direccion.distrito.id)
                    );

                    this.distritos = objDistritos;
                    this.forma.controls['distrito'].setValue(objDistrito.id);
                    // console.log(objDistritos);
                    // console.log(objDistrito);
                  });
              }

              if (!this.usuario.data?.direccion.corregimiento.id) {
                this.corregimientos = [{ id: null, name: 'Corregimiento' }];
                this.forma.controls['corregimiento'].setValue(
                  this.corregimientos[0].id
                );
              } else {
                this.usuarioService
                  .cargarProvincias('corregimientos')
                  .subscribe((corrgs: Array<any>) => {
                    const objCorrs = corrgs.filter(
                      (corrg) =>
                        Number(corrg.district_id) ===
                        Number(this.usuario.data?.direccion.distrito.id)
                    );

                    const objCorr = objCorrs.find(
                      (corr) =>
                        Number(corr.id) ===
                        Number(this.usuario.data?.direccion.corregimiento.id)
                    );
                    this.corregimientos = objCorrs;
                    this.forma.controls['corregimiento'].setValue(objCorr.id);
                  });
              }

              this.forma.controls['nombre'].setValue(this.usuario.data?.nombre);
              this.forma.controls['telefono'].setValue(
                this.usuario.data?.telefono
              );
              this.forma.controls['direccion'].setValue(
                this.usuario.data?.direccion.direccion
              );
            });
        }
      });
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
      verEditarPerfilAction.abrirVerEditarPerfil({
        modal: { idReferencia: '', abrirCerrarModal: false },
      })
    );
  }

  cargarDistritos(): void {
    const provinciaSel = this.forma.controls['provincia'].value;

    if (provinciaSel === 'null') {
      this.distritos = [{ id: null, name: 'Distrito' }];
      this.corregimientos = [{ id: null, name: 'Corregimiento' }];

      this.forma.controls['distrito'].setValue(this.distritos[0].id);
      this.forma.controls['corregimiento'].setValue(this.corregimientos[0].id);
    } else {
      this.usuarioService
        .cargarProvincias('distritos')
        .subscribe((distritos: Array<any>) => {
          const distritosFilter = distritos.filter((distrito) => {
            return Number(distrito.province_id) === Number(provinciaSel);
          });
          this.forma.controls['distrito'].setValue(distritosFilter[0].id);
          this.distritos = distritosFilter;
          this.cargarCorregimiento();
        });
    }
  }

  cargarCorregimiento(): void {
    const corrSel = this.forma.controls['distrito'].value;

    if (corrSel === 'null') {
      this.corregimientos = [{ id: null, name: 'Corregimiento' }];
      this.forma.controls['corregimiento'].setValue(this.corregimientos[0].id);
    } else {
      this.usuarioService
        .cargarProvincias('corregimientos')
        .subscribe((correg: Array<any>) => {
          const corregFilter = correg.filter((correg) => {
            return Number(correg.district_id) === Number(corrSel);
          });
          this.corregimientos = corregFilter;
          this.forma.controls['corregimiento'].setValue(corregFilter[0].id);
        });
    }
  }

  guardarPerfil(): void {
    // const fd = new FormData();

    if (!this.validarTelefono()) {
      return;
    }

    const provincias = this.usuarioService.cargarProvincias('provincias');
    const distritos = this.usuarioService.cargarProvincias('distritos');
    const corregimientos =
      this.usuarioService.cargarProvincias('corregimientos');

    forkJoin([provincias, distritos, corregimientos]).subscribe((resp) => {
      const provincias: Array<any> = resp[0];
      const distritos: Array<any> = resp[1];
      const corregimientos: Array<any> = resp[2];

      const objProvincia = provincias.find(
        (provincia) =>
          Number(this.forma.controls['provincia'].value) ===
          Number(provincia.id)
      );

      const objDistrito = distritos.find(
        (distrito) =>
          Number(distrito.id) === Number(this.forma.controls['distrito'].value)
      );

      const objCorregimientos = corregimientos.find(
        (corregimiento) =>
          Number(corregimiento.id) ===
          Number(this.forma.controls['corregimiento'].value)
      );

      const data = {
        nombre: this.forma.controls['nombre'].value,
        telefono: this.forma.controls['telefono'].value,
        direccion: {
          provincia: objProvincia || { id: null, name: null },
          distrito: objDistrito || { id: null, name: null },
          corregimiento: objCorregimientos || { id: null, name: null },
          direccion: this.forma.controls['direccion'].value,
        },
        idUsuario: this.usuario.data?._id,
        idUsuarioSocket: this.usuarioSocketService.socketUsuario.id,
      };

      // console.log(this.usuario.data?._id);

      this.usuarioService
        .editarUsuario(data)
        .subscribe((usuario: UsuarioInterface) => {
          if (usuario.ok) {
            this.modal.nativeElement.style.display = 'none';

            Swal.fire('Mensaje', `${usuario.mensaje}`, 'info');

            // activar socket
            this.usuarioService.obtenerUsuarios().subscribe();

            this.store.dispatch(
              verEditarPerfilAction.abrirVerEditarPerfil({
                modal: { abrirCerrarModal: false, idReferencia: '' },
              })
            );
          } else {
            Swal.fire('Mensaje', `${usuario.mensaje}`, 'error');
          }
        });
    });
  }
}
