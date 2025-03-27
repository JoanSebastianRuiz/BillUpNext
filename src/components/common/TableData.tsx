import { ReactNode } from "react";

interface TableDataProps {
    children: ReactNode;
    center?: boolean;
    width?: string; // Permite definir el ancho como porcentaje o cualquier valor válido en CSS
    smallText?: boolean; // Permite reducir el tamaño del texto
}

const TableData = ({ children, center, width, smallText }: TableDataProps) => {
    return (
        <td 
            className={`px-4 py-3 ${center ? "text-center" : ""} ${smallText ? "text-sm" : "text-base"}`} 
            style={{ width }} // Aplica el ancho directamente en el estilo
        >
            {children}
        </td>
    );
}

export default TableData;
