import { Component, input, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { Producto } from '../../core/models/producto';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss'],
})
export class ModalProductoComponent {
  product = input.required<Producto>();

  @Input() close: () => void = () => {};
  cantidad: number = 1;
  mensaje: string = '';

  constructor(private cartService: CartService, private router: Router) {}

  closeDialog() {
    if (this.close) this.close();
  }

  addToCart() {
    if (
      this.product &&
      this.product().stock &&
      this.cantidad > (this.product()?.stock || 0)
    ) {
      this.mensaje = 'No hay suficiente stock disponible.';
      return;
    }
    this.cartService.addToCart(this.product(), this.cantidad);
    this.mensaje = '¡Producto añadido al carrito!';

    setTimeout(() => {
      this.closeDialog();
    }, 600);
  }

  enviarWhatsapp() {
    if (!this.product) return;
    let mensaje = '¡Hola! Quiero realizar un pedido:%0A';

    const totalPorProducto = this.product().precio! * this.cantidad;

    mensaje += `1. ${this.product().nombre} x${
      this.cantidad
    } - S/ ${totalPorProducto.toFixed(2)}%0A`;
    const telefono = '51916541671';
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  goToCart() {
    this.addToCart();
    // Aquí podrías navegar al carrito si tienes router, o cerrar el modal y notificar al padre
    // Por ejemplo: this.router.navigate(['/carrito']);
    // O simplemente cerrar el modal:
    this.closeDialog();
    this.router.navigate(['/carrito']);
  }
}
