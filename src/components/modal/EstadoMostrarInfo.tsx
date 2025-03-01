const EstadoMostrarInfo = ({ estado }: { estado: boolean }) => {
    return (
        <p>
            <span className="font-semibold">Estado:</span>
            <span className={`ml-1 px-2 py-1 text-xs font-bold rounded-md ${estado ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {estado ? "Activo" : "Inactivo"}
            </span>
        </p>
    );
};

export default EstadoMostrarInfo;