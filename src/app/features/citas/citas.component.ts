import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitasService } from '../../core/services/citas.service';
import { CalendarComponent } from './calendar.component';
import { AuthService } from 'core/services/security/auth.service';
import { AuthHelper } from '../../core/helpers/auth.helper';
import { FechaDDMMYYYY } from 'shared/pipes/fechaDDMMYYYY.pipe';
import { Cita } from 'core/models/cita';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarComponent,
    FechaDDMMYYYY,
  ],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css',
})
export class CitasComponent {
  meses: any[] = [];
  selectedDate: string = '';
  horaSeleccionada: string | null = null;
  horariosDisponibles: { hora: string; disponible: boolean }[] = [];
  diasNoDisponibles: string[] = [];
  citas: Cita[] = [];
  mensaje: string = '';
  reservando = false;
  form: FormGroup;
  userRole: string = '';
  username: string = '';

  estadoEditando: { [id: number]: boolean } = {};
  nuevoEstado: { [id: number]: string } = {};
  citaSeleccionadaId: number | null = null;
  mensajeEstado: string = '';

  // Filtros para paginado
  filtroFecha: string = '';
  filtroEstado: string = '';
  pagina: number = 0;
  totalPaginas: number = 1;
  pageSize: number = 10;
  citasPaginadas: Cita[] = [];

  constructor(
    private fb: FormBuilder,
    private citasService: CitasService,
    private auth: AuthService
  ) {
    this.userRole = AuthHelper.getUserRole(this.auth.getAccessToken());
    this.username = AuthHelper.getUsername(this.auth.getAccessToken());
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.generarMeses();
    this.cargarMisCitasUsuario();
    // Autocompletar email si es USER
    if (this.userRole === 'USER') {
      const email = AuthHelper.decodeToken(this.auth.getAccessToken())?.email;
      if (email) {
        this.form.get('email')?.setValue(email);
        this.form.get('email')?.disable();
      }
    }
  }

  ngOnInit() {
    const hoy = new Date();
    this.filtroFecha = hoy.toISOString().slice(0, 10);
    if (this.userRole === 'ADMIN') {
      this.cargarCitasPaginadas();
    }
  }

  mostrarSelectEstado(cita: any) {
    this.estadoEditando[cita.id] = true;
    this.nuevoEstado[cita.id] = cita.estado;
  }

  cambiarEstado(idCita: number) {
    this.citaSeleccionadaId = idCita;
  }

  ejecutarCambioEstado(cita: any) {
    this.citasService
      .actualizarEstadoCita(cita.id, this.nuevoEstado[cita.id])
      .subscribe({
        next: (citaActualizada) => {
          this.mensajeEstado = `La cita Nro: ${cita.id} fue actualizada a ${citaActualizada.estado}`;
          setTimeout(() => {
            this.mensajeEstado = '';
          }, 1500);
          this.estadoEditando[cita.id] = false;
          this.citaSeleccionadaId = null;
          this.cargarCitasPaginadas(); // Recargar citas paginadas
          // Actualiza la lista de citas si es necesario
        },
        error: (err) => {
          this.mensajeEstado = 'Error al actualizar el estado';
          this.citaSeleccionadaId = null;
        },
      });
  }

  generarMeses() {
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
    const mesesAMostrar = 2;
    this.meses = [];
    for (let i = 0; i < mesesAMostrar; i++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + i, 1);
      const nombre = fecha.toLocaleString('es-PE', { month: 'long' });
      const anio = fecha.getFullYear();
      const primerDia = new Date(anio, fecha.getMonth(), 1).getDay();
      const diasEnMes = new Date(anio, fecha.getMonth() + 1, 0).getDate();
      const dias = [];
      for (let d = 0; d < primerDia; d++)
        dias.push({ numero: '', fecha: '', disponible: false });
      for (let d = 1; d <= diasEnMes; d++) {
        const fechaStr = `${anio}-${(fecha.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        // Deshabilitar días anteriores a hoy
        const disponible = fechaStr >= hoyStr;
        dias.push({ numero: d, fecha: fechaStr, disponible });
      }
      this.meses.push({
        nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
        anio,
        dias,
      });
    }
  }

  cargarMisCitasUsuario() {
    console.log('Cargando citas para el usuario:', this.userRole);
    if (this.userRole === 'USER') {
      this.citasService
        .getCitasPorUsuario(this.username)
        .subscribe((citas: Cita[]) => {
          this.citas = citas;
          this.marcarDiasNoDisponibles();
        });
    } else {
      this.citas = [];
      this.marcarDiasNoDisponibles();
    }
  }

  cargarCitasPaginadas() {
    this.citasService
      .getCitasPaginadas(
        this.pagina,
        this.pageSize,
        this.filtroFecha,
        this.filtroEstado
      )
      .subscribe((res) => {
        this.citasPaginadas = res.content || [];
        this.totalPaginas = res.totalPages || 1;
      });
  }

  onFiltroFechaChange(fecha: Event) {
    const fechaTarget = fecha.target as HTMLInputElement;
    this.filtroFecha = fechaTarget.value;
    this.pagina = 0;
    this.cargarCitasPaginadas();
  }

  onFiltroEstadoChange(estado: string) {
    this.filtroEstado = estado;
    this.pagina = 0;
    this.cargarCitasPaginadas();
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.pagina + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPaginas) {
      this.pagina = nuevaPagina;
      this.cargarCitasPaginadas();
    }
  }

  marcarDiasNoDisponibles() {
    // Un día no está disponible si todos los horarios están reservados
    const horarios = this.generarHorarios();
    const reservasPorDia: Record<string, number> = {};
    for (const cita of this.citas) {
      reservasPorDia[cita.fecha!] = (reservasPorDia[cita.fecha!] || 0) + 1;
    }
    this.diasNoDisponibles = Object.entries(reservasPorDia)
      .filter(([fecha, count]) => count >= horarios.length)
      .map(([fecha]) => fecha);
    // Marcar en this.meses
    for (const mes of this.meses) {
      for (const dia of mes.dias) {
        if (this.diasNoDisponibles.includes(dia.fecha)) dia.disponible = false;
      }
    }
  }

  onDateChange(fecha: string) {
    this.selectedDate = fecha;
    this.horaSeleccionada = null;
    this.generarHorariosDisponibles();
  }

  generarHorarios() {
    const horarios: string[] = [];
    for (let h = 9; h <= 18; h += 2) {
      horarios.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return horarios;
  }

  generarHorariosDisponibles() {
    const horarios = this.generarHorarios();
    const reservas = this.citas
      .filter((c) => c.fecha === this.selectedDate)
      .map((c) => c.hora);
    this.horariosDisponibles = horarios.map((hora) => ({
      hora,
      disponible: !reservas.includes(hora),
    }));
  }

  selectHora(hora: any) {
    if (hora.disponible) {
      this.horaSeleccionada = hora.hora;
    }
  }

  reservarCita() {
    if (this.form.invalid || !this.selectedDate || !this.horaSeleccionada)
      return;
    this.reservando = true;
    const cita = new Cita({
      nombre: this.form.value.nombre,
      email: this.form.get('email')?.value,
      fecha: this.selectedDate,
      hora: this.horaSeleccionada,
      username: this.username || undefined,
    });

    this.citasService.reservarCita(cita).subscribe({
      next: (res) => {
        this.mensaje = '¡Cita reservada exitosamente!';
        this.cargarMisCitasUsuario();
        this.form.reset();

        setTimeout(() => {
          // Limpiar campos después de 1 segundo
          this.horaSeleccionada = null;
        }, 1000);

        this.reservando = false;
        // Si es USER, volver a setear el email y deshabilitar
        if (this.userRole === 'USER') {
          const email = AuthHelper.decodeToken(
            this.auth.getAccessToken()
          )?.email;
          if (email) {
            this.form.get('email')?.setValue(email);
            this.form.get('email')?.disable();
          }
        }
      },
      error: () => {
        this.mensaje = 'Error al reservar la cita. Intenta nuevamente.';
        this.reservando = false;
      },
    });
  }
}
