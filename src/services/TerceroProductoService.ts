import { NextResponse } from "next/server";
import { TerceroProductoDTO } from "@/dto/TerceroProductoDTO";

export interface TerceroProductoService {
    getAll(): Promise<Array<TerceroProductoDTO>>;
    create(terceroProducto: TerceroProductoDTO): Promise<NextResponse>;
    update(terceroProducto: TerceroProductoDTO): Promise<NextResponse>;
    getById(idTerceroProducto: number): Promise<TerceroProductoDTO | null>;
}