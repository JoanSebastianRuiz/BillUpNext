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
        const terceros = await terceroService.getAllPersona(parseInt(idEmpresa), true);
        console.log(terceros);
        return NextResponse.json(terceros, {status: 200});
    } else if(tipo === "empresa"){
        const terceros = await terceroService.getAllEmpresa(parseInt(idEmpresa), true);
        console.log(terceros);
        return NextResponse.json(terceros, {status: 200});
    } else {
        return NextResponse.json({message: "Tipo de tercero no válido"}, {status: 400});
    }
}