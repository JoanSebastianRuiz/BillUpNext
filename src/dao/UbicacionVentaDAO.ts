import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

export interface UbicacionVentaDAO{
    getAll(idEmpresa: number): Promise<Array<UbicacionVentaDTO>>;
    getById(idUbicacionVenta: number): Promise<UbicacionVentaDTO | null>;
    create(ubicacionVenta: UbicacionVentaDTO): Promise<boolean>;
    update(ubicacionVenta: UbicacionVentaDTO): Promise<boolean>;
    existUbicacionVentaNombre(nombreUbicacionVenta: string, idEmpresa: number, idUbicacionVenta?: number): Promise<boolean>; 
}
