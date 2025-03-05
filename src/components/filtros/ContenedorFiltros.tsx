import Titulo from "../common/Titulo";

interface ContenedorFiltrosProps {
    title: string;
    children: React.ReactNode;
}

const ContenedorFiltros = ({ title, children }: ContenedorFiltrosProps) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-5">
            <Titulo name={title} />
            {children}
        </div>
    );
};

export default ContenedorFiltros;