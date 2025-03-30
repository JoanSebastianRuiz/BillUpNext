import { UsuarioService } from "@/services/UsuarioService";
import { UsuarioDAOImpl } from "@/dao/impl/UsuarioDAOImpl";
import { NextResponse } from "next/server";
import bycript from "bcryptjs";
import { isValidEmail, isValidPhoneNumber, isValidDocument, isValidLength, isValidPassword } from "@/util/validators/validators";
import { plainToInstance } from "class-transformer";
import { UsuarioRequestDTO } from "@/dto/UsuarioRequestDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { UsuarioAutenticacionDTO } from "@/dto/UsuarioAutenticacionDTO";


export class UsuarioServiceImpl implements UsuarioService {
    private static instancia: UsuarioServiceImpl;
    private usuarioDAOImpl: UsuarioDAOImpl = UsuarioDAOImpl.getInstance();
    private constructor() { }

    public static getInstance(): UsuarioServiceImpl {
        if (!UsuarioServiceImpl.instancia) {
            UsuarioServiceImpl.instancia = new UsuarioServiceImpl();
        }
        return UsuarioServiceImpl.instancia;
    }

    public create = async (data: UsuarioRequestDTO): Promise<NextResponse> => {
        const {
            idEmpresa,
            idTipoDocumento,
            idRol,
            idMunicipio,
            numeroDocumentoUsuario,
            nombreUsuario,
            apellidoUsuario,
            correoUsuario,
            telefonoUsuario,
            direccionUsuario,
            claveUsuario,
            estadoUsuario
        } = data


        if (!idEmpresa || !idTipoDocumento || !idRol || !idMunicipio || !numeroDocumentoUsuario || !nombreUsuario || !apellidoUsuario || !correoUsuario || !telefonoUsuario || !direccionUsuario || !claveUsuario || estadoUsuario === undefined) {
            return NextResponse.json({ message: "Faltan campos por llenar" }, { status: 400 })
        }

        if (!isValidLength(nombreUsuario, 100)) {
            return NextResponse.json({ message: "Nombre inválido" }, { status: 400 });
        }

        if (!isValidLength(apellidoUsuario, 100)) {
            return NextResponse.json({ message: "Apellido inválido" }, { status: 400 });
        }

        if (!isValidLength(direccionUsuario, 250)) {
            return NextResponse.json({ message: "Dirección inválida" }, { status: 400 });
        }

        if (!isValidLength(correoUsuario, 250)) {
            return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
        }

        if (!isValidLength(claveUsuario, 250)) {
            return NextResponse.json({ message: "Clave inválida" }, { status: 400 });
        }

        try {
            if (!isValidDocument(numeroDocumentoUsuario)) {
                return NextResponse.json({ message: "Documento inválido" }, { status: 400 });
            }

            if (await this.usuarioDAOImpl.existUsuarioDoc(numeroDocumentoUsuario)) {
                return NextResponse.json({ message: "El numero de documento ya se encuentra registrado" }, { status: 400 });
            }

            if (!isValidEmail(correoUsuario)) {
                return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
            }

            if (await this.usuarioDAOImpl.existUsuarioCorreo(correoUsuario)) {
                return NextResponse.json({ message: "El correo electrónico ya se encuentra registrado" }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoUsuario)) {
                return NextResponse.json({ message: "Teléfono inválido" }, { status: 400 });
            }

            if (await this.usuarioDAOImpl.existUsuarioTelefono(telefonoUsuario)) {
                return NextResponse.json({ message: "El teléfono ya se encuentra registrado" }, { status: 400 });
            }

            // Encriptar clave
            const hashClave = await bycript.hash(claveUsuario, 12);
            const dataFinal: UsuarioRequestDTO = { ...data, claveUsuario: hashClave };

            const respuesta = await this.usuarioDAOImpl.create(dataFinal);

            if (respuesta) {
                return NextResponse.json({ message: "Usuario creado correctamente" }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Error al crear el usuario" }, { status: 400 });
            }

        } catch (error) {
            console.error("Error inesperado:", error);
            return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
        }
    }

    public update = async (data: UsuarioRequestDTO): Promise<NextResponse> => {
        const { idUsuario, idEmpresa, idTipoDocumento, idRol, idMunicipio, numeroDocumentoUsuario, nombreUsuario, apellidoUsuario, correoUsuario, telefonoUsuario, direccionUsuario, estadoUsuario } = data;

        if (!idUsuario || !idEmpresa || !idTipoDocumento || !idRol || !idMunicipio || !numeroDocumentoUsuario || !nombreUsuario || !apellidoUsuario || !correoUsuario || !telefonoUsuario || !direccionUsuario || estadoUsuario === undefined) {
            return Promise.resolve(NextResponse.json({ message: "Faltan campos por llenar" }, { status: 400 }))
        }

        if (!isValidLength(nombreUsuario, 100)) {
            return NextResponse.json({ message: "Nombre inválido" }, { status: 400 });
        }

        if (!isValidLength(apellidoUsuario, 100)) {
            return NextResponse.json({ message: "Apellido inválido" }, { status: 400 });
        }

        if (!isValidLength(direccionUsuario, 250)) {
            return NextResponse.json({ message: "Dirección inválida" }, { status: 400 });
        }

        if (!isValidLength(correoUsuario, 250)) {
            return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
        }

        try {
            const usuarioExistente = await this.usuarioDAOImpl.getByIdUser(idUsuario);
            if (!usuarioExistente) {
                return NextResponse.json({ message: "El usuario no existe" }, { status: 404 });
            }

            if (!isValidDocument(numeroDocumentoUsuario)) {
                return NextResponse.json({ message: "Documento inválido" }, { status: 400 });
            }

            if (numeroDocumentoUsuario !== usuarioExistente.numeroDocumentoUsuario) {
                if (await this.usuarioDAOImpl.existUsuarioDoc(numeroDocumentoUsuario)) {
                    return NextResponse.json({ message: "El número de documento ya se encuentra registrado" }, { status: 400 });
                }
            }

            if (!isValidEmail(correoUsuario)) {
                return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
            }

            if (correoUsuario !== usuarioExistente.correoUsuario) {
                if (await this.usuarioDAOImpl.existUsuarioCorreo(correoUsuario)) {
                    return NextResponse.json({ message: "El correo electrónico ya se encuentra registrado" }, { status: 400 });
                }
            }

            if (!isValidPhoneNumber(telefonoUsuario)) {
                return NextResponse.json({ message: "Teléfono inválido" }, { status: 400 });
            }

            if (telefonoUsuario !== usuarioExistente.telefonoUsuario) {
                if (await this.usuarioDAOImpl.existUsuarioTelefono(telefonoUsuario)) {
                    return NextResponse.json({ message: "El teléfono ya se encuentra registrado" }, { status: 400 });
                }
            }

            const respuesta = await this.usuarioDAOImpl.update(data);

            if (respuesta) {
                return NextResponse.json({ message: "Usuario actualizado correctamente" }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Error al actualizar el usuario" }, { status: 400 });
            }

        } catch (error) {
            console.error("Error inesperado:", error);
            return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
        }
    }

    public getAll = async (): Promise<UsuarioResponseDTO[]> => {
        try {
            const usuariosResponseDTO = await this.usuarioDAOImpl.getAll();
            if (!usuariosResponseDTO) {
                return Promise.resolve([]);
            }

            return usuariosResponseDTO;
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            throw new Error(`Error al obtener los usuarios ${error}`);
        }
    }

    public getByIdUser = async (idUser: number): Promise<UsuarioResponseDTO | null> => {
        try {
            const usuarioResponseDTO = await this.usuarioDAOImpl.getByIdUser(idUser);
            if (!usuarioResponseDTO) {
                return null;
            }
            return usuarioResponseDTO;

        } catch (error) {
            console.error("Error al obtener el usuario por documento:", error);
            throw new Error("Error al obtener el usuario por documento");
        }
    }

    public async autenticarUsuario(numeroDocumentoUsuario: string, claveUsuario: string): Promise<UsuarioAutenticacionDTO | null> {
        try {
            if (!numeroDocumentoUsuario || !claveUsuario) {
                return null;
            }

            const usuarioAutenticacionDTO = await this.getClaveAutenticacion(numeroDocumentoUsuario);
            if (!usuarioAutenticacionDTO || !usuarioAutenticacionDTO.estadoUsuario) {
                return null;
            }

            // Para usuarios registrados antes de la encriptación de la clave
            if (usuarioAutenticacionDTO.claveUsuario == claveUsuario) {
                return usuarioAutenticacionDTO;
            }

            const isValidPassword = await bycript.compare(claveUsuario, usuarioAutenticacionDTO.claveUsuario);
            if (!isValidPassword) {
                return null;
            }

            return usuarioAutenticacionDTO;

        } catch (error) {
            console.error("Error al autenticar el usuario:", error);
            return null;
        }
    }

    private getClaveAutenticacion = async (numeroDocumentoUsuario: string): Promise<UsuarioAutenticacionDTO | null> => {
        try {
            const usuarioAutenticacionDTO = await this.usuarioDAOImpl.getClaveAutenticacion(numeroDocumentoUsuario);
            if (!usuarioAutenticacionDTO || !usuarioAutenticacionDTO.estadoUsuario) {
                return null;
            }
            return usuarioAutenticacionDTO;

        } catch (error) {
            console.error("Error al obtener el usuario por documento:", error);
            throw new Error("Error al obtener el usuario por documento");
        }
    }

    public updateClave = async (data: UsuarioRequestDTO): Promise<NextResponse> => {
        const {
            idUsuario,
            claveUsuario,
            claveNuevaUsuario,
            confirmarClaveUsuario
        } = data


        if (!claveUsuario || !claveNuevaUsuario || !confirmarClaveUsuario || !idUsuario) {
            return NextResponse.json({ message: "Faltan campos por llenar" }, { status: 400 })
        }

        if (claveNuevaUsuario !== confirmarClaveUsuario) {
            return NextResponse.json({ message: "Las contraseñas no coinciden" }, { status: 400 });
        }

        if (claveUsuario === claveNuevaUsuario) {
            return NextResponse.json({ message: "La nueva contraseña no puede ser igual a la actual" }, { status: 400 });
        }

        if (!isValidLength(claveUsuario, 100)) {
            return NextResponse.json({ message: "Longitud de contraseña invalida" }, { status: 400 });
        }

        if (!isValidLength(claveNuevaUsuario, 100)) {
            return NextResponse.json({ message: "Longitud de contraseña nueva invalida" }, { status: 400 });
        }

        if (!isValidLength(confirmarClaveUsuario, 100)) {
            return NextResponse.json({ message: "Longitud de contraseña nueva invalida" }, { status: 400 });
        }

        if (!isValidPassword(claveNuevaUsuario)) {
            return NextResponse.json({ message: "La contraseña nueva no es válida" }, { status: 400 });
        }

        if (!isValidPassword(claveUsuario)) {
            return NextResponse.json({ message: "La contraseña actual no es válida" }, { status: 400 });
        }

        if (!isValidPassword(confirmarClaveUsuario)) {
            return NextResponse.json({ message: "La contraseña nueva no es válida" }, { status: 400 });
        }

        try {
            const datosDB = await this.usuarioDAOImpl.getDatosActualizarClave(idUsuario);

            if (!datosDB) {
                return NextResponse.json({ message: "El usuario no existe" }, { status: 404 });
            }

            if (!datosDB.estadoUsuario) {
                return NextResponse.json({ message: "El usuario no se encuentra activo" }, { status: 400 });
            }

            const isValidPassword = await bycript.compare(claveUsuario, datosDB.claveUsuario);
            if (!isValidPassword) {
                return NextResponse.json({ message: "La contraseña actual es incorrecta" }, { status: 400 });
            }

            // Encriptar clave
            const hashClave = await bycript.hash(claveNuevaUsuario, 12);

            const respuesta = await this.usuarioDAOImpl.updateClave(idUsuario, hashClave);

            if (respuesta) {
                return NextResponse.json({ message: "Contraseña actualizada correctamente" }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Error al actualizar la contraseña" }, { status: 400 });
            }

        } catch (error) {
            console.error("Error inesperado:", error);
            return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
        }
    }

}