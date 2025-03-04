import { NextResponse } from "next/server";
import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

export interface UbicacionVentaService {
    getAll(): Promise<Array<UbicacionVentaDTO>>;
    create( ubicacionVenta : UbicacionVentaDTO): Promise<NextResponse>;
    update(ubicacionVenta: UbicacionVentaDTO): Promise<NextResponse>;
    getById(idUbicacionVenta: number): Promise<UbicacionVentaDTO | null>;
}