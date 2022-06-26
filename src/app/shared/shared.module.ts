import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// componentes
import { ModalComponent } from './modal/modal.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingComponent } from './loading/loading.component';
import { MenuSidebarComponent } from './menu-sidebar/menu-sidebar.component';
import { TablaGeneralComponent } from './tabla-general/tabla-general.component';
import { EditarVerPerfilComponent } from './editar-ver-perfil/editar-ver-perfil.component';
import { CrearEditarProductoComponent } from './crear-editar-producto/crear-editar-producto.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SignatureComponent } from './signature/signature.component';

@NgModule({
  declarations: [
    NavbarComponent,
    ModalComponent,
    FooterComponent,
    LoadingComponent,
    MenuSidebarComponent,
    TablaGeneralComponent,
    EditarVerPerfilComponent,
    CrearEditarProductoComponent,
    PerfilComponent,
    SignatureComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    NavbarComponent,
    ModalComponent,
    FooterComponent,
    LoadingComponent,
    MenuSidebarComponent,
    TablaGeneralComponent,
    EditarVerPerfilComponent,
    CrearEditarProductoComponent,
    PerfilComponent,
    SignatureComponent,
  ],
})
export class SharedModule {}
