import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

export interface DetalleVentaDAO{
    getAll(): Promise<Array<DetalleVentaDTO>>;
    getById(idDetalleVenta: number): Promise<DetalleVentaDTO | null>;
    create(detalleVenta: DetalleVentaDTO): Promise<boolean>;
    validarCantidad(cantidadDetalleVenta: number): Promise<boolean>;
    validarDescuento(valorDescuentoDetalleVenta: number): Promise<boolean>;
    validarValor(valorTotalDetalleVenta: number): Promise<boolean>;
}