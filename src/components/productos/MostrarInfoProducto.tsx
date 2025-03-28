import { useProductoContext } from "@/context/ProductoContext";

import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";

const MostrarInfoProducto = ({ producto }: {
  producto: ProductoResponseDTO;
}) => {
  const { categorias } = useProductoContext();

  return (
    <ContenedorMostrarInfo name={producto.nombreProducto}>
      <ParrafoMostrarInfo
        subtitle="Descripción"
        text={producto.descripcionProducto}
      />
      <ParrafoMostrarInfo
        subtitle="Precio base"
        text={`${producto.precioVentaProducto}`}
      />
      <ParrafoMostrarInfo
        subtitle="Descuento"
        text={`${producto.porcentajeDescuentoProducto || 0}%`}
      />
      <ParrafoMostrarInfo
        subtitle="Impuesos aplicados"
        text={`${producto.valorImpuestoProducto}`}
      />
      <ParrafoMostrarInfo
        subtitle="Precio de Venta"
        text={`${producto.valorTotalProducto}`}
      />
      <ParrafoMostrarInfo
        subtitle="Stock Mínimo"
        text={`${producto.stockMinimoProducto}`}
      />
      <ParrafoMostrarInfo
        subtitle="Stock Máximo"
        text={`${producto.stockMaximoProducto}`}
      />
      <ParrafoMostrarInfo
        subtitle="Stock Actual"
        text={`${producto.stockProducto}`}
      />
      <ParrafoMostrarInfo
        subtitle="Categoría"
        text={
          categorias.find(c => c.idCategoria === producto.idCategoria)
            ?.nombreCategoria || "N/A"
        }
      />
      <EstadoMostrarInfo estado={producto.estadoProducto} />
    </ContenedorMostrarInfo>
  );
};

export default MostrarInfoProducto;
