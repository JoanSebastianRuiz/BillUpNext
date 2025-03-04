import { UbicacionVentaDAO } from "@/dao/UbicacionVentaDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";
import { UbicacionVenta } from "@/models/UbicacionVenta";

export class UbicacionVentaDAOImpl implements UbicacionVentaDAO {
    private static instancia: UbicacionVentaDAOImpl;
    private constructor() { }

    public static getInstance(): UbicacionVentaDAOImpl {
        if (!UbicacionVentaDAOImpl.instancia){
            UbicacionVentaDAOImpl.instancia = new UbicacionVentaDAOImpl();
        }
        return UbicacionVentaDAOImpl.instancia;
    }

    public getAll = async(): Promise<Array<UbicacionVentaDTO>> =>{
        try {
            const ubicacionVentaDatabase : UbicacionVentaDTO[] = await ejecutarQuery(
                `SELECT * FROM \"UbicacionVenta\";`,
                []
            );

            return ubicacionVentaDatabase;

        } catch (error) {
            throw new Error(`Error en UbicacionVenta.getAll: ${error}`);
        }

    }


    public getById = async(idUbicacionVenta : number): Promise<UbicacionVentaDTO | null> => {
        try {
            const respuesta : UbicacionVentaDTO[] = await ejecutarQuery(
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
                    ubicacionVenta.idUbicacionVenta,
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
                `SELECT actualizarUbicacionVenta($1,$2,$3) as resultado;`, 
                [
                    ubicacionVenta.idUbicacionVenta,
                    ubicacionVenta.nombreUbicacionVenta,
                    ubicacionVenta.estadoUbicacionVenta
                ]  
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en UbicacionVentaDAO.update: ${error}`);
        }
    }


    public delete = async (idUbicacionVenta : number): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
               `SELECT eliminarUbicacionVenta($1) as resultado;`, 
               [idUbicacionVenta]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en UbicacionVentaDAO.delete: ${error}`);
        }

    }


}
