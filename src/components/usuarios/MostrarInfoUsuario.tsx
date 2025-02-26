import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";

const MostrarInfoUsuario = ({ usuario }: { usuario: UsuarioResponseDTO }) => {
    const { tiposDocumento, departamentos, municipios, empresas, roles } = useUsuarioContext();
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                {usuario.nombreUsuario} {usuario.apellidoUsuario}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
                <p><span className="font-semibold">Tipo de documento:</span> {tiposDocumento.find(td => td.idTipoDocumento === usuario.idTipoDocumento)?.nombreTipoDocumento}</p>

                <p><span className="font-semibold">Documento:</span> {usuario.numeroDocumentoUsuario}</p>

                <p><span className="font-semibold">Empresa:</span> {empresas.find(e=>e.idEmpresa === usuario.idEmpresa)?.nombreEmpresa}</p>

                <p><span className="font-semibold">Rol:</span> {roles.find(r=>r.idRol === usuario.idRol)?.nombreRol}</p>

                <p><span className="font-semibold">Teléfono:</span> {usuario.telefonoUsuario}</p>

                <p><span className="font-semibold">Correo:</span> {usuario.correoUsuario}</p>

                <p><span className="font-semibold">Dirección:</span> {usuario.direccionUsuario}</p>

                <p><span className="font-semibold">Departamento:</span> {departamentos.find(d=>d.idDepartamento === usuario.idDepartamento)?.nombreDepartamento}</p>

                <p><span className="font-semibold">Municipio:</span> {municipios.find(m=>m.idMunicipio === usuario.idMunicipio)?.nombreMunicipio}</p>
                
                <p>
                    <span className="font-semibold">Estado:</span>
                    <span className={`ml-1 px-2 py-1 text-xs font-bold rounded-md ${usuario.estadoUsuario ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {usuario.estadoUsuario ? "Activo" : "Inactivo"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default MostrarInfoUsuario;
