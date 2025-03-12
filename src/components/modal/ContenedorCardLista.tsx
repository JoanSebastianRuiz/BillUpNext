const ContenedorCardLista = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="border rounded-xl shadow-lg p-6 transition-all duration-300 
        bg-white border-gray-200 text-gray-900 hover:shadow-xl hover:-translate-y-1
        dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
            {children}
        </div>

    )
};

export default ContenedorCardLista;