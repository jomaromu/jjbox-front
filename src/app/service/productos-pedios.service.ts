import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosPediosService {
  constructor(private http: HttpClient) {}

  nuevoPPedido(data: any): Observable<any> {
    const url = `${environment.urlPPedidos}/nuevoProductoPedido`;

    return this.http.post(url, data).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerPPedidos(idSocket: string): Observable<any> {
    const url = `${environment.urlPPedidos}/verProductosPedidos`;

    const header = new HttpHeaders({ idSocket });
    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerPedidosAnioActual(): Observable<any> {
    const url = `${environment.urlPPedidos}/obtenerPedidosAnioActual`;
    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  busquedaCriterioAdmin(data: any): Observable<any> {
    const url = `${environment.urlPPedidos}/busquedaCriterioAdmin`;

    const headers = new HttpHeaders({
      idSocket: data.idSocket,
      criterio: data.criterio,
    });
    return this.http.get(url, { headers }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  busquedaCriterioCliente(data: any): Observable<any> {
    const url = `${environment.urlPPedidos}/busquedaCriterioCliente`;

    const headers = new HttpHeaders({
      idSocket: data.idSocket,
      criterio: data.criterio,
      cliente: data.cliente,
    });
    return this.http.get(url, { headers }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerProductosPedidosAdmin(): Observable<any> {
    const url = `${environment.urlPPedidos}/obtenerProductosPedidosAdmin`;

    return this.http.get(url).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerProductosPedidosCliente(idCliente: string): Observable<any> {
    const header = new HttpHeaders({ idCliente });
    const url = `${environment.urlPPedidos}/obtenerProductosPedidosCliente`;
    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerPedidosFecha(data: any): Observable<any> {
    // console.log(data);
    const header = new HttpHeaders({
      fechaDesde: data.fechaDesde,
      fechaHasta: data.fechaHasta,
    });

    const url = `${environment.urlPPedidos}/obtenerPedidosFecha`;
    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  paginacionPedidos(
    filtro?: any,
    idSocket?: any,
    role?: any,
    idUsuario?: any
  ): Observable<any> {
    const url = `${environment.urlPPedidos}/paginacionPedidos`;

    const header = new HttpHeaders({
      desde: filtro.desde,
      hasta: filtro.hasta,
      role,
      idUsuario,
      idSocket,
    });

    // console.log(filtro, idSocket);
    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  editarProductoPedido(data: any): Observable<any> {
    const url = `${environment.urlPPedidos}/editarProductoPedido`;

    return this.http.put(url, data).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  obtenerPPedido(idPPedido: string): Observable<any> {
    const url = `${environment.urlPPedidos}/verProductoPedido`;

    const header = new HttpHeaders({ idPPedido });

    return this.http.get(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  productosPedidosPorUser(cliente: string): Observable<any> {
    const url = `${environment.urlPPedidos}/productosPedidosPorUser/`;

    const header = new HttpHeaders({ cliente });

    return this.http.get(url, { headers: header }).pipe(map((resp) => resp));
  }

  eliminarPPedido(idPPedido: string): Observable<any> {
    const url = `${environment.urlPPedidos}/eliminarPPedido`;
    const header = new HttpHeaders({ idPPedido });

    return this.http.delete(url, { headers: header }).pipe(
      map((resp) => {
        return resp;
      })
    );
  }
}
