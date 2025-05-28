import { NextResponse } from "next/server";
import { CajaServiceImpl } from "@/services/Impl/CajaServiceImpl";

export const PUT = async (
    request: Request,
    context: { params: Promise<{ idCaja: string }> }
) => {
    const cajaService = CajaServiceImpl.getInstance();
    const { idCaja } = await context.params;

    if (!idCaja) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const respuesta = await cajaService.close(parseInt(idCaja));
        return respuesta;
    } catch (error) {
        console.error("Error al cerrar la caja:", error);
        return NextResponse.json({ message: "Error al cerrar la caja" }, { status: 500 });
    }
};