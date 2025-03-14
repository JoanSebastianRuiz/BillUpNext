import { useEmpresaContext } from "@/context/EmpresaContext";

import { CategoriaDTO } from "@/dto/CategoriaDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";

const MostrarInfoCategoria = ({ categoria }: { categoria: CategoriaDTO }) => {
  const { empresas } = useEmpresaContext();
  return (
    <ContenedorMostrarInfo name={categoria.nombreCategoria}>
      <ParrafoMostrarInfo
        subtitle="Empresa"
        text={empresas.find(e => e.idEmpresa === categoria.idEmpresa)?.nombreEmpresa || "N/A"} />
      <EstadoMostrarInfo estado={categoria.estadoCategoria} />
    </ContenedorMostrarInfo>
  );
};

export default MostrarInfoCategoria;
