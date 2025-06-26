import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita } from 'core/models/cita';
import { environment } from '../../../environment/environment/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private apiUrl = `${environment.apiUrl}` + '/api/citas';

  constructor(private http: HttpClient) {}

  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  getCitasPorFecha(fecha: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(
      `${this.apiUrl}?fecha=${encodeURIComponent(fecha)}`
    );
  }

  reservarCita(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  getCitasPorUsuario(username: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(
      `${this.apiUrl}/usuario/${encodeURIComponent(username)}`
    );
  }

  actualizarEstadoCita(id: number, nuevoEstado: string): Observable<Cita> {
    return this.http.patch<Cita>(`${this.apiUrl}/${id}/estado`, {
      estado: nuevoEstado,
    });
  }

  /**
   * Obtiene citas paginadas con filtros opcionales de fecha y estado.
   * @param page Página (por defecto 0)
   * @param size Tamaño de página (por defecto 10)
   * @param fecha Fecha en formato YYYY-MM-DD (opcional)
   * @param estado Estado de la cita (opcional)
   */
  getCitasPaginadas(
    page: number = 0,
    size: number = 10,
    fecha?: string,
    estado?: string
  ): Observable<{
    content: Cita[];
    totalElements: number;
    totalPages: number;
    number: number;
  }> {
    const params: Record<string, string | number> = { page, size };
    if (fecha) params['fecha'] = fecha;
    if (estado) params['estado'] = estado;
    return this.http.get<{
      content: Cita[];
      totalElements: number;
      totalPages: number;
      number: number;
    }>(`${this.apiUrl}/paginado`, { params });
  }
}
