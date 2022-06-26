import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, map, mergeMap, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { UsuarioInterface } from '../interface/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private http: HttpClient, private router: Router) {}

  registroUsuario(data: any): Observable<any> {
    const url = `${environment.urlUsuarios}/nuevoUsuario`;

    return this.http.post(url, data).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerUsuario(idReferencia: string): Observable<any> {
    const url = `${environment.urlUsuarios}/obtenerUsuario`;

    const header = new HttpHeaders({ idReferencia });

    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerUsuarioID(id: string): Observable<any> {
    const url = `${environment.urlUsuarios}/obtenerUsuarioID`;

    const header = new HttpHeaders({ id });

    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerUsuarios(lim?: string): Observable<any> {
    const url = `${environment.urlUsuarios}/obtenerUsuarios`;

    if (!lim) {
      return this.http.get(url).pipe(
        map((resp) => {
          return resp;
        })
      );
    } else {
      const header = new HttpHeaders({ lim });
      return this.http.get(url, { headers: header }).pipe(
        map((resp) => {
          return resp;
        })
      );
    }
  }

  obtenerUsuariosCriterio(criterio: string): Observable<any> {
    const url = `${environment.urlUsuarios}/obtenerUsuarioCriterio`;
    const header = new HttpHeaders({ criterio });

    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  busquedaClienteCriterio(criterio: string): Observable<any> {
    const url = `${environment.urlUsuarios}/busquedaClienteCriterio`;
    const header = new HttpHeaders({ criterio });

    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  editarUsuario(data: any): Observable<any> {
    const url = `${environment.urlUsuarios}/editarUsuario`;

    return this.http.put(url, data).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  loguearUsuario(data: FormData): Observable<any> {
    const url = `${environment.urlUsuarios}/loguearUsuario`;

    return this.http.put(url, data).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  decodificarToken(token: string): Observable<any> {
    const url = `${environment.urlUsuarios}/decodificarToken`;

    const header = new HttpHeaders({ token });

    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  cargarUsuario(): Observable<any> {
    const token: any = localStorage.getItem('token');

    if (token) {
      return this.decodificarToken(token).pipe(
        mergeMap((usuarioDB: UsuarioInterface) => {
          if (!usuarioDB.ok) {
            this.router.navigate(['/inicio']);
            return of(null);
          } else {
            return this.obtenerUsuario(usuarioDB?.data?.idReferencia || '');
          }
        })
      );
    } else {
      this.router.navigate(['/inicio']);
      return of(null);
    }
  }

  cargarProvincias(tipo: string): Observable<any> {
    const url = `../assets/rest-direccion/${tipo}.json`;
    return this.http.get(url).pipe(map((resp) => resp));
  }

  mensajeContacto(data: any): Observable<any> {
    const url = `${environment.urlUsuarios}/mensajeContacto`;

    return this.http.post(url, data).pipe(
      map((resp: any) => {
        return resp;
      })
    );
  }
}
