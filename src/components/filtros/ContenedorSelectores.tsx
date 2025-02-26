import { ReactNode } from 'react';

interface ContenedorSelectoresProps {
    children: ReactNode;
}

const ContenedorSelectores = ({ children }: ContenedorSelectoresProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children}
        </div>
    );
};

export default ContenedorSelectores;