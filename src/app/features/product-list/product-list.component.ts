import { Component, signal } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../core/models/producto';
import { ModalProductoComponent } from '../../components/modal-producto/modal-producto.component';

@Component({
  selector: 'app-product-list',
  imports: [
    ProductCardComponent,
    FormsModule,
    CommonModule,
    ModalProductoComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  productos = signal<any[]>([]);
  totalPages = signal(0);
  page = signal(0);
  nombre = signal('');
  precioMin = signal<number | null>(null);
  precioMax = signal<number | null>(null);
  imagenUrl = signal<string | null>(null);
  loading = signal(false);
  modalAbierto = signal(false);
  productoSeleccionado = signal<Producto | null>(null);

  constructor(private productoService: ProductoService) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading.set(true);
    this.productoService
      .getProductosPaginado(
        this.page(),
        10,
        this.nombre(),
        this.precioMin() ?? undefined,
        this.precioMax() ?? undefined
      )
      .subscribe((res: any) => {
        this.productos.set(res.content);
        this.totalPages.set(res.totalPages);
        this.loading.set(false);
      });
  }

  filtrar() {
    this.page.set(0);
    this.cargarProductos();
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.page() + delta;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages()) {
      this.page.set(nuevaPagina);
      this.cargarProductos();
    }
  }

  abrirModal(producto: Producto) {
    this.productoSeleccionado.set(producto);
    this.modalAbierto.set(true);
  }
  cerrarModal = () => {
    this.modalAbierto.set(false);
    this.productoSeleccionado.set(null);
  };
  agregarProducto(producto: Producto) {
    this.abrirModal(producto);
  }
}
