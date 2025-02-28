import { NextResponse } from "next/server";
import { CategoriaServiceImpl } from "@/services/Impl/CategoriaServiceImpl";

export const GET = async ({ params }: { params: { idCategoria: string } }) => {
  try {
    const categoriaService = CategoriaServiceImpl.getInstance();
    const { idCategoria } = await params;
    const categoria = await categoriaService.getById(parseInt(idCategoria));
    return NextResponse.json(categoria, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la categoria por id:", error);
    return NextResponse.json(
      { message: "Error al obtener la categoria por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: { idCategoria: string } }
) => {
  const categoriaService = CategoriaServiceImpl.getInstance();
  const { idCategoria } = params;
  const data = await request.json();

  if (!idCategoria) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idCategoria: parseInt(idCategoria) };
    const respuesta = await categoriaService.update(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    return NextResponse.json(
      { message: "Error al actualizar la categoria" },
      { status: 500 }
    );
  }
};
