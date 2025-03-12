import { ReactNode } from "react";

import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";

const ClienteEmpresaCard = ({ tercero, children }: { tercero: TerceroResponseEmpresaDTO, children: ReactNode }) => {
    return (
        <ContenedorCard name={tercero.nombreTercero}>
            <ParrafoCard subtitle="NIT" text={`${tercero.nitTercero} - ${tercero.digitoVerificacionTercero}`} />
            <ParrafoCard subtitle="Teléfono" text={tercero.telefonoTercero} />
            <ParrafoCard subtitle="Correo" text={tercero.correoTercero} />
            
            {/* Botones de acción */}
            {children}
        </ContenedorCard>
    );
};

export default ClienteEmpresaCard;