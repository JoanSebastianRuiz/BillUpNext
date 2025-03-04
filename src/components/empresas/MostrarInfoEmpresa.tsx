import { useUsuarioContext } from "@/context/UsuarioContext";
import { useEmpresaContext } from "@/context/EmpresaContext";

import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";


const MostrarInfoEmpresa = ({ empresa }: { empresa: EmpresaResponseDTO }) => {
    const { departamentos, municipios } = useUsuarioContext();
    const { empresas, tiposPersona, regimenesContribuyente } = useEmpresaContext();

    return (
        <ContenedorMostrarInfo name={empresa.nombreEmpresa}>
            <ParrafoMostrarInfo subtitle="NIT" text={`${empresa.nitEmpresa} - ${empresa.digitoVerificacionEmpresa}`} />

            <ParrafoMostrarInfo subtitle="Tipo de persona" text={tiposPersona.find(tp => tp.idTipoPersona === empresa.idTipoPersona)?.nombreTipoPersona || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Regimen contribuyente" text={regimenesContribuyente.find(r => r.idRegimenContribuyente === empresa.idRegimenContribuyente)?.nombreRegimenContribuyente || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Razón social" text={empresa.razonSocialEmpresa} />

            <ParrafoMostrarInfo subtitle="Teléfono" text={empresa.telefonoEmpresa} />

            <ParrafoMostrarInfo subtitle="Correo" text={empresa.correoEmpresa} />

            <ParrafoMostrarInfo subtitle="Departamento" text={departamentos.find(d => d.idDepartamento === empresa.idDepartamento)?.nombreDepartamento || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Municipio" text={municipios.find(m => m.idMunicipio === empresa.idMunicipio)?.nombreMunicipio || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Dirección" text={empresa.direccionEmpresa} />

            <ParrafoMostrarInfo subtitle="Código postal" text={empresa.codigoPostalEmpresa} />

            <EstadoMostrarInfo estado={empresa.estadoEmpresa} />

        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoEmpresa;
