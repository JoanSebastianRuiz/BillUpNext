import { NextResponse } from "next/server";
import { RegimenContribuyenteServiceImpl } from "@/services/Impl/RegimenContribuyenteServiceImpl";

export const GET = async () => {
    try {
        const regimenContribuyenteServiceImpl = RegimenContribuyenteServiceImpl.getInstance();
        const response = await regimenContribuyenteServiceImpl.getAll();
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error(`Error al obtener los regimnes contribuyentes: ${error}`);
        return NextResponse.json({ message: 'Error al obtener los regimnes contribuyentes' }, { status: 500 });
    }
}