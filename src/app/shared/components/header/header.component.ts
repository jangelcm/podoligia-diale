import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/security/auth.service';
import { AuthHelper } from 'core/helpers/auth.helper';
import { CartService } from 'core/services/cart.service';
import { ClickOutsideDirective } from 'shared/directives/click-outside.directive';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isDarkMode = false;
  menuOpen = false;
  userMenuOpen = false;
  cartCount = signal(0);
  constructor(
    private auth: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    effect(() => {
      this.cartCount.set(this.cartService.getCart().length);
    });
  }

  onBlur() {
    console.log('onBlur');
    setTimeout(() => {
      this.userMenuOpen = false;
    }, 200);
  }

  onBlurPanelMenu() {
    this.menuOpen = false;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  isLoggedIn(): boolean {
    return !!this.auth.getAccessToken();
  }

  getUsername(): string {
    return AuthHelper.getUsername(this.auth.getAccessToken());
  }

  getUserRole(): string {
    return AuthHelper.getUserRole(this.auth.getAccessToken());
  }

  logout() {
    this.auth.logout();
    this.userMenuOpen = false;
    this.cartService.clearCart();
    this.router.navigate(['/login']);
  }
}
