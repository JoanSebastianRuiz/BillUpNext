import { NextResponse } from "next/server";
import { CajaServiceImpl } from "@/services/Impl/CajaServiceImpl";

export const GET = async (request: Request, context: { params: Promise<{ idUsuario: string }> }) => {
    try {
        const cajaService = CajaServiceImpl.getInstance();
        const { idUsuario } = await context.params;

        if (!idUsuario) {
            return NextResponse.json({ message: "ID inválido" }, { status: 400 });
        }

        const respuesta = await cajaService.getCajaAbiertaUsuario(parseInt(idUsuario));
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obtener la caja abierta por el usuario:", error);
        return NextResponse.json({ message: "Error al obtener la caja abierta por el usuario" }, { status: 500 });
    }
};

