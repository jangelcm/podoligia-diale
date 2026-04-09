import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-taller',
  templateUrl: './taller.component.html',
  styleUrls: ['./taller.component.css'],
  imports: [CommonModule, FormsModule],
})
export class TallerComponent implements OnInit {
  // Variables de control de estado del formulario
  codeInput = '';
  codeCorrect = false;
  codeError = false;

  // Cambia este valor por tu código secreto
  private readonly SECRET_CODE = 'DIALE2026';

  constructor() { }

  /**
   * Método que verifica el código ingresado por el alumno
   */
  checkCode() {
    if (this.codeInput === this.SECRET_CODE) {
      this.codeCorrect = true;
      this.codeError = false;
      // Guardar en sessionStorage para mantener acceso en la sesión actual
      sessionStorage.setItem('taller_access', '1');
      sessionStorage.setItem('taller_access_time', Date.now().toString());
    } else {
      this.codeError = true;
      this.codeCorrect = false;
    }
  }

  /**
   * Ciclo de vida: Al iniciar el componente, verifica si el alumno ya tiene acceso
   */
  ngOnInit() {
    // Si ya tiene acceso en sessionStorage, mostrar contenido
    if (sessionStorage.getItem('taller_access') === '1') {
      this.codeCorrect = true;
      // Validar acceso y expiración (1 hora)
      const access = sessionStorage.getItem('taller_access');
      const accessTime = sessionStorage.getItem('taller_access_time');
      if (access === '1' && accessTime) {
        const now = Date.now();
        const elapsed = now - Number(accessTime);
        const oneHour = 60 * 60 * 1000;
        if (elapsed < oneHour) {
          this.codeCorrect = true;
        } else {
          // Expiró el acceso
          sessionStorage.removeItem('taller_access');
          sessionStorage.removeItem('taller_access_time');
        }
      }
    }
  }
}