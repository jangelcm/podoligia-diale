import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PedidoService } from 'core/services/pedido.service';
import { Pedido } from 'core/models/pedido';
import { FormsModule } from '@angular/forms';
import { Page } from 'core/models/page';

@Component({
  selector: 'app-ventas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas-admin.component.html',
  styleUrl: './ventas-admin.component.css',
})
export class VentasAdminComponent implements OnInit {
  ventas: Pedido[] = [];
  loading = false;
  error = '';
  fechaSeleccionada: string = '';

  page = signal(0);
  totalPages = signal(0);

  constructor(private http: HttpClient, private pedidoService: PedidoService) {}

  ngOnInit() {
    const hoy = new Date();
    this.fechaSeleccionada = hoy.toISOString().slice(0, 10);
    this.cargarVentas();
  }

  getTotal(venta: Pedido): number {
    return venta.items!.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  cambiarPagina(page: number) {
    const nuevaPagina = this.page() + page;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages()) {
      this.page.set(nuevaPagina);
      this.cargarVentas();
    }
  }

  cargarVentas() {
    if (!this.fechaSeleccionada) return;
    this.loading = true;
    const size = 3;
    this.pedidoService
      .getPedidosPaginados(this.page(), size, this.fechaSeleccionada)
      .subscribe({
        next: (res: Page<Pedido>) => {
          this.ventas = res.content || [];
          this.totalPages.set(res.totalPages);

          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar ventas';
          this.loading = false;
        },
      });
  }
}
