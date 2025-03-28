import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";

export interface DetalleCajaDAO {
    getAll(idEmpresa: number): Promise<Array<DetalleCajaDTO>>;
    getById(idDetalleCaja: number): Promise<DetalleCajaDTO | null>;
    create(DetalleCaja: DetalleCajaDTO): Promise<boolean>;
    update(DetalleCaja: DetalleCajaDTO): Promise<boolean>;
}