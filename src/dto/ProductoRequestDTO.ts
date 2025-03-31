export interface ProductoRequestDTO {
    idProducto?: number,
    idEmpresa: number,
    idCategoria: number | string,
    nombreProducto: string,
    descripcionProducto: string,
    precioVentaProducto: number,
    porcentajeDescuentoProducto?: number,
    stockMinimoProducto: number,
    stockMaximoProducto: number,
    estadoProducto: boolean | string,
}