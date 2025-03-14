import { useEmpresaContext } from "@/context/EmpresaContext";
import { ReactNode } from "react";

import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";

const ProductoCard = ({
  producto,
  children,
}: {
  producto: ProductoResponseDTO;
  children: ReactNode;

}) => {
  const { empresas } = useEmpresaContext();
  const precioFormateado = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(producto.precioVentaProducto);

  return (
    <ContenedorCard name={producto.nombreProducto}>
      <ParrafoCard
        subtitle="Empresa"
        text={empresas.find(e => e.idEmpresa === producto.idEmpresa)?.nombreEmpresa || "N/A"} />
      <ParrafoCard subtitle="Precio" text={precioFormateado} />
      <ParrafoCard
        subtitle="Stock"
        text={`${producto.stockProducto} unidades`}
      />
      <ParrafoCard
        subtitle="Estado"
        text={producto.estadoProducto ? "Activo" : "Inactivo"}
      />

      {/* Botones de acción */}
      {children}
    </ContenedorCard>
  );
};

export default ProductoCard;
