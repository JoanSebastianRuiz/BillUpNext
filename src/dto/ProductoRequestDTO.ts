export interface ProductoRequestDTO {
    idProducto?: number,
    idEmpresa: number,
    idCategoria: number,
    nombreProducto: string,
    descripcionProducto: string,
    precioVentaProducto: number,
    porcentajeDescuentoProducto?: number,
    stockMinimoProducto: number,
    stockMaximoProducto: number,
    estadoProducto: boolean
}