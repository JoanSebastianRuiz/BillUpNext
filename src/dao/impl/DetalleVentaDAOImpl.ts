import { DetalleVentaDAO } from "@/dao/DetalleVentaDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

export class DetalleVentaDAOImpl implements DetalleVentaDAO {
  private static instancia: DetalleVentaDAOImpl;
  private constructor() { }

  public static getInstance(): DetalleVentaDAOImpl {
    if (!DetalleVentaDAOImpl.instancia) {
      DetalleVentaDAOImpl.instancia = new DetalleVentaDAOImpl();
    }
    return DetalleVentaDAOImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<DetalleVentaDTO>> => {
    try {
      const detalleVentaDatabase: DetalleVentaDTO[] = await ejecutarQuery(
        `SELECT dv.\"idDetalleVenta\", dv.\"idVenta\", dv.\"idProducto\", dv.\"cantidadDetalleVenta\", dv.\"valorDescuentoDetalleVenta\", dv.\"valorTotalDetalleVenta\", dv.\"valorImpuestosDetalleVenta\"
                FROM \"DetalleVenta\" dv
                JOIN \"Producto\" p ON dv.\"idProducto\" = p.\"idProducto\"
                WHERE p.\"idEmpresa\" = $1;`,
        [idEmpresa]
      );

      return detalleVentaDatabase;
    } catch (error) {
      throw new Error(`Error en DetalleVentaDAO.getAll: ${error}`);
    }
  };
}
