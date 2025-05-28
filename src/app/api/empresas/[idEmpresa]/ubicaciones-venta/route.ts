import { NextResponse } from "next/server";
import { UbicacionVentaServiceImpl } from "@/services/Impl/UbicacionVentaServiceImpl";

export const GET = async (_: Request, context: { params: Promise<{ idEmpresa: string }> }) => {
    try {
        const { idEmpresa } = await context.params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const ubicacionService = UbicacionVentaServiceImpl.getInstance();
        const ubicaciones = await ubicacionService.getAll(parseInt(idEmpresa));

        return NextResponse.json(ubicaciones, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las ubicaciones de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener las ubicaciones de la empresa" }, { status: 500 });
    }
};
