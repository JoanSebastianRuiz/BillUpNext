import { ProductoDAO } from "@/dao/ProductoDAO";
import { ejecutarQuery } from "@/connection/conexion";
import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { ProductoRequestDTO } from "@/dto/ProductoRequestDTO";
import { ResultadoBooleanDTO } from "@/dto/ResultadoBooleanDTO";

export class ProductoDAOImpl implements ProductoDAO {
  private static instancia: ProductoDAOImpl;
  private constructor() { } 

  public static getInstance(): ProductoDAOImpl {
    if (!ProductoDAOImpl.instancia) {
      ProductoDAOImpl.instancia = new ProductoDAOImpl();
    }
    return ProductoDAOImpl.instancia;
  }

  public getAll = async (idEmpresa: number): Promise<Array<ProductoResponseDTO>> => {
    try {
      const productoDatabase: ProductoResponseDTO[] = await ejecutarQuery(
        `SELECT p.\"idProducto\", p.\"idEmpresa\", p.\"idCategoria\", p.\"nombreProducto\",
                p.\"descripcionProducto\", p.\"precioVentaProducto\", p.\"porcentajeDescuentoProducto\", p.\"stockMinimoProducto\",
                p.\"stockMaximoProducto\", p.\"stockProducto\", p.\"estadoProducto\"
                FROM \"Producto\" p
                WHERE p.\"idEmpresa\" = $1;`,
        [idEmpresa]
      );

      return productoDatabase;
    } catch (error) {
      throw new Error(`Error en ProductoDAO.getAll: ${error}`);
    }
  };

  public getById = async (
    idProducto: number
  ): Promise<ProductoResponseDTO | null> => {
    try {
      const respuesta: ProductoResponseDTO[] = await ejecutarQuery(
        `SELECT p.\"idProducto\", p.\"idEmpresa\", p.\"idCategoria\", p.\"nombreProducto\",
                p.\"descripcionProducto\", p.\"precioVentaProducto\", p.\"porcentajeDescuentoProducto\", p.\"stockMinimoProducto\", p.\"stockMaximoProducto\",
                p.\"stockProducto\", p.\"estadoProducto\" 
                FROM \"Producto\" p
                WHERE p.\"idProducto\" = $1;`,
        [idProducto]
      );

      return respuesta.length > 0 ? respuesta[0] : null;
    } catch (error) {
      throw new Error(`Error en ProductoDAO.getById: ${error}`);
    }
  };

  public create = async (producto: ProductoRequestDTO): Promise<boolean> => {
    try {
      
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT insertarProducto($1,$2,$3,$4,$5,$6,$7,$8,$9) as resultado;`,
        [
          producto.idEmpresa,
          producto.idCategoria,
          producto.nombreProducto,
          producto.descripcionProducto,
          producto.precioVentaProducto,
          producto.porcentajeDescuentoProducto,
          producto.stockMinimoProducto,
          producto.stockMaximoProducto,
          producto.estadoProducto,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en ProductoDAO.create: ${error}`);
    }
  };
  public update = async (producto: ProductoRequestDTO): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery<ResultadoBooleanDTO>(
        `SELECT actualizarProducto($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) as resultado;`,
        [
          producto.idProducto,
          producto.idEmpresa,
          producto.idCategoria,
          producto.nombreProducto,
          producto.descripcionProducto,
          producto.precioVentaProducto,
          producto.porcentajeDescuentoProducto,
          producto.stockMinimoProducto,
          producto.stockMaximoProducto,
          producto.estadoProducto,
        ]
      );

      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en ProductoDAO.update: ${error}`);
    }
  };

  public existProductoNombre = async (
    nombreProducto: string,
    idEmpresa: number,
    idCategoria: number
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery(
        `SELECT existeProductoNombre ($1,$2,$3) as resultado;`,
        [nombreProducto, idEmpresa, idCategoria]
      );
      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en ProductoDAO.existProductoNombre: ${error}`);
    }
  };

  public validarStock = async (
    stockMinimoProducto: number,
    stockMaximoProducto: number
  ): Promise<boolean> => {
    try {
      const respuesta = await ejecutarQuery(
        `SELECT validarStockProducto ($1,$2) as resultado;`,
        [stockMinimoProducto, stockMaximoProducto]
      );
      return respuesta.length > 0 ? respuesta[0].resultado : false;
    } catch (error) {
      throw new Error(`Error en ProductoDAO.validarStockProducto: ${error}`);
    }
  };
}
