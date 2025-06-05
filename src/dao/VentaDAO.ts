import { VentaDTO } from "@/dto/VentaDTO";

export interface VentaDAO {
    getAll(idEmpresa: number): Promise<Array<VentaDTO>>;
    getById(idVenta: number): Promise<VentaDTO | null>;
    create(venta: VentaDTO): Promise<boolean>;
    cancel(venta: VentaDTO): Promise<boolean>;
    stockProducto(idProducto: number, cantidadDetalleVenta: number): Promise<boolean>;
}