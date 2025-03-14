import { TerceroProductoServiceImpl } from "@/services/Impl/TerceroProductoServiceImpl";

export const POST = async (request: Request) => {
    const terceroProductoService = TerceroProductoServiceImpl.getInstance();
    const respuesta = await terceroProductoService.create(await request.json());
    return respuesta;
};