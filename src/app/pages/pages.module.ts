import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SwiperModule } from 'swiper/angular';

// Componentes
import { BackSoonComponent } from './back-soon/back-soon.component';
import { InicioComponent } from './inicio/inicio.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminComponent } from './admin/admin.component';
import { ComoImportarComponent } from './como-importar/como-importar.component';
import { ContactoComponent } from './contacto/contacto.component';
import { RegistroComponent } from './registro/registro.component';
import { EntrarComponent } from './entrar/entrar.component';
import { VerClienteComponent } from './ver-cliente/ver-cliente.component';

//Modulo de Ruta
import { PagesRoutesModule } from './pages-routes.module';

// Modulo de componentes compartidos
import { SharedModule } from '../shared/shared.module';

// modulos personzalizados
import { NgChartsModule } from 'ng2-charts';

// CDK
import { LayoutModule } from '@angular/cdk/layout';
import { ClientesComponent } from './clientes/clientes.component';
import { ProductosPedidosComponent } from './productos-pedidos/productos-pedidos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';

// Providers
import { Whatsapp } from '../scripts/whatsapp';

@NgModule({
  declarations: [
    BackSoonComponent,
    InicioComponent,
    NotFoundComponent,
    ComoImportarComponent,
    ContactoComponent,
    RegistroComponent,
    EntrarComponent,
    AdminComponent,
    ClientesComponent,
    ProductosPedidosComponent,
    ReportesComponent,
    MiPerfilComponent,
    VerClienteComponent,
  ],
  imports: [
    SwiperModule,
    CommonModule,
    RouterModule,
    PagesRoutesModule,
    SharedModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
  ],
  exports: [
    BackSoonComponent,
    InicioComponent,
    NotFoundComponent,
    ComoImportarComponent,
  ],
  providers: [Whatsapp],
})
export class PagesModule {}
