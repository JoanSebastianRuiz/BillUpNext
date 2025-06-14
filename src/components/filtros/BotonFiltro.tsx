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
        bg-brandBlue text-white hover:bg-brandBlueHover 
        dark:bg-brandBlue dark:hover:bg-brandBlueHover"
            onClick={onClick}
        >
            <Symbol size={20} />
            {name}
        </button>

    )
}

export default BotonFiltro;