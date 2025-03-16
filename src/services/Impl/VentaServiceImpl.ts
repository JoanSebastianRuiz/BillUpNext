import { VentaService } from "@/services/VentaService";
import { VentaDAOImpl } from "@/dao/impl/VentaDAOImpl";
import { NextResponse } from "next/server";
import { VentaDTO } from "@/dto/VentaDTO";

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
      } = venta;

      if (
        !idTercero ||
        !idCaja ||
        !idUsuario ||
        !idUbicacionVenta ||
        !idTipoMedioPago ||
        !observacionVenta ||
        !valorTotalVenta
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
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

  public getAll = async (): Promise<Array<VentaDTO>> => {
    try {
      const respuesta: VentaDTO[] = await this.ventaDAOImpl.getAll();
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
}
