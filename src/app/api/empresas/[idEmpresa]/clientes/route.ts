import { NextRequest, NextResponse } from "next/server";
import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";

const terceroService = TerceroServiceImpl.getInstance();

export const GET = async (request : NextRequest, {params} : {params : {idEmpresa : string}}) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const {idEmpresa} = await params;

    if (!idEmpresa) {
        return NextResponse.json({message: "ID inválido"}, {status: 400});
    }

    if(tipo === "persona"){
        const tercero = await terceroService.getAllPersona(parseInt(idEmpresa), false);
        return NextResponse.json(tercero, {status: 200});
    } else if(tipo === "empresa"){
        const tercero = await terceroService.getAllEmpresa(parseInt(idEmpresa), false);
        return NextResponse.json(tercero, {status: 200});
    } else {
        return NextResponse.json({message: "Tipo inválido"}, {status: 400});
    }
}