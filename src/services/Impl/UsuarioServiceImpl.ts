import { UsuarioService } from "@/services/UsuarioService";
import { UsuarioDAOImpl } from "@/dao/impl/UsuarioDAOImpl";
import { NextResponse } from "next/server";
import bycript from "bcryptjs";
import { isValidEmail, isValidPhoneNumber, isValidDocument, isValidLength } from "@/util/validators/validators";
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
        

        if (!idEmpresa || !idTipoDocumento || !idRol || !idMunicipio || !numeroDocumentoUsuario || !nombreUsuario || !apellidoUsuario || !correoUsuario || !telefonoUsuario || !direccionUsuario || !claveUsuario || !estadoUsuario) {
            return NextResponse.json({ message: "Faltan campos por llenar" }, { status: 400 })
        }

        if(!isValidLength(nombreUsuario, 100)){
            return NextResponse.json({ message: "Nombre inválido" }, { status: 400 });
        }

        if(!isValidLength(apellidoUsuario, 100)){
            return NextResponse.json({ message: "Apellido inválido" }, { status: 400 });
        }

        if(!isValidLength(direccionUsuario, 250)){
            return NextResponse.json({ message: "Dirección inválida" }, { status: 400 });
        }

        if(!isValidLength(correoUsuario, 250)){
            return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
        }

        if(!isValidLength(claveUsuario, 250)){
            return NextResponse.json({ message: "Clave inválida" }, { status: 400 });
        }

        try {
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

            if (!isValidDocument(numeroDocumentoUsuario)) {
                return NextResponse.json({ message: "Documento inválido" }, { status: 400 });
            }

            // Encriptar clave
            const hashClave = await bycript.hash(claveUsuario, 12);
            const dataFinal : UsuarioRequestDTO = { ...data, claveUsuario: hashClave };

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

        if (!idUsuario || !idEmpresa || !idTipoDocumento || !idRol || !idMunicipio || !numeroDocumentoUsuario || !nombreUsuario || !apellidoUsuario || !correoUsuario || !telefonoUsuario || !direccionUsuario || !estadoUsuario) {
            return Promise.resolve(NextResponse.json({ message: "Faltan campos por llenar" }, { status: 400 }))
        }

        if(!isValidLength(nombreUsuario, 100)){
            return NextResponse.json({ message: "Nombre inválido" }, { status: 400 });
        }

        if(!isValidLength(apellidoUsuario, 100)){
            return NextResponse.json({ message: "Apellido inválido" }, { status: 400 });
        }

        if(!isValidLength(direccionUsuario, 250)){
            return NextResponse.json({ message: "Dirección inválida" }, { status: 400 });
        }

        if(!isValidLength(correoUsuario, 250)){
            return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
        }

        try {
            const usuarioExistente = await this.usuarioDAOImpl.getByIdUser(idUsuario);
            if (!usuarioExistente) {
                return NextResponse.json({ message: "El usuario no existe" }, { status: 404 });
            }

            const existeDocumento = await this.usuarioDAOImpl.existUsuarioDoc(numeroDocumentoUsuario);
            if (existeDocumento && usuarioExistente.numeroDocumentoUsuario !== numeroDocumentoUsuario) {
                return NextResponse.json({ message: "El número de documento ya se encuentra registrado" }, { status: 400 });
            }

            if (!isValidEmail(correoUsuario)) {
                return NextResponse.json({ message: "Correo inválido" }, { status: 400 });
            }

            const existeCorreo = await this.usuarioDAOImpl.existUsuarioCorreo(correoUsuario);
            if (existeCorreo && usuarioExistente.correoUsuario !== correoUsuario) {
                return NextResponse.json({ message: "El correo electrónico ya se encuentra registrado" }, { status: 400 });
            }

            if (!isValidPhoneNumber(telefonoUsuario)) {
                return NextResponse.json({ message: "Teléfono inválido" }, { status: 400 });
            }

            const existeTelefono = await this.usuarioDAOImpl.existUsuarioTelefono(telefonoUsuario);
            if (existeTelefono && usuarioExistente.telefonoUsuario !== telefonoUsuario) {
                return NextResponse.json({ message: "El teléfono ya se encuentra registrado" }, { status: 400 });
            }

            if (!isValidDocument(numeroDocumentoUsuario)) {
                return NextResponse.json({ message: "Documento inválido" }, { status: 400 });
            }

            let dataFinal: UsuarioRequestDTO = { ...data };

            const respuesta = await this.usuarioDAOImpl.update(dataFinal);

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
    
    public getAll = async (): Promise<UsuarioResponseDTO[]> =>{
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

    public getByIdUser = async(idUser: number): Promise<UsuarioResponseDTO | null> =>{
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
            if (!usuarioAutenticacionDTO) {
                return null;
            }

            // Para pruebas
            if(usuarioAutenticacionDTO.claveUsuario == claveUsuario){
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

    private getClaveAutenticacion = async(numeroDocumentoUsuario: string): Promise<UsuarioAutenticacionDTO | null> =>{
        try {
            const UsuarioAutenticacionDTO = await this.usuarioDAOImpl.getClaveAutenticacion(numeroDocumentoUsuario);
            if (!UsuarioAutenticacionDTO) {
                return null;
            }
            return UsuarioAutenticacionDTO;

        } catch (error) {
            console.error("Error al obtener el usuario por documento:", error);
            throw new Error("Error al obtener el usuario por documento");
        }
    }

}