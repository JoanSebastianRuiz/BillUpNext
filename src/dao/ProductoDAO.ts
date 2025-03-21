import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { ProductoRequestDTO } from "@/dto/ProductoRequestDTO";

export interface ProductoDAO{
    getAll(idEmpresa: number): Promise<Array<ProductoResponseDTO>>;
    getById(idProducto: number): Promise<ProductoResponseDTO | null>;
    create(producto: ProductoRequestDTO): Promise<boolean>;
    update(producto: ProductoRequestDTO): Promise<boolean>;
    existProductoNombre(nombreProducto: string, idEmpresa: number, idCategoria: number): Promise<boolean>;
    validarStock(stockMinimoProducto: number, stockMaximoProducto: number): Promise<boolean>;
    validarPrecio(precioVentaProducto: number): Promise<boolean>;
    validarPorcentaje(porcentajeDescuentoProducto: number): Promise<boolean>;
}
