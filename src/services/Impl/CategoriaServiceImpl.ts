import { CategoriaService } from "@/services/CategoriaService";
import { CategoriaDAOImpl } from "@/dao/impl/CategoriaDAOImpl";
import { NextResponse } from "next/server";
import { CategoriaDTO } from "@/dto/CategoriaDTO";

export class CategoriaServiceImpl implements CategoriaService {
  private static instancia: CategoriaServiceImpl;
  private CategoriaDAOImpl: CategoriaDAOImpl = CategoriaDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): CategoriaServiceImpl {
    if (!CategoriaServiceImpl.instancia) {
      CategoriaServiceImpl.instancia = new CategoriaServiceImpl();
    }
    return CategoriaServiceImpl.instancia;
  }

  public create = async (categoria: CategoriaDTO): Promise<NextResponse> => {
    try {
      const { nombreCategoria, estadoCategoria } = categoria;

      if (!nombreCategoria || !estadoCategoria) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          {
            status: 400,
          }
        );
      }

      if (await this.CategoriaDAOImpl.existCategoriaNombre(nombreCategoria)) {
        return NextResponse.json(
          { message: "El nombre de la categoría ya existe" },
          { status: 400 }
        );
      }

      const respuesta = await this.CategoriaDAOImpl.create(categoria);
      if (respuesta) {
        return NextResponse.json(
          { message: "Categoría creada correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear la categoría" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en CategoriaService.create: ${error}`);
    }
  };

  public update = async (categoria: CategoriaDTO): Promise<NextResponse> => {
    try {
      const { idCategoria, nombreCategoria, estadoCategoria } = categoria;

      if (!idCategoria || !nombreCategoria || !estadoCategoria) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (await this.CategoriaDAOImpl.existCategoriaNombre(nombreCategoria)) {
        return NextResponse.json(
          { message: "El nombre de la categoría ya existe" },
          { status: 400 }
        );
      }

      const respuesta = await this.CategoriaDAOImpl.update(categoria);
      if (respuesta) {
        return NextResponse.json(
          { message: "Categoría actualizada correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al actualizar la categoría " },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en CategoriaService.update: ${error}`);
    }
  };

  public getAll = async (): Promise<Array<CategoriaDTO>> => {
    try {
      const respuesta: CategoriaDTO[] = await this.CategoriaDAOImpl.getAll();
      return respuesta;
    } catch (error) {
      throw new Error(`Error en CategoríaService.getAll: ${error}`);
    }
  };

  public getById = async (
    idCategoria: number
  ): Promise<CategoriaDTO | null> => {
    try {
      const respuesta = await this.CategoriaDAOImpl.getById(idCategoria);

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en CategoriaService.getById: ${error}`);
    }
  };
}
