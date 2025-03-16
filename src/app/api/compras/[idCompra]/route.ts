import { NextResponse } from "next/server";
import { CompraServiceImpl } from "@/services/Impl/CompraServiceImpl";

export const GET = async (
  _: Request,
  { params }: { params: { idCompra: string } }
) => {
  try {
    const compraService = CompraServiceImpl.getInstance();
    const { idCompra } = await params;

    if (!idCompra) {
      return NextResponse.json(
        { message: "idCompra es requerido" },
        { status: 400 }
      );
    }

    const compra = await compraService.getById(parseInt(idCompra));
    return NextResponse.json(compra, { status: 200 });
  } catch (error) {
    console.error("Error al obtener la compra por id", error);
    return NextResponse.json(
      { message: "Error al obtener la compra por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: { idCompra: string } }
) => {
  const compraService = CompraServiceImpl.getInstance();
  const { idCompra } =await params;
  const data = await request.json();

  if (!idCompra) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idCompra: parseInt(idCompra) };
    const respuesta = await compraService.update(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al actualizar la compra", error);
    return NextResponse.json(
      { message: "Error al actualizar la compra" },
      { status: 500 }
    );
  }
};
