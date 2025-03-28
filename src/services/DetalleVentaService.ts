import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

export interface DetalleVentaService{
    getAll(idEmpresa: number): Promise<Array<DetalleVentaDTO>>;
}