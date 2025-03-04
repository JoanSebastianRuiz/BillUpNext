import { MovimientoService } from "@/services/MovimientoService";
import { MovimientoDAOImpl } from "@/dao/impl/MovimientoDAOImpl";
import { NextResponse } from "next/server";
import { MovimientoDTO } from "@/dto/MovimientoDTO";

export class MovimientoServiceImpl implements MovimientoService {
  private static instancia: MovimientoServiceImpl;
  private movimientoDAOImpl: MovimientoDAOImpl =
    MovimientoDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): MovimientoServiceImpl {
    if (!MovimientoServiceImpl.instancia) {
      MovimientoServiceImpl.instancia = new MovimientoServiceImpl();
    }
    return MovimientoServiceImpl.instancia;
  }

  public create = async (movimiento: MovimientoDTO): Promise<NextResponse> => {
    try {
      const { idUsuario, idCaja, descripcionMovimiento, valorMovimiento } =
        movimiento;

      if (!idUsuario || !idCaja || !descripcionMovimiento || !valorMovimiento) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      const respuesta = await this.movimientoDAOImpl.create(movimiento);
      if (respuesta) {
        return NextResponse.json(
          { message: "Movimiento creado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear el movimiento" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en MovimientoService.create: ${error}`);
    }
  };

  public update = async (movimiento: MovimientoDTO): Promise<NextResponse> => {
    try {
      const {
        idMovimiento,
        idUsuario,
        idCaja,
        descripcionMovimiento,
        valorMovimiento,
      } = movimiento;

      if (
        !idMovimiento ||
        !idUsuario ||
        !idCaja ||
        !descripcionMovimiento ||
        !valorMovimiento
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      const respuesta = await this.movimientoDAOImpl.update(movimiento);
      if (respuesta) {
        return NextResponse.json(
          { message: "Movimiento actualizado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al actualizar el movimiento" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en MovimientoService.update: ${error}`);
    }
  };

  public getAll = async (): Promise<Array<MovimientoDTO>> => {
    try {
      const respuesta: MovimientoDTO[] = await this.movimientoDAOImpl.getAll();
      return respuesta;
    } catch (error) {
      throw new Error(`Error en MovimientoService.getAll: ${error}`);
    }
  };

  public getById = async (
    idMovimiento: number
  ): Promise<MovimientoDTO | null> => {
    try {
      const respuesta = await this.movimientoDAOImpl.getById(idMovimiento);

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en MovimientoService.getById: ${error}`);
    }
  };
}
