import { DetalleVentaDAO } from "@/dao/DetalleVentaDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class DetalleVentaDAOImpl implements DetalleVentaDAO {
  private static instancia: DetalleVentaDAOImpl;
  private constructor() {}

  public static getInstance(): DetalleVentaDAOImpl {
    if (!DetalleVentaDAOImpl.instancia) {
      DetalleVentaDAOImpl.instancia = new DetalleVentaDAOImpl();
    }
    return DetalleVentaDAOImpl.instancia;
  }

  public getAll = async (): Promise<Array<DetalleVentaDTO>> => {
    try {
      const detalleVentaDatabase: DetalleVentaDTO[] = await ejecutarQuery(
        `SELECT dv.\"idDetalleVenta\", dv.\"idVenta\", dv.\"idProducto\", dv.\"cantidadDetalleVenta\", dv.\"valorDescuentoDetalleVenta\", dv.\"valorTotalDetalleVenta\"
                FROM \"DetalleVenta\" dv;`,
        []
      );

      return detalleVentaDatabase;
    } catch (error) {
      throw new Error(`Error en DetalleVentaDAO.getAll: ${error}`);
    }
  };

  public getById = async (
    idDetalleVenta: number
  ): Promise<DetalleVentaDTO | null> => {
    try {
      const respuesta: DetalleVentaDTO[] = await ejecutarQuery(
        `SELECT dv.\"idDetalleVenta\", dv.\"idVenta\", dv.\"idProducto\", dv.\"cantidadDetalleVenta\", dv.\"valorDescuentoDetalleVenta\", dv.\"valorTotalDetalleVenta\"
                FROM \"DetalleVenta\" dv
                WHERE dv.\"idDetalleVenta\" = $1;`,
        [idDetalleVenta]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en DetalleVentaDAO.getById: ${error}`);
    }
  };

  public create = async (detalleVenta: DetalleVentaDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarDetalleVenta($1,$2,$3,$4,$5) as resultado;`,
        [
          detalleVenta.idVenta,
          detalleVenta.idProducto,
          detalleVenta.cantidadDetalleVenta,
          detalleVenta.valorDescuentoDetalleVenta,
          detalleVenta.valorTotalDetalleVenta,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en DetalleVentaDAO.create: ${error}`);
    }
  };

  public validarCantidad = async (
    cantidadDetalleVenta: number
  ) : Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery(
        `SELECT validarCantidadDetalleVenta ($1) as resultado;`,
        [cantidadDetalleVenta]
      );
      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en DetalleVentaDAO.validarCantidad: ${error}`);
    }
  };

  public validarDescuento = async (
    valorDescuentoDetalleVenta: number
  ) : Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery(
        `SELECT validarValorDescuentoDetalleVenta ($1) as resultado;`,
        [valorDescuentoDetalleVenta]
      );
      return respuesta.length > 0 ? respuesta[0].resultado: false;
    } catch (error) {
      throw new Error(`Error en DetalleVentaDAO.validarDescuento: ${error}`)
    }
  };

  public validarValor = async (
    valorTotalDetalleVenta: number
  ) : Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery(
        `SELECT validarValorTotalDetalleVenta ($1) as resultado;`,
        [valorTotalDetalleVenta]
      );
      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en DetalleVentaDAO.validarValor: ${error}`);
    }
  };
}
