import { CajaDTO } from "@/dto/CajaDTO";

export interface CajaDAO {
    getAll(idEmpresa: number): Promise<Array<CajaDTO>>;
    getById(idCaja: number): Promise<CajaDTO | null>;
    create(caja: CajaDTO): Promise<boolean>;
    update(caja: CajaDTO): Promise<boolean>;
    existCajaNombre(nombreCaja: string, idEmpresa: number): Promise<boolean>;
    close(idCaja: number): Promise<boolean>;
    getDetalleCajaActual(idCaja: number): Promise<CajaDTO | null>;
}