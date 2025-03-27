import { NextResponse } from "next/server";
import { CompraDTO } from "@/dto/CompraDTO";

export interface CompraService {
  getAll(idEmpresa: number): Promise<Array<CompraDTO>>;
  create(compra: CompraDTO): Promise<NextResponse>;
  cancel(compra: CompraDTO): Promise<NextResponse>;
  getById(idCompra: number): Promise<CompraDTO | null>;
}