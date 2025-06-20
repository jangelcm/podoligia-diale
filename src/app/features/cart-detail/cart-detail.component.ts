import { Component } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PedidoItemRequest } from 'core/models/pedido-item';
import { PedidoRequest, PedidoService } from 'core/services/pedido.service';
import { Producto } from 'core/models/producto';

@Component({
  selector: 'app-cart-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './cart-detail.component.html',
  styleUrl: './cart-detail.component.css',
})
export class CartDetailComponent {
  mostrarPago = false;
  medioSeleccionado: 'yape' | 'transferencia' | 'entrega' | null = null;
  comprobanteFile: File | null = null;
  comprobantePreview: string | null = null;
  mensajeCompra = '';

  pagoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private pedidoService: PedidoService,
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
    this.comprobanteFile = null;
    this.comprobantePreview = null;
    this.mensajeCompra = '';
  }

  cerrarPago() {
    this.mostrarPago = false;
  }

  seleccionarMedio(medio: 'yape' | 'transferencia' | 'entrega') {
    this.medioSeleccionado = medio;
    this.comprobanteFile = null;
    this.comprobantePreview = null;
    this.mensajeCompra = '';
  }

  onComprobanteSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.comprobanteFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) =>
        (this.comprobantePreview = reader.result as string);
      reader.readAsDataURL(this.comprobanteFile);
    }
  }

  confirmarCompra() {
    if (!this.comprobanteFile) return;
    if (this.pagoForm.invalid) {
      this.mensajeCompra = 'Debe ingresar dirección y teléfono.';
      return;
    }
    const items: PedidoItemRequest[] = this.cart.map(
      (item: { producto: Producto; cantidad: number }) =>
        new PedidoItemRequest(item.producto.id, item.cantidad)
    );

    const request: PedidoRequest = {
      items,
      direccionEnvio: this.pagoForm.get('direccionEnvio')?.value,
      telefonoContacto: this.pagoForm.get('telefonoContacto')?.value,
    };
    this.pedidoService.crearPedido(request, this.comprobanteFile).subscribe({
      next: () => {
        this.mensajeCompra =
          '¡Compra realizada! Pronto confirmaremos tu pedido.';
        this.cartService.clearCart();
        this.cart = [];
        setTimeout(() => {
          this.cerrarPago();
          this.irProductos();
        }, 2000);
      },
      error: () => {
        this.mensajeCompra =
          'Error al registrar el pedido. Intente nuevamente.';
      },
    });
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

  cart: any[] = [];

  get total() {
    return this.cartService.getTotal();
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
    const telefono = '51916541671';
    const url = `https://wa.me/${telefono}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  remove(productoId: number) {
    this.cartService.removeFromCart(productoId);
    this.cart = this.cartService.getCart();
  }

  irProductos() {
    this.router.navigate(['/productos/list']); // o window.history.back();
  }
}
