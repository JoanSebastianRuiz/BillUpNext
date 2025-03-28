import { DetalleVentaDTO } from './DetalleVentaDTO';

export interface VentaDTO {
    idVenta?: number,
    idTercero: number,
    idCaja: number,
    idUsuario: number,
    idUbicacionVenta: number,
    idTipoMedioPago: number,
    fechaVenta?: Date,
    observacionVenta?: string,
    valorTotalVenta: number,
    estadoVenta?: boolean,
    fechaCancelacionVenta?: Date,
    idUsuarioCancelacionVenta?: number,
    motivoCancelacionVenta?: string,
    detallesVenta?: DetalleVentaDTO[]
}