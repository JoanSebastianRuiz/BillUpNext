import { FC } from 'react';



interface BotonFiltroProps {
    Symbol: FC<{ size: number }>;
    onClick: () => void;
    name: string;
}

const BotonFiltro: FC<BotonFiltroProps> = ({ Symbol, onClick, name }) => {
    return (
        <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            onClick={onClick}
        >
            <Symbol size={20} />
            {name}
        </button>
    )
}

export default BotonFiltro;