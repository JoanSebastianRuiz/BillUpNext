import { ReactNode } from "react";

import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";

import ParrafoCard from "../modal/ParrafoCard";
import ContenedorCard from "../modal/ContenedorCard";
import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";

const TipoMedioPagoCard = ({
    tipoMedioPago,
    children
}: {
    tipoMedioPago: TipoMedioPagoDTO,
    children: ReactNode
}) => {
    return (
        <ContenedorCard name= {tipoMedioPago.nombreTipoMedioPago}>
            <ParrafoCard 
                subtitle="Estado"
                text={tipoMedioPago.estadoTipoMedioPago ? "Activa" : "Inactiva"}
            />
            {/* Boton de acción*/}
            {children}
        </ContenedorCard>
    );
};


export default TipoMedioPagoCard;