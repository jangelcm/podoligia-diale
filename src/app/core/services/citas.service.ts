import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita } from 'core/models/cita';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private url = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}

  getCitas() {
    return this.http.get<Cita[]>(this.url);
  }

  getCitasPorFecha(fecha: string) {
    return this.http.get<Cita[]>(`${this.url}?fecha=${fecha}`);
  }

  reservarCita(cita: Cita) {
    return this.http.post<Cita>(this.url, cita);
  }

  getCitasPorUsuario(username: string) {
    return this.http.get<Cita[]>(`${this.url}/usuario/${username}`);
  }
}
