import { DetalleCompraService } from "@/services/DetalleCompraService";
import { DetalleCompraDAOImpl } from "@/dao/impl/DetalleCompraDAOImpl";
import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";

export class DetalleCompraServiceImpl implements DetalleCompraService {
  private static instancia: DetalleCompraServiceImpl;
  private detalleCompraDAOImpl: DetalleCompraDAOImpl =
    DetalleCompraDAOImpl.getInstance();
  private constructor() { }

  public static getInstance(): DetalleCompraServiceImpl {
    if (!DetalleCompraServiceImpl.instancia) {
      DetalleCompraServiceImpl.instancia = new DetalleCompraServiceImpl();
    }
    return DetalleCompraServiceImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<DetalleCompraDTO>> => {
    try {
      const respuesta: DetalleCompraDTO[] =
        await this.detalleCompraDAOImpl.getAll(idEmpresa);
      return respuesta;
    } catch (error) {
      throw new Error(`Error en DetalleCompraService.getAll: ${error}`);
    }
  };

}
