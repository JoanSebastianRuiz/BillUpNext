import { NextResponse } from "next/server";
import { UbicacionVentaServiceImpl } from "@/services/Impl/UbicacionVentaServiceImpl";

export const GET = async () => {
    try {
        const UbicacionVentaService = UbicacionVentaServiceImpl.gerInstance();
        const respuesta = await UbicacionVentaService.getAll();
        return NextResponse.json(respuesta, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las ubicaciones de venta:", error);
        return NextResponse.json(
            { message: "Error al obtener las ubicaciones de venta" },
            { status: 500 }
        );
    }
};

export const POST = async ( request: Request ) => {

    const UbicacionVentaService = UbicacionVentaServiceImpl.gerInstance();
    const respuesta = await UbicacionVentaService.create( await request.json() );
    return respuesta;
};