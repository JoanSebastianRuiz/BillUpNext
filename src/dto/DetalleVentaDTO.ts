export interface DetalleVentaDTO {
    idDetalleVenta?: number,
    idVenta: number,
    idProducto: number,
    cantidadDetalleVenta: number,
    valorDescuentoDetalleVenta: number,
    valorImpuestosDetalleVenta: number,
    valorTotalDetalleVenta: number
}