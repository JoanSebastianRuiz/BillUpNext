"use client";

import axios from "axios";
import { createContext, useState, useContext, ReactNode } from "react";
import { CompraDTO } from "@/dto/CompraDTO";
import { useSession } from "next-auth/react";
import { DetalleCompraDTO } from "@/dto/DetalleCompraDTO";


interface CompraContextType {
    compras: CompraDTO[]
    setCompras: (compras: CompraDTO[]) => void
    detallesCompras: DetalleCompraDTO[]
    setDetallesCompras: (detallesCompras: DetalleCompraDTO[]) => void
    obtenerCompras: () => void
    obtenerDetallesCompras: () => void
}

const CompraContext = createContext<CompraContextType | undefined>(undefined);

// Proveedor del contexto
interface CompraProviderProps {
    children: ReactNode;
}

export const CompraContextProvider: React.FC<CompraProviderProps> = ({ children }) => {
    const [compras, setCompras] = useState<CompraDTO[]>([]);
    const [detallesCompras, setDetallesCompras] = useState<DetalleCompraDTO[]>([]);
    const { data: session, status } = useSession();
    const idEmpresa = session?.user?.idEmpresa;

    const obtenerCompras = async () => {
        try {
            const respuesta = await axios.get<CompraDTO[]>(`/api/empresas/${idEmpresa}/compras`);
            if (respuesta.status === 200) {
                setCompras(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo compras", error);
        }
    };

    const obtenerDetallesCompras = async () => {
        try {
            const respuesta = await axios.get<DetalleCompraDTO[]>(`/api/empresas/${idEmpresa}/detalles-compras`);
            if (respuesta.status === 200) {
                setDetallesCompras(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo detalles compras", error);
        }
    };

    return (
        <CompraContext.Provider value={{
            compras,
            setCompras,
            detallesCompras,
            setDetallesCompras,
            obtenerCompras,
            obtenerDetallesCompras
        }}>
            {children}
        </CompraContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useCompraContext = (): CompraContextType => {
    const context = useContext(CompraContext);
    if (!context) {
        throw new Error("useCompraContext debe usarse dentro de un CompraContextProvider");
    }
    return context;
};

