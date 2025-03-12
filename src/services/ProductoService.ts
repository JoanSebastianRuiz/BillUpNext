import { NextResponse } from "next/server";
import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { ProductoRequestDTO } from "@/dto/ProductoRequestDTO";

export interface ProductoService {
    getAll(idEmpresa: number): Promise<Array<ProductoResponseDTO>>;
    create(producto: ProductoRequestDTO): Promise<NextResponse>;
    update(producto: ProductoRequestDTO): Promise<NextResponse>;
    getById(idProducto: number): Promise<ProductoResponseDTO | null>;
}
