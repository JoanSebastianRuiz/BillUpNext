import { TipoMedioPagoDAO } from "@/dao/TipoMedioPagoDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class TipoMedioPagoDAOImpl implements TipoMedioPagoDAO {
    private static instancia: TipoMedioPagoDAOImpl;
    private constructor() { }

    public static getInstance(): TipoMedioPagoDAOImpl{
        if (!TipoMedioPagoDAOImpl.instancia) {
            TipoMedioPagoDAOImpl.instancia = new TipoMedioPagoDAOImpl();
        }
        return TipoMedioPagoDAOImpl.instancia;
    }

    public getAll = async(): Promise<Array<TipoMedioPagoDTO>> => {
        try {
            const tipoMedioPagoDatabase : TipoMedioPagoDTO[] = await ejecutarQuery(
                `SELECT * FROM \"TipoMedioPago\";`,
                []
            );

            return tipoMedioPagoDatabase;

        } catch (error) {
            throw new Error(`Error en TipoMedioPagoDAO.getAll: ${error}`);
        }
    }

    public getById = async(idTipoMedioPago : number): Promise<TipoMedioPagoDTO | null> => {
        try {
            const respuesta : TipoMedioPagoDTO[] = await ejecutarQuery(
                `SELECT * FROM \"TipoMedioPago\" WHERE \"idTipoMedioPago\" = $1;`,
                [idTipoMedioPago]
            );

            return respuesta.length >0 ? respuesta[0] : null;

        } catch (error) {
            throw new Error(`Error en TipoMedioPagoDAO.getById: ${error}`);
        }
    }


    public create = async(tipoMedioPago: TipoMedioPagoDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarTipoMedioPago($1,$2) as resultado;`,
                [
                    tipoMedioPago.nombreTipoMedioPago,
                    tipoMedioPago.estadoTipoMedioPago
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en TipoMedioPagoDAO.create: ${error}`);
        }
        
    }


    public update = async(tipoMedioPago: TipoMedioPagoDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarTipoMedioPago($1,$2,$3) as resultado;`,
                [
                    tipoMedioPago.idTipoMedioPago,
                    tipoMedioPago.nombreTipoMedioPago,
                    tipoMedioPago.estadoTipoMedioPago
                ]
            );

            return respuesta.length >0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en TipoMedioPagoDAO.update: ${error}`);
        }
    }

    public delete = async (idTipoMedioPago: number): Promise<boolean> =>{
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT eliminarTipoMedioPago($1) as resultado;`,
                [idTipoMedioPago]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en TipoMedioPagoDAO.delete: ${error}`);
        }

    }


    public existNombreTipoMedioPago = async (nombreTipoMedioPago: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery(`SELECT validarExistNombreTipoMedioPago ($1) as resultado;`, [nombreTipoMedioPago]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TipoMedioPagoDAO.existNombreTipoMedioPago: ${error}`);
        }
    }

};