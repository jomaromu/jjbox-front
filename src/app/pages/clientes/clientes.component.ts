import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers/globalReducer';
import * as dataTablaActions from '../../reducers/tabla-general/tabla-general-actions';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.setItemTabla();
  }

  setItemTabla(): void {
    this.store.dispatch(
      dataTablaActions.dataTabla({ tipoItem: 'clientes', usuario: null })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(
      dataTablaActions.dataTabla({ tipoItem: '', usuario: null })
    );
  }
}
