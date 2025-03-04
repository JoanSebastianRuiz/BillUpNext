import { GravamenProductoService } from "@/services/GravamenProductoService";
import { GravamenProductoDAOImpl } from "@/dao/impl/GravamenProductoDAOImpl";
import { NextResponse } from "next/server";
import { GravamenProductoDTO } from "@/dto/GravamenProductoDTO";

export class GravamenProductoServiceImpl implements GravamenProductoService {
  private static instancia: GravamenProductoServiceImpl;
  private gravamenProductoDAOImpl: GravamenProductoDAOImpl =
    GravamenProductoDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): GravamenProductoServiceImpl {
    if (!GravamenProductoServiceImpl.instancia) {
      GravamenProductoServiceImpl.instancia = new GravamenProductoServiceImpl();
    }
    return GravamenProductoServiceImpl.instancia;
  }

  public create = async (
    gravamenProducto: GravamenProductoDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idProducto,
        idGravamen,
        compraGravamenProducto,
        ventaGravamenProducto,
      } = gravamenProducto;

      if (
        !idProducto ||
        !idGravamen ||
        !compraGravamenProducto ||
        !ventaGravamenProducto
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      const respuesta = await this.gravamenProductoDAOImpl.create(
        gravamenProducto
      );
      if (respuesta) {
        return NextResponse.json(
          { message: "GravamenProducto creado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear el gravamenProducto" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en GravamenProductoService.create: ${error}`);
    }
  };

  public update = async (
    gravamenProducto: GravamenProductoDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idGravamenProducto,
        idProducto,
        idGravamen,
        compraGravamenProducto,
        ventaGravamenProducto,
      } = gravamenProducto;

      if (
        !idGravamenProducto ||
        !idProducto ||
        !idGravamen ||
        !compraGravamenProducto ||
        !ventaGravamenProducto
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      const respuesta = await this.gravamenProductoDAOImpl.update(
        gravamenProducto
      );
      if (respuesta) {
        return NextResponse.json(
          { message: "GravamenProducto actualizado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al actualizar el gravamenProducto" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en GravamenProductoService.update: ${error}`);
    }
  };

  public getAll = async (): Promise<Array<GravamenProductoDTO>> => {
    try {
      const respuesta: GravamenProductoDTO[] =
        await this.gravamenProductoDAOImpl.getAll();
      return respuesta;
    } catch (error) {
      throw new Error(`Error en GravamenProductoService.getAll: ${error}`);
    }
  };

  public getById = async (
    idGravamenProducto: number
  ): Promise<GravamenProductoDTO | null> => {
    try {
      const respuesta = await this.gravamenProductoDAOImpl.getById(
        idGravamenProducto
      );

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en GravamenProductoService.getById; ${error}`);
    }
  };
}
