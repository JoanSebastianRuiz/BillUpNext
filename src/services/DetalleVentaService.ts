import { NextResponse } from "next/server";
import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

export interface DetalleVentaService{
    getAll(): Promise<Array<DetalleVentaDTO>>;
    create(detalleVenta: DetalleVentaDTO): Promise<NextResponse>;
    getById(idDetalleVenta: number): Promise<DetalleVentaDTO | null>;
}