import { useUsuarioContext } from "@/context/UsuarioContext";
import { ReactNode } from "react";

import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";



const TerceroPersonaCard = ({ tercero, children }: { tercero: TerceroResponsePersonaDTO, children: ReactNode }) => {
    const { tiposDocumento } = useUsuarioContext();

    return (
        <ContenedorCard name={`${tercero.nombreTercero} ${tercero.apellidoTercero}`}>
            <ParrafoCard subtitle="Tipo de documento" text={tiposDocumento.find(t => t.idTipoDocumento === tercero.idTipoDocumento)?.nombreTipoDocumento || "N/A"} />

            <ParrafoCard subtitle="Número de documento" text={tercero.numeroDocumentoTercero} />

            <ParrafoCard subtitle="Teléfono" text={tercero.telefonoTercero} />

            <ParrafoCard subtitle="Correo" text={tercero.correoTercero} />

            {/* Botones de acción */}
            {children}
        </ContenedorCard>
    );
};

export default TerceroPersonaCard;