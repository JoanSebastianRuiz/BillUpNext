import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

export interface DetalleVentaDAO{
    getAll(idEmpresa: number): Promise<Array<DetalleVentaDTO>>;
}