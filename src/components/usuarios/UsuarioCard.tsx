import { useUsuarioContext } from "@/context/UsuarioContext";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { ReactNode } from "react";

import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";


const UsuarioCard = ({ usuario, children }: { usuario: UsuarioResponseDTO, children: ReactNode }) => {
    const { roles } = useUsuarioContext();
    const { empresas } = useEmpresaContext();
    
    return (
        <ContenedorCard name={`${usuario.nombreUsuario} ${usuario.apellidoUsuario}`}>

            <ParrafoCard subtitle="Empresa" text={empresas.find(e => e.idEmpresa === usuario.idEmpresa)?.nombreEmpresa || "N/A"} />

            <ParrafoCard subtitle="Rol" text={roles.find(r => r.idRol === usuario.idRol)?.nombreRol || "N/A"} />


            {/* Botones de acción */}
            {children}
        </ContenedorCard>
    );
};

export default UsuarioCard;