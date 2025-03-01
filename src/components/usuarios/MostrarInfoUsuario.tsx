import { useUsuarioContext } from "@/context/UsuarioContext";
import { useEmpresaContext } from "@/context/EmpresaContext";

import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";


const MostrarInfoUsuario = ({ usuario }: { usuario: UsuarioResponseDTO }) => {
    const { tiposDocumento, departamentos, municipios, roles } = useUsuarioContext();
    const { empresas } = useEmpresaContext();

    return (
        <ContenedorMostrarInfo name={`${usuario.nombreUsuario} ${usuario.apellidoUsuario}`}>
            <ParrafoMostrarInfo subtitle="Tipo de documento" text={tiposDocumento.find(td => td.idTipoDocumento === usuario.idTipoDocumento)?.nombreTipoDocumento || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Documento" text={usuario.numeroDocumentoUsuario} />

            <ParrafoMostrarInfo subtitle="Empresa" text={empresas.find(e => e.idEmpresa === usuario.idEmpresa)?.nombreEmpresa || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Rol" text={roles.find(r => r.idRol === usuario.idRol)?.nombreRol || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Teléfono" text={usuario.telefonoUsuario} />

            <ParrafoMostrarInfo subtitle="Correo" text={usuario.correoUsuario} />

            <ParrafoMostrarInfo subtitle="Dirección" text={usuario.direccionUsuario} />

            <ParrafoMostrarInfo subtitle="Departamento" text={departamentos.find(d => d.idDepartamento === usuario.idDepartamento)?.nombreDepartamento || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Municipio" text={municipios.find(m => m.idMunicipio === usuario.idMunicipio)?.nombreMunicipio || 'N/A'} />

            <EstadoMostrarInfo estado={usuario.estadoUsuario} />

        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoUsuario;
