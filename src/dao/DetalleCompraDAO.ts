import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";

export interface DetalleCompraDAO{
    getAll(idEmpresa: number): Promise<Array<DetalleCompraDTO>>;
}