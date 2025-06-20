import { Injectable, signal } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<{ producto: Producto; cantidad: number }[]>([]);

  getCart() {
    return this.items();
  }

  addToCart(producto: Producto, cantidad: number = 1) {
    const current = this.items();
    const idx = current.findIndex((i) => i.producto.id === producto.id);
    if (idx > -1) {
      current[idx].cantidad += cantidad;
    } else {
      current.push({ producto, cantidad });
    }
    this.items.set([...current]);
  }

  updateQuantity(productoId: number, cantidad: number) {
    const current = this.items();
    const idx = current.findIndex((i) => i.producto.id === productoId);
    if (idx > -1) {
      current[idx].cantidad = cantidad;
      if (cantidad <= 0) current.splice(idx, 1);
      this.items.set([...current]);
    }
  }

  removeFromCart(productoId: number) {
    const current = this.items().filter((i) => i.producto.id !== productoId);
    this.items.set(current);
  }

  clearCart() {
    this.items.set([]);
  }

  getTotal() {
    return this.items().reduce(
      (acc, item) => acc + item.producto.precio! * item.cantidad,
      0
    );
  }
}
