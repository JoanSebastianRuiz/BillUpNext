import { GravamenProductoDTO } from "@/dto/GravamenProductoDTO";

export interface GravamenProductoDAO {
  getAll(idEmpresa: number): Promise<Array<GravamenProductoDTO>>;
  getById(idGravamenProducto: number): Promise<GravamenProductoDTO | null>;
  create(gravamenProducto: GravamenProductoDTO): Promise<boolean>;
  update(gravamenProducto: GravamenProductoDTO): Promise<boolean>;
}
