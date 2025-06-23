import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Producto } from 'core/models/producto';
import { PedidoItemRequest } from 'core/models/pedido-item';
import { Pedido } from 'core/models/pedido';
import { environment } from '../../../environment/environment/environment';

export interface PedidoRequest {
  items: PedidoItemRequest[];
  direccionEnvio: string;
  telefonoContacto: string;
}

export interface PedidoProducto {
  id: number;
  pedido: Pedido;
  producto: Producto;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private url = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  crearPedido(request: PedidoRequest, comprobante: File): Observable<Pedido> {
    const formData = new FormData();

    let body = {
      items: request.items,
      direccionEnvio: request.direccionEnvio,
      telefonoContacto: request.telefonoContacto,
    };

    const jsonBlob = new Blob([JSON.stringify(body)], {
      type: 'application/json',
    });

    formData.append('request', jsonBlob);
    if (comprobante) {
      formData.append('comprobante', comprobante);
    }

    return this.http.post<Pedido>(this.url + '/api/pedidos', formData);
  }

  getMisPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}` + '/api/pedidos/mios').pipe(
      map((pedido: Pedido[]) =>
        pedido.map((item: Pedido) => ({
          ...item,
          comprobanteUrl: this.url + item.comprobanteUrl,
        }))
      )
    );
  }

  getPedidosPaginados(
    page: number,
    size: number,
    fechaPedido: string
  ): Observable<any> {
    return this.http
      .get<any>(`${this.url}/api/pedidos/paginado`, {
        params: {
          page: page.toString(),
          size: size.toString(),
          fechaPedido,
        },
      })
      .pipe(
        map((res: any) => {
          if (res && res.content) {
            res.content = res.content.map((item: any) => ({
              ...item,
              comprobanteUrl: item.comprobanteUrl
                ? this.url + item.comprobanteUrl
                : null,
            }));
          }
          return res;
        })
      );
  }
}
