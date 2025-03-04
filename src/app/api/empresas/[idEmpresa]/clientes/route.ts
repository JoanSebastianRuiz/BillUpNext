import { NextRequest, NextResponse } from "next/server";
import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";

const terceroService = TerceroServiceImpl.getInstance();

export const GET = async (request : NextRequest, {params} : {params : {idEmpresa : string}}) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const {idEmpresa} = await params;

    if (!idEmpresa) {
        return {message: "ID inválido"};
    }

    if(tipo === "persona"){
        const tercero = await terceroService.getAllPersona(parseInt(idEmpresa), false);
        return tercero;
    } else if(tipo === "empresa"){
        const tercero = await terceroService.getAllEmpresa(parseInt(idEmpresa), false);
        return tercero;
    } else {
        return {message: "Tipo de tercero no válido"};
    }
}