import { NextResponse } from "next/server";
import { EmpresaServiceImpl } from "@/services/Impl/EmpresaServiceImpl";

export const GET = async (_:Request, context: { params: Promise<{ idEmpresa: string }> }) => {
    try {
        const empresaService = EmpresaServiceImpl.getInstance();
        const { idEmpresa } = await context.params;

        if (!idEmpresa) {
            return NextResponse.json({ message: "idEmpresa es requerido" }, { status: 400 });
        }
        
        const empresa = await empresaService.getById(parseInt(idEmpresa));
        return NextResponse.json(empresa, { status: 200 });
    } catch (error) {
        console.error("Error al obtener la empresa por id:", error);
        return NextResponse.json({ message: "Error al obtener la empresa por id" }, { status: 500 });
    }
}

export const PUT = async (request: Request, context: { params: Promise<{ idEmpresa: string }> }) => {
    const empresaService = EmpresaServiceImpl.getInstance();
    const { idEmpresa } = await context.params;
    const data = await request.json();

    if (!idEmpresa) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idEmpresa: parseInt(idEmpresa) };
        const respuesta = await empresaService.update(dataWithId);
        return respuesta;
    } catch (error) {
        console.error("Error al actualizar la empresa:", error);
        return NextResponse.json({ message: "Error al actualizar la empresa" }, { status: 500 });
    }
}
