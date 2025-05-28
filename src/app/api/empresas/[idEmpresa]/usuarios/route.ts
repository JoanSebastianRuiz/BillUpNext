import { NextResponse } from "next/server";
import { EmpresaServiceImpl } from "@/services/Impl/EmpresaServiceImpl";

export const GET = async (_: Request, context: { params: Promise<{ idEmpresa: string }> }) => {
    try {
        const { idEmpresa } = await context.params;
        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }

        const empresaService = EmpresaServiceImpl.getInstance();
        const empresa = await empresaService.getUsuarios(parseInt(idEmpresa));

        return NextResponse.json(empresa, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los usuarios de la empresa:", error);
        return NextResponse.json({ message: "Error al obtener los usuarios de la empresa" }, { status: 500 });
    }
};