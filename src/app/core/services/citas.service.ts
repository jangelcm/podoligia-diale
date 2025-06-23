import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita } from 'core/models/cita';
import { environment } from '../../../environment/environment/environment';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private apiUrl = `${environment.apiUrl}` + '/api/citas';

  constructor(private http: HttpClient) {}

  getCitas() {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  getCitasPorFecha(fecha: string) {
    return this.http.get<Cita[]>(`${this.apiUrl}?fecha=${fecha}`);
  }

  reservarCita(cita: Cita) {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  getCitasPorUsuario(username: string) {
    return this.http.get<Cita[]>(`${this.apiUrl}/usuario/${username}`);
  }
}
