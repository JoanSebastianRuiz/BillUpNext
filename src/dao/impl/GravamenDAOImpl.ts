import { GravamenDAO } from "@/dao/GravamenDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { GravamenDTO } from "@/dto/GravamenDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class GravamenDAOImpl implements GravamenDAO {
  private static instancia: GravamenDAOImpl;
  private constructor() {}

  public static getInstance(): GravamenDAOImpl {
    if (!GravamenDAOImpl.instancia) {
      GravamenDAOImpl.instancia = new GravamenDAOImpl();
    }
    return GravamenDAOImpl.instancia;
  }

  public getAll = async (): Promise<Array<GravamenDTO>> => {
    try {
      const gravamenDatabase: GravamenDTO[] = await ejecutarQuery(
        `SELECT g.\idGravamen\", g.\"nombreGravamen\", g.\"estadoGravamen\", g.\"negativoGravamen\", g.\"porcentajeGravamen\"
                FROM \"Gravamen\" g;`,
        []
      );

      return gravamenDatabase;
    } catch (error) {
      throw new Error(`Error en GravamenDAO.getAll: ${error}`);
    }
  };

  public getById = async (idGravamen: number): Promise<GravamenDTO | null> => {
    try {
      const respuesta: GravamenDTO[] = await ejecutarQuery(
        `SELECT g.\"idGravamen\", g.\"nombreGravamen\", g.\"estadoGravamen\", g.\"negativoGravamen\", g.\"porcentajeGravamen\"
                FROM  \"Gravamen\" g
                WHERE g.\"idGravamen\" = $1;`,
        [idGravamen]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en GravamenDAO.getById: ${error}`);
    }
  };

  public create = async (gravamen: GravamenDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarGravamen($1,$2,$3,$4) as resultado;`,
        [
          gravamen.nombreGravamen,
          gravamen.estadoGravamen,
          gravamen.negativoGravamen,
          gravamen.porcentajeGravamen,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en GravamenDAO.create: ${error}`);
    }
  };

  public update = async (gravamen: GravamenDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT actualizarGravamen($1,$2,$3,$4,$5) as resultado;`,
        [
          gravamen.idGravamen,
          gravamen.nombreGravamen,
          gravamen.estadoGravamen,
          gravamen.negativoGravamen,
          gravamen.porcentajeGravamen,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en GravamenDAO.update: ${error}`);
    }
  };

  public existGravamenNombre = async (
    nombreGravamen: string,
    idGravamen?: number
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT existeGravamenNombre($1,$2) as resultado;`,
        [nombreGravamen, idGravamen]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en GravamenDAO.existGravamenNombre: ${error}`);
    }
  };
}
