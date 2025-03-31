import { useUsuarioContext } from "@/context/UsuarioContext";
import { useEmpresaContext } from "@/context/EmpresaContext";
import { ReactNode } from "react";

import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

import ContenedorCard from "../modal/ContenedorCard";
import ParrafoCard from "../modal/ParrafoCard";


const UsuarioCard = ({ usuario, children }: { usuario: UsuarioResponseDTO, children: ReactNode }) => {
    const { roles, usuario: usuarioContext, tiposDocumento } = useUsuarioContext();
    const { empresas } = useEmpresaContext();

    return (
        <ContenedorCard name={`${usuario.nombreUsuario} ${usuario.apellidoUsuario}`}>

            {usuarioContext.idRol == 1 && <ParrafoCard subtitle="Empresa" text={empresas.find(e => e.idEmpresa === usuario.idEmpresa)?.nombreEmpresa || "N/A"} />}

            <ParrafoCard subtitle="Rol" text={roles.find(r => r.idRol === usuario.idRol)?.nombreRol || "N/A"} />

            {usuarioContext.idRol == 2 && <ParrafoCard subtitle="Tipo de documento" text={tiposDocumento.find(t => t.idTipoDocumento === usuario.idTipoDocumento)?.nombreTipoDocumento || "N/A"} />}

            {usuarioContext.idRol == 2 && <ParrafoCard subtitle="Documento" text={usuario.numeroDocumentoUsuario} />}

            {/* Botones de acción */}
            {children}
        </ContenedorCard>
    );
};

export default UsuarioCard;