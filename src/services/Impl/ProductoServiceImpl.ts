import { ProductoService } from "@/services/ProductoService";
import { ProductoDAOImpl } from "@/dao/impl/ProductoDAOImpl";
import { NextResponse } from "next/server";
import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { ProductoRequestDTO } from "@/dto/ProductoRequestDTO";
import { GravamenProductoDTO } from "@/dto/GravamenProductoDTO";
import { GravamenProductoDAOImpl } from "@/dao/impl/GravamenProductoDAOImpl";
import { isValidLength, isValidNum } from "@/util/validators/validators";

export class ProductoServiceImpl implements ProductoService {
  private static instancia: ProductoServiceImpl;
  private productoDAOImpl: ProductoDAOImpl = ProductoDAOImpl.getInstance();
  private gravamenProductoDAOImpl: GravamenProductoDAOImpl = GravamenProductoDAOImpl.getInstance();
  private constructor() { }

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
        estadoProducto === undefined
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (!isValidLength(nombreProducto, 50)) {
        return NextResponse.json(
          { message: "Nombre invalido" },
          { status: 400 }
        );
      }

      if (!isValidLength(descripcionProducto, 250)) {
        return NextResponse.json(
          { message: "Descripción invalida" },
          { status: 400 }
        );
      }

      if (!isValidNum(precioVentaProducto.toString())) {
        return NextResponse.json(
          { message: "Precio invalido" },
          { status: 400 }
        );
      }

      if (!isValidNum(stockMinimoProducto.toString())) {
        return NextResponse.json(
          { message: "Stock minimo invalido" },
          { status: 400 }
        );
      }

      if (!isValidNum(stockMaximoProducto.toString())) {
        return NextResponse.json(
          { message: "Stock maximo invalido" },
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
        estadoProducto === undefined
      ) {
        return NextResponse.json(
          { message: "Faltan campos por llenar" },
          { status: 400 }
        );
      }

      if (!isValidLength(nombreProducto, 50)) {
        return NextResponse.json(
          { message: "Nombre invalido" },
          { status: 400 }
        );
      }

      if (!isValidLength(descripcionProducto, 250)) {
        return NextResponse.json(
          { message: "Descripción invalida" },
          { status: 400 }
        );
      }

      if (!isValidNum(precioVentaProducto.toString())) {
        return NextResponse.json(
          { message: "Precio invalido" },
          { status: 400 }
        );
      }

      if (!isValidNum(stockMinimoProducto.toString())) {
        return NextResponse.json(
          { message: "Stock minimo invalido" },
          { status: 400 }
        );
      }

      if (!isValidNum(stockMaximoProducto.toString())) {
        return NextResponse.json(
          { message: "Stock maximo invalido" },
          { status: 400 }
        );
      }

      const productoExistente = await this.productoDAOImpl.getById(idProducto);

      if (!productoExistente) {
        return NextResponse.json(
          { message: "El producto no existe" },
          { status: 400 }
        );
      }

      if (nombreProducto !== productoExistente.nombreProducto) {
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
      const productos: ProductoResponseDTO[] = await this.productoDAOImpl.getAll(idEmpresa);
      const gravamenesProducto: GravamenProductoDTO[] = await this.gravamenProductoDAOImpl.getAll(idEmpresa);

      const productosModificados = productos.map((producto: ProductoResponseDTO) => {
        const gravamenes = gravamenesProducto.filter((gp: GravamenProductoDTO) => gp.idProducto === producto.idProducto);

        return {
          ...producto, // Copia el objeto sin modificar el original
          precioVentaProducto: producto.precioVentaProducto +
            (gravamenes.reduce((acc: number, gp: GravamenProductoDTO) => acc + gp.porcentajeGravamenProducto, 0) * (producto.precioVentaProducto / 100)) -
            producto.precioVentaProducto * (producto.porcentajeDescuentoProducto / 100),
        };
      });
      return productosModificados;
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
