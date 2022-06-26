import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UsuarioInterface } from '../interface/usuario';
import { UsuarioService } from '../service/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  permitido: boolean = false;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  canActivate(): boolean {
    return this.decodificarToken();
  }

  decodificarToken(): boolean {
    const token: any = localStorage.getItem('token');

    // console.log(token === null);

    if (!token) {
      this.permitido = false;
      this.router.navigate(['inicio']);
    } else {
      // console.log(token);
      this.usuarioService
        .decodificarToken(token)
        .subscribe((usuario: UsuarioInterface) => {
          if (!usuario) {
            this.permitido = false;
            this.router.navigate(['inicio']);
          } else {
            if (usuario.ok) {
              this.permitido = true;
              this.router.navigate(['admin/mi-perfil']);
              // this.router.navigate(['admin/ver-cliente'], {
              //   queryParams: { cliente: '629bbb1d4e5bd998b26e7638' },
              // });
            } else {
              this.permitido = false;
              this.router.navigate(['inicio']);
            }
          }
        });
    }

    return this.permitido;
  }
}
