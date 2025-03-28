import { NextResponse } from "next/server";
import { TipoMedioPagoServiceImpl } from "@/services/Impl/TipoMedioPagoServiceImpl";

export const GET = async () => {
    try {
        const tipoMedioPagoService = TipoMedioPagoServiceImpl.getInstance();
        const respuesta = await tipoMedioPagoService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obtener los tipos de medio de pago:", error);
        return NextResponse.json({ message: "Error al obtener los tipos de medio de pago" }, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    const tipoMedioPagoService = TipoMedioPagoServiceImpl.getInstance();
    const respuesta = await tipoMedioPagoService.create(await request.json());
    return respuesta;
};