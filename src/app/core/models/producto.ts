export class Producto {
  id?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  imagenUrl?: string;
  stock?: number;

  constructor(
    id?: number,
    nombre?: string,
    descripcion?: string,
    precio?: number,
    imagenUrl?: string,
    stock?: number
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagenUrl = imagenUrl;
    this.stock = stock;
  }
}
