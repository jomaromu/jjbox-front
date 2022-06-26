import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class UsuarioSocketService {
  public socketUsuario: Socket;
  constructor() {
    this.socketUsuario = io('http://190.218.43.46:4001');
    this.checkStatus();
  }

  checkStatus(): void {
    this.socketUsuario.on('connect', () => {
      console.log({
        mensaje: 'Conectado al servidor de usuarios',
        cliente: this.socketUsuario.id,
      });
    });

    this.socketUsuario.on('disconnect', () => {
      console.log('Desconectado del servidor de usuarios');
    });
  }

  emitir(evento: string, payload?: any, callback?: any): void {
    this.socketUsuario.emit(evento, payload, callback);
  }

  escuchar(evento: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socketUsuario.on(evento, (callback: any) => {
        subscriber.next(callback);
      });
    });
  }

  quitarSubscripcion(evento: string): any {
    this.socketUsuario.off(evento);
  }
}
