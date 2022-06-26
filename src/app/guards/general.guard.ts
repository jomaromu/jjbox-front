import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';

import { UsuarioInterface } from '../interface/usuario';

@Injectable({
  providedIn: 'root',
})
export class GeneralGuard implements CanActivate {
  constructor(private router: Router, private usuarioService: UsuarioService) {}
  permitido: boolean = false;
  canActivate(): boolean {
    return this.decodificarToken();
  }

  decodificarToken(): boolean {
    const token: any = localStorage.getItem('token');

    // console.log(token === null);

    if (!token) {
      this.permitido = true;
    } else {
      // console.log(token);
      this.usuarioService
        .decodificarToken(token)
        .subscribe((usuario: UsuarioInterface) => {
          if (usuario.ok) {
            this.router.navigate(['admin']);
            this.permitido = false;
          }
        });
    }

    return this.permitido;
  }
}
