import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react"; // Íconos para abrir/cerrar
import { signOut } from "next-auth/react";

const ContenedorNav = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        // Eliminar cookies manualmente
        document.cookie = "next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "__Secure-next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "__Host-next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Cerrar sesión con NextAuth
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="relative z-50">
            {/* Botón para abrir/cerrar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md 
               transition-all hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
                <span className="font-medium text-gray-700 dark:text-gray-200">Menú</span>
            </button>

            {/* Navbar Expandible con Scroll Interno */}
            <nav
                className={`absolute left-0 mt-2 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg 
                dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)] border border-gray-300 dark:border-gray-700 
                overflow-hidden transition-all
                ${isOpen ? "opacity-100 scale-100 max-h-screen" : "max-h-0 opacity-0 scale-95"}`}
            >
                <ul className="p-4 space-y-2 max-h-[80vh] overflow-y-auto">
                    {children}
                    <li className="block text-red-600 dark:text-red-500 font-medium px-4 py-2 rounded-lg transition-all 
                                       hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-700 dark:hover:text-red-400">
                        <button onClick={handleLogout}>
                            <span>Cerrar sesión</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ContenedorNav;
