import { NextResponse } from "next/server";
import { TerceroProductoServiceImpl } from "@/services/Impl/TerceroProductoServiceImpl";

export const GET = async (_:Request, { params }: { params: { idTerceroProducto: string } }) => {
    try {
        const terceroProductoService = TerceroProductoServiceImpl.getInstance();
        const { idTerceroProducto } = await params;

        if (!idTerceroProducto) {
            return NextResponse.json({ message: "idTerceroProducto es requerido" }, { status: 400 });
        }

        const terceroProducto = await terceroProductoService.getById(parseInt(idTerceroProducto));
        return NextResponse.json(terceroProducto, { status: 200 });
    } catch (error) {
        console.error("Error al obtener terceroProducto por id", error);
        return NextResponse.json(
            { message: "Error al obtener terceroProducto por id"},
            { status: 500 }
        );
    }
};

export const PUT = async (
    request: Request,
    { params }: { params: { idTerceroProducto: string }}
) => {
    const terceroProductoService = TerceroProductoServiceImpl.getInstance();
    const { idTerceroProducto } = await params;
    const data = await request.json();

    if (!idTerceroProducto) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idTerceroProducto: parseInt(idTerceroProducto) };
        const respuesta = await terceroProductoService.update(dataWithId);
        return respuesta;
    } catch (error) {
        console.error("Error al actualizar terceroProducto:", error);
        return NextResponse.json(
            { message: "Error al actualizar terceroProducto"},
            { status: 500 }
        );
    }
};