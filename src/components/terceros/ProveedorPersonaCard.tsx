import axios from "axios";

import { useUsuarioContext } from "@/context/UsuarioContext";
import { useTerceroContext } from "@/context/TerceroContext";
import { ReactNode } from "react";

import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

import ContenedorCardLista from "../modal/ContenedorCardLista";
import ParrafoCard from "../modal/ParrafoCard";
import ListaCard from "../common/ListaCard";



const ProveedorPersonaCard = ({ tercero, children }: { tercero: TerceroResponsePersonaDTO, children: ReactNode }) => {
    const { tiposDocumento } = useUsuarioContext();

    return (
        <ContenedorCardLista>
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold tracking-wide">
                    {`${tercero.nombreTercero} ${tercero.apellidoTercero}`}
                </h2>
                <div className="flex gap-2">{children}</div>
            </div>

            <ParrafoCard subtitle="Tipo de documento" text={tiposDocumento.find(t => t.idTipoDocumento === tercero.idTipoDocumento)?.nombreTipoDocumento || "N/A"} />

            <ParrafoCard subtitle="Número de documento" text={tercero.numeroDocumentoTercero} />

            <ParrafoCard subtitle="Teléfono" text={tercero.telefonoTercero} />

            <ParrafoCard subtitle="Correo" text={tercero.correoTercero} />

            <ListaCard name="Productos">
                <div></div>
            </ListaCard>

        </ContenedorCardLista>
    );
};

export default ProveedorPersonaCard;