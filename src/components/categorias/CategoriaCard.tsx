import { useEmpresaContext } from "@/context/EmpresaContext";
import { ReactNode } from "react";

import { CategoriaDTO } from "@/dto/CategoriaDTO";

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";

const CategoriaCard = ({
  categoria,
  children
}: {
  categoria: CategoriaDTO,
  children: ReactNode
}) => {
  const { empresas } = useEmpresaContext();

  return (
    <ContenedorCard name={categoria.nombreCategoria}>
      <ParrafoCard
        subtitle="Empresa"
        text={empresas.find(e => e.idEmpresa === categoria.idEmpresa)?.nombreEmpresa || "N/A"} />
      <ParrafoCard
        subtitle="Estado"
        text={categoria.estadoCategoria ? "Activa" : "Inactiva"}
      />
      {/* Botone de ación */}
      {children}
    </ContenedorCard>
  );
};

export default CategoriaCard;
