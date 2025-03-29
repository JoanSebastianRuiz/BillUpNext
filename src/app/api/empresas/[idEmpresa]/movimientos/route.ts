import { NextResponse } from "next/server";
import { MovimientoServiceImpl } from "@/services/Impl/MovimientoServiceImpl";

export const GET = async (_: Request, { params }: { params: { idEmpresa: string } }) => {
    try {
        const { idEmpresa } = await params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const movimientoService = MovimientoServiceImpl.getInstance();
        const movimientos = await movimientoService.getAll(parseInt(idEmpresa));

        return NextResponse.json(movimientos, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los movimientos de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener los movimientos de la empresa" }, { status: 500 });
    }
};
