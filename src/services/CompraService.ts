import { NextResponse } from "next/server";
import { CompraDTO } from "@/dto/CompraDTO";

export interface CompraService {
  getAll(): Promise<Array<CompraDTO>>;
  create(compra: CompraDTO): Promise<NextResponse>;
  update(compra: CompraDTO): Promise<NextResponse>;
  getById(idCompra: number): Promise<CompraDTO | null>;
}