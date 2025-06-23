export interface RestApiException {
  titulo: string;
  detalle: string;
  errores: string[][];
  estado: number;
}
