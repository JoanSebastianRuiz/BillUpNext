import { NextResponse } from "next/server";
import { VentaServiceImpl } from "@/services/Impl/VentaServiceImpl";

export const GET = async (
  _: Request,
  context: { params: Promise<{ idVenta: string }> }
) => {
  try {
    const ventaService = VentaServiceImpl.getInstance();
    const { idVenta } = await context.params;

    if (!idVenta) {
      return NextResponse.json(
        { message: "idVenta es requerido" },
        { status: 400 }
      );
    }

    const venta = await ventaService.getById(parseInt(idVenta));
    return NextResponse.json(venta, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la venta por id", error);
    return NextResponse.json(
      { message: "Error al obtener la venta por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  context: { params: Promise<{ idVenta: string }> }
) => {
  const ventaService = VentaServiceImpl.getInstance();
  const { idVenta } = await context.params;
  const data = await request.json();

  if (!idVenta) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idVenta: parseInt(idVenta) };
    const respuesta = await ventaService.cancel(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al cancelar la venta", error);
    return NextResponse.json(
      { message: "Error al cancelar la venta" },
      { status: 500 }
    );
  }
};