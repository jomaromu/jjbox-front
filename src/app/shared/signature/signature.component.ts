import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers/globalReducer';
import SignaturePad from 'signature_pad';
import { Signature } from '../../reducers/signature/signature.reducer';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';

import * as bootstrap from 'bootstrap';
import * as signatureActions from '../../reducers/signature/signature.actions';
import { FacturaService } from '../../service/factura.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss'],
})
export class SignatureComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  signature: SignaturePad;
  modal: bootstrap.Modal;

  constructor(
    private store: Store<AppState>,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('miModal')!, {
      backdrop: 'static',
    });
    this.cSignature();

    // console.log(this.modal);
    // this.facturaService.facturaAdmin();
  }

  cargarSingature(): void {
    const canvas = this.canvas.nativeElement;
    this.signature = new SignaturePad(canvas);
  }

  cSignature(): void {
    this.store.select('signature').subscribe((resp: Signature) => {
      if (resp.estado) {
        this.modal.show();
        this.cargarSingature();
        this.keysPrevent();
      }
    });
  }

  cerrarSignature(): void {
    this.store.dispatch(
      signatureActions.cerrarSignature({
        firma: { estado: false, firma: '', idPPedido: '' },
      })
    );
    this.signature.clear();
    this.modal.hide();
  }

  keysPrevent(): void {
    document.addEventListener('keydown', (e) => {
      this.store.dispatch(
        signatureActions.cerrarSignature({
          firma: { estado: false, firma: '', idPPedido: '' },
        })
      );
    });
  }

  crearFirmaFactura(): void {
    Swal.fire({
      title: 'Mensaje',
      text: '¿Confirma la creación de esta factura?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Crear factura',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const firmaPNG = this.signature.toDataURL();
        this.store
          .select('signature')
          .pipe(first())
          .subscribe((resp: Signature) => {
            // console.log(resp);
            this.facturaService.facturaAdmin(
              firmaPNG,
              resp.idPPedido,
              this.modal
            );
          });
      } else {
        this.store.dispatch(
          signatureActions.cerrarSignature({
            firma: { estado: false, firma: '', idPPedido: '' },
          })
        );
        this.signature.clear();
        this.modal.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.modal.dispose();
  }
}
