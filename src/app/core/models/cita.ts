export class Cita {
  id?: string;
  nombre?: string;
  email?: string;
  fecha?: string; // formato YYYY-MM-DD
  hora?: string; // formato HH:mm
  username?: string;
  constructor(init?: Partial<Cita>) {
    Object.assign(this, init);
  }
}
