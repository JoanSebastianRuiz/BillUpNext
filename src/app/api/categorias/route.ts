import { CategoriaServiceImpl } from "@/services/Impl/CategoriaServiceImpl";

export const POST = async (request: Request) => {
  
    const categoriaService = CategoriaServiceImpl.getInstance();
    const respuesta = await categoriaService.create(await request.json());
    return respuesta;   
};