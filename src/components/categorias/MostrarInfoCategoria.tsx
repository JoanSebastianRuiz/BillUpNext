import { CategoriaDTO } from "@/dto/CategoriaDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";

const MostrarInfoCategoria = ({ categoria }: { categoria: CategoriaDTO }) => {
  return (
    <ContenedorMostrarInfo name={categoria.nombreCategoria}>
      <EstadoMostrarInfo estado={categoria.estadoCategoria} />
    </ContenedorMostrarInfo>
  );
};

export default MostrarInfoCategoria;
