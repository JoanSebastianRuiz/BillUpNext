import { NextResponse } from "next/server";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";

export interface DetalleCajaService {
    getAll(): Promise<Array<DetalleCajaDTO>>;
    create(detalleCaja : DetalleCajaDTO) : Promise<NextResponse>;
    update(detalleCaja : DetalleCajaDTO) : Promise<NextResponse>;
    getById(idDetalleCaja : number) : Promise<DetalleCajaDTO | null>;
}