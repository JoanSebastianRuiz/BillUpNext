import { NextResponse } from "next/server";
import { CompraServiceImpl } from "@/services/Impl/CompraServiceImpl";

export const GET = async () => {
    try {
        const compraService = CompraServiceImpl.getInstance();
        const respuesta = await compraService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obetener la compra:", error);
        return NextResponse.json(
            { message: "Error al obtener la compra"},
            { status: 500 }
        );
    }
};

export const POST = async (request: Request) => {
    const compraService = CompraServiceImpl.getInstance();
    const respuesta = await compraService.create(await request.json());
    return respuesta;
};