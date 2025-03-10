import {  ReactNode } from "react";

import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";

import ContenedorCard from "@/components/modal/ContenedorCard";
import ParrafoCard from "@/components/modal/ParrafoCard";

const UbicacionVentaCard = ({
    ubicacionVenta,
    children
} : {
    ubicacionVenta: UbicacionVentaDTO,
    children: ReactNode
}) => {
    return (
        <ContenedorCard name= {ubicacionVenta.nombreUbicacionVenta}>
            <ParrafoCard
                subtitle=" Estado"
                text={ubicacionVenta.estadoUbicacionVenta ? "Activa" : "Inactiva"}
                />
                {/* Boton de acción */}
                {children}
        </ContenedorCard>
    );
};
    

export default UbicacionVentaCard; 