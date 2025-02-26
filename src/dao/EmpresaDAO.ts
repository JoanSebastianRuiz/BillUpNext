import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { EmpresaRequestDTO } from "@/dto/EmpresaRequestDTO";

export interface EmpresaDAO{
    getAll(): Promise<Array<EmpresaResponseDTO>>;
    getById(idEmpresa: number): Promise<EmpresaResponseDTO | null>;
    create(empresa: EmpresaRequestDTO): Promise<boolean>;
    update(empresa: EmpresaRequestDTO): Promise<boolean>;
    existEmpresaNit(nitEmpresa: string): Promise<boolean>;
    existEmpresaCorreo(correoEmpresa: string): Promise<boolean>;
    existEmpresaTelefono(telefonoEmpresa: string): Promise<boolean>;
}
