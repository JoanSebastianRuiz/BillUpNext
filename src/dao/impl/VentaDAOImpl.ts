import { VentaDAO } from "@/dao/VentaDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { VentaDTO } from "@/dto/VentaDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class VentaDAOImpl implements VentaDAO {
  private static instancia: VentaDAOImpl;
  private constructor() { }

  public static getInstance(): VentaDAOImpl {
    if (!VentaDAOImpl.instancia) {
      VentaDAOImpl.instancia = new VentaDAOImpl();
    }
    return VentaDAOImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<VentaDTO>> => {
    try {
      const ventaDatabase: VentaDTO[] = await ejecutarQuery(
        `SELECT v.\"idVenta\", v.\"idTecero\", v.\"idCaja\", v.\"idUsuario\", v.\"idUbicacionVenta\", v.\"idTipoMedioPago\", v.\"fechaVenta\", v.\"observacionVenta\", v.\"valorTotalVenta\", v.\"estadoVenta\", v.\"fechaCancelacionVenta\", v.\"idUsuarioCancelacionVenta\", v.\"motivoCancelacionVenta\"
                FROM \"Venta\" v
                JOIN \"Usuario\" u ON v.\"idUsuario\" = u.\"idUsuario\"
                WHERE u.\"idEmpresa\" = $1
                ORDER BY v.\"fechaVenta\" DESC;;`,
        [idEmpresa]
      );

      return ventaDatabase;
    } catch (error) {
      throw new Error(`Error en VentaDAO.getAll: ${error}`);
    }
  };

  public getById = async (idVenta: number): Promise<VentaDTO | null> => {
    try {
      const respuesta: VentaDTO[] = await ejecutarQuery(
        `SELECT v.\"idVenta\", v.\"idTecero\", v.\"idCaja\", v.\"idUsuario\", v.\"idUbicacionVenta\", v.\"idTipoMedioPago\", v.\"fechaVenta\", v.\"observacionVenta\", v.\"valorTotalVenta\", v.\"estadoVenta\", v.\"fechaCancelacionVenta\", v.\"idUsuarioCancelacionVenta\", v.\"motivoCancelacionVenta\"
                FROM \"Venta\" v
                WHERE v.\"idVenta\" = $1;`,
        [idVenta]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en VentaDAO.getById: ${error}`);
    }
  };

  public create = async (venta: VentaDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarVenta($1,$2,$3,$4,$5,$6,$7,$8) as resultado;`,
        [
          venta.idUsuario,
          venta.idTercero,
          venta.idCaja,
          venta.idUbicacionVenta,
          venta.idTipoMedioPago,
          venta.observacionVenta,
          venta.valorTotalVenta,
          JSON.stringify(venta.detallesVenta)
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en VentaDAO.create: ${error}`);
    }
  };

  public cancel = async (venta: VentaDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT cancelarVenta($1,$2,$3) as resultado;`,
        [
          venta.idVenta,
          venta.idUsuarioCancelacionVenta,
          venta.motivoCancelacionVenta
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en VentaDAO.cancel: ${error}`);
    }
  };
}