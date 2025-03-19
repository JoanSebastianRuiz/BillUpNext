import { DetalleCajaDAO } from "@/dao/DetalleCajaDAO"; 
import { ejecutarQuery } from "@/connection/conexion";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";


export class DetalleCajaDAOImpl implements DetalleCajaDAO {
    private static instancia: DetalleCajaDAOImpl;
    private constructor() { }

    public static getInstance(): DetalleCajaDAOImpl {
        if (!DetalleCajaDAOImpl.instancia) {
            DetalleCajaDAOImpl.instancia = new DetalleCajaDAOImpl();
        }
        return DetalleCajaDAOImpl.instancia;
    }

    public getAll = async(): Promise<Array<DetalleCajaDTO>> => {

        try {
            const detalleCajaDatabase : DetalleCajaDTO[]= await ejecutarQuery(
                `SELECT d.\"idDetalleCaja\", d.\"idCaja\", d.\"idUsuario\", d.\"FechaAperturaDetalleCaja\", d.\"FechaCierreDetalleCaja\" d.\"DineroAperturaDetalleCaja\", d.\"DineroCierreDetalleCaja\", d.\"DineroCierreSistemaDetalleCaja\"
                FROM \"DetalleCaja\" d;`,
                []
            );

            return detalleCajaDatabase;

        } catch (error) {
            throw new Error(`Error en DetalleCajaDAO.getAll: ${error}`);
        }
    }


    public getById = async(idDetalleCaja : number) : Promise<DetalleCajaDTO | null> => {
        try {
            const respuesta : DetalleCajaDTO[] = await ejecutarQuery(

                `SELECT d.\"idDetalleCaja\", d.\"idCaja\", d.\"idUsuario\", d.\"FechaAperturaDetalleCaja\", d.\"FechaCierreDetalleCaja\" d.\"DineroAperturaDetalleCaja\", d.\"DineroCierreDetalleCaja\", d.\"DineroCierreSistemaDetalleCaja\"
                FROM \"DetalleCaja\" d
                WHERE \"idDetalleCaja\" = $1;`,
                [idDetalleCaja]
            );

            return respuesta.length > 0 ? respuesta[0] : null;

        } catch (error) {
            throw new Error(`Error en DetalleCajaDAO.getById: ${error}`);
        }
    }


    public create = async(detalleCaja : DetalleCajaDTO) : Promise<boolean> => {
        try {
            const respuesta  = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarEmpresa($1,$2,$3,$4,$5,$6,$7) as resultado;`,
                [
                    detalleCaja.idCaja,
                    detalleCaja.idUsuario,
                    detalleCaja.fechaAperturaDetalleCaja,
                    detalleCaja.fechaCierreDetalleCaja,
                    detalleCaja.dineroAperturaDetalleCaja,
                    detalleCaja.dineroCierreDetalleCaja,
                    detalleCaja.dineroCierreSistemaDetalleCaja
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en DetalleCajaDAO.create: ${error}`);
        }
    }


    public update = async(detalleCaja : DetalleCajaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO >(
                `SELECT insertarEmpresa($1,$2,$3,$4,$5,$6,$7,$8) as resultado;`,
                [
                    detalleCaja.idDetalleCaja,
                    detalleCaja.idCaja,
                    detalleCaja.idUsuario,
                    detalleCaja.fechaAperturaDetalleCaja,
                    detalleCaja.fechaCierreDetalleCaja,
                    detalleCaja.dineroAperturaDetalleCaja,
                    detalleCaja.dineroCierreDetalleCaja,
                    detalleCaja.dineroCierreSistemaDetalleCaja
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;

        } catch (error) {
            throw new Error(`Error en DetalleCajaDAO.update: ${error}`);
        }
    }

}
