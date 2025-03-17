export interface MovimientoDTO {
    idMovimiento?: number,
    idUsuario: number,
    idCaja: number,
    tipoMovimiento: boolean,
    descripcionMovimiento: string,
    fechaMovimiento?: Date,
    valorMovimiento: number
}