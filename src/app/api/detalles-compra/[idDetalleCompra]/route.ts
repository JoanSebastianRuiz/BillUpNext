import { NextResponse } from "next/server";
import { DetalleCompraServiceImpl } from "@/services/Impl/DetalleCompraServiceImpl";

export const GET = async (
  _: Request,
  { params }: { params: { idDetalleCompra: string } }
) => {
  try {
    const detalleCompraService = DetalleCompraServiceImpl.getInstance();
    const { idDetalleCompra } = await params;

    if (!idDetalleCompra) {
      return NextResponse.json(
        { message: "idDetalleCompra es requerido" },
        { status: 400 }
      );
    }

    const detalleCompra = await detalleCompraService.getById(parseInt(idDetalleCompra));
    return NextResponse.json(detalleCompra, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el detalle de la Compra por id", error);
    return NextResponse.json(
      { message: "Error al obtener el detalle de la Compra por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: { idDetalleCompra: string } }
) => {
  const detalleCompraService = DetalleCompraServiceImpl.getInstance();
  const { idDetalleCompra } =await params;
  const data = await request.json();

  if (!idDetalleCompra) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idDetalleCompra: parseInt(idDetalleCompra) };
    const respuesta = await detalleCompraService.update(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al actualizar el detalle de la Compra", error);
    return NextResponse.json(
      { message: "Error al actualizar el detalle de la Compra" },
      { status: 500 }
    );
  }
};
