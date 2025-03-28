import { DetalleCompraDAO } from "@/dao/DetalleCompraDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";

export class DetalleCompraDAOImpl implements DetalleCompraDAO {
  private static instancia: DetalleCompraDAOImpl;
  private constructor() { }

  public static getInstance(): DetalleCompraDAOImpl {
    if (!DetalleCompraDAOImpl.instancia) {
      DetalleCompraDAOImpl.instancia = new DetalleCompraDAOImpl();
    }
    return DetalleCompraDAOImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<DetalleCompraDTO>> => {
    try {
      const detalleCompraDatabase: DetalleCompraDTO[] = await ejecutarQuery(
        `SELECT dc.\"idDetalleCompra\", dc.\"idCompra\", dc.\"idProducto\", dc.\"cantidadDetalleCompra\", dc.\"valorDetalleCompra\", dc.\"idTercero\"
                FROM \"DetalleCompra\" dc
                JOIN \"Producto\" p ON dc.\"idProducto\" = p.\"idProducto\"
                WHERE p.\"idEmpresa\" = $1;`,
        [idEmpresa]
      );

      return detalleCompraDatabase;
    } catch (error) {
      throw new Error(`Error en DetalleCompraDAO.getAll: ${error}`);
    }
  };

}
