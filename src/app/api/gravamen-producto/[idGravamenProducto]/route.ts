import { NextResponse } from "next/server";
import { GravamenProductoServiceImpl } from "@/services/Impl/GravamenProductoServiceImpl";

export const GET = async (_:Request, context: { params: Promise<{ idGravamenProducto: string }> }) => {
  try {
    const gravamenProductoService = GravamenProductoServiceImpl.getInstance();
    const { idGravamenProducto } = await context.params;

    if (!idGravamenProducto) {
      return NextResponse.json({ message: "idGravamenProducto es requerido" }, { status: 400 });
    }
    
    const gravamenProducto = await gravamenProductoService.getById(parseInt(idGravamenProducto));
    return NextResponse.json(gravamenProducto, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el gravamenProducto por id:", error);
    return NextResponse.json(
      { message: "Error al obtener el gravamenProducto por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  context: { params: Promise<{ idGravamenProducto: string }> }
) => {
  const gravamenProductoService = GravamenProductoServiceImpl.getInstance();
  const { idGravamenProducto } = await context.params;
  const data = await request.json();

  if (!idGravamenProducto) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idGravamenProducto: parseInt(idGravamenProducto) };
    const respuesta = await gravamenProductoService.update(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al actualizar el gravamenProducto:", error);
    return NextResponse.json(
      { message: "Error al actualizar el gravamenProducto" },
      { status: 500 }
    );
  }
};