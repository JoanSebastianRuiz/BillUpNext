import { DetalleCompraService } from "@/services/DetalleCompraService";
import { DetalleCompraDAOImpl } from "@/dao/impl/DetalleCompraDAOImpl";
import { NextResponse } from "next/server";
import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";

export class DetalleCompraServiceImpl implements DetalleCompraService {
  private static instancia: DetalleCompraServiceImpl;
  private detalleCompraDAOImpl: DetalleCompraDAOImpl =
    DetalleCompraDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): DetalleCompraServiceImpl {
    if (!DetalleCompraServiceImpl.instancia) {
      DetalleCompraServiceImpl.instancia = new DetalleCompraServiceImpl();
    }
    return DetalleCompraServiceImpl.instancia;
  }

  public create = async (
    detalleCompra: DetalleCompraDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idCompra,
        idProducto,
        cantidadDetalleCompra,
        valorDetalleCompra,
      } = detalleCompra;

      if (
        !idCompra ||
        !idProducto ||
        !cantidadDetalleCompra ||
        !valorDetalleCompra 
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (
        await this.detalleCompraDAOImpl.validarCantidad(
          cantidadDetalleCompra
        )
      ) {
        return NextResponse.json(
          { message: "La cantidad no es valida"},
          { status: 400 }
        )
      }

      if (
        await this.detalleCompraDAOImpl.validarValor(
          valorDetalleCompra
        )
      ) {
        return NextResponse.json(
          { message: "El valor no es valido"},
          { status: 400 }
        )
      }

      const respuesta = await this.detalleCompraDAOImpl.create(detalleCompra);
      if (respuesta) {
        return NextResponse.json(
          { message: "detalle de la Compra creado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear el detalle de la Compra" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en DetalleCompraService.create: ${error}`);
    }
  };

  public update = async (
    detalleCompra: DetalleCompraDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idDetalleCompra,
        idCompra,
        idProducto,
        cantidadDetalleCompra,
        valorDetalleCompra,
      } = detalleCompra;

      if (
        !idDetalleCompra ||
        !idCompra ||
        !idProducto ||
        !cantidadDetalleCompra ||
        !valorDetalleCompra 
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (
        await this.detalleCompraDAOImpl.validarCantidad(
          cantidadDetalleCompra
        )
      ) {
        return NextResponse.json(
          { message: "La cantidad no es valida" },
          { status: 400 }
        );
      }

      if (
        await this.detalleCompraDAOImpl.validarValor(
          valorDetalleCompra
        )
      ) {
        return NextResponse.json(
          { message: "El valor no es valido" },
          { status: 400 }
        );
      }

      const respuesta = await this.detalleCompraDAOImpl.update(detalleCompra);
      if (respuesta) {
        return NextResponse.json(
          { message: "detalle de la Compra actualizado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al actualizar el detalle de la Compra" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en DetalleCompraService.update: ${error}`);
    }
  };

  public getAll = async (): Promise<Array<DetalleCompraDTO>> => {
    try {
      const respuesta: DetalleCompraDTO[] =
        await this.detalleCompraDAOImpl.getAll();
      return respuesta;
    } catch (error) {
      throw new Error(`Error en DetalleCompraService.getAll: ${error}`);
    }
  };

  public getById = async (
    idDetalleCompra: number
  ): Promise<DetalleCompraDTO | null> => {
    try {
      const respuesta = await this.detalleCompraDAOImpl.getById(idDetalleCompra);

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en DetalleCompraService.getById: ${error}`);
    }
  };
}
