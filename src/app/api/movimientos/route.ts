import { NextResponse } from "next/server";
import { MovimientoServiceImpl } from "@/services/Impl/MovimientoServiceImpl";

export const GET = async () => {
  try {
    const movimientoService = MovimientoServiceImpl.getInstance();
    const respuesta = await movimientoService.getAll();
    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los movimientos:", error);
    return NextResponse.json(
      { message: "Error al obtener los movimientos" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  
    const movimientoService = MovimientoServiceImpl.getInstance();
    const respuesta = await movimientoService.create(await request.json());
    return respuesta;   
};