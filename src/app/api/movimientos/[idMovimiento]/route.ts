import { NextResponse } from "next/server";
import { MovimientoServiceImpl } from "@/services/Impl/MovimientoServiceImpl";

export const GET = async (_:Request, { params }: { params: { idMovimiento: string } }) => {
  try {
    const movimientoService = MovimientoServiceImpl.getInstance();
    const { idMovimiento } = await params;

    if (!idMovimiento) {
      return NextResponse.json({ message: "idMovimiento es requerido" }, { status: 400 });
    }
    
    const movimiento = await movimientoService.getById(parseInt(idMovimiento));
    return NextResponse.json(movimiento, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el movimiento por id:", error);
    return NextResponse.json(
      { message: "Error al obtener el movimiento por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: { idMovimiento: string } }
) => {
  const movimientoService = MovimientoServiceImpl.getInstance();
  const { idMovimiento } = params;
  const data = await request.json();

  if (!idMovimiento) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idMovimiento: parseInt(idMovimiento) };
    const respuesta = await movimientoService.update(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al actualizar el movimiento:", error);
    return NextResponse.json(
      { message: "Error al actualizar el movimiento" },
      { status: 500 }
    );
  }
};