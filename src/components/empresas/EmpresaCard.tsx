import { ReactNode } from "react";

import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";


const EmpresaCard = ({ empresa, children }: { empresa: EmpresaResponseDTO, children: ReactNode }) => {
    
    return (
        <ContenedorCard name={empresa.nombreEmpresa}>

            <ParrafoCard subtitle="NIT" text={`${empresa.nitEmpresa} - ${empresa.digitoVerificacionEmpresa}`} />
            <ParrafoCard subtitle="Teléfono" text={empresa.telefonoEmpresa} />
            <ParrafoCard subtitle="Correo" text={empresa.correoEmpresa} />
            <ParrafoCard subtitle="Dirección" text={empresa.direccionEmpresa} />

            {/* Botones de acción */}
            {children}
        </ContenedorCard>
    );
};

export default EmpresaCard;