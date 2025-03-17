import { CompraDTO } from "@/dto/CompraDTO";

export interface CompraDAO {
    getAll(): Promise<Array<CompraDTO>>;
    getById(idCompra: number): Promise<CompraDTO | null>;
    create(compra: CompraDTO): Promise<boolean>;
    update(compra: CompraDTO): Promise<boolean>;
}