const ParrafoMostrarInfo = ({ text, subtitle }: { text: string, subtitle: string }) => {
    return (
        <p><span className="font-semibold">{subtitle}:</span> {text}</p>
    );
}

export default ParrafoMostrarInfo;