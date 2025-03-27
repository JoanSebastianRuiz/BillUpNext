import { CompraDAO } from "@/dao/CompraDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { CompraDTO } from "@/dto/CompraDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class CompraDAOImpl implements CompraDAO {
  private static instancia: CompraDAOImpl;
  private constructor() { }

  public static getInstance(): CompraDAOImpl {
    if (!CompraDAOImpl.instancia) {
      CompraDAOImpl.instancia = new CompraDAOImpl();
    }
    return CompraDAOImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<CompraDTO>> => {
    try {
      const compraDatabase: CompraDTO[] = await ejecutarQuery(
        `SELECT c.\"idCompra\", c.\"idUsuario\", c.\"fechaCompra\", c.\"observacionCompra\", c.\"valorTotalCompra\", c.\"estadoCompra\", c.\"fechaCancelacionCompra\", c.\"idUsuarioCancelacionCompra\", c.\"motivoCancelacionCompra\"
                FROM \"Compra\" c
                JOIN \"Usuario\" u ON c.\"idUsuario\" = u.\"idUsuario\"
                WHERE u.\"idEmpresa\" = $1
                ORDER BY c.\"fechaCompra\" DESC;`,
        [idEmpresa]
      );

      return compraDatabase;
    } catch (error) {
      throw new Error(`Error en CompraDAO.getAll: ${error}`);
    }
  };

  public getById = async (idCompra: number): Promise<CompraDTO | null> => {
    try {
      const respuesta: CompraDTO[] = await ejecutarQuery(
        `SELECT c.\"idCompra\", c.\"idUsuario\", c.\"fechaCompra\", c.\"observacionCompra\", c.\"valorTotalCompra\", c.\"estadoCompra\", c.\"fechaCancelacionCompra\", c.\"idUsuarioCancelacionCompra\", c.\"motivoCancelacionCompra\"
                FROM \"Compra\" c
                WHERE c.\"idCompra\" = $1;`,
        [idCompra]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en CompraDAO.getById: ${error}`);
    }
  };

  public create = async (compra: CompraDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarCompra($1,$2,$3,$4) as resultado;`,
        [
          compra.idUsuario,
          compra.observacionCompra,
          compra.valorTotalCompra,
          JSON.stringify(compra.detallesCompra)
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en CompraDAO.create: ${error}`);
    }
  };

  public cancel = async (compra: CompraDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT cancelarCompra($1,$2,$3) as resultado;`,
        [
          compra.idCompra,
          compra.idUsuarioCancelacionCompra,
          compra.motivoCancelacionCompra
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en CompraDAO.update: ${error}`);
    }
  };
}