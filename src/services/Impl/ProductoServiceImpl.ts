import { ProductoService } from "@/services/ProductoService";
import { ProductoDAOImpl } from "@/dao/impl/ProductoDAOImpl";
import { NextResponse } from "next/server";
import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { ProductoRequestDTO } from "@/dto/ProductoRequestDTO";

export class ProductoServiceImpl implements ProductoService {
  private static instancia: ProductoServiceImpl;
  private productoDAOImpl: ProductoDAOImpl = ProductoDAOImpl.getInstance();
  private constructor() {}

  public static getInstance(): ProductoServiceImpl {
    if (!ProductoServiceImpl.instancia) {
      ProductoServiceImpl.instancia = new ProductoServiceImpl();
    }
    return ProductoServiceImpl.instancia;
  }

  public create = async (
    producto: ProductoRequestDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idEmpresa,
        idCategoria,
        nombreProducto,
        descripcionProducto,
        precioVentaProducto,
        stockMinimoProducto,
        stockMaximoProducto,
        estadoProducto,
      } = producto;

      const porcentajeDescuentoProducto =
      producto.porcentajeDescuentoProducto !== undefined &&
      producto.porcentajeDescuentoProducto !== null 
        ? parseFloat(producto.porcentajeDescuentoProducto as any)
        : 0;

      if (
        !idEmpresa ||
        !idCategoria ||
        !nombreProducto ||
        !descripcionProducto ||
        !precioVentaProducto ||
        !stockMinimoProducto ||
        !stockMaximoProducto ||
        !estadoProducto
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (
        await this.productoDAOImpl.existProductoNombre(
          nombreProducto,
          idEmpresa,
          idCategoria
        )
      ) {
        return NextResponse.json(
          { message: "El nombre del producto ya existe" },
          { status: 400 }
        );
      }

      if (
        !(await this.productoDAOImpl.validarStock(
          stockMinimoProducto,
          stockMaximoProducto
        ))
      ) {
        return NextResponse.json(
          { message: "Los valores del stock no son validos" },
          { status: 400 }
        );
      }

      const respuesta = await this.productoDAOImpl.create({
        idEmpresa,
        idCategoria,
        nombreProducto,
        descripcionProducto,
        precioVentaProducto,
        porcentajeDescuentoProducto,
        stockMinimoProducto,
        stockMaximoProducto,
        estadoProducto,
      });

      if (respuesta) {
        return NextResponse.json(
          { message: "Producto creado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al crear el producto" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en ProductoService.create: ${error}`);
    }
  };

  public update = async (
    producto: ProductoRequestDTO
  ): Promise<NextResponse> => {
    try {
      const {
        idProducto,
        idEmpresa,
        idCategoria,
        nombreProducto,
        descripcionProducto,
        precioVentaProducto,
        stockMinimoProducto,
        stockMaximoProducto,
        estadoProducto,
      } = producto;

      const porcentajeDescuentoProducto =
  producto.porcentajeDescuentoProducto !== undefined &&
  producto.porcentajeDescuentoProducto !== null 
    ? parseFloat(producto.porcentajeDescuentoProducto as any)
    : 0;

      if (
        !idProducto ||
        !idEmpresa ||
        !idCategoria ||
        !nombreProducto ||
        !descripcionProducto ||
        !precioVentaProducto ||
        !stockMinimoProducto ||
        !stockMaximoProducto ||
        !estadoProducto
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (
        await this.productoDAOImpl.existProductoNombre(
          nombreProducto,
          idEmpresa,
          idCategoria,
          idProducto
        )
      ) {
        return NextResponse.json(
          { message: "El nombre del producto ya existe"},
          { status: 400 }
        );
      }

      if (
        !(await this.productoDAOImpl.validarStock(
          stockMinimoProducto,
          stockMaximoProducto
        ))
      ) {
        return NextResponse.json(
          { message: "Los valores del stock no son validos" },
          { status: 400 }
        );
      }

      const respuesta = await this.productoDAOImpl.update({
        idProducto,
        idEmpresa,
        idCategoria,
        nombreProducto,
        descripcionProducto,
        precioVentaProducto,
        porcentajeDescuentoProducto,
        stockMinimoProducto,
        stockMaximoProducto,
        estadoProducto,
      });

      if (respuesta) {
        return NextResponse.json(
          { message: "Producto actualizado correctamente" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Error al actualizar el producto" },
          { status: 500 }
        );
      }
    } catch (error) {
      throw new Error(`Error en ProductoService.update: ${error}`);
    }
  };

  public getAll = async (idEmpresa: number): Promise<Array<ProductoResponseDTO>> => {
    try {
      const respuesta: ProductoResponseDTO[] =
        await this.productoDAOImpl.getAll(idEmpresa);
      return respuesta;
    } catch (error) {
      throw new Error(`Error en ProdcutoService.getAll: ${error}`);
    }
  };

  public getById = async (
    idProducto: number
  ): Promise<ProductoResponseDTO | null> => {
    try {
      const respuesta = await this.productoDAOImpl.getById(idProducto);

      if (!respuesta) {
        return null;
      }
      return respuesta;
    } catch (error) {
      throw new Error(`Error en ProductoService.getById: ${error}`);
    }
  };
}
