import { ReactNode } from "react";

interface TableDataProps {
    children: ReactNode;
    center?: boolean;
    width?: string; // Permite definir el ancho como porcentaje o cualquier valor válido en CSS
    smallText?: boolean; // Permite reducir el tamaño del texto
    noWrap?: boolean; // Evita saltos de línea
}

const TableData = ({ children, center, width, smallText, noWrap }: TableDataProps) => {
    return (
        <td
            className={`px-4 py-3 
                ${center ? "text-center" : ""} 
                ${smallText ? "text-sm" : "text-base"} 
                ${noWrap ? "whitespace-nowrap" : ""}`}
            style={{ width }} // Aplica el ancho directamente en el estilo
        >
            {children}
        </td>
    );
}

export default TableData;
