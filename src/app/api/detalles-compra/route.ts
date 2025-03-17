import { NextResponse } from "next/server";
import { DetalleCompraServiceImpl } from "@/services/Impl/DetalleCompraServiceImpl";

export const GET = async () => {
    try {
        const detalleCompraService = DetalleCompraServiceImpl.getInstance();
        const respuesta = await detalleCompraService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obetener el detalle de la compra:", error);
        return NextResponse.json(
            { message: "Error al obtener el detalle de la compra"},
            { status: 500 }
        );
    }
};

export const POST = async (request: Request) => {
    const detalleCompraService = DetalleCompraServiceImpl.getInstance();
    const respuesta = await detalleCompraService.create(await request.json());
    return respuesta;
};