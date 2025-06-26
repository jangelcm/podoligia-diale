export class Cita {
  id?: number;
  nombre?: string;
  email?: string;
  fecha?: string; // formato YYYY-MM-DD
  hora?: string; // formato HH:mm
  username?: string;
  estado?: string = 'Pendiente'; // Pendiente, Confirmada, Cancelada
  codigoEstado?: number;
  constructor(init?: Partial<Cita>) {
    Object.assign(this, init);
  }
}
