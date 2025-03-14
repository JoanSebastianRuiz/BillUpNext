import { TerceroProductoDAO } from "@/dao/TerceroProductoDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { TerceroProductoDTO } from "@/dto/TerceroProductoDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class TerceroProductoDAOImpl implements TerceroProductoDAO {
  private static instancia: TerceroProductoDAOImpl;
  private constructor() { }

  public static getInstance(): TerceroProductoDAOImpl {
    if (!TerceroProductoDAOImpl.instancia) {
      TerceroProductoDAOImpl.instancia = new TerceroProductoDAOImpl();
    }
    return TerceroProductoDAOImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<TerceroProductoDTO>> => {
    try {
      const terceroProductoDatabase: TerceroProductoDTO[] = await ejecutarQuery(
        `SELECT t.\"idTerceroProducto\", t.\"idTercero\", t.\"idProducto\", t.\"precioCompraTerceroProducto\", t.\"estadoTerceroProducto\"
                FROM \"TerceroProducto\" t
                JOIN \"Producto\" p ON p.\"idProducto\" = t.\"idProducto\"
                WHERE p.\"idEmpresa\" = $1;`,
        [idEmpresa]
      );

      return terceroProductoDatabase;
    } catch (error) {
      throw new Error(`Error en TerceroProductoDAO.getAll: ${error}`);
    }
  };

  public getById = async (
    idTerceroProducto: number
  ): Promise<TerceroProductoDTO | null> => {
    try {
      const respuesta: TerceroProductoDTO[] = await ejecutarQuery(
        `SELECT t.\"idTerceroProducto\", t.\"idTercero\", t.\"idProducto\", t.\"precioCompraTerceroProducto\"
                FROM \"TerceroProducto\" t
                WHERE t.\"idTerceroProducto\" = $1;`,
        [idTerceroProducto]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en TerceroProductoDAO.getById: ${error}`);
    }
  };

  public create = async (
    terceroProducto: TerceroProductoDTO
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarTerceroProducto($1,$2,$3) as resultado;`,
        [
          terceroProducto.idTercero,
          terceroProducto.idProducto,
          terceroProducto.precioCompraTerceroProducto,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en TerceroProductoDAO.create: ${error}`);
    }
  };
  public update = async (
    terceroProducto: TerceroProductoDTO
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT actualizarTerceroProducto($1,$2,$3,$4) as resultado;`,
        [
          terceroProducto.idTerceroProducto,
          terceroProducto.idTercero,
          terceroProducto.idProducto,
          terceroProducto.precioCompraTerceroProducto,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en TerceroProductoDAO.update: ${error}`);
    }
  };

  public validarRelacion = async (
    idProducto: number,
    idTercero: number,
    idTerceroProducto?: number
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery(
        `SELECT validarRelacionTerceroProducto ($1,$2,$3) as resultado;`,
        [idProducto, idTercero, idTerceroProducto]
      );
      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en TerceroProductoDAO.validarRelacion: ${error}`);
    }
  };

  public validarPrecio = async (
    precioCompraTerceroProducto: number
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery(
        `SELECT validarPrecioCompraProducto ($1) as resultado;`,
        [precioCompraTerceroProducto]
      );
      return respuesta.length > 0 ? respuesta[0].ressultado : false;
    } catch (error) {
      throw new Error(`Error en TerceroProductoDAO.validarPrecio: ${error}`);
    }
  };
}
