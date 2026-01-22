import { Component, signal } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Producto } from '../../core/models/producto';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ModalProductoComponent } from './components/modal-producto/modal-producto.component';
import { Page } from 'core/models/page';

@Component({
  selector: 'app-product',
  imports: [
    FormsModule,
    CommonModule,
    ProductCardComponent,
    ModalProductoComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
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
  opcionSeleccionada = signal<number | null>(null);

  opcionesMinimas = [
    { value: null, label: 'Precio mínimo' },
    { value: 10, label: '> S/10' },
    { value: 30, label: '> S/30' },
    { value: 50, label: '> S/50' },
    { value: 100, label: '> S/100' },
    { value: 200, label: '> S/200' },
  ];

  opcionesMaximas = [
    { value: null, label: 'Precio máximo' },
    { value: 10, label: '< S/10' },
    { value: 30, label: '< S/30' },
    { value: 50, label: '< S/50' },
    { value: 100, label: '< S/100' },
    { value: 200, label: '< S/200' },
  ];

  constructor(private productoService: ProductoService) {
    this.cargarProductos();
  }

  cargarProductos() {
    //numero de registros a mostrar
    const size = 9;

    this.loading.set(true);
    this.productoService
      .getProductosPaginado(
        this.page(),
        size,
        this.nombre(),
        this.precioMin() ?? undefined,
        this.precioMax() ?? undefined
      )
      .subscribe((res: Page<Producto>) => {
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
