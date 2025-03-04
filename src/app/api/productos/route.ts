import { NextResponse } from "next/server";
import { ProductoServiceImpl } from "@/services/Impl/ProductoServiceImpl";

export const GET = async () => {
  try {
    const productoService = ProductoServiceImpl.getInstance();
    const respuesta = await productoService.getAll();
    return NextResponse.json(respuesta, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    return NextResponse.json(
      { message: "Error al obtener los productos" },
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  const productoService = ProductoServiceImpl.getInstance();
  const respuesta = await productoService.create(await request.json());
  return respuesta;
};
