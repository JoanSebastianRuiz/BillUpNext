export interface DetalleVentaDTO {
    idDetalleVenta?: number,
    idVenta: number,
    idProducto: number,
    idGravamen: number,
    cantidadDetalleVenta: number,
    valorDescuentoDetalleVenta: number,
    valorTotalDetalleVenta: number
}