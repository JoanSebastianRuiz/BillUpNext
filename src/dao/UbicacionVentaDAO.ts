import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

export interface UbicacionVentaDAO{
    getAll(): Promise<Array<UbicacionVentaDTO>>;
    getById(idUbicacionVenta: number): Promise<UbicacionVentaDTO | null>;
    create(ubicacionVenta: UbicacionVentaDTO): Promise<boolean>;
    update(ubicacionVenta: UbicacionVentaDTO): Promise<boolean>;
    delete(idUbicacionVenta: number): Promise<boolean>;
}
