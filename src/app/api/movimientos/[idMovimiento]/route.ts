import { NextResponse } from "next/server";
import { MovimientoServiceImpl } from "@/services/Impl/MovimientoServiceImpl";

export const GET = async (_:Request, context: { params: Promise<{ idMovimiento: string }> }) => {
  try {
    const movimientoService = MovimientoServiceImpl.getInstance();
    const { idMovimiento } = await context.params;

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
}

