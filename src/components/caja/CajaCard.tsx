import { ReactNode } from "react";
 
 import ParrafoCard from "../modal/ParrafoCard";
 import ContenedorCard from "../modal/ContenedorCard";
 
 import { CajaDTO } from "@/dto/CajaDTO";
import { useEmpresaContext } from "@/context/EmpresaContext";
 
 const CajaCard = ({caja,children}: {caja : CajaDTO,children: ReactNode})  => {
    const {empresas} = useEmpresaContext();

     return (
         <ContenedorCard name={caja.nombreCaja}>
             <ParrafoCard 
                 subtitle="Empresa" 
                 text={empresas.find(e => e.idEmpresa === caja.idEmpresa)?.nombreEmpresa || "N/A"}
             />
             <ParrafoCard 
                 subtitle="Estado" 
                 text={caja.estadoCaja ? "Activa" : "Inactiva"}
             />
             { /*Boton de acción */}
             {children}
 
         </ContenedorCard>
     );
 
 };
 
 export default CajaCard;