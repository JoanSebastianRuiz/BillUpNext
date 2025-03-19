import { GravamenProductoDAO } from "@/dao/GravamenProductoDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { GravamenProductoDTO } from "@/dto/GravamenProductoDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class GravamenProductoDAOImpl implements GravamenProductoDAO {
  private static instancia: GravamenProductoDAOImpl;
  private constructor() { }

  public static getInstance(): GravamenProductoDAOImpl {
    if (!GravamenProductoDAOImpl.instancia) {
      GravamenProductoDAOImpl.instancia = new GravamenProductoDAOImpl();
    }
    return GravamenProductoDAOImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<GravamenProductoDTO>> => {
    try {
      const gravamenProductoDatabase: GravamenProductoDTO[] =
        await ejecutarQuery(
          `SELECT gp.\"idGravamenProducto\", gp.\"idProducto"\, gp."\idGravamen"\, gp.\"porcentajeGravamenProducto\"
                    FROM \"GravamenProducto\" gp
                    JOIN \"Producto\" p ON p.\"idProducto\"=gp.\"idProducto\"
                    WHERE p.\"idEmpresa\"=$1;`,
          [idEmpresa]
        );

      return gravamenProductoDatabase;
    } catch (error) {
      throw new Error(`Error en GravamenProductoDAO.getAll: ${error}`);
    }
  };

  public getById = async (
    idGravamenProducto: number
  ): Promise<GravamenProductoDTO | null> => {
    try {
      const respuesta: GravamenProductoDTO[] = await ejecutarQuery(
        `SELECT gp.\"idGravamenProducto\", gp.\"idProducto"\, gp."\idGravamen"\, gp.\"porcentajeGravamenProducto\"
                    FROM \"GravamenProducto\" gp 
                    WHERE gp.\"idGravamenProducto\" = $1;`,
        [idGravamenProducto]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en GravamenProductoDAO.getById: ${error}`);
    }
  };

  public create = async (
    gravamenProducto: GravamenProductoDTO
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarGravamenProducto($1,$2,$3) as resultado;`,
        [
          gravamenProducto.idProducto,
          gravamenProducto.idGravamen,
          gravamenProducto.porcentajeGravamenProducto
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en GravamenProductoDAO.create: ${error}`);
    }
  };

  public update = async (
    gravamenProducto: GravamenProductoDTO
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT actualizarGravamenProducto($1,$2,$3,$4) as resultado;`,
        [
          gravamenProducto.idGravamenProducto,
          gravamenProducto.idProducto,
          gravamenProducto.idGravamen,
          gravamenProducto.porcentajeGravamenProducto
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en GravamenProductoDAO.update: ${error}`);
    }
  };
}
