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

  public getAll = async (idEmpresa: number): Promise<Array<DetalleVentaDTO>> => {
    try {
      const respuesta: DetalleVentaDTO[] =
        await this.detalleVentaDAOImpl.getAll(idEmpresa);
      return respuesta;
    } catch (error) {
      throw new Error(`Error en DetalleVentaService.getAll: ${error}`);
    }
  };

  
}
