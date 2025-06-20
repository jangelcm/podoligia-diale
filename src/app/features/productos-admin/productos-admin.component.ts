import { Component, OnInit } from '@angular/core';
import { Producto } from '../../core/models/producto';
import { ProductoService } from '../../core/services/producto.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './productos-admin.component.html',
  styleUrls: ['./productos-admin.component.css'],
})
export class ProductosAdminComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  filtro: string = '';
  page = 0;
  size = 5;
  totalPages = 0;
  loading = false;

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.productoService.getProductosPaginado(this.page, this.size).subscribe({
      next: (res: any) => {
        this.productos = res.content || res;
        this.totalPages = res.totalPages || 1;
        this.filtrarProductos();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  filtrarProductos() {
    const filtroLower = this.filtro.trim().toLowerCase();
    this.productosFiltrados = this.productos.filter(
      (p) =>
        (p.nombre && p.nombre.toLowerCase().includes(filtroLower)) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(filtroLower))
    );
  }

  // Compatibilidad con el template
  get paginaActual() {
    return this.page;
  }
  get totalPaginas() {
    return this.totalPages;
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 0 || nuevaPagina >= this.totalPages) return;
    this.page = nuevaPagina;
    this.cargarProductos();
  }

  editarProducto(producto: Producto) {
    this.router.navigate(['/productos/editar', producto.id]);
  }

  eliminarProducto(producto: Producto) {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(producto.id!).subscribe({
        next: () => {
          this.cargarProductos();
        },
        error: (err) => {
          alert('Error al eliminar el producto');
          console.error(err);
        },
      });
    }
  }
}
