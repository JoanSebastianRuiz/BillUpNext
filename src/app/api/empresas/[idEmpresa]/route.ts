import { NextResponse } from "next/server";
import { EmpresaServiceImpl } from "@/services/Impl/EmpresaServiceImpl";

export const GET = async ({ params }: { params: { idEmpresa: string } }) => {
    try {
        const empresaService = EmpresaServiceImpl.getInstance();
        const { idEmpresa } = await params;
        const empresa = await empresaService.getById(parseInt(idEmpresa));
        return NextResponse.json(empresa, { status: 200 });
    } catch (error) {
        console.error("Error al obtener la empresa por id:", error);
        return NextResponse.json({ message: "Error al obtener la empresa por id" }, { status: 500 });
    }
}

export const PUT = async (request: Request, { params }: { params: { idEmpresa: string } }) => {
    const empresaService = EmpresaServiceImpl.getInstance();
    const { idEmpresa } = params;
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
