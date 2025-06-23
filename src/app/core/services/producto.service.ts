import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Producto } from '../models/producto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environment/environment/environment';
import { Page } from 'core/models/page';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private apiUrl = `${environment.apiUrl}` + '/api/productos-magistrales';

  constructor(private http: HttpClient) {}

  getProductosPaginado(
    page: number = 0,
    size: number = 10,
    nombre: string = '',
    minPrecio?: number,
    maxPrecio?: number
  ): Observable<Page<Producto>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (nombre) params = params.set('nombre', nombre);
    if (minPrecio !== undefined) params = params.set('minPrecio', minPrecio);
    if (maxPrecio !== undefined) params = params.set('maxPrecio', maxPrecio);

    return this.http
      .get<Page<Producto>>(`${this.apiUrl}/paginado`, {
        params,
      })
      .pipe(
        map((pageData: Page<Producto>) => ({
          ...pageData,
          content:
            pageData.content?.map((prod: Producto) => ({
              ...prod,
              imagenUrl: prod.imagenUrl
                ? `${environment.apiUrl}${prod.imagenUrl}`
                : '',
            })) ?? [],
        }))
      );
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}`);
  }

  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`).pipe(
      map((prod) => ({
        ...prod,
        imagenUrl: prod.imagenUrl
          ? `${environment.apiUrl}${prod.imagenUrl}`
          : '',
      }))
    );
  }

  agregarProducto(producto: Producto) {
    return this.http.post(`${this.apiUrl}`, producto);
  }

  actualizarProducto(id: number, producto: Producto) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  uploadImagen(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
