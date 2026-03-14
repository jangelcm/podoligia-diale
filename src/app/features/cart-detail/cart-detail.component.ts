import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PedidoItemRequest } from 'core/models/pedido-item';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.css',
})
export class CartDetailComponent {
  mostrarPago = false;
  medioSeleccionado: 'yape' | 'transferencia' | 'contraentrega' | null = null;
  mensajeCompra = '';

  pagoForm: FormGroup;

  cart: any[] = [];

  get total() {
    return this.cartService.getTotal();
  }

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.cart = this.cartService.getCart();
    this.pagoForm = this.fb.group({
      direccionEnvio: ['', Validators.required],
      telefonoContacto: [
        '',
        [Validators.required, Validators.pattern(/^9\d{8}$/)],
      ],
    });
  }

  iraPagar() {
    this.mostrarPago = true;
    this.medioSeleccionado = null;
    this.mensajeCompra = '';
  }

  cerrarPago() {
    this.mostrarPago = false;
  }

  seleccionarMedio(medio: 'yape' | 'transferencia' | 'contraentrega') {
    this.medioSeleccionado = medio;
    this.mensajeCompra = '';
  }

  confirmarCompra() {
    if (this.pagoForm.invalid || !this.medioSeleccionado) {
      this.mensajeCompra = 'Por favor completa el formulario y selecciona un medio de pago.';
      return;
    }
    this.cuerpoConfirmacionCompraWssp(this.medioSeleccionado);
  }

  confirmarCompraEntrega() {
    this.mensajeCompra = '¡Compra registrada! Paga al recibir tu pedido.';

    setTimeout(() => {
      this.cartService.clearCart();
      this.cart = [];
      setTimeout(() => {
        this.cerrarPago();
        this.irProductos();
      }, 2500);
    }, 1500);
  }


  updateCantidad(productoId: number, cant: Event) {
    const cantidad = cant.target as HTMLInputElement;
    const value = parseInt(cantidad.value, 10);
    if (!isNaN(value) && value > 0) {
      this.cartService.updateQuantity(productoId, value);
      this.cart = this.cartService.getCart();
    }
  }

  incrementarCantidad(productoId: number, actual: number) {
    this.cartService.updateQuantity(productoId, actual + 1);
    this.cart = this.cartService.getCart();
  }

  decrementarCantidad(productoId: number, actual: number) {
    if (actual > 1) {
      this.cartService.updateQuantity(productoId, actual - 1);
      this.cart = this.cartService.getCart();
    }
  }

  enviarWhatsapp() {
    if (!this.cart.length) return;
    let mensaje = '¡Hola! Quiero realizar un pedido:%0A';
    this.cart.forEach((item, idx) => {
      mensaje += `${idx + 1}. ${item.producto.nombre} x${item.cantidad} - S/ ${(
        item.producto.precio * item.cantidad
      ).toFixed(2)}%0A`;
    });
    mensaje += `%0ATotal: S/ ${this.total.toFixed(2)}`;
    const telefono = '51903379990';
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  remove(productoId: number) {
    this.cartService.removeFromCart(productoId);
    this.cart = this.cartService.getCart();
  }

  irProductos() {
    this.router.navigate(['/productos/list']);
  }

  cuerpoConfirmacionCompraWssp(medioSeleccionado: 'yape' | 'transferencia' | 'contraentrega') {
    const telefono = "51903379990";
    const items = this.cart.map(i => `- ${i.producto.nombre} (x${i.cantidad})`).join('\n');

    const mensaje = `¡Hola Diale! 👋\n\n` +
      `Deseo confirmar mi pedido:\n` +
      `${items}\n\n` +
      `*Total:* ${this.total}\n` +
      `*Dirección:* ${this.pagoForm.value.direccionEnvio}\n` +
      `*Método de pago:* ${medioSeleccionado.toUpperCase()}\n\n` +
      (medioSeleccionado !== 'contraentrega' ? `✅ Ya tengo la captura del pago lista para enviarla.` : '');

    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }
}
