import { DetalleVentaService } from "@/services/DetalleVentaService";
import { DetalleVentaDAOImpl } from "@/dao/impl/DetalleVentaDAOImpl";
import { NextResponse } from "next/server";
import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";

export class DetalleVentaServiceImpl implements DetalleVentaService {
  private static instancia: DetalleVentaServiceImpl;
  private detalleVentaDAOImpl: DetalleVentaDAOImpl =
    DetalleVentaDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): DetalleVentaServiceImpl {
    if (!DetalleVentaServiceImpl.instancia) {
      DetalleVentaServiceImpl.instancia = new DetalleVentaServiceImpl();
    }
    return DetalleVentaServiceImpl.instancia;
  }

  public create = async (
    detalleVenta: DetalleVentaDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idVenta,
        idProducto,
        cantidadDetalleVenta,
        valorDescuentoDetalleVenta,
        valorTotalDetalleVenta,
      } = detalleVenta;

      if (
        !idVenta ||
        !idProducto ||
        !cantidadDetalleVenta ||
        !valorDescuentoDetalleVenta ||
        !valorTotalDetalleVenta
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (
        !(await this.detalleVentaDAOImpl.validarCantidad(
          cantidadDetalleVenta)
        )
      ) {
        return NextResponse.json(
          { message: "La cantidad no es valida" },
          { status: 400 }
        )
      }

      if (
        !(await this.detalleVentaDAOImpl.validarDescuento(
          valorDescuentoDetalleVenta)
        )
      ) {
        return NextResponse.json(
          { message: "El descuento no es valido" },
          { status: 400 }
        )
      }

      if (
        !(await this.detalleVentaDAOImpl.validarValor(
          valorTotalDetalleVenta)
        )
      ) {
        return NextResponse.json(
          { message: "El valor total no es valido" },
          { status: 400 }
        )
      }

      const respuesta = await this.detalleVentaDAOImpl.create(detalleVenta);
      if (respuesta) {
        return NextResponse.json(
          { message: "detalle de la Venta creado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear el detalle de la Venta" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en DetalleVentaService.create: ${error}`);
    }
  };

  public getAll = async (): Promise<Array<DetalleVentaDTO>> => {
    try {
      const respuesta: DetalleVentaDTO[] =
        await this.detalleVentaDAOImpl.getAll();
      return respuesta;
    } catch (error) {
      throw new Error(`Error en DetalleVentaService.getAll: ${error}`);
    }
  };

  public getById = async (
    idDetalleVenta: number
  ): Promise<DetalleVentaDTO | null> => {
    try {
      const respuesta = await this.detalleVentaDAOImpl.getById(idDetalleVenta);

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en DetalleVentaService.getById: ${error}`);
    }
  };
}
