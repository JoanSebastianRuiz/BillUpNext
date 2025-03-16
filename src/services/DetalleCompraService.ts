import { NextResponse } from "next/server";
import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";

export interface DetalleCompraService{
    getAll(): Promise<Array<DetalleCompraDTO>>;
    create(detalleCompra: DetalleCompraDTO): Promise<NextResponse>;
    update(detalleCompra: DetalleCompraDTO): Promise<NextResponse>;
    getById(idDetalleCompra: number): Promise<DetalleCompraDTO | null>;
}