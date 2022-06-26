import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../service/usuario.service';
import { UsuarioInterface } from '../interface/usuario';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/globalReducer';

@Injectable({
  providedIn: 'root',
})
export class SuperGuard implements CanActivate {
  permitido: boolean;
  constructor(private router: Router, private store: Store<AppState>) {}

  canActivate(): boolean {
    this.store.select('usuario').subscribe((usuario: UsuarioInterface) => {
      // console.log(usuario.data?.role);
      if (usuario.data?.role === 'admin') {
        this.permitido = true;
      } else {
        this.permitido = false;
        // this.router.navigate(['admin/mi-perfil']); // comentar
      }
    });

    return this.permitido;
  }
}
