"use client"

import { createContext, useState, useContext, ReactNode } from "react";
import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";

interface TerceroContextType {
    clientesPersona: TerceroResponsePersonaDTO[]
    setClientesPersona: (clientesPersona: TerceroResponsePersonaDTO[]) => void
    clientesEmpresa: TerceroResponseEmpresaDTO[]
    setClientesEmpresa: (clientesEmpresa: TerceroResponseEmpresaDTO[]) => void
    proveedoresPersona: TerceroResponsePersonaDTO[]
    setProveedoresPersona: (proveedoresPersona: TerceroResponsePersonaDTO[]) => void
    proveedoresEmpresa: TerceroResponseEmpresaDTO[]
    setProveedoresEmpresa: (proveedoresEmpresa: TerceroResponseEmpresaDTO[]) => void
}

const TerceroContext = createContext<TerceroContextType | undefined>(undefined);

// Proveedor del contexto
interface TerceroProviderProps {
    children: ReactNode;
}

export const TerceroContextProvider: React.FC<TerceroProviderProps> = ({ children }) => {
    const [clientesPersona, setClientesPersona] = useState<TerceroResponsePersonaDTO[]>([]);
    const [clientesEmpresa, setClientesEmpresa] = useState<TerceroResponseEmpresaDTO[]>([]);
    const [proveedoresPersona, setProveedoresPersona] = useState<TerceroResponsePersonaDTO[]>([]);
    const [proveedoresEmpresa, setProveedoresEmpresa] = useState<TerceroResponseEmpresaDTO[]>([]);

    return (
        <TerceroContext.Provider value={{
            clientesPersona,
            setClientesPersona,
            clientesEmpresa,
            setClientesEmpresa,
            proveedoresPersona,
            setProveedoresPersona,
            proveedoresEmpresa,
            setProveedoresEmpresa
        }}>
            {children}
        </TerceroContext.Provider>
    )
}

// Hook personalizado para usar el contexto
export const useTerceroContext = (): TerceroContextType => {
    const context = useContext(TerceroContext);
    if (!context) {
        throw new Error("useTerceroContext debe usarse dentro de un TerceroContextProvider");
    }
    return context;
};
