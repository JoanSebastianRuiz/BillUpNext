import ContenedorBotonesFiltros from "./ContenedorBotonesFiltros";

interface ContenedorFiltrosProps {
    title: string;
    children: React.ReactNode;
}

const ContenedorFiltros = ({ title, children }: ContenedorFiltrosProps) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-5">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">{title}</h1>
            {children}
        </div>
    );
};

export default ContenedorFiltros;