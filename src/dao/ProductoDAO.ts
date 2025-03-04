import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { ProductoRequestDTO } from "@/dto/ProductoRequestDTO";

export interface ProductoDAO{
    getAll(): Promise<Array<ProductoResponseDTO>>;
    getById(idProducto: number): Promise<ProductoResponseDTO | null>;
    create(producto: ProductoRequestDTO): Promise<boolean>;
    update(producto: ProductoRequestDTO): Promise<boolean>;
    existProductoNombre(nombreProducto: string, idCategoria: number, idProducto?: number): Promise<boolean>;
    validarStock(stockMinimoProducto: number, stockMaximoProducto: number): Promise<boolean>;
}
