import { ProductoServiceImpl } from "@/services/Impl/ProductoServiceImpl";



export const POST = async (request: Request) => {
  const productoService = ProductoServiceImpl.getInstance();
  const respuesta = await productoService.create(await request.json());
  return respuesta;
};
