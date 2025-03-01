const ParrafoCard = ({ subtitle, text }: { subtitle: string, text: string }) => {
    return (
        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
            <span className="font-semibold text-gray-900 dark:text-gray-100">{subtitle}:</span>
            <span className="text-gray-600 dark:text-gray-400">{text}</span>
        </p>
    );
}

export default ParrafoCard;