import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from 'core/services/security/auth.service';
import { AuthHelper } from 'core/helpers/auth.helper';

@Pipe({ name: 'userRole', standalone: true })
export class UserRolePipe implements PipeTransform {
  constructor(private auth: AuthService) {}
  transform(pipe: string): string {
    const rol = AuthHelper.getUserRole(this.auth.getAccessToken());
    if (!rol) {
      return 'Invitado';
    }
    return rol;
  }
}
