export interface VentaDTO {
    idVenta?: number,
    idTercero: number,
    idCaja: number,
    idUsuario: number,
    idUbicacionVenta: number,
    idTipoMedioPago: number,
    fechaVenta?: Date,
    observacionVenta?: string,
    valorTotalVenta: number
}