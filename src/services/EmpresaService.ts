import { NextResponse } from "next/server";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { EmpresaRequestDTO } from "@/dto/EmpresaRequestDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

export interface EmpresaService {
    getAll(): Promise<Array<EmpresaResponseDTO>>;
    getUsuarios(idEmpresa: number): Promise<UsuarioResponseDTO[]>;
    create(empresa: EmpresaRequestDTO): Promise<NextResponse>;
    update(empresa: EmpresaRequestDTO): Promise<NextResponse>;
    getById(idEmpresa: number): Promise<EmpresaResponseDTO | null>;
}