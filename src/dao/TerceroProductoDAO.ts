import { TerceroProductoDTO } from "@/dto/TerceroProductoDTO";

export interface TerceroProductoDAO{
    getAll(idEmpresa: number): Promise<Array<TerceroProductoDTO>>;
    getById(idTerceroProducto: number): Promise<TerceroProductoDTO | null>;
    create(terceroProducto: TerceroProductoDTO): Promise<boolean>;
    update(terceroProducto: TerceroProductoDTO): Promise<boolean>;
    validarRelacion(idProducto: number, idTercero: number, idTerceroProducto?: number):Promise<boolean>;
}