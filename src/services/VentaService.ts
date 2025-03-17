import { NextResponse } from "next/server";
import { VentaDTO } from "@/dto/VentaDTO";

export interface VentaService {
  getAll(): Promise<Array<VentaDTO>>;
  create(venta: VentaDTO): Promise<NextResponse>;
  getById(idVenta: number): Promise<VentaDTO | null>;
}