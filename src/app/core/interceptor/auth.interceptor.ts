import { inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
  HttpInterceptorFn,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/security/auth.service';
import { Router } from '@angular/router';
import { RestApiException } from 'core/models/rest-api-exception.interface';
import { ToastService } from 'core/services/general/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  auth = inject(AuthService);
  router = inject(Router);
  toast = inject(ToastService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.auth.getAccessToken();
    let authReq = req;

    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((err) => {
        const error: RestApiException = err.error;
        if (
          error.estado === 401 &&
          (error.titulo === 'Token expirado' ||
            error.titulo === 'No autorizado')
        ) {
          this.toast.show(error.detalle);
          setTimeout(() => {
            this.auth.logout();
            this.router.navigate(['/login']);
          }, 3000);
        }
        return throwError(() => err);
      })
    );
  }
}

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const interceptor = inject(AuthInterceptor);
  // Wrap the HttpHandlerFn as an object with a handle method
  const handler: HttpHandler = { handle: (r) => next(r) };
  return interceptor.intercept(req, handler);
};
