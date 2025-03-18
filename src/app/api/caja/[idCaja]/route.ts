import { NextResponse } from "next/server";
import { CajaServiceImpl } from "@/services/Impl/CajaServiceImpl";

export const PUT = async (request: Request, { params }: { params: { idCaja: string } }) => {
    const cajaService = CajaServiceImpl.getInstance();
    const {idCaja} = params;
    const data = await request.json();

    if (!idCaja) {
        return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    try {
        const dataWithId = { ...data, idCaja: parseInt(idCaja) };
        const respuesta = await cajaService.update(dataWithId);
        return respuesta;
    } catch (error) {
        console.error("Error al actualizar la caja:", error);
        return NextResponse.json({ message: "Error al actualizar la caja" }, { status: 500 });
    }
};

export const GET = async (request: Request, { params }: { params: { idCaja: string } }) => {
    try {
        const cajaService = CajaServiceImpl.getInstance();
        const { idCaja } = await params;
        const caja = await cajaService.getById(parseInt(idCaja));
        return NextResponse.json(caja, { status: 200 });
        
    } catch (error) {
        console.error("Error al obtener la caja por id:", error);
        return NextResponse.json({ message: "Error al obtener la caja por id" }, { status: 500 });
    }
};