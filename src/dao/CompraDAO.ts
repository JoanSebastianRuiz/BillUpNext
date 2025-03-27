import { CompraDTO } from "@/dto/CompraDTO";

export interface CompraDAO {
    getAll(idEmpresa: number): Promise<Array<CompraDTO>>;
    getById(idCompra: number): Promise<CompraDTO | null>;
    create(compra: CompraDTO): Promise<boolean>;
    cancel(compra: CompraDTO): Promise<boolean>;
}