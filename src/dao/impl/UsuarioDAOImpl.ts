import { UsuarioDAO } from "@/dao/UsuarioDAO";
import { ejecutarQuery } from "@/connection/conexion"
import { UsuarioRequestDTO } from "@/dto/UsuarioRequestDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { UsuarioAutenticacionDTO } from "@/dto/UsuarioAutenticacionDTO";

export class UsuarioDAOImpl implements UsuarioDAO {
    private static instancia: UsuarioDAOImpl;
    private constructor() { }


    public static getInstance(): UsuarioDAOImpl {
        if (!UsuarioDAOImpl.instancia) {
            UsuarioDAOImpl.instancia = new UsuarioDAOImpl();
        }
        return UsuarioDAOImpl.instancia;
    }

    public create = async (usuario: UsuarioRequestDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT insertarUsuario ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) as resultado;`,
                [
                    usuario.idEmpresa,
                    usuario.idTipoDocumento,
                    usuario.idMunicipio,
                    usuario.idRol,
                    usuario.numeroDocumentoUsuario,
                    usuario.nombreUsuario,
                    usuario.apellidoUsuario,
                    usuario.correoUsuario,
                    usuario.telefonoUsuario,
                    usuario.direccionUsuario,
                    usuario.claveUsuario,
                    usuario.estadoUsuario
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false; // Si la respuesta está vacía, se retorna false
        }
        catch (error) {
            throw new Error(`Error en UsuarioDAO.create: ${error}`);
        }
    }



    public update = async (usuario: UsuarioRequestDTO): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarUsuario ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) as resultado;`,
                [
                    usuario.idUsuario,
                    usuario.idEmpresa,
                    usuario.idTipoDocumento,
                    usuario.idMunicipio,
                    usuario.idRol,
                    usuario.numeroDocumentoUsuario,
                    usuario.nombreUsuario,
                    usuario.apellidoUsuario,
                    usuario.correoUsuario,
                    usuario.telefonoUsuario,
                    usuario.direccionUsuario,
                    usuario.estadoUsuario
                ]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false; // Si la respuesta está vacía, se retorna false
        }
        catch (error) {
            throw new Error(`Error en UsuarioDAO.update: ${error}`);
        }
    }

    public getAll = async (): Promise<Array<UsuarioResponseDTO>> => {
        try {
            const respuesta: UsuarioResponseDTO[] = await ejecutarQuery(
                `SELECT u.\"idUsuario\", u.\"idEmpresa\", u.\"idTipoDocumento\", u.\"idMunicipio\", 
                m.\"idDepartamento\", u.\"idRol\", u.\"numeroDocumentoUsuario\", u.\"nombreUsuario\", 
                u.\"apellidoUsuario\", u.\"correoUsuario\", u.\"telefonoUsuario\", u.\"direccionUsuario\", 
                u.\"estadoUsuario\"
                FROM \"Usuario\" u 
                JOIN \"Municipio\" m ON m.\"idMunicipio\" = u.\"idMunicipio\";`,
                []
            );

            return respuesta;
        } catch (error) {
            throw new Error(`Error en UsuarioDAO.getAll: ${error}`);
        }
    }


    public getByIdUser = async (idUsuario: number): Promise<UsuarioResponseDTO | null> => {
        try {
            const respuesta: UsuarioResponseDTO[] = await ejecutarQuery(
                `SELECT u.\"idUsuario\", u.\"idEmpresa\", u.\"idTipoDocumento\", u.\"idMunicipio\", 
                m.\"idDepartamento\", u.\"idRol\", u.\"numeroDocumentoUsuario\", u.\"nombreUsuario\", 
                u.\"apellidoUsuario\", u.\"correoUsuario\", u.\"telefonoUsuario\", u.\"direccionUsuario\", 
                u.\"estadoUsuario\"
                FROM \"Usuario\" u 
                JOIN \"Municipio\" m ON m.\"idMunicipio\" = u.\"idMunicipio\"
                WHERE u.\"idUsuario\" = $1;`,
                [idUsuario]
            );

            return respuesta.length > 0 ? respuesta[0] : null;

        } catch (error) {
            throw new Error(`Error en UsuarioDAO.getByIdUser: ${error}`);
        }

    }

    public existUsuarioDoc = async (numeroDocumentoUsuario: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery(`SELECT validarExisteUsuarioDoc ($1) as resultado;`, [numeroDocumentoUsuario]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en UsuarioDAO.existUsuarioDoc: ${error}`);
        }
    }

    public existUsuarioCorreo = async (correoUsuario: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery(`SELECT validarExisteUsuarioCorreo ($1) as resultado;`, [correoUsuario]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en UsuarioDAO.existUsuarioCorreo: ${error}`);
        }
    }

    public existUsuarioTelefono = async (telefonoUsuario: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery(`SELECT validarExisteUsuarioTelefono ($1) as resultado;`, [telefonoUsuario]);
            return respuesta.length > 0 ? respuesta[0].resultado : false;
        } catch (error) {
            throw new Error(`Error en UsuarioDAO.existUsuarioTelefono: ${error}`);
        }
    }

    public getClaveAutenticacion = async (numeroDocumentoUsuario: string): Promise<UsuarioAutenticacionDTO | null> => {
        try {
            const respuesta = await ejecutarQuery<UsuarioAutenticacionDTO>(
                `SELECT \"claveUsuario\", \"numeroDocumentoUsuario\", \"idRol\", \"idUsuario\", \"idEmpresa\", \"estadoUsuario\" FROM \"Usuario\" WHERE \"numeroDocumentoUsuario\" = $1;`,
                [numeroDocumentoUsuario]
            );

            return respuesta.length > 0 ? respuesta[0] : null;
        } catch (error) {
            throw new Error(`Error en UsuarioDAO.getClaveAutenticacion: ${error}`);
        }
    }

    public getDatosActualizarClave = async (idUsuario: number): Promise<UsuarioAutenticacionDTO | null> => {
        try {
            const respuesta = await ejecutarQuery<UsuarioAutenticacionDTO>(
                `SELECT \"claveUsuario\", \"estadoUsuario\" FROM \"Usuario\" WHERE \"idUsuario\" = $1;`,
                [idUsuario]
            );

            return respuesta.length > 0 ? respuesta[0] : null;
        } catch (error) {
            throw new Error(`Error en UsuarioDAO.getClaveUsuario: ${error}`);
        }
    }

    public updateClave = async (idUsuario: number, claveUsuario: string): Promise<boolean> => {
        try {
            const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
                `SELECT actualizarClaveUsuario ($1,$2) as resultado;`,
                [idUsuario, claveUsuario]
            );

            return respuesta.length > 0 ? respuesta[0].resultado : false; // Si la respuesta está vacía, se retorna false
        }
        catch (error) {
            throw new Error(`Error en UsuarioDAO.updateClave: ${error}`);
        }
    }

}

