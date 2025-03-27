import { DetalleCompraDTO } from "./DetalleCompraDTO";

export interface CompraDTO {
    idCompra?: number,
    idUsuario: number,
    fechaCompra?: Date,
    observacionCompra?: string,
    valorTotalCompra?: number,
    estadoCompra?: boolean,
    detallesCompra?: DetalleCompraDTO[],
    fechaCancelacionCompra?: Date,
    idUsuarioCancelacionCompra?: number,
    motivoCancelacionCompra?: string
}