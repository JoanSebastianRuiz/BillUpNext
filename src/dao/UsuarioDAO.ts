import { UsuarioAutenticacionDTO } from "@/dto/UsuarioAutenticacionDTO";
import { UsuarioRequestDTO } from "@/dto/UsuarioRequestDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

export interface UsuarioDAO {
    create(usuario: UsuarioRequestDTO): Promise<boolean>;
    update(usuario: UsuarioRequestDTO): Promise<boolean>;
    getAll(): Promise<Array<UsuarioResponseDTO>>;
    getByIdUser(idUsuario: number): Promise<UsuarioResponseDTO | null>;
    existUsuarioDoc(numeroDocumentoUsuario: string): Promise<boolean>;
    existUsuarioCorreo(correoUsuario: string): Promise<boolean>;
    existUsuarioTelefono(telefonoUsuario: string): Promise<boolean>;
    getClaveAutenticacion(numeroDocumentoUsuario: string): Promise<UsuarioAutenticacionDTO | null>;
    getDatosActualizarClave(idUsuario: number): Promise<UsuarioAutenticacionDTO | null>;
    updateClave(idUsuario: number, claveUsuario : string): Promise<boolean>;
}