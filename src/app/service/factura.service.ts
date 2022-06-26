import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { jsPDF } from 'jspdf';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/globalReducer';
import autoTable from 'jspdf-autotable';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { ProductosPedidos } from '../interface/productosPedidos';
import * as signatureActions from '../reducers/signature/signature.actions';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  facturaAdmin(firma: string, idPPedido: string, modal: bootstrap.Modal): any {
    const url = `${environment.urlPPedidos}/verProductoPedido`;
    const header = new HttpHeaders({ idPPedido });

    // console.log(idPPedido);

    this.http
      .get<ProductosPedidos>(url, { headers: header })
      .subscribe((pPedido) => {
        // console.log(pPedido);

        if (pPedido.ok) {
          const espaciado = 5;

          const doc = new jsPDF({
            orientation: 'portrait',
            format: 'letter',
          });

          const anchoDoc = doc.internal.pageSize.getWidth();
          const totalPages = doc.getNumberOfPages();

          // firma
          for (let i = 0; i <= totalPages; i++) {
            if (i === totalPages) {
              // console.log(doc.getCurrentPageInfo());
              const anchoFirma = 90;
              const altoFirma = 30;
              const altoPagina = doc.internal.pageSize.getHeight();

              doc.setFont('Helvetica');
              doc.setFontSize(14);
              doc.text(
                'Recibido y conforme',
                espaciado * 3,
                altoPagina - altoFirma
              );

              doc.addImage(
                firma,
                'png',
                espaciado * 3,
                altoPagina - altoFirma,
                anchoFirma,
                altoFirma
              );
            }
          }

          // titulo
          doc.setFont('Helvetica');
          doc.setFontSize(28);
          doc.setTextColor('#001398');
          doc.text('Factura', anchoDoc / 2, espaciado * 4, {
            maxWidth: 215,
            align: 'center',
          });

          // fecha
          doc.setTextColor('#999999');
          doc.setFontSize(15);
          doc.text('Factura No.', espaciado * 4, espaciado * 10, {});
          doc.text('Fecha:', espaciado * 4, espaciado * 12, {});

          doc.setTextColor('black');
          doc.setFont('Helvetica', '', 'bold');
          doc.text(
            pPedido.data?.idReferencia!,
            espaciado * 11,
            espaciado * 10,
            {}
          );
          doc.text(
            pPedido.data?.fechaRegistro!,
            espaciado * 11,
            espaciado * 12,
            {}
          );

          // doc.addImage(
          //   '../assets/logo-jjboxpty.png',
          //   'png',
          //   140,
          //   espaciado * 8,
          //   25,
          //   28
          // );

          // datos cliente - tienda
          doc.setTextColor('#001398');
          doc.setDrawColor('#ffffff');
          doc.setFillColor('#c9cffc');
          doc.roundedRect(15, espaciado * 17, 90, 70, 5, 5, 'F');
          doc.roundedRect(110, espaciado * 17, 90, 70, 5, 5, 'F');

          doc.text('Facturado por:', espaciado * 5, espaciado * 19);
          doc.text('Facturado A:', 120, espaciado * 19);

          doc.setTextColor('black');
          doc.text('JJBOXPTY', espaciado * 6, espaciado * 21);
          doc.text('Cliente', 125, espaciado * 21);

          // faturado por
          doc.setFontSize(11);
          doc.setTextColor('#3d3d3d');
          doc.text(
            'Dirección: Pueblo Nuevo, Calle 16, detrás antigua Estrella Azul. (En la entrada de la calle).',
            espaciado * 6,
            espaciado * 23,
            {
              maxWidth: 75,
              align: 'left',
            }
          );
          doc.text('RUC: 4-585-741 DV 01.', espaciado * 6, espaciado * 27, {
            maxWidth: 75,
            align: 'left',
          });
          doc.text('Teléfono: 64252114', espaciado * 6, espaciado * 29, {
            maxWidth: 75,
            align: 'left',
          });

          // facturado a
          doc.setFontSize(11);
          doc.text(
            `Nombre: ${pPedido.data?.cliente.nombre}`,
            125,
            espaciado * 23,
            {
              maxWidth: 75,
              align: 'left',
            }
          );
          doc.text(
            `Correo: ${pPedido.data?.cliente.correo}`,
            125,
            espaciado * 25,
            {
              maxWidth: 75,
              align: 'left',
            }
          );
          doc.text(
            `Teléfono: +507(${pPedido.data?.cliente.telefono})`,
            125,
            espaciado * 27,
            {
              maxWidth: 75,
              align: 'left',
            }
          );

          // tabla
          autoTable(doc, {
            margin: { top: espaciado * 34 },
            styles: { minCellHeight: 12, valign: 'middle' },
            headStyles: { fillColor: [0, 19, 152] },
            footStyles: { fillColor: [255, 255, 255] },
            head: [['#', 'Descripción', 'Precio', 'Delivery', 'Total']],
            body: [
              [
                '1',
                `${pPedido.data?.descripcion}`,
                `${pPedido.data?.precio}`,
                `${pPedido.data?.delivery}`,
                `${pPedido.data?.precio! + pPedido.data?.delivery!}`,
              ],
              [
                {
                  content: `Total: ${
                    pPedido.data?.precio! + pPedido.data?.delivery!
                  }`,
                  colSpan: 5,
                  styles: {
                    halign: 'right',
                    fontSize: 16,
                    textColor: [0, 19, 152],
                    fontStyle: 'bold',
                  },
                },
              ],
            ],
          });

          doc.save('Factura');
          modal.hide();

          setTimeout(() => {
            // console.log(pPedido);

            const dataFactura = {
              idFactura: pPedido.data?.idReferencia,
              fecha: pPedido.data?.fechaRegistro,
              nombreCliente: pPedido.data?.cliente.nombre,
              correoCliente: pPedido.data?.cliente.correo,
              telCliente: pPedido.data?.cliente.telefono,
              descripcion: pPedido.data?.descripcion,
              precio: pPedido.data?.precio,
              delivery: pPedido.data?.delivery,
              total: pPedido.data?.precio! + pPedido.data?.delivery!,
            };
            this.envioFactura(dataFactura);
            Swal.fire('Mensaje', 'Factura enviada al cliente', 'info');
          }, 500);

          this.store.dispatch(
            signatureActions.cerrarSignature({
              firma: { estado: false, firma: '', idPPedido: '' },
            })
          );
        } else {
          Swal.fire(
            'Mensaje',
            'Ocurrió un error al generar la factura',
            'error'
          );
        }
      });
  }

  envioFactura(dataFactura: any): void {
    // console.log(dataFactura);
    const url = `${environment.urlPPedidos}/correoConfirmacionFactura`;
    this.http.post(url, dataFactura).subscribe((resp) => resp);
  }
}
