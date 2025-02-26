import { NextResponse } from "next/server"
import { UsuarioServiceImpl } from "@/services/Impl/UsuarioServiceImpl"

export const PUT = async (request: Request, { params }: { params: { idUsuario: string } }) => {
    const usuarioService = UsuarioServiceImpl.getInstance();
    const { idUsuario } = params;
    const data = await request.json();

    if (!idUsuario) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idUsuario: parseInt(idUsuario) };
        const respuesta = await usuarioService.update(dataWithId);
        return respuesta;
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return NextResponse.json({ message: "Error al actualizar el usuario" }, { status: 500 });
    }
};

export const GET = async (request: Request, { params }: { params: { idUsuario: string } }) => {
    try {
        const usuarioService = UsuarioServiceImpl.getInstance();
        const { idUsuario } = await params;
        const usuario = await usuarioService.getByIdUser(parseInt(idUsuario));
        return NextResponse.json(usuario, { status: 200 });
    } catch (error) {
        console.error("Error al obtener el usuario por id:", error);
        return NextResponse.json({ message: "Error al obtener el usuario por id" }, { status: 500 });
    }
}

