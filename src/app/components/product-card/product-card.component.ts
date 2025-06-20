import { Component, input, output } from '@angular/core';
import { Producto } from '../../core/models/producto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  producto = input.required<Producto>();
  agregarProducto = output<Producto>();

  comprar(producto: Producto): void {
    this.agregarProducto.emit(producto);
  }
}
