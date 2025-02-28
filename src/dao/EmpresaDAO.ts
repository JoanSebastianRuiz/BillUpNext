import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { EmpresaRequestDTO } from "@/dto/EmpresaRequestDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

export interface EmpresaDAO{
    getAll(): Promise<Array<EmpresaResponseDTO>>;
    getById(idEmpresa: number): Promise<EmpresaResponseDTO | null>;
    getUsuarios(idEmpresa: number): Promise<UsuarioResponseDTO[]>;
    create(empresa: EmpresaRequestDTO): Promise<boolean>;
    update(empresa: EmpresaRequestDTO): Promise<boolean>;
    existEmpresaNit(nitEmpresa: string): Promise<boolean>;
    existEmpresaCorreo(correoEmpresa: string): Promise<boolean>;
    existEmpresaTelefono(telefonoEmpresa: string): Promise<boolean>;
}
