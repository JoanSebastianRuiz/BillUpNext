import { NextResponse } from "next/server";
import { TerceroProductoServiceImpl } from "@/services/Impl/TerceroProductoServiceImpl";

export const GET = async () => {
  try {
    const terceroProductoService = TerceroProductoServiceImpl.getInstance();
    const respuesta = await terceroProductoService.getAll();
    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error("Error al obtener terceroProducto:", error);
    return NextResponse.json(
      { message: "Error al obtener terceroProducto:" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
    const terceroProductoService = TerceroProductoServiceImpl.getInstance();
    const respuesta = await terceroProductoService.create(await request.json());
    return respuesta;
};