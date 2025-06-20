import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  TokenResponse,
} from '../../../core/services/security/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  hidePassword = true;
  registering = false;
  registerSuccessMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', []], // Se activa solo en registro
    });
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  showRegister() {
    this.registering = true;
    this.errorMsg = '';
    this.registerSuccessMsg = '';
    this.form.reset();
    this.form
      .get('email')
      ?.setValidators([
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]);
    this.form.get('email')?.updateValueAndValidity();
  }

  showLogin() {
    this.registering = false;
    this.errorMsg = '';
    this.registerSuccessMsg = '';
    this.form.reset();
    this.form.get('email')?.clearValidators();
    this.form.get('email')?.updateValueAndValidity();
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.registerSuccessMsg = '';
    if (this.registering) {
      const { username, password, email } = this.form.value;
      this.auth.register({ username, password, email }).subscribe({
        next: () => {
          this.registerSuccessMsg =
            '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.';
          this.loading = false;
          setTimeout(() => this.showLogin(), 1500);
        },
        error: (err) => {
          this.errorMsg = err?.error?.detalle || 'No se pudo crear la cuenta';
          this.loading = false;
        },
      });
    } else {
      const { username, password } = this.form.value;
      this.auth.login({ username, password }).subscribe({
        next: (res: TokenResponse) => {
          this.auth.processAuthResponse(res);
          this.router.navigate(['/']);
          this.loading = false;
        },
        error: (error) => {
          this.errorMsg = 'Usuario o contraseña incorrectos';
          this.loading = false;
        },
      });
    }
  }

  ingresarInvitado() {
    this.router.navigate(['/']);
  }
}
