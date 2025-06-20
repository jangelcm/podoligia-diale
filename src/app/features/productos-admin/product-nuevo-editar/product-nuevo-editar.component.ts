import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from 'core/services/producto.service';
import { Producto } from 'core/models/producto';

@Component({
  selector: 'app-product-nuevo-editar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-nuevo-editar.component.html',
  styleUrls: ['./product-nuevo-editar.component.css'],
})
export class ProductNuevoEditarComponent implements OnInit {
  producto: Partial<Producto> = {};
  esEdicion = false;
  imagenPreview: string | ArrayBuffer | null = null;
  imagenFile: File | null = null;
  loading = false;
  mensajeErrorImg: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.esEdicion = true;
      this.loading = true;
      this.productoService.getProducto(id).subscribe({
        next: (prod) => {
          this.producto = prod;
          this.imagenPreview = prod.imagenUrl!;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validación de tamaño (máximo 3MB)
      const maxSizeMB = 3;
      if (file.size > maxSizeMB * 1024 * 1024) {
        this.mensajeErrorImg = `La imagen es demasiado grande. El tamaño máximo permitido es ${maxSizeMB}MB.`;
        return;
      } else {
        this.mensajeErrorImg = null;
      }
      this.imagenFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imagenPreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  async guardarProducto() {
    this.loading = true;
    try {
      if (this.imagenFile) {
        // Subir imagen y obtener URL real
        const resp = await this.productoService
          .uploadImagen(this.imagenFile)
          .toPromise();
        this.producto.imagenUrl = resp?.url;
      }
      if (this.esEdicion && this.producto.id) {
        this.productoService
          .actualizarProducto(this.producto.id, this.producto)
          .subscribe(() => {
            this.loading = false;
            this.router.navigate(['/productos/admin']);
          });
      } else {
        this.productoService.agregarProducto(this.producto).subscribe(() => {
          this.loading = false;
          this.router.navigate(['/productos/admin']);
        });
      }
    } catch (err) {
      this.loading = false;
      // Manejo de error: podrías mostrar un mensaje al usuario
      console.error('Error subiendo imagen o guardando producto', err);
    }
  }

  cancelar() {
    this.router.navigate(['/productos/admin']);
  }
}
