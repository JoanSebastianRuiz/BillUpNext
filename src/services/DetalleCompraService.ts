import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";

export interface DetalleCompraService{
    getAll(idEmpresa: number): Promise<Array<DetalleCompraDTO>>;
}