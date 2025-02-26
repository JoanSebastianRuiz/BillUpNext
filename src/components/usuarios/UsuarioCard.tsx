import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";
import { ReactNode } from "react";

const UsuarioCard = ({ usuario, children }: { usuario: UsuarioResponseDTO, children : ReactNode }) => {
    const {empresas, roles} = useUsuarioContext();
    return (
        <div
            className="border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4 bg-white dark:bg-gray-900"
        >
            {/* Información del usuario */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {usuario.nombreUsuario} {usuario.apellidoUsuario}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Empresa:</span> {empresas.find(e => e.idEmpresa === usuario.idEmpresa)?.nombreEmpresa}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Rol:</span> {roles.find(r => r.idRol === usuario.idRol)?.nombreRol}
            </p>

            {/* Botones de acción */}
            {children}
        </div>
    );
};

export default UsuarioCard;