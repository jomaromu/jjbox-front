import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { InicioComponent } from './inicio/inicio.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ComoImportarComponent } from './como-importar/como-importar.component';
import { ContactoComponent } from './contacto/contacto.component';
import { RegistroComponent } from './registro/registro.component';
import { EntrarComponent } from './entrar/entrar.component';
import { AdminComponent } from './admin/admin.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosPedidosComponent } from './productos-pedidos/productos-pedidos.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { ReportesComponent } from './reportes/reportes.component';
import { VerClienteComponent } from './ver-cliente/ver-cliente.component';

// guards
import { GeneralGuard } from '../guards/general.guard';
import { AdminGuard } from '../guards/admin.guard';
import { SuperGuard } from '../guards/super.guard';


// import { BackSoonComponent } from './back-soon/back-soon.component';

const pagesRoutes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'como-importar', component: ComoImportarComponent },
  { path: 'contacto', component: ContactoComponent },
  {
    path: 'registro',
    component: RegistroComponent,
    canActivate: [GeneralGuard],
  },
  { path: 'entrar', component: EntrarComponent, canActivate: [GeneralGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'clientes',
        component: ClientesComponent,
        canActivate: [SuperGuard],
      }, // can active
      { path: 'productos-pedidos', component: ProductosPedidosComponent },
      { path: 'mi-perfil', component: MiPerfilComponent },
      {
        path: 'reportes',
        component: ReportesComponent,
        canActivate: [SuperGuard],
      }, // can active
      {
        path: 'ver-cliente',
        component: VerClienteComponent,
        canActivate: [SuperGuard],
      }, // can active

      { path: '', redirectTo: 'mi-perfil', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(pagesRoutes)],
})
export class PagesRoutesModule {}
