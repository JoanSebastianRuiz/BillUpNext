import { TerceroDAO } from "../TerceroDAO";
import { TerceroRequestEmpresaDTO } from "@/dto/TerceroRequestEmpresaDTO";
import { TerceroRequestPersonaDTO } from "@/dto/TerceroRequestPersonaDTO";
import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";
import { ejecutarQuery } from "@/connection/conexion";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class TerceroDAOImpl implements TerceroDAO {
    private static instancia: TerceroDAOImpl;

    public static getInstancia(): TerceroDAOImpl {
        if (!TerceroDAOImpl.instancia) {
            TerceroDAOImpl.instancia = new TerceroDAOImpl();
        }
        return TerceroDAOImpl.instancia;
    }

    public createEmpresa = async (tercero: TerceroRequestEmpresaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarTerceroEmpresa ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) as resultado;`,
                [
                    tercero.idEmpresa,
                    tercero.idTipoPersona,
                    tercero.idRegimenContribuyente,
                    tercero.idMunicipio,
                    tercero.nitTercero,
                    tercero.digitoVerificacionTercero,
                    tercero.nombreTercero,
                    tercero.razonSocialTercero,
                    tercero.direccionTercero,
                    tercero.codigoPostalTercero,
                    tercero.telefonoTercero,
                    tercero.correoTercero,
                    tercero.proveedorTercero,
                    tercero.estadoTercero
                ]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.createEmpresa: ${error}`);
        }
    }

    public createPersona = async (tercero: TerceroRequestPersonaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarTerceroPersona ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) as resultado;`,
                [
                    tercero.idEmpresa,
                    tercero.idTipoDocumento,
                    tercero.idMunicipio,
                    tercero.numeroDocumentoTercero,
                    tercero.nombreTercero,
                    tercero.apellidoTercero,
                    tercero.telefonoTercero,
                    tercero.direccionTercero,
                    tercero.correoTercero,
                    tercero.proveedorTercero,
                    tercero.estadoTercero
                ]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.createPersona: ${error}`);
        }
    }

    public updateEmpresa = async (tercero: TerceroRequestEmpresaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarTerceroEmpresa ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) as resultado;`,
                [
                    tercero.idTercero,
                    tercero.idEmpresa,
                    tercero.idTipoPersona,
                    tercero.idRegimenContribuyente,
                    tercero.idMunicipio,
                    tercero.nitTercero,
                    tercero.digitoVerificacionTercero,
                    tercero.nombreTercero,
                    tercero.razonSocialTercero,
                    tercero.direccionTercero,
                    tercero.codigoPostalTercero,
                    tercero.telefonoTercero,
                    tercero.correoTercero,
                    tercero.estadoTercero
                ]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.updateEmpresa: ${error}`);
        }
    }

    public updatePersona = async (tercero: TerceroRequestPersonaDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarTerceroPersona ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) as resultado;`,
                [
                    tercero.idTercero,
                    tercero.idEmpresa,
                    tercero.idTipoDocumento,
                    tercero.idMunicipio,
                    tercero.numeroDocumentoTercero,
                    tercero.nombreTercero,
                    tercero.apellidoTercero,
                    tercero.telefonoTercero,
                    tercero.direccionTercero,
                    tercero.correoTercero,
                    tercero.estadoTercero
                ]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.updatePersona: ${error}`);
        }
    }

    public getAllEmpresa = async (idEmpresa: number, estadoProveedor: boolean): Promise<TerceroResponseEmpresaDTO[]> => {
        try {
            const respuesta: TerceroResponseEmpresaDTO[] = await ejecutarQuery<TerceroResponseEmpresaDTO>(
                `SELECT 
                    t.\"idTercero\",
                    t.\"idTipoPersona\", 
                    t.\"idMunicipio\", 
                    m.\"idDepartamento\", 
                    t.\"idRegimenContribuyente\", 
                    t.\"nitTercero\", 
                    t.\"digitoVerificacionTercero\", 
                    t.\"razonSocialTercero\", 
                    t.\"nombreTercero\", 
                    t.\"telefonoTercero\", 
                    t.\"direccionTercero\", 
                    t.\"correoTercero\", 
                    t.\"codigoPostalTercero\", 
                    t.\"proveedorTercero\", 
                    t.\"estadoTercero\"
                FROM \"Tercero\" t 
                JOIN \"Municipio\" m ON m.\"idMunicipio\" = t.\"idMunicipio\"
                WHERE \"idEmpresa\"=$1 and \"estadoProveedor\"=$2;`,
                [idEmpresa, estadoProveedor]
            );

            return respuesta;
        }
        catch (error) {
            throw new Error(`Error en TerceroDAO.getAllEmpresa: ${error}`);
        }
    }

    public getAllPersona = async (idEmpresa: number, estadoProveedor: boolean): Promise<TerceroResponsePersonaDTO[]> => {
        try {
            const respuesta = await ejecutarQuery<TerceroResponsePersonaDTO>(
                `SELECT 
                    t.\"idTercero\",
                    t.\"idTipoDocumento\", 
                    t.\"idMunicipio\", 
                    m.\"idDepartamento\", 
                    t.\"numeroDocumentoTercero\", 
                    t.\"nombreTercero\", 
                    t.\"apellidoTercero\", 
                    t.\"telefonoTercero\", 
                    t.\"direccionTercero\", 
                    t.\"correoTercero\", 
                    t.\"proveedorTercero\", 
                    t.\"estadoTercero\"
                FROM \"Tercero\" t 
                JOIN \"Municipio\" m ON m.\"idMunicipio\" = t.\"idMunicipio\"
                WHERE \"idEmpresa\"=$1 and \"estadoProveedor\"=$2;`,
                [idEmpresa, estadoProveedor]
            );

            return respuesta;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.getAllPersona: ${error}`);
        }
    }

    public getByIdTerceroPersona = async (idTercero: number): Promise<TerceroResponsePersonaDTO | null> => {
        try {
            const respuesta = await ejecutarQuery<TerceroResponsePersonaDTO>(
                `SELECT 
                    t.\"idTercero\",
                    t.\"idTipoDocumento\", 
                    t.\"idMunicipio\", 
                    m.\"idDepartamento\", 
                    t.\"numeroDocumentoTercero\", 
                    t.\"nombreTercero\", 
                    t.\"apellidoTercero\", 
                    t.\"telefonoTercero\", 
                    t.\"direccionTercero\", 
                    t.\"correoTercero\", 
                    t.\"proveedorTercero\", 
                    t.\"estadoTercero\"
                FROM \"Tercero\" t 
                JOIN \"Municipio\" m ON m.\"idMunicipio\" = t.\"idMunicipio\"
                WHERE \"idTercero\"=$1;`,
                [idTercero]
            );

            return respuesta.length > 0 ? respuesta[0] : null;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.getByIdTerceroPersona: ${error}`);
        }
    }

    public getByIdTerceroEmpresa = async (idTercero: number): Promise<TerceroResponseEmpresaDTO | null> => {
        try {
            const respuesta = await ejecutarQuery<TerceroResponseEmpresaDTO>(
                `SELECT 
                    t.\"idTercero\",
                    t.\"idTipoPersona\", 
                    t.\"idMunicipio\", 
                    m.\"idDepartamento\", 
                    t.\"idRegimenContribuyente\", 
                    t.\"nitTercero\", 
                    t.\"digitoVerificacionTercero\", 
                    t.\"razonSocialTercero\", 
                    t.\"nombreTercero\", 
                    t.\"telefonoTercero\", 
                    t.\"direccionTercero\", 
                    t.\"correoTercero\", 
                    t.\"codigoPostalTercero\", 
                    t.\"proveedorTercero\", 
                    t.\"estadoTercero\"
                FROM \"Tercero\" t 
                JOIN \"Municipio\" m ON m.\"idMunicipio\" = t.\"idMunicipio\"
                WHERE \"idTercero\"=$1;`,
                [idTercero]
            );

            return respuesta.length > 0 ? respuesta[0] : null;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.getByIdTerceroEmpresa: ${error}`);
        }
    }

    public existTerceroDoc = async (numeroDocumentoTercero: string, idEmpresa: number, estadoProveedor: boolean): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT validarExisteTerceroDoc ($1,$2,$3) as resultado;`,
                [numeroDocumentoTercero, idEmpresa, estadoProveedor]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.existTerceroDoc: ${error}`);
        }
    }

    public existTerceroNit = async (nitTercero: string, idEmpresa: number, estadoProveedor: boolean): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT validarExisteTerceroNit ($1,$2,$3) as resultado;`,
                [nitTercero, idEmpresa, estadoProveedor]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.existTerceroNit: ${error}`);
        }
    }

    public existTerceroCorreo = async (correoTercero: string, idEmpresa: number, estadoProveedor: boolean): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT validarExisteTerceroCorreo ($1,$2,$3) as resultado;`,
                [correoTercero, idEmpresa, estadoProveedor]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.existTerceroCorreo: ${error}`);
        }
    }

    public existTerceroTelefono = async (telefonoTercero: string, idEmpresa: number, estadoProveedor: boolean): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT validarExisteTerceroTelefono ($1,$2,$3) as resultado;`,
                [telefonoTercero, idEmpresa, estadoProveedor]
            );
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en TerceroDAO.existTerceroTelefono: ${error}`);
        }
    }
}