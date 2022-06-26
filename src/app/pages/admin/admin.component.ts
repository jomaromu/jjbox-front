import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import { UsuarioService } from '../../service/usuario.service';
import { Subscription } from 'rxjs';

import anime from 'animejs';
import { UsuarioInterface } from '../../interface/usuario';
import { UsuarioSocketService } from '../../service/usuario-socket.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild('wrapRutas', { static: true }) wrapRutas: ElementRef<HTMLElement>;
  @ViewChild('sidebar', { static: true }) sidebar: ElementRef<HTMLElement>;
  items: Array<any>;
  subSidebar: Subscription;
  usuario: UsuarioInterface;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private usuarioService: UsuarioService,
    private usuarioSocket: UsuarioSocketService
  ) {}

  ngOnInit(): void {
    // this.itemsSidebar();
    this.abrirCerrarSidebar();
    this.obtenerUsuarioSocket();
  }

  cargarUsuario(): void {
    this.usuarioService.cargarUsuario().subscribe((usuario) => {
      this.usuario = usuario;
    });
  }

  ngAfterViewInit(): void {
    this.cargarUsuario();
  }

  itemsSidebar(): void {
    const items: Array<any> = [
      {
        icono: 'fas fa-users',
        nombre: 'Clientes',
        row: 'fas fa-angle-right',
        routerLink: '/admin/clientes',
        role: ['admin'],
      },
      {
        icono: 'fas fa-cart-arrow-down',
        nombre: 'Productos pedidos',
        row: 'fas fa-angle-right',
        routerLink: '/admin/productos-pedidos',
        role: ['admin', 'cliente'],
      },
      {
        icono: 'fas fa-chart-line',
        nombre: 'Reportes',
        row: 'fas fa-angle-right',
        routerLink: '/admin/reportes',
        role: ['admin'],
      },
      {
        icono: 'fas fa-user',
        nombre: 'Mi perfil',
        row: 'fas fa-angle-right',
        routerLink: '/admin/mi-perfil',
        role: ['admin', 'cliente'],
      },
      {
        icono: 'fas fa-bell',
        nombre: 'Notificaciones',
        row: 'fas fa-angle-right',
        role: ['admin', 'cliente'],
        // routerLink: '/',
      },
      // {
      //   icono: 'fas fa-arrow-circle-right',
      //   nombre: 'Salir',
      //   row: 'fas fa-angle-right',
      //   routerLink: '/',
      // },
    ];

    this.items = items;
  }

  abrirCerrarSidebar(): void {
    this.subSidebar = this.store
      .select('sidebar')
      // .pipe(first())
      .subscribe((resp) => {
        const wrapRutas = this.wrapRutas.nativeElement;
        const sidebar = this.sidebar.nativeElement;

        const anchoWrapRutas = wrapRutas.clientWidth;

        // console.log(resp);
        const tl = anime.timeline({
          duration: 150,
          easing: 'linear',
        });

        if (resp) {
          tl.add({
            targets: sidebar,
            marginLeft: '0',
          }).add({
            targets: wrapRutas,
            marginLeft: '250px',
          });
        } else {
          tl.add({
            targets: sidebar,
            marginLeft: '-250px',
          }).add({
            targets: wrapRutas,
            marginLeft: '0',
          });
        }
      });
  }

  salir(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/inicio']);
    } else {
      localStorage.removeItem('token');
      this.router.navigate(['/inicio']);
    }
  }

  obtenerUsuarioSocket(): void {
    this.usuarioSocket
      .escuchar('obtener-usuario-editado')
      .subscribe((usuario: UsuarioInterface) => {
        // this.usuario = usuario;
        // cargar todos los usuarios
      });
  }

  ngOnDestroy(): void {
    // this.subSidebar.unsubscribe();
  }
}
