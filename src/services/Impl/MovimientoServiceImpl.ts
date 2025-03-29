import { MovimientoService } from "@/services/MovimientoService";
import { MovimientoDAOImpl } from "@/dao/impl/MovimientoDAOImpl";
import { NextResponse } from "next/server";
import { MovimientoDTO } from "@/dto/MovimientoDTO";
import { isValidDinero, isValidLength } from "@/util/validators/validators";

export class MovimientoServiceImpl implements MovimientoService {
  private static instancia: MovimientoServiceImpl;
  private movimientoDAOImpl: MovimientoDAOImpl =
    MovimientoDAOImpl.getInstance();
  private constructor() { }

  public static getInstance(): MovimientoServiceImpl {
    if (!MovimientoServiceImpl.instancia) {
      MovimientoServiceImpl.instancia = new MovimientoServiceImpl();
    }
    return MovimientoServiceImpl.instancia;
  }

  public create = async (movimiento: MovimientoDTO): Promise<NextResponse> => {
    try {
      const { idUsuario, idCaja, tipoMovimiento, descripcionMovimiento, valorMovimiento } =
        movimiento;

      if (!idUsuario || !idCaja || tipoMovimiento == undefined || !descripcionMovimiento || !valorMovimiento) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (!isValidLength(descripcionMovimiento, 250)) {
        return NextResponse.json(
          { message: "La descripción puede tener máximo 250 caracteres" },
          { status: 400 }
        );
      }

      if (!isValidDinero(valorMovimiento.toString())) {
        return NextResponse.json(
          { message: "El valor del movimiento no es válido" },
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

  public getAll = async (idEmpresa: number): Promise<Array<MovimientoDTO>> => {
    try {
      const respuesta: MovimientoDTO[] = await this.movimientoDAOImpl.getAll(idEmpresa);
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
