import { ReactNode } from 'react';

const ContenedorMostrarInfo = ({ children, name }: { children: ReactNode, name: string }) => {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                {name}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-gray-800 dark:text-gray-300">
                {children}
            </div>
        </div>
    )
}

export default ContenedorMostrarInfo;