export interface DetalleCompraDTO {
    idDetalleCompra?: number,
    idCompra: number,
    idTercero: number | string,
    idProducto: number | string,
    cantidadDetalleCompra: number,
    valorDetalleCompra: number
}