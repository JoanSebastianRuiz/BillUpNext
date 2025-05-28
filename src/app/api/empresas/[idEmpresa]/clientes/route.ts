import { NextRequest, NextResponse } from "next/server";
import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";

const terceroService = TerceroServiceImpl.getInstance();

export const GET = async (request : NextRequest, context: { params: Promise<{ idEmpresa: string }> }) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const {idEmpresa} = await context.params;

    if (!idEmpresa) {
        return NextResponse.json({message: "ID inválido"}, {status: 400});
    }

    if(tipo === "persona"){
        const terceros = await terceroService.getAllPersona(parseInt(idEmpresa), false);
        return NextResponse.json(terceros, {status: 200});
    } else if(tipo === "empresa"){
        const terceros = await terceroService.getAllEmpresa(parseInt(idEmpresa), false);
        return NextResponse.json(terceros, {status: 200});
    } else {
        return NextResponse.json({message: "Tipo inválido"}, {status: 400});
    }
}