import { NextResponse } from "next/server";
import { DetalleVentaServiceImpl } from "@/services/Impl/DetalleVentaServiceImpl";

export const GET = async (
  _: Request,
  { params }: { params: { idDetalleVenta: string } }
) => {
  try {
    const detalleVentaService = DetalleVentaServiceImpl.getInstance();
    const { idDetalleVenta } = await params;

    if (!idDetalleVenta) {
      return NextResponse.json(
        { message: "idDetalleVenta es requerido" },
        { status: 400 }
      );
    }

    const detalleVenta = await detalleVentaService.getById(parseInt(idDetalleVenta));
    return NextResponse.json(detalleVenta, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el detalle de la venta por id", error);
    return NextResponse.json(
      { message: "Error al obtener el detalle de la venta por id" },
      { status: 500 }
    );
  }
};