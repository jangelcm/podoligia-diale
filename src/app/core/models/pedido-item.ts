export class PedidoItemRequest {
  productoId?: number;
  cantidad?: number;

  constructor(productoId?: number, cantidad?: number) {
    this.productoId = productoId;
    this.cantidad = cantidad;
  }
}
