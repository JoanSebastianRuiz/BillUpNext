import { TerceroServiceImpl } from "@/services/Impl/TerceroServiceImpl";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const {searchParams} = request.nextUrl;
    const tipo = searchParams.get("tipo"); 
    const terceroService = TerceroServiceImpl.getInstance();
    const data = await request.json();

    if(tipo === "persona"){
        const respuesta = await terceroService.createPersona(data);
        return respuesta;
    } else if(tipo === "empresa"){
        const respuesta = await terceroService.createEmpresa(data);
        return respuesta;
    } else {
        return {message: "Tipo de tercero no válido"};
    }
}