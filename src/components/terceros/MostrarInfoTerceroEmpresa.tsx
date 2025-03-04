import { useUsuarioContext } from "@/context/UsuarioContext";
import { useEmpresaContext } from "@/context/EmpresaContext";

import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";


const MostrarInfoTerceroEmpresa = ({ tercero }: { tercero: TerceroResponseEmpresaDTO }) => {
    const { departamentos, municipios } = useUsuarioContext();
    const { tiposPersona, regimenesContribuyente } = useEmpresaContext();

    return (
        <ContenedorMostrarInfo name={tercero.nombreTercero}>
            <ParrafoMostrarInfo subtitle="NIT" text={`${tercero.nitTercero} - ${tercero.digitoVerificacionTercero}`} />

            <ParrafoMostrarInfo subtitle="Tipo de persona" text={tiposPersona.find(tp => tp.idTipoPersona === tercero.idTipoPersona)?.nombreTipoPersona || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Regimen contribuyente" text={regimenesContribuyente.find(r => r.idRegimenContribuyente === tercero.idRegimenContribuyente)?.nombreRegimenContribuyente || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Razón social" text={tercero.razonSocialTercero} />

            <ParrafoMostrarInfo subtitle="Teléfono" text={tercero.telefonoTercero} />

            <ParrafoMostrarInfo subtitle="Correo" text={tercero.correoTercero} />

            <ParrafoMostrarInfo subtitle="Departamento" text={departamentos.find(d => d.idDepartamento === tercero.idDepartamento)?.nombreDepartamento || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Municipio" text={municipios.find(m => m.idMunicipio === tercero.idMunicipio)?.nombreMunicipio || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Dirección" text={tercero.direccionTercero} />

            <ParrafoMostrarInfo subtitle="Código postal" text={tercero.codigoPostalTercero} />

            <EstadoMostrarInfo estado={tercero.estadoTercero} />

        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoTerceroEmpresa;
