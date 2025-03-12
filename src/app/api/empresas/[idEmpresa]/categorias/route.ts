import { NextResponse } from "next/server";
import { CategoriaServiceImpl } from "@/services/Impl/CategoriaServiceImpl";

export const GET = async (_: Request, { params }: { params: { idEmpresa: string } }) => {
    try {
        const { idEmpresa } = await params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const categoriaService = CategoriaServiceImpl.getInstance();
        const categorias = await categoriaService.getAll(parseInt(idEmpresa));

        return NextResponse.json(categorias, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las categorias de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener las categorias de la empresa" }, { status: 500 });
    }
};