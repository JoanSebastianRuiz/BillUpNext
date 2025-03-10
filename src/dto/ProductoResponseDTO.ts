export interface ProductoResponseDTO {
    idProducto: number,
    idEmpresa: number,
    idCategoria: number,
    nombreProducto: string,
    descripcionProducto: string,
    precioVentaProducto: number,
    porcentajeDescuentoProducto: number,
    stockMinimoProducto: number,
    stockMaximoProducto: number,
    stockProducto: number,
    estadoProducto: boolean
}
