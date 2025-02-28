import { FC } from 'react';



interface BotonFiltroProps {
    Symbol: FC<{ size: number }>;
    onClick: () => void;
    name: string;
}

const BotonFiltro: FC<BotonFiltroProps> = ({ Symbol, onClick, name }) => {
    return (
        <button
            className="flex items-center gap-2 py-2 px-4 rounded-lg font-semibold transition-all duration-200 
        bg-blue-500 text-white hover:bg-blue-600 
        dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={onClick}
        >
            <Symbol size={20} />
            {name}
        </button>

    )
}

export default BotonFiltro;