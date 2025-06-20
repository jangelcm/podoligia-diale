import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PedidoService } from 'core/services/pedido.service';
import { Pedido } from 'core/models/pedido';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient, private pedidoService: PedidoService) {}

  ngOnInit() {
    const hoy = new Date();
    this.fechaSeleccionada = hoy.toISOString().slice(0, 10);
    this.cargarVentas();
  }

  getTotal(venta: Pedido): number {
    return venta.items!.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  }

  cargarVentas() {
    if (!this.fechaSeleccionada) return;
    this.loading = true;
    const page = 0;
    const size = 10;

    this.pedidoService
      .getPedidosPaginados(page, size, this.fechaSeleccionada)
      .subscribe({
        next: (res) => {
          this.ventas = res.content || [];
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar ventas';
          this.loading = false;
        },
      });
  }
}
