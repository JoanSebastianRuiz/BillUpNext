import { VentaServiceImpl } from "@/services/Impl/VentaServiceImpl";

export const POST = async (request: Request) => {
    const ventaService = VentaServiceImpl.getInstance();
    const respuesta = await ventaService.create(await request.json());
    return respuesta;
};