import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";

export interface DetalleCompraDAO{
    getAll(): Promise<Array<DetalleCompraDTO>>;
    getById(idDetalleCompra: number): Promise<DetalleCompraDTO | null>;
    create(detalleCompra: DetalleCompraDTO): Promise<boolean>;
    update(detalleCompra: DetalleCompraDTO): Promise<boolean>;
    validarCantidad(cantidadDetalleCompra: number): Promise<boolean>;
    validarValor(valorDetalleCompra: number): Promise<boolean>;
}