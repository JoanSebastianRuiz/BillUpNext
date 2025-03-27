const EstadoMostrarInfo = ({ estado, facturacion = false }: { estado: boolean, facturacion?: boolean }) => {
    const estadoTexto = facturacion
        ? (estado ? "Registrada" : "Cancelada")
        : (estado ? "Activo" : "Inactivo");

    return (
        <p>
            <span className="font-semibold">Estado:</span>
            <span className={`ml-1 px-2 py-1 text-xs font-bold rounded-md ${estado ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {estadoTexto}
            </span>
        </p>
    );
};

export default EstadoMostrarInfo;