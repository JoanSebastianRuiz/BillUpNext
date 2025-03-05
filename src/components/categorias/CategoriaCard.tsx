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
  return (
    <ContenedorCard name={categoria.nombreCategoria}>
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
