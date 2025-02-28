import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react"; // Íconos para abrir/cerrar

const ContenedorNav = ({children}: {children: ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* Botón para abrir/cerrar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md 
                           transition-all hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
                <span className="font-medium text-gray-700 dark:text-gray-200">Menú</span>
            </button>

            {/* Navbar Expandible */}
            <nav
                className={`absolute left-0 mt-2 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all
                            ${isOpen ? "max-h-60 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"}
                          `}
            >
                <ul className="p-4 space-y-2">
                    {children}
                </ul>
            </nav>
        </div>
    );
};

export default ContenedorNav;
