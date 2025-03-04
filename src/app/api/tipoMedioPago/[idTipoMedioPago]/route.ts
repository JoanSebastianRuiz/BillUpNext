import { NextResponse } from "next/server";
import { TipoMedioPagoServiceImpl } from "@/services/Impl/TipoMedioPagoServiceImpl";

export const PUT = async (request: Request, { params }: { params: { idTipoMedioPago: string } }) => {
    const tipoMedioPagoService = TipoMedioPagoServiceImpl.getInstance();
    const { idTipoMedioPago } = params;
    const data = await request.json();

    if (!idTipoMedioPago) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idTipoMedioPago: parseInt(idTipoMedioPago) };
        const respuesta = await tipoMedioPagoService.update(dataWithId);
        return respuesta;
    } catch (error) {
        console.error("Error al actualizar el tipo de medio de pago:", error);
        return NextResponse.json({ message: "Error al actualizar el tipo de medio de pago" }, { status: 500 });
    }
};

export const GET = async (request: Request, { params }: { params: { idTipoMedioPago: string } }) => {
    try {
        const tipoMedioPagoService = TipoMedioPagoServiceImpl.getInstance();
        const { idTipoMedioPago } = await params;
        const tipoMedioPago = await tipoMedioPagoService.getById(parseInt(idTipoMedioPago));
        return NextResponse.json(tipoMedioPago, { status: 200 });
    } catch (error) {
        console.error("Error al obtener el tipo de medio de pago por id:", error);
        return NextResponse.json({ message: "Error al obtener el tipo de medio de pago por id" }, { status: 500 });
    }
};