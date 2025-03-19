import { GravamenProductoServiceImpl } from "@/services/Impl/GravamenProductoServiceImpl";

export const POST = async (request: Request) => {
  
    const gravamenProductoService = GravamenProductoServiceImpl.getInstance();
    const respuesta = await gravamenProductoService.create(await request.json());
    return respuesta;   
};