import { NextResponse } from "next/server";
import { CategoriaServiceImpl } from "@/services/Impl/CategoriaServiceImpl";

export const GET = async () => {
  try {
    const categoriaService = CategoriaServiceImpl.getInstance();
    const respuesta = await categoriaService.getAll();
    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    return NextResponse.json(
      { message: "Error al obtener las categorías" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  
    const categoriaService = CategoriaServiceImpl.getInstance();
    const respuesta = await categoriaService.create(await request .json());
    return respuesta;   
};