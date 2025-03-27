const ParrafoMostrarInfo = ({ text, subtitle, justify = false }: { text: string, subtitle: string, justify?: boolean }) => {
    return (
        <p className={`whitespace-pre-wrap ${justify && "text-justify"}`}><span className="font-semibold">{subtitle}:</span> {text}</p>
    );
}

export default ParrafoMostrarInfo;
