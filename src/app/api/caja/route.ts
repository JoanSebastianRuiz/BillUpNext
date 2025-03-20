import { NextResponse } from "next/server";
import { CajaServiceImpl } from "@/services/Impl/CajaServiceImpl";

export const POST = async (request: Request) => {
    try {
        const cajaService = CajaServiceImpl.getInstance();
        const respuesta = await cajaService.create(await request.json());
        return respuesta;
    } catch (error) {
        console.error("Error al crear la caja:", error);
        return NextResponse.json({ message: "Error al crear la caja" }, { status: 500 });
    }
};