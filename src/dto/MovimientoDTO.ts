export interface MovimientoDTO {
    idMovimiento?: number,
    idUsuario: number,
    idCaja: number,
    descripcionMovimiento: string,
    fechaMovimiento: Date,
    valorMovimiento: number
}