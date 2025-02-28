"use client"

import { createContext, useState, useContext, ReactNode } from "react";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { TipoPersonaDTO } from "@/dto/TipoPersonaDTO";
import { RegimenContribuyenteResponseDTO } from "@/dto/RegimenContribuyenteResponseDTO";

interface EmpresaContextType {
    tiposPersona: TipoPersonaDTO[]
    setTiposPersona: (tiposPersona: TipoPersonaDTO[]) => void
    regimenesContribuyente: RegimenContribuyenteResponseDTO[]
    setRegimenesContribuyente: (regimenesContribuyente: RegimenContribuyenteResponseDTO[]) => void
    empresas: EmpresaResponseDTO[]
    setEmpresas: (empresas: EmpresaResponseDTO[]) => void
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

// Proveedor del contexto
interface EmpresaProviderProps {
    children: ReactNode;
}

export const EmpresaContextProvider: React.FC<EmpresaProviderProps> = ({ children }) => {
    const [tiposPersona, setTiposPersona] = useState<TipoPersonaDTO[]>([]);
    const [regimenesContribuyente, setRegimenesContribuyente] = useState<RegimenContribuyenteResponseDTO[]>([]);
    const [empresas, setEmpresas] = useState<EmpresaResponseDTO[]>([]);

    return (
        <EmpresaContext.Provider value={{
            tiposPersona,
            setTiposPersona,
            regimenesContribuyente,
            setRegimenesContribuyente,
            empresas,
            setEmpresas
        }}>
            {children}
        </EmpresaContext.Provider>
    )
}

// Hook personalizado para usar el contexto
export const useEmpresaContext = (): EmpresaContextType => {
    const context = useContext(EmpresaContext);
    if (!context) {
        throw new Error("useEmpresaContext debe usarse dentro de un EmpresaContextProvider");
    }
    return context;
};
