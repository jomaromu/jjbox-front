import { Component, OnInit } from '@angular/core';
import { UsuarioInterface } from '../../interface/usuario';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss'],
})
export class MiPerfilComponent implements OnInit {
  usuario: UsuarioInterface;
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.usuarioService
      .cargarUsuario()
      .subscribe((usuarioDB: UsuarioInterface) => {
        this.usuario = usuarioDB;
      });
  }
}
