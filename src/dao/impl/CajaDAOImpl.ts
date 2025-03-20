import { CajaDAO } from "../CajaDAO";
import { CajaDTO } from "@/dto/CajaDTO";
import { ejecutarQuery } from "@/connection/conexion";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class CajaDAOImpl implements CajaDAO {
    getEmpresas(idEmpresa: number) {
       throw new Error("Method not implemented.");
    }
    private static instancia: CajaDAOImpl;
    private constructor() { }
    

    public static getInstance(): CajaDAOImpl {
        if ( !CajaDAOImpl.instancia){
            CajaDAOImpl.instancia = new CajaDAOImpl();
        }
        return CajaDAOImpl.instancia;
    }

    public getAll = async(idEmpresa: number): Promise<Array<CajaDTO>> => {
        try {
            const cajaDatabase : CajaDTO[] = await ejecutarQuery(
                `SELECT * FROM \"Caja\" c
                JOIN \"Empresa\" e ON e.\"idEmpresa\"=c.\"idEmpresa\"
                WHERE c.\"idEmpresa\"=$1;`,
                [idEmpresa]
            );

            return  cajaDatabase;
        } catch (error) {
            throw new Error(`Error en CajaDAO.getAll: ${error}`);
        }
    }


    public getById = async(idCaja : number): Promise<CajaDTO | null> => {
        try {
            const respuesta : CajaDTO[] = await ejecutarQuery(
                `SELECT * FROM \"Caja\" WHERE \"idCaja\" = $1;`,
                [idCaja]
            );

            return respuesta.length > 0 ? respuesta[0] : null;

        } catch (error) {
            throw new Error(`Error en CajaDAO.getById: ${error}`);
        }
    }

    public create = async (caja: CajaDTO): Promise<boolean>=> {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarCaja($1,$2,$3) as resultado;`,
                [
                    caja.idEmpresa,
                    caja.nombreCaja,
                    caja.estadoCaja,
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en CajaDAO.create: ${error}`);
        }
    }


    public update = async (caja: CajaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarCaja($1,$2,$3,$4) as resultado;`,
                [
                    caja.idCaja,
                    caja.idEmpresa,
                    caja.nombreCaja,
                    caja.estadoCaja
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en CajaDAO.update: ${error}`);
        }
    }


    public existCajaNombre = async (nombreCaja: string, idEmpresa: number): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery( `SELECT validarExistCajaNombre ($1,$2) as resultado;`,[nombreCaja,idEmpresa]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en CajaDAO.existCajaNombre: ${error}`);
        }
    }

}