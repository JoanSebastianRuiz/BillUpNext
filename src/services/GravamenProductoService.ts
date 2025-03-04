import { NextResponse } from "next/server";
import { GravamenProductoDTO } from "@/dto/GravamenProductoDTO";

export interface GravamenProductoService {
  getAll(): Promise<Array<GravamenProductoDTO>>;
  create(gravamenProducto: GravamenProductoDTO): Promise<NextResponse>;
  update(gravamenProducto: GravamenProductoDTO): Promise<NextResponse>;
  getById(idGravamenProducto: number): Promise<GravamenProductoDTO | null>;
}
