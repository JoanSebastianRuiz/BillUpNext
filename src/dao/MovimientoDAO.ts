import { MovimientoDTO } from "@/dto/MovimientoDTO";

export interface MovimientoDAO{
    getAll(): Promise<Array<MovimientoDTO>>;
    getById(idMovimiento: number): Promise<MovimientoDTO | null>;
    create(movimiento: MovimientoDTO): Promise<boolean>
}