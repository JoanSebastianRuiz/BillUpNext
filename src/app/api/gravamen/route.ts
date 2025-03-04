import { NextResponse } from "next/server";
import { GravamenServiceImpl } from "@/services/Impl/GravamenServiceImpl";

export const GET = async () => {
    try {
        const gravamenService = GravamenServiceImpl.getInstance();
        const respuesta = await gravamenService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obetener el gravamen:", error);
        return NextResponse.json(
            { message: "Error al obtener el gravamen"},
            { status: 500 }
        );
    }
};

export const POST = async (request: Request) => {
    const gravamenService = GravamenServiceImpl.getInstance();
    const respuesta = await gravamenService.create(await request.json());
    return respuesta;
};