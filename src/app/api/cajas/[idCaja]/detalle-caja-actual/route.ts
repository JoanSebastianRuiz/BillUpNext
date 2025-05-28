import { NextResponse } from "next/server";
import { CajaServiceImpl } from "@/services/Impl/CajaServiceImpl";

export const GET = async (_: Request, context: { params: Promise<{ idCaja: string }> }) => {
    try {
        const { idCaja } = await context.params;
        if (!idCaja) {
            return NextResponse.json({ message: "idCaja es requerido" }, { status: 400 });
        }

        const cajaService = CajaServiceImpl.getInstance();
        const detalleCaja = await cajaService.getDetalleCajaActual(parseInt(idCaja));

        return NextResponse.json(detalleCaja, { status: 200 });
    } catch (error) {
        console.error("Error al obtener el detalle caja actual:", error);
        return NextResponse.json({ message: "Error al obtener el detalle caja actual" }, { status: 500 });
    }
};
