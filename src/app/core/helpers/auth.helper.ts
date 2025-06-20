export class AuthHelper {
  static decodeToken(token: string | null): any {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  static getUsername(token: string | null): string {
    const payload = this.decodeToken(token);
    return payload?.sub || payload?.username || '';
  }

  static getUserRole(token: string | null): string {
    const payload = this.decodeToken(token);
    return payload?.role || payload?.rol || payload?.authorities?.[0] || '';
  }
}
