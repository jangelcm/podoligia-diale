export class Pedido {
  id?: number;
  username?: string;
  items?: Item[];
  direccionEnvio?: string;
  telefonoContacto?: string;
  comprobanteUrl?: string;
  fechaPedido?: Date;

  constructor(init?: Partial<Pedido>) {
    Object.assign(this, init);
  }
}

export interface Item {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precio: number;
}
