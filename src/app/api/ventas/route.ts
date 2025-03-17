import { NextResponse } from "next/server";
import { VentaServiceImpl } from "@/services/Impl/VentaServiceImpl";

export const GET = async () => {
    try {
        const ventaService = VentaServiceImpl.getInstance();
        const respuesta = await ventaService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obetener la venta:", error);
        return NextResponse.json(
            { message: "Error al obtener la venta"},
            { status: 500 }
        );
    }
};

export const POST = async (request: Request) => {
    const ventaService = VentaServiceImpl.getInstance();
    const respuesta = await ventaService.create(await request.json());
    return respuesta;
};