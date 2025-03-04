import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo"); 
    const terceroService = TerceroServiceImpl.getInstance();
    if(tipo === "persona"){
        const respuesta = await terceroService.createPersona(await request.json());
        return respuesta;
    } else if(tipo === "empresa"){
        const respuesta = await terceroService.createEmpresa(await request.json());
        return respuesta;
    } else {
        return {message: "Tipo de tercero no válido"};
    }
}