import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule para directivas como @if, @for
import { RouterLink } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { FechaDDMMYYYY } from 'shared/pipes/fechaDDMMYYYY.pipe';

// Define una interfaz sencilla para estructurar tus horarios
export interface Horario {
  hora: string;       // Valor legible para el usuario (ej: '2:00 PM')
  valor: string;      // Valor de 24h para WhatsApp y lógica (ej: '14:00')
  disponible: boolean; // Para controlar si el botón está activo
}
@Component({
  selector: 'app-citas',
  standalone: true,
  // Asegúrate de incluir CommonModule y tu componente de calendario aquí
  imports: [CommonModule, RouterLink, CalendarComponent, FechaDDMMYYYY /*, FechaDDMMYYYYPipe */],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'] // Si usas estilos CSS
})
export class CitasComponent implements OnInit {

  // --- DATOS Y ESTADOS ---

  // Guardamos el rol para simular la vista del usuario
  userRole: 'USER' | 'ADMIN' = 'USER';

  // Fecha seleccionada en el calendario (empieza en null)
  selectedDate: string = '';

  // Hora seleccionada por el usuario (empieza en null)
  horaSeleccionada: string | null = null; // Guardará el 'valor' (ej: '14:00')

  // Variable simulada para 'Mis Citas'
  citas: any[] = [];

  // Variables simuladas para el calendario (app-calendar)
  meses: any[] = [];
  diasNoDisponibles: Date[] = []; // Ejemplo: [new Date(2024, 9, 26), new Date(2024, 9, 27)]


  // --- TUS HORARIOS FIJOS ---

  // Definimos tus 4 horarios como objetos estructurados
  // Todos están 'disponibles: true' porque no hay lógica de backend.
  horariosEstablecidos: Horario[] = [
    { hora: '2:00 PM', valor: '14:00', disponible: true },
    { hora: '4:00 PM', valor: '16:00', disponible: true },
    { hora: '6:00 PM', valor: '18:00', disponible: true },
    { hora: '7:30 PM', valor: '19:30', disponible: true }
  ];

  // Número de teléfono de la podóloga (formato internacional sin el +)
  // Reemplázalo por tu número real
  telefonoPodologa: string = '51903379990';


  constructor() { }

  ngOnInit(): void {
    this.generarMeses(); // Generamos los meses para el calendario
  }

  /**
   * Se ejecuta cuando el usuario selecciona una fecha en <app-calendar>
   * @param date La fecha seleccionada (string)
   */
  onDateChange(date: string): void {
    this.selectedDate = date;
    this.horaSeleccionada = null; // IMPORTANTE: Reiniciar la hora si cambia la fecha
  }

  /**
   * Se ejecuta cuando el usuario selecciona una hora
   * @param valor El valor de 24h de la hora seleccionada (ej: '14:00')
   */
  selectHora(valor: string): void {
    this.horaSeleccionada = valor;
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

  /**
   * Crea el mensaje profesional y abre WhatsApp con los datos seleccionados
   */
  abrirWhatsApp(): void {
    if (!this.selectedDate || !this.horaSeleccionada) {
      console.error('Error: Debes seleccionar fecha y hora antes de agendar.');
      return; // Detener si falta información
    }

    // A. Formatear la fecha para que sea profesional (ej: Viernes, 25 de Octubre de 2024)
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    const fechaFormateada = new Date(this.selectedDate).toLocaleDateString('es-ES', opcionesFecha);

    // B. Crear el mensaje personalizado y profesional
    const mensaje = `¡Hola! Me gustaría reservar una cita de podología en Clínica Diale para el día *${fechaFormateada}* a las *${this.horaSeleccionada}* horas.`;

    // C. Generar la URL de WhatsApp (codificando el mensaje)
    const urlWa = `https://wa.me/${this.telefonoPodologa}?text=${encodeURIComponent(mensaje)}`;

    // D. Abrir la URL en una nueva pestaña
    window.open(urlWa, '_blank');
  }
}