import { MovimientoServiceImpl } from "@/services/Impl/MovimientoServiceImpl";

export const POST = async (request: Request) => {
  
    const movimientoService = MovimientoServiceImpl.getInstance();
    const respuesta = await movimientoService.create(await request.json());
    return respuesta;   
};