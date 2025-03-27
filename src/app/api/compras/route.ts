import { CompraServiceImpl } from "@/services/Impl/CompraServiceImpl";

export const POST = async (request: Request) => {
    const compraService = CompraServiceImpl.getInstance();
    const respuesta = await compraService.create(await request.json());
    return respuesta;
};