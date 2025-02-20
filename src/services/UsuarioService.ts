import { NextResponse } from "next/server";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { UsuarioRequestDTO } from "@/dto/UsuarioRequestDTO";
import { UsuarioAutenticacionDTO } from "@/dto/UsuarioAutenticacionDTO";
export interface UsuarioService{
    create (data: UsuarioRequestDTO): Promise<NextResponse>;
    update(data: UsuarioRequestDTO): Promise<NextResponse>;
    delete(idUsuario: number): Promise<boolean>;
    getAll(): Promise<Array<UsuarioResponseDTO>>;
    getByIdUser(idUser: number): Promise<UsuarioResponseDTO | null>;
    autenticarUsuario(numeroDocumentoUsuario: string, claveUsuario: string): Promise<UsuarioAutenticacionDTO | null>;
}

