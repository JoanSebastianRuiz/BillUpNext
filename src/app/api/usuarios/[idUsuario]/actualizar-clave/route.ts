import { NextResponse } from "next/server"
import { UsuarioServiceImpl } from "@/services/Impl/UsuarioServiceImpl"

export const PUT = async (request: Request, { params }: { params: { idUsuario: string } }) => {
    const usuarioService = UsuarioServiceImpl.getInstance();
    const { idUsuario } = await params;
    const data = await request.json();

    if (!idUsuario) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idUsuario: parseInt(idUsuario) };
        const respuesta = await usuarioService.updateClave(dataWithId);
        return respuesta;
    } catch (error) {
        console.error("Error al actualizar la contraseña del usuario:", error);
        return NextResponse.json({ message: "Error al actualizar la contraseña del usuario" }, { status: 500 });
    }
};