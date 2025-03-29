import { MovimientoDTO } from "@/dto/MovimientoDTO";

export interface MovimientoDAO{
    getAll(idEmpresa: number): Promise<Array<MovimientoDTO>>;
    getById(idMovimiento: number): Promise<MovimientoDTO | null>;
    create(movimiento: MovimientoDTO): Promise<boolean>
}