import { NextResponse } from "next/server";
import { TerceroProductoServiceImpl } from "@/services/Impl/TerceroProductoServiceImpl";

export const GET = async (_: Request, context: { params: Promise<{ idEmpresa: string }> }) => {
    try {
        const { idEmpresa } = await context.params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const terceroProductoService = TerceroProductoServiceImpl.getInstance();
        const tercerosProducto = await terceroProductoService.getAll(parseInt(idEmpresa));

        return NextResponse.json(tercerosProducto, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los terceros producto de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener los terceros producto de la empresa" }, { status: 500 });
    }
};
