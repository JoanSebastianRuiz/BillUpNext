import { NextResponse } from "next/server";
import { TerceroProductoServiceImpl } from "@/services/Impl/TerceroProductoServiceImpl";
import { GravamenProductoServiceImpl } from "@/services/Impl/GravamenProductoServiceImpl";

export const GET = async (_: Request, { params }: { params: { idEmpresa: string } }) => {
    try {
        const { idEmpresa } = await params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const gravamenProductoService = GravamenProductoServiceImpl.getInstance();
        const gravamenesProducto = await gravamenProductoService.getAll(parseInt(idEmpresa));

        return NextResponse.json(gravamenesProducto, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los gravamenes producto de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener los gravamenes producto de la empresa" }, { status: 500 });
    }
};

