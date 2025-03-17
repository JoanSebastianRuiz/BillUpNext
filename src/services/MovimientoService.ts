import { NextResponse } from "next/server";
import { MovimientoDTO } from "@/dto/MovimientoDTO";

export interface MovimientoService{
    getAll(): Promise<Array<MovimientoDTO>>;
    create(movimiento: MovimientoDTO): Promise<NextResponse>;
    getById(idMovimiento: number): Promise<MovimientoDTO | null>;
}