import { DetalleCajaServiceImpl } from "@/services/Impl/DetalleCajaServiceImpl";

export const POST = async (request: Request) => {
    const detalleCajaService = DetalleCajaServiceImpl.getInstance();
    const respuesta = await detalleCajaService.create(await request.json());
    return respuesta;
}