import { MovimientoDAO } from "@/dao/MovimientoDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { MovimientoDTO } from "@/dto/MovimientoDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class MovimientoDAOImpl implements MovimientoDAO {
  private static instancia: MovimientoDAOImpl;
  private constructor() {}

  public static getInstance(): MovimientoDAOImpl {
    if (!MovimientoDAOImpl.instancia) {
      MovimientoDAOImpl.instancia = new MovimientoDAOImpl();
    }
    return MovimientoDAOImpl.instancia;
  }

  public getAll = async (): Promise<Array<MovimientoDTO>> => {
    try {
      const movimientoDatabase: MovimientoDTO[] = await ejecutarQuery(
        `SELECT m.\"idMovimiento\", m.\"idUsuario\", m.\"idCaja\", m.\"descripcionMovimiento\", m.\"valorMovimiento\"
            FROM \"Movimiento\" m;`,
        []
      );

      return movimientoDatabase;
    } catch (error) {
      throw new Error(`Error en MovimientoDAO.getAll: ${error}`);
    }
  };

  public getById = async (
    idMovimiento: number
  ): Promise<MovimientoDTO | null> => {
    try {
      const respuesta: MovimientoDTO[] = await ejecutarQuery(
        `SELECT m.\"idMovimiento\", m.\"idUsuario\", m.\"idCaja\", m.\"descripcionMovimiento\", m.\"valorMovimiento\"
            FROM \"Movimiento\" m
            WHERE m.\"idMovimiento\" = $1;`,
        [idMovimiento]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en MovimietoDAO.getById: ${error}`);
    }
  };

  public create = async (movimiento: MovimientoDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarMovimiento($1,$2,$3,$4) as resultado;`,
        [
          movimiento.idUsuario,
          movimiento.idCaja,
          movimiento.descripcionMovimiento,
          movimiento.valorMovimiento,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
        throw new Error(`Error en MovimientoDAO.create: ${error}`);
    }
  };

  public update = async (movimiento: MovimientoDTO): Promise<boolean> => {
    try {
        const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
            `SELECT actualizarMovimiento($1,$2,$3,$4,$5) as resultado;`,
            [
                movimiento.idMovimiento,
                movimiento.idUsuario,
                movimiento.idCaja,
                movimiento.descripcionMovimiento,
                movimiento.valorMovimiento
            ]
        );

        return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
        throw new Error(`Error en MovimientoDAO.update: ${error}`);
    }
  };
}
