import { UbicacionVentaServiceImpl } from "@/services/Impl/UbicacionVentaServiceImpl";

export const POST = async ( request: Request ) => {

    const UbicacionVentaService = UbicacionVentaServiceImpl.getInstance();
    const respuesta = await UbicacionVentaService.create( await request.json() );
    return respuesta;
};