import { CajaDTO } from "@/dto/CajaDTO";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";

export interface CajaDAO {

    getAll(): Promise<Array<CajaDTO>>;
    getByid(idCaja: number): Promise<CajaDTO | null>;
    getEmpresa(idCaja: number): Promise<EmpresaResponseDTO | null>;
    create(caja: CajaDTO): Promise<boolean>;
    update(caja: CajaDTO): Promise<boolean>;
    existCajaNombre(nombreCaja: string): Promise<boolean>; 
}