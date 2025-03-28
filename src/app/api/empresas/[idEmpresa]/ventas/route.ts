import { NextResponse } from "next/server";
import { VentaServiceImpl } from "@/services/Impl/VentaServiceImpl";


export const GET = async (_: Request, { params }: { params: { idEmpresa: string } }) => {
    try {
        const { idEmpresa } = await params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const ventaService = VentaServiceImpl.getInstance();
        const ventas = await ventaService.getAll(parseInt(idEmpresa));

        return NextResponse.json(ventas, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las ventas de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener las ventas de la empresa" }, { status: 500 });
    }
};