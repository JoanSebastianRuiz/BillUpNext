import { NextResponse } from "next/server";
import { CajaDTO } from "@/dto/CajaDTO";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";

export interface CajaService {
    getAll(): Promise<Array<CajaDTO>>;
    getEmpresas(idEmpresa: number): Promise<EmpresaResponseDTO[]>;
    create(caja: CajaDTO): Promise<NextResponse>;
    update(caja: CajaDTO): Promise<NextResponse>;
    getById(idCaja: number): Promise<CajaDTO | null>;
}