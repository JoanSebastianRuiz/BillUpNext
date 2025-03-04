import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";
import { NextRequest } from "next/server";

const terceroService = TerceroServiceImpl.getInstance();

export const PUT = async (request: NextRequest, {params} : {params : {idTercero : string}}) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const {idTercero} = await params;

    if (!idTercero) {
        return {message: "ID inválido"};
    }
    
    const data = await request.json();
    const dataWithId = { ...data, idTercero: parseInt(idTercero) };

    if(tipo === "persona"){
        const respuesta = await terceroService.updatePersona(dataWithId);
        return respuesta;
    } else if(tipo === "empresa"){
        const respuesta = await terceroService.updateEmpresa(dataWithId);
        return respuesta;
    } else {
        return {message: "Tipo de tercero no válido"};
    }
}

export const GET = async (request: NextRequest, {params} : {params : {idTercero : string}}) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo");
    const {idTercero} = await params;

    if (!idTercero) {
        return {message: "ID inválido"};
    }

    if(tipo === "persona"){
        const tercero = await terceroService.getByIdTerceroPersona(parseInt(idTercero));
        return tercero;
    } else if(tipo === "empresa"){
        const tercero = await terceroService.getByIdTerceroEmpresa(parseInt(idTercero));
        return tercero;
    } else {
        return {message: "Tipo de tercero no válido"};
    }
}