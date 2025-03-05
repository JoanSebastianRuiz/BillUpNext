import { NextResponse } from "next/server";
import { DetalleCajaServiceImpl } from "@/services/Impl/DetalleCajaServiceImpl";
import { request } from "http";

export const GET = async () => {
    try {
        const detalleCajaService = DetalleCajaServiceImpl.getInstance();
        const respuesta = await detalleCajaService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los detalles de caja:", error);
        return NextResponse.json({ message: "Error al obtener los detalles de caja" }, { status: 500 });
    }
}

export const POST = async (request: Request) => {
    const detalleCajaService = DetalleCajaServiceImpl.getInstance();
    const respuesta = await detalleCajaService.create(await request.json());
    return respuesta;
}