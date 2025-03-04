import { NextResponse } from "next/server";
import { GravamenProductoServiceImpl } from "@/services/Impl/GravamenProductoServiceImpl";

export const GET = async () => {
  try {
    const gravamenProductoService = GravamenProductoServiceImpl.getInstance();
    const respuesta = await gravamenProductoService.getAll();
    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los gravamenProducto:", error);
    return NextResponse.json(
      { message: "Error al obtener los gravamenProducto" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  
    const gravamenProductoService = GravamenProductoServiceImpl.getInstance();
    const respuesta = await gravamenProductoService.create(await request.json());
    return respuesta;   
};