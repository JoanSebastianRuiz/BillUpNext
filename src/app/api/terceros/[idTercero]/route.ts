import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";
import { NextRequest, NextResponse } from "next/server";

const terceroService = TerceroServiceImpl.getInstance();

export const PUT = async (request: NextRequest, {params} : {params : {idTercero : string}}) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const {idTercero} = await params;

    if (!idTercero) {
        return NextResponse.json({message: "ID inválido"}, {status: 400});
    }
    console.log("ID TERCERO", idTercero);
    
    const data = await request.json();
    const dataWithId = { ...data, idTercero: parseInt(idTercero.toString()) };

    if(tipo === "persona"){
        const respuesta = await terceroService.updatePersona(dataWithId);
        return respuesta;
    } else if(tipo === "empresa"){
        const respuesta = await terceroService.updateEmpresa(dataWithId);
        return respuesta;
    } else {
        return NextResponse.json({message: "Tipo de tercero no válido"}, {status: 400});
    }
}

export const GET = async (request: NextRequest, {params} : {params : {idTercero : string}}) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const {idTercero} = await params;

    if (!idTercero) {
        return NextResponse.json({message: "ID inválido"}, {status: 400});
    }

    if(tipo === "persona"){
        const tercero = await terceroService.getByIdTerceroPersona(parseInt(idTercero));
        return NextResponse.json(tercero, {status: 200});
    } else if(tipo === "empresa"){
        const tercero = await terceroService.getByIdTerceroEmpresa(parseInt(idTercero));
        return NextResponse.json(tercero, {status: 200});
    } else {
        return NextResponse.json({message: "Tipo de tercero no válido"}, {status: 400});
    }
}