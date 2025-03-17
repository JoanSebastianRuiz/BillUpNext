import { DetalleCompraDAO } from "@/dao/DetalleCompraDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class DetalleCompraDAOImpl implements DetalleCompraDAO {
  private static instancia: DetalleCompraDAOImpl;
  private constructor() {}

  public static getInstance(): DetalleCompraDAOImpl {
    if (!DetalleCompraDAOImpl.instancia) {
      DetalleCompraDAOImpl.instancia = new DetalleCompraDAOImpl();
    }
    return DetalleCompraDAOImpl.instancia;
  }

  public getAll = async (): Promise<Array<DetalleCompraDTO>> => {
    try {
      const detalleCompraDatabase: DetalleCompraDTO[] = await ejecutarQuery(
        `SELECT dc.\"idDetalleCompra\", dc.\"idCompra\", dc.\"idProducto\", dc.\"cantidadDetalleCompra\", dc.\"valorDetalleCompra\", dc.\"fechaVencimientoDetalleCompra\"
                FROM \"DetalleCompra\" dc;`,
        []
      );

      return detalleCompraDatabase;
    } catch (error) {
      throw new Error(`Error en DetalleCompraDAO.getAll: ${error}`);
    }
  };

  public getById = async (
    idDetalleCompra: number
  ): Promise<DetalleCompraDTO | null> => {
    try {
      const respuesta: DetalleCompraDTO[] = await ejecutarQuery(
        `SELECT dc.\"idDetalleCompra\", dc.\"idCompra\", dc.\"idProducto\", dc.\"cantidadDetalleCompra\", dc.\"valorDetalleCompra\", dc.\"fechaVencimientoDetalleCompra\"
                FROM \"DetalleCompra\" dc
                WHERE dc.\"idDetalleCompra\" = $1;`,
        [idDetalleCompra]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en DetalleCompraDAO.getById: ${error}`);
    }
  };

  public create = async (detalleCompra: DetalleCompraDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarDetalleCompra($1,$2,$3,$4,$5) as resultado;`,
        [
          detalleCompra.idCompra,
          detalleCompra.idProducto,
          detalleCompra.cantidadDetalleCompra,
          detalleCompra.valorDetalleCompra,
          detalleCompra.fechaVencimientoDetalleCompra
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en DetalleCompraDAO.create: ${error}`);
    }
  };

  public update = async (detalleCompra: DetalleCompraDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT actualizarDetalleCompra($1,$2,$3,$4,$5,$6) as resultado;`,
        [
          detalleCompra.idDetalleCompra,
          detalleCompra.idCompra,
          detalleCompra.idProducto,
          detalleCompra.cantidadDetalleCompra,
          detalleCompra.valorDetalleCompra,
          detalleCompra.fechaVencimientoDetalleCompra
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en DetalleCompraDAO.update: ${error}`);
    }
  };
}
