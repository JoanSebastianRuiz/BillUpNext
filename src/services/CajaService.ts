import { NextResponse } from "next/server";
import { CajaDTO } from "@/dto/CajaDTO";

export interface CajaService {
    getAll(idEmpresa: number): Promise<Array<CajaDTO>>;
    create(caja: CajaDTO): Promise<NextResponse>;
    update(caja: CajaDTO): Promise<NextResponse>;
    getById(idCaja: number): Promise<CajaDTO | null>;
}