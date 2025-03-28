import { NextResponse } from "next/server";
import { DetalleVentaServiceImpl } from "@/services/Impl/DetalleVentaServiceImpl";


export const GET = async (_: Request, { params }: { params: { idEmpresa: string } }) => {
    try {
        const { idEmpresa } = await params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const detalleVentaService = DetalleVentaServiceImpl.getInstance();
        const detalles = await detalleVentaService.getAll(parseInt(idEmpresa));

        return NextResponse.json(detalles, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los detalles de las ventas de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener los detalles de las ventas de la empresa" }, { status: 500 });
    }
};


