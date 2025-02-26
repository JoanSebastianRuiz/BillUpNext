
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const ContenedorBotonesFiltros = ({ children }: Props) => {
    return (
        <div className="flex justify-end mb-4 gap-4">
            {children}
        </div>
    )
}

export default ContenedorBotonesFiltros;