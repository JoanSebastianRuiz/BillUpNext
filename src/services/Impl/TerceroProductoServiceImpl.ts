import { TerceroProductoService } from "@/services/TerceroProductoService";
import { TerceroProductoDAOImpl } from "@/dao/impl/TerceroProductoDAOImpl";
import { NextResponse } from "next/server";
import { TerceroProductoDTO } from "@/dto/TerceroProductoDTO";

export class TerceroProductoServiceImpl implements TerceroProductoService {
  private static instancia: TerceroProductoServiceImpl;
  private terceroProductoDAOImpl: TerceroProductoDAOImpl =
    TerceroProductoDAOImpl.getInstance();
  private constructor() { }

  public static getInstance(): TerceroProductoServiceImpl {
    if (!TerceroProductoServiceImpl.instancia) {
      TerceroProductoServiceImpl.instancia = new TerceroProductoServiceImpl();
    }
    return TerceroProductoServiceImpl.instancia;
  }

  public create = async (
    terceroProducto: TerceroProductoDTO
  ): Promise<NextResponse> => {
    try {
      const { idTercero, idProducto, precioCompraTerceroProducto, estadoTerceroProducto } =
        terceroProducto;

      if (!idTercero || !idProducto || !precioCompraTerceroProducto || estadoTerceroProducto === undefined) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (
        await this.terceroProductoDAOImpl.validarRelacion(Number(idProducto), Number(idTercero))
      ) {
        return NextResponse.json(
          { message: "La relación entre el proveedor y producto ya existe" },
          { status: 400 }
        );
      }

      if (
        precioCompraTerceroProducto <= 0
      ) {
        return NextResponse.json(
          { message: "El precio del producto debe ser mayor a cero" },
          { status: 400 }
        );
      }

      const respuesta = await this.terceroProductoDAOImpl.create(
        terceroProducto
      );

      if (respuesta) {
        return NextResponse.json(
          { message: "terceroProducto creado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear terceroProducto" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en TerceroProductoService.create: ${error}`);
    }
  };

  public update = async (
    terceroProducto: TerceroProductoDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idTerceroProducto,
        idTercero,
        idProducto,
        precioCompraTerceroProducto,
        estadoTerceroProducto
      } = terceroProducto;


      if (
        !idTerceroProducto ||
        !idTercero ||
        !idProducto ||
        !precioCompraTerceroProducto ||
        estadoTerceroProducto === undefined
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (
        await this.terceroProductoDAOImpl.validarRelacion(
          Number(idProducto),
          idTercero,
          idTerceroProducto
        )
      ) {
        return NextResponse.json(
          { message: "La relación entre el proveedor y producto ya existe" },
          { status: 400 }
        );
      }

      if (
        precioCompraTerceroProducto <= 0
      ) {
        return NextResponse.json(
          { message: "El precio del producto debe ser mayor a cero" },
          { status: 400 }
        );
      }

      const respuesta = await this.terceroProductoDAOImpl.update(
        terceroProducto
      );

      if (respuesta) {
        return NextResponse.json(
          { message: "terceroProducto actualizado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al actualizar terceroProducto" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en TerceroProductoService.update: ${error}`);
    }
  };

  public getAll = async (idEmpresa: number): Promise<Array<TerceroProductoDTO>> => {
    try {
      const respuesta: TerceroProductoDTO[] =
        await this.terceroProductoDAOImpl.getAll(idEmpresa);
      return respuesta;
    } catch (error) {
      throw new Error(`Error en TerceroProducto.getAll: ${error}`);
    }
  };

  public getById = async (
    idTerceroProducto: number
  ): Promise<TerceroProductoDTO | null> => {
    try {
      const respuesta = await this.terceroProductoDAOImpl.getById(
        idTerceroProducto
      );

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en TerceroProductoService.getById: ${error}`);
    }
  };
}
