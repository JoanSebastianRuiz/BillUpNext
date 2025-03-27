import { NextResponse } from "next/server";
import { CompraServiceImpl } from "@/services/Impl/CompraServiceImpl";


export const GET = async (_: Request, { params }: { params: { idEmpresa: string } }) => {
    try {
        const { idEmpresa } = await params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const compraService = CompraServiceImpl.getInstance();
        const compras = await compraService.getAll(parseInt(idEmpresa));

        return NextResponse.json(compras, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las compras de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener las compras de la empresa" }, { status: 500 });
    }
};
