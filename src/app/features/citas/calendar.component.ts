import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cita } from 'core/models/cita';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <div
        *ngIf="mesesMostrados.length === 1"
        class="flex items-center justify-between w-full mb-2"
      >
        <button
          (click)="prevMes()"
          class="p-2 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-800 transition text-cyan-700 dark:text-cyan-300"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span class="font-bold text-cyan-700 dark:text-cyan-300"
          >{{ mesesMostrados[0]?.nombre }} {{ mesesMostrados[0]?.anio }}</span
        >
        <button
          (click)="nextMes()"
          class="p-2 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-800 transition text-cyan-700 dark:text-cyan-300"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <ng-container *ngFor="let mes of mesesMostrados">
        <div
          class="bg-white dark:bg-gray-900 rounded-xl shadow p-4 w-full md:w-80"
        >
          <div
            *ngIf="mesesMostrados.length !== 1"
            class="flex justify-between items-center mb-2"
          >
            <span class="font-bold text-cyan-700 dark:text-cyan-300"
              >{{ mes.nombre }} {{ mes.anio }}</span
            >
          </div>
          <div
            class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 dark:text-gray-400 mb-1"
          >
            <span *ngFor="let d of diasSemana">{{ d }}</span>
          </div>
          <div class="grid grid-cols-7 gap-1">
            <ng-container *ngFor="let dia of mes.dias">
              <button
                class="rounded-lg p-2 w-8 h-8 font-semibold transition text-gray-700 dark:text-gray-100"
                [ngClass]="{
                  'bg-cyan-600 text-white': dia.fecha === selectedDate,
                  'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed':
                    !dia.disponible,
                  'hover:bg-cyan-100 dark:hover:bg-cyan-800':
                    dia.disponible && dia.fecha !== selectedDate
                }"
                [disabled]="!dia.disponible"
                (click)="onDiaClick(dia)"
              >
                {{ dia.numero || '' }}
              </button>
            </ng-container>
          </div>
        </div>
      </ng-container>
      <div
        *ngIf="mensaje"
        class="mt-2 text-red-600 dark:text-red-400 font-semibold"
      >
        {{ mensaje }}
      </div>
    </div>
  `,
  styleUrls: [],
})
export class CalendarComponent {
  @Input() selectedDate: string = '';
  @Input() meses: any[] = [];
  @Input() diasNoDisponibles: string[] = [];
  @Input() citas: Cita[] = [];
  @Output() dateChange = new EventEmitter<string>();

  diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  mensaje = '';
  mesOffset = 0;

  get mesesMostrados() {
    const mesesAMostrar = 2;
    return this.meses.slice(this.mesOffset, this.mesOffset + mesesAMostrar);
  }

  selectDate(fecha: string) {
    this.dateChange.emit(fecha);
  }

  onDiaClick(dia: any) {
    if (!dia.disponible) {
      this.mensaje = 'Este día ya no tiene horarios disponibles.';
      setTimeout(() => (this.mensaje = ''), 2500);
      return;
    }
    this.mensaje = '';
    this.dateChange.emit(dia.fecha);
  }

  prevMes() {
    if (this.mesOffset > 0) this.mesOffset--;
  }
  nextMes() {
    const mesesAMostrar = window.innerWidth >= 768 ? 2 : 1;
    if (this.mesOffset + mesesAMostrar < this.meses.length) this.mesOffset++;
  }
}
