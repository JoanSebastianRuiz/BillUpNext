import { CategoriaDAO } from "@/dao/CategoriaDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { CategoriaDTO } from "@/dto/CategoriaDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class CategoriaDAOImpl implements CategoriaDAO {
  private static instancia: CategoriaDAOImpl;
  private constructor() { }

  public static getInstance(): CategoriaDAOImpl {
    if (!CategoriaDAOImpl.instancia) {
      CategoriaDAOImpl.instancia = new CategoriaDAOImpl();
    }
    return CategoriaDAOImpl.instancia;
  }

  public getAll = async (): Promise<Array<CategoriaDTO>> => {
    try {
      const categoriasDatabase: CategoriaDTO[] = await ejecutarQuery(
        `SELECT c.\"idCategoria\", c.\"nombreCategoria\", c.\"estadoCategoria\"
                FROM \"Categoria\" c;`,
        []
      );

      return categoriasDatabase;
    } catch (error) {
      throw new Error(`Error en CategoriaDAO.getAll: ${error}`);
    }
  };

  public getById = async (
    idCategoria: number
  ): Promise<CategoriaDTO | null> => {
    try {
      const respuesta: CategoriaDTO[] = await ejecutarQuery(
        `SELECT c.\"idCategoria\", c.\"nombreCategoria\", c.\"estadoCategoria\"
                FROM \"Categoria\" c 
                WHERE c.\"idCategoria\" = $1;`,
        [idCategoria]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en CategoriaDAO.getById: ${error}`);
    }
  };

  public create = async (categoria: CategoriaDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarCategoria($1,$2) as resultado;`,
        [categoria.nombreCategoria, categoria.estadoCategoria]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en CategoriaDAO.create: ${error}`);
    }
  };

  public update = async (categoria: CategoriaDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT actualizarCategoria($1,$2,$3) as resultado;`,
        [
          categoria.idCategoria,
          categoria.nombreCategoria,
          categoria.estadoCategoria,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en CategoriaDAO.update: ${error}`);
    }
  };

  public existCategoriaNombre = async (
    nombreCategoria: string,
    idCategoria?: number
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT existeCategoriaNombre($1,$2) as resultado;`,
        [nombreCategoria, idCategoria]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en CategoriaDAO.existCategoriaNombre: ${error}`);
    }
  };
}
