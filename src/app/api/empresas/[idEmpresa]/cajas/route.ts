import { NextResponse } from "next/server";
import { CajaServiceImpl } from "@/services/Impl/CajaServiceImpl";

export const GET = async (_: Request, context: { params: Promise<{ idEmpresa: string }> }) => {
    try {
        const { idEmpresa } = await context.params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const cajaService = CajaServiceImpl.getInstance();
        const cajas = await cajaService.getAll(parseInt(idEmpresa));

        return NextResponse.json(cajas, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las cajas de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener las cajas de la empresa" }, { status: 500 });
    }
};
