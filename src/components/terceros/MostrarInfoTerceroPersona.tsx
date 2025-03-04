import { useUsuarioContext } from "@/context/UsuarioContext";

import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

import ContenedorMostrarInfo from "../modal/ContenedorMostrarInfo";
import ParrafoMostrarInfo from "../modal/ParrafoMostrarInfo";
import EstadoMostrarInfo from "../modal/EstadoMostrarInfo";


const MostrarInfoTercero = ({ tercero }: { tercero: TerceroResponsePersonaDTO }) => {
    const { tiposDocumento, departamentos, municipios } = useUsuarioContext();

    return (
        <ContenedorMostrarInfo name={`${tercero.nombreTercero} ${tercero.apellidoTercero}`}>
            <ParrafoMostrarInfo subtitle="Tipo de documento" text={tiposDocumento.find(td => td.idTipoDocumento === tercero.idTipoDocumento)?.nombreTipoDocumento || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Documento" text={tercero.numeroDocumentoTercero} />

            <ParrafoMostrarInfo subtitle="Teléfono" text={tercero.telefonoTercero} />

            <ParrafoMostrarInfo subtitle="Correo" text={tercero.correoTercero} />

            <ParrafoMostrarInfo subtitle="Dirección" text={tercero.direccionTercero} />

            <ParrafoMostrarInfo subtitle="Departamento" text={departamentos.find(d => d.idDepartamento === tercero.idDepartamento)?.nombreDepartamento || 'N/A'} />

            <ParrafoMostrarInfo subtitle="Municipio" text={municipios.find(m => m.idMunicipio === tercero.idMunicipio)?.nombreMunicipio || 'N/A'} />

            <EstadoMostrarInfo estado={tercero.estadoTercero} />

        </ContenedorMostrarInfo>
    );
};

export default MostrarInfoTercero;
