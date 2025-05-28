import { NextResponse } from "next/server";
import { ProductoServiceImpl } from "@/services/Impl/ProductoServiceImpl";

export const GET = async (
  _: Request,
  context: { params: Promise<{ idProducto: string }> }
) => {
  try {
    const productoService = ProductoServiceImpl.getInstance();
    const { idProducto } = await context.params;

    if (!idProducto) {
      return NextResponse.json({ message: "idProducto es requerido" }, { status: 400 });
    }
    
    const producto = await productoService.getById(parseInt(idProducto));
    return NextResponse.json(producto, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el producto por id", error);
    return NextResponse.json(
      { message: "Error al obtener el producto por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  context: { params: Promise<{ idProducto: string }> }
) => {
  const productoService = ProductoServiceImpl.getInstance();
  const { idProducto } = await context.params;
  const data = await request.json();

  if (!idProducto) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idProducto: parseInt(idProducto) };
    const respuesta = await productoService.update(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json(
      { message: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
};
