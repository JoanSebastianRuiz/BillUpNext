import { FC } from 'react';

interface BotonAccionCardProps {
    Symbol: FC<{ className: string; onClick: () => void }>;
    onClick: () => void;
    h?: number;
}

const BotonAccionCard: FC<BotonAccionCardProps> = ({ Symbol, onClick, h=5 }) => {
    return (
        <button
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
            <Symbol className={`w-${h} h-${h} text-gray-600 dark:text-gray-300`}
                onClick={onClick}
            />
        </button>
    )
}

export default BotonAccionCard;