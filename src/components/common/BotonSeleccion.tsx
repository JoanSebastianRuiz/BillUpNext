const BotonSeleccion = ({ seleccion, onClick, name }: { seleccion: boolean, name: string, onClick: () => void }) => {
    return (
        <button
            className={`px-4 py-2 rounded-lg transition 
      ${seleccion
                    ? "bg-brandBlue text-white dark:bg-brandBlue"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
            onClick={onClick}
        >
            {name}
        </button>
    )
}

export default BotonSeleccion;