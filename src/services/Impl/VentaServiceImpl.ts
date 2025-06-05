import { VentaService } from "@/services/VentaService";
import { VentaDAOImpl } from "@/dao/impl/VentaDAOImpl";
import { NextResponse } from "next/server";
import { VentaDTO } from "@/dto/VentaDTO";
import { isValidLength, isValidDinero } from "@/util/validators/validators";

export class VentaServiceImpl implements VentaService {
  private static instancia: VentaServiceImpl;
  private ventaDAOImpl: VentaDAOImpl = VentaDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): VentaServiceImpl {
    if (!VentaServiceImpl.instancia) {
      VentaServiceImpl.instancia = new VentaServiceImpl();
    }
    return VentaServiceImpl.instancia;
  }

  public create = async (venta: VentaDTO): Promise<NextResponse> => {
    try {
      const {
        idTercero,
        idCaja,
        idUsuario,
        idUbicacionVenta,
        idTipoMedioPago,
        observacionVenta,
        valorTotalVenta,
        detallesVenta,
      } = venta;

      if (
        idTercero == null || // Acepta 0 como válido
        idCaja == null ||
        idUsuario == null ||
        idUbicacionVenta == null ||
        idTipoMedioPago == null ||
        valorTotalVenta == null ||
        !Array.isArray(detallesVenta) ||
        detallesVenta.length === 0
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (observacionVenta && !isValidLength(observacionVenta, 250)) {
        return NextResponse.json(
          { message: "La observación debe tener entre 1 y 250 caracteres" },
          { status: 400 }
        );
      }

      if (!isValidDinero(valorTotalVenta.toString())) {
        return NextResponse.json(
          { message: "El valor total de la venta debe ser un número positivo" },
          { status: 400 }
        );
      }

      for (let detalle of detallesVenta) {
        const {
          idProducto,
          cantidadDetalleVenta,
          valorTotalDetalleVenta,
          valorDescuentoDetalleVenta,
          valorImpuestosDetalleVenta,
        } = detalle;

        if (
          idProducto == null ||
          cantidadDetalleVenta == null ||
          valorTotalDetalleVenta == null ||
          valorDescuentoDetalleVenta == null ||
          valorImpuestosDetalleVenta == null
        ) {
          return NextResponse.json(
            { message: "Faltan campos por llenar" },
            { status: 400 }
          );
        }

        const tieneStock = await this.ventaDAOImpl.stockProducto(
          idProducto,
          cantidadDetalleVenta
        );
        if (!tieneStock) {
          return NextResponse.json(
            { message: "No hay suficiente stock del producto" },
            { status: 400 }
          );
        }
      }

      const respuesta = await this.ventaDAOImpl.create(venta);
      if (respuesta) {
        return NextResponse.json(
          { message: "venta creada correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear la venta" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en VentaService.create: ${error}`);
    }
  };

  public getAll = async (idEmpresa: number): Promise<Array<VentaDTO>> => {
    try {
      const respuesta: VentaDTO[] = await this.ventaDAOImpl.getAll(idEmpresa);
      return respuesta;
    } catch (error) {
      throw new Error(`Error en VentaService.getAll: ${error}`);
    }
  };

  public getById = async (idVenta: number): Promise<VentaDTO | null> => {
    try {
      const respuesta = await this.ventaDAOImpl.getById(idVenta);

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en VentaService.getById: ${error}`);
    }
  };

  public cancel = async (venta: VentaDTO): Promise<NextResponse> => {
    try {
      const { idVenta, motivoCancelacionVenta, idUsuarioCancelacionVenta } =
        venta;

      if (!idVenta || !motivoCancelacionVenta || !idUsuarioCancelacionVenta) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (!isValidLength(motivoCancelacionVenta, 250)) {
        return NextResponse.json(
          { message: "El motivo debe tener entre 1 y 250 caracteres" },
          { status: 400 }
        );
      }

      const respuesta = await this.ventaDAOImpl.cancel(venta);
      if (respuesta) {
        return NextResponse.json(
          { message: "Venta cancelada correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al cancelar la venta" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en VentaService.cancel: ${error}`);
    }
  };
}
