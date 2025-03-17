import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

export interface DetalleVentaDAO{
    getAll(): Promise<Array<DetalleVentaDTO>>;
    getById(idDetalleVenta: number): Promise<DetalleVentaDTO | null>;
    create(detalleVenta: DetalleVentaDTO): Promise<boolean>;
}