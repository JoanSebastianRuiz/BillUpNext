import { CajaDTO } from "@/dto/CajaDTO";
import { useCajaContext } from "@/context/CajaContext";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";



const MostrarInfoCaja= ({caja} : {caja : CajaDTO} ) => {
    const { empresas } = useCajaContext();
    
    return (
        <ContenedorMostrarInfo name= {caja.nombreCaja}>
            <ParrafoMostrarInfo subtitle="Empresa" text={empresas.find(e => e.idEmpresa === caja.idEmpresa)?.nombreEmpresa || 'N/A'}/>
            <EstadoMostrarInfo estado = {caja.estadoCaja} />
        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoCaja;
