import { EmpresaDAO } from "@/dao/EmpresaDAO";
import { ejecutarQuery } from "@/connection/conexion"
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { EmpresaRequestDTO } from "@/dto/EmpresaRequestDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class EmpresaDAOImpl implements EmpresaDAO {
    private static instancia: EmpresaDAOImpl;
    private constructor() { }

    public static getInstance(): EmpresaDAOImpl {
        if (!EmpresaDAOImpl.instancia) {
            EmpresaDAOImpl.instancia = new EmpresaDAOImpl();
        }
        return EmpresaDAOImpl.instancia;
    }

    public getAll = async(): Promise<Array<EmpresaResponseDTO>> => {
        try {
            const empresasDatabase : EmpresaResponseDTO[] = await ejecutarQuery(
                `SELECT * FROM \"Empresa\";`,
                []
            );

            return empresasDatabase;
       
        } catch (error) {
            throw new Error(`Error en EmpresaDAO.getAll: ${error}`);
        }
    }

    public getById = async(idEmpresa : number): Promise<EmpresaResponseDTO | null> => {
        try {
            const respuesta : EmpresaResponseDTO[] = await ejecutarQuery(
                `SELECT * FROM \"Empresa\" WHERE \"idEmpresa\" = $1;`,
                [idEmpresa]
            );

            return respuesta.length > 0 ? respuesta[0] : null;
       
        } catch (error) {
            throw new Error(`Error en EmpresaDAO.getById: ${error}`);
        }
    }

    public create = async (empresa: EmpresaRequestDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarEmpresa($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) as resultado;`,
                [
                    empresa.idTipoPersona,
                    empresa.idRegimenContribuyente,
                    empresa.idMunicipio,
                    empresa.nitEmpresa,
                    empresa.digitoVerificacionEmpresa,
                    empresa.nombreEmpresa,
                    empresa.razonSocialEmpresa,
                    empresa.direccionEmpresa,
                    empresa.codigoPostalEmpresa,
                    empresa.telefonoEmpresa,
                    empresa.correoEmpresa,
                    empresa.logoEmpresa,
                    empresa.estadoEmpresa
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;
       
        } catch (error) {
            throw new Error(`Error en EmpresaDAO.create: ${error}`);
        }
    }
    public update = async (empresa: EmpresaRequestDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarEmpresa($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) as resultado;`,
                [
                    empresa.idEmpresa,
                    empresa.idTipoPersona,
                    empresa.idRegimenContribuyente,
                    empresa.idMunicipio,
                    empresa.nitEmpresa,
                    empresa.digitoVerificacionEmpresa,
                    empresa.nombreEmpresa,
                    empresa.razonSocialEmpresa,
                    empresa.direccionEmpresa,
                    empresa.codigoPostalEmpresa,
                    empresa.telefonoEmpresa,
                    empresa.correoEmpresa,
                    empresa.logoEmpresa,
                    empresa.estadoEmpresa
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false;
       
        } catch (error) {
            throw new Error(`Error en EmpresaDAO.update: ${error}`);
        }
    }

    public existEmpresaNit = async (nitEmpresa: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery(`SELECT validarExisteEmpresaNit ($1) as resultado;`, [nitEmpresa]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en EmpresaDAO.existEmpresaNit: ${error}`);
        }
    }

    public existEmpresaCorreo = async (correoEmpresa: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery(`SELECT validarExisteEmpresaCorreo ($1) as resultado;`, [correoEmpresa]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en EmpresaDAO.existEmpresaCorreo: ${error}`);
        }
    }

    public existEmpresaTelefono = async (telefonoEmpresa: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery(`SELECT validarExisteEmpresaTelefono ($1) as resultado;`, [telefonoEmpresa]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en EmpresaDAO.existEmpresaTelefono: ${error}`);
        }
    }

}