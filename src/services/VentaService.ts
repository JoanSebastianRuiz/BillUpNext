import { NextResponse } from "next/server";
import { VentaDTO } from "@/dto/VentaDTO";

export interface VentaService {
  getAll(idEmpresa: number): Promise<Array<VentaDTO>>;
  create(venta: VentaDTO): Promise<NextResponse>;
  getById(idVenta: number): Promise<VentaDTO | null>;
  cancel(venta: VentaDTO): Promise<NextResponse>;
}