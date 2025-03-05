import { ChevronLeft, ChevronRight } from "lucide-react";

const ControlesPaginacion = ({
    currentPage,
    totalPages,
    setCurrentPage,
}: {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (currentPage: number) => void;
}) => {
    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            {/* Botón Anterior */}
            <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
            >
                <ChevronLeft size={18} /> Anterior
            </button>

            {/* Indicador de Página */}
            <span className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Página {currentPage} de {totalPages}
            </span>

            {/* Botón Siguiente */}
            <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition bg-gray-200 rounded-lg dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
            >
                Siguiente <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default ControlesPaginacion;
