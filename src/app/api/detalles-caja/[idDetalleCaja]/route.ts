import { NextResponse } from "next/server";
import { DetalleCajaServiceImpl } from "@/services/Impl/DetalleCajaServiceImpl";

export const PUT = async (request: Request, context: { params: Promise<{ idDetalleCaja: string }> }) => {
    const detalleCajaService = DetalleCajaServiceImpl.getInstance();
    const { idDetalleCaja } = await context.params;
    const data = await request.json();

    if (!idDetalleCaja) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idDetalleCaja: parseInt(idDetalleCaja) };
        const respuesta = await detalleCajaService.update(dataWithId);
        return respuesta;
    } catch (error) {
        console.error("Error al actualizar el detalle de caja:", error);
        return NextResponse.json({ message: "Error al actualizar el detalle de caja" }, { status: 500 });
    }
}

export const GET = async (request: Request,  context: { params: Promise<{ idDetalleCaja: string }> }) => {
    try {
        const detalleCajaService = DetalleCajaServiceImpl.getInstance();
        const { idDetalleCaja } = await context.params;
        const detalleCaja = await detalleCajaService.getById(parseInt(idDetalleCaja));
        return NextResponse.json(detalleCaja, { status: 200 });

    } catch (error) {
        console.error("Error al obtener el detalle de caja por id:", error);
        return NextResponse.json({ message: "Error al obtener el detalle de caja por id" }, { status: 500 });
    }
}
