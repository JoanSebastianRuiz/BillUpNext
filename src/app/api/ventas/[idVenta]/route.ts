import { NextResponse } from "next/server";
import { VentaServiceImpl } from "@/services/Impl/VentaServiceImpl";

export const GET = async (
  _: Request,
  { params }: { params: { idVenta: string } }
) => {
  try {
    const ventaService = VentaServiceImpl.getInstance();
    const { idVenta } = await params;

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
