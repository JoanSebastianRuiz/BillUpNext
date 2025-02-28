import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { useUsuarioContext } from "@/context/UsuarioContext";
import { ReactNode } from "react";

const UsuarioCard = ({ usuario, children }: { usuario: UsuarioResponseDTO, children: ReactNode }) => {
    const { empresas, roles } = useUsuarioContext();
    return (
        <div className="border rounded-lg shadow-md p-4 transition-all duration-200
        bg-gray-50 border-gray-300 text-gray-900
        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">

            {/* Información del usuario */}
            <h2 className="text-lg font-semibold">{usuario.nombreUsuario} {usuario.apellidoUsuario}</h2>

            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Empresa:</span> {empresas.find(e => e.idEmpresa === usuario.idEmpresa)?.nombreEmpresa}
            </p>

            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Rol:</span> {roles.find(r => r.idRol === usuario.idRol)?.nombreRol}
            </p>

            {/* Botones de acción */}
            {children}
        </div>
    );
};

export default UsuarioCard;