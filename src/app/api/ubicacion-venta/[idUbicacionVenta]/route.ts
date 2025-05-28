import { NextResponse } from "next/server";
import { UbicacionVentaServiceImpl } from "@/services/Impl/UbicacionVentaServiceImpl";

export const GET = async (request: Request, context: { params: Promise<{ idUbicacionVenta: string }> }) => {
    try {
        const ubicacionVentaService = UbicacionVentaServiceImpl.getInstance();
        const { idUbicacionVenta } = await context.params;

        console.log(idUbicacionVenta);

        if (!idUbicacionVenta) {
            return NextResponse.json({ message: "idUbicacionVenta es requerido" }, { status: 400 });
        }

        const ubicacionVenta = await ubicacionVentaService.getById(parseInt(idUbicacionVenta));
        return NextResponse.json(ubicacionVenta, { status: 200 });

    } catch (error) {
        console.error("Error al obtener la ubicacion de venta por id:", error);
        return NextResponse.json(
            { message: "Error al obtener la ubicacion de venta por id" },
            { status: 500 }
        );
    }
};

export const PUT = async (request: Request, context: { params: Promise<{ idUbicacionVenta: string }> }) => {
    const ubicacionVentaService = UbicacionVentaServiceImpl.getInstance();
    const { idUbicacionVenta } = await context.params;
    const data = await request.json();

    if (!idUbicacionVenta) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idUbicacionVenta: parseInt(idUbicacionVenta) };
        const respuesta = await ubicacionVentaService.update(dataWithId);
        return respuesta;

    } catch (error) {
        console.error("Error al actualizar la ubicacion de venta: ", error);
        return NextResponse.json(
            { message: "Error al actualizar la ubicacion de venta " }, { status: 500 }
        );
    }

};