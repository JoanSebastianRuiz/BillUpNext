import { NextResponse } from "next/server";
import { ProductoServiceImpl } from "@/services/Impl/ProductoServiceImpl";

export const GET = async (_: Request, { params }: { params: { idEmpresa: string } }) => {
    try {
        const { idEmpresa } = await params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const productoService = ProductoServiceImpl.getInstance();
        const productos = await productoService.getAll(parseInt(idEmpresa));

        return NextResponse.json(productos, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los productos de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener los productos de la empresa" }, { status: 500 });
    }
};