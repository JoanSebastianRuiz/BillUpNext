import { NextResponse } from "next/server";
import { CategoriaDTO } from "@/dto/CategoriaDTO";

export interface CategoriaService {
  getAll(idEmpresa: number): Promise<Array<CategoriaDTO>>;
  create(categoria: CategoriaDTO): Promise<NextResponse>;
  update(categoria: CategoriaDTO): Promise<NextResponse>;
  getById(idCategoria: number): Promise<CategoriaDTO | null>;
}
