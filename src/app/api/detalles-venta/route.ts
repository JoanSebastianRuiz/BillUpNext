import { NextResponse } from "next/server";
import { DetalleVentaServiceImpl } from "@/services/Impl/DetalleVentaServiceImpl";

export const GET = async () => {
    try {
        const detalleVentaService = DetalleVentaServiceImpl.getInstance();
        const respuesta = await detalleVentaService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obetener el detalle de la venta:", error);
        return NextResponse.json(
            { message: "Error al obtener el detalle de la venta"},
            { status: 500 }
        );
    }
};

export const POST = async (request: Request) => {
    const detalleVentaService = DetalleVentaServiceImpl.getInstance();
    const respuesta = await detalleVentaService.create(await request.json());
    return respuesta;
};