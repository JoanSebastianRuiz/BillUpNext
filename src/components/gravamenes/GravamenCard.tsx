import { ReactNode } from "react";
import { GravamenDTO } from "@/dto/GravamenDTO"; 

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";

const GravamenCard = ({
    gravamen,
    children,
}: {
    gravamen: GravamenDTO;
    children: ReactNode;
}) => {
    const porcentajeFormateado = `${gravamen.porcentajeGravamen}%`;

    return (
        <ContenedorCard name={gravamen.nombreGravamen}>
            <ParrafoCard subtitle="Porcentaje" text={porcentajeFormateado} />
            <ParrafoCard
                subtitle="Estado"
                text={gravamen.estadoGravamen ? "Activo" : "Inactivo"}
            />

            {/* Botones de acción */}
            {children}
        </ContenedorCard>
    );
};

export default GravamenCard;