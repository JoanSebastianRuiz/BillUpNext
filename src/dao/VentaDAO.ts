import { VentaDTO } from "@/dto/VentaDTO";

export interface VentaDAO {
    getAll(): Promise<Array<VentaDTO>>;
    getById(idVenta: number): Promise<VentaDTO | null>;
    create(venta: VentaDTO): Promise<boolean>;
}