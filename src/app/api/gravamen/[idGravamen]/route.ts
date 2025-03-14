import { NextResponse } from "next/server";
import { GravamenServiceImpl } from "@/services/Impl/GravamenServiceImpl";

export const GET = async (
  _: Request,
  { params }: { params: { idGravamen: string } }
) => {
  try {
    const gravamenService = GravamenServiceImpl.getInstance();
    const { idGravamen } = await params;

    if (!idGravamen) {
      return NextResponse.json(
        { message: "idGravamen es requerido" },
        { status: 400 }
      );
    }

    const gravamen = await gravamenService.getById(parseInt(idGravamen));
    return NextResponse.json(gravamen, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el gravamen por id", error);
    return NextResponse.json(
      { message: "Error al obtener el gravamen por id" },
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: Request,
  { params }: { params: { idGravamen: string } }
) => {
  const gravamenService = GravamenServiceImpl.getInstance();
  const { idGravamen } =await params;
  const data = await request.json();

  if (!idGravamen) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    const dataWithId = { ...data, idGravamen: parseInt(idGravamen) };
    const respuesta = await gravamenService.update(dataWithId);
    return respuesta;
  } catch (error) {
    console.error("Error al actualizar el gravamen", error);
    return NextResponse.json(
      { message: "Error al actualizar el gravamen" },
      { status: 500 }
    );
  }
};
