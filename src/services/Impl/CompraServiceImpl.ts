import { CompraService } from "@/services/CompraService";
import { CompraDAOImpl } from "@/dao/impl/CompraDAOImpl";
import { NextResponse } from "next/server";
import { CompraDTO } from "@/dto/CompraDTO";

export class CompraServiceImpl implements CompraService {
  private static instancia: CompraServiceImpl;
  private compraDAOImpl: CompraDAOImpl = CompraDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): CompraServiceImpl {
    if (!CompraServiceImpl.instancia) {
      CompraServiceImpl.instancia = new CompraServiceImpl();
    }
    return CompraServiceImpl.instancia;
  }

  public create = async (compra: CompraDTO): Promise<NextResponse> => {
    try {
      const { idTercero, idUsuario, observacionCompra } = compra;

      if (!idTercero || !idUsuario || !observacionCompra) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
    }

    const respuesta = await this.compraDAOImpl.create(compra);
    if (respuesta) {
        return NextResponse.json(
        { message: "Compra creada correctamente" },
            { status: 200 }
        );
    } else {
        return NextResponse.json(
            { message: "Error al crear la compra" },
            {status: 500 }
        )
    }
    } catch (error) {
        throw new Error(`Error en CompraService.create: ${error}`);
    }
  };

  public update = async (compra: CompraDTO): Promise<NextResponse> => {
    try {
        const { idCompra, idTercero, idUsuario, observacionCompra } = compra;

        if ( !idCompra || !idTercero || !idUsuario ||  !observacionCompra ) {
            return NextResponse.json(
                { message: "Faltan campos por llenar" },
                { status: 400 }
            );
        }

        const respuesta = await this.compraDAOImpl.update(compra);
        if (respuesta) {
            return NextResponse.json(
                { message: "Compra actualizada correctamente"},
                {status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Error al actualizar la compra"},
                { status: 500 }
            );
        }
    } catch (error) {
        throw new Error(`Error en CompraService.update: ${error}`);
    }
  };

  public getAll = async (): Promise<Array<CompraDTO>> => {
    try {
        const respuesta: CompraDTO[] = await this.compraDAOImpl.getAll();
        return respuesta;
    } catch (error) {
        throw new Error(`Error en CompraService.getAll: ${error}`);
    }
  };

  public getById = async (idCompra: number): Promise<CompraDTO | null> => {
    try {
        const respuesta = await this.compraDAOImpl.getById(idCompra);

        if (!respuesta){
            return null;
        }
        return respuesta
    } catch (error) {
        throw new Error(`Error en CompraService.getById: ${error}`);
    }
  };
}
