import { UbicacionVentaDAO } from "@/dao/UbicacionVentaDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class UbicacionVentaDAOImpl implements UbicacionVentaDAO {
    private static instancia: UbicacionVentaDAOImpl;
    private constructor() { }

    public static getInstance(): UbicacionVentaDAOImpl {
        if (!UbicacionVentaDAOImpl.instancia) {
            UbicacionVentaDAOImpl.instancia = new UbicacionVentaDAOImpl();
        }
        return UbicacionVentaDAOImpl.instancia;
    }

    public getAll = async (idEmpresa: number): Promise<Array<UbicacionVentaDTO>> => {
        try {
            const ubicacionVentaDatabase: UbicacionVentaDTO[] = await ejecutarQuery(
                `SELECT * FROM \"UbicacionVenta\" u WHERE u.\"idEmpresa\" = $1;`,
                [idEmpresa]
            );

            return ubicacionVentaDatabase;

        } catch (error) {
            throw new Error(`Error en UbicacionVenta.getAll: ${error}`);
        }

    }


    public getById = async (idUbicacionVenta: number): Promise<UbicacionVentaDTO | null> => {
        try {
            const respuesta: UbicacionVentaDTO[] = await ejecutarQuery(
                `SELECT * FROM \"UbicacionVenta\" WHERE \"idUbicacionVenta\" = $1;`,
                [idUbicacionVenta]
            );

            return respuesta.length > 0 ? respuesta[0] : null;

        } catch (error) {
            throw new Error(`Error en UbicacionDAO.getById: ${error}`);
        }

    }


    public create = async (ubicacionVenta: UbicacionVentaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarUbicacionVenta ($1,$2,$3) as resultado;`,
                [
                    ubicacionVenta.idEmpresa,
                    ubicacionVenta.nombreUbicacionVenta,
                    ubicacionVenta.estadoUbicacionVenta
                ]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false; // Si la respuesta está vacía, se retorna false
        }
        catch (error) {
            throw new Error(`Error en UbicacionVentaDAO.create: ${error}`);
        }
    }


    public update = async (ubicacionVenta: UbicacionVentaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarUbicacionVenta($1,$2,$3,$4) as resultado;`,
                [
                    ubicacionVenta.idUbicacionVenta,
                    ubicacionVenta.idEmpresa,
                    ubicacionVenta.nombreUbicacionVenta,
                    ubicacionVenta.estadoUbicacionVenta
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en UbicacionVentaDAO.update: ${error}`);
        }
    }

    public existUbicacionVentaNombre = async (
        nombreUbicacionVenta: string,
        idEmpresa: number
      ): Promise<boolean> => {
        try {
          const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
            `SELECT existeUbicacionVentaNombre($1,$2) as resultado;`,
            [nombreUbicacionVenta, idEmpresa]
          );
    
          return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
          throw new Error(`Error en UbicacionVentaDAO.existeUbicacionVentaNombre: ${error}`);
        }
      };
}
