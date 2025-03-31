"use client"

import axios from "axios";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import { TipoPersonaDTO } from "@/dto/TipoPersonaDTO";
import { RegimenContribuyenteResponseDTO } from "@/dto/RegimenContribuyenteResponseDTO";
import { useSession } from "next-auth/react";

interface EmpresaContextType {
    tiposPersona: TipoPersonaDTO[]
    setTiposPersona: (tiposPersona: TipoPersonaDTO[]) => void
    regimenesContribuyente: RegimenContribuyenteResponseDTO[]
    setRegimenesContribuyente: (regimenesContribuyente: RegimenContribuyenteResponseDTO[]) => void
    empresas: EmpresaResponseDTO[]
    setEmpresas: (empresas: EmpresaResponseDTO[]) => void
    obtenerEmpresas: () => void
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
    const { data: session, status } = useSession();
    const idRol = session?.user?.idRol;

    const obtenerEmpresas = async () => {
        try {
            const respuesta = await axios.get<EmpresaResponseDTO[]>("/api/empresas")
            if (respuesta.status === 200) {
                setEmpresas(respuesta.data)
            }
        } catch (error) {
            console.error("Error obteniendo empresas", error)
        }
    }

    useEffect(() => {
        if (status !== "authenticated") return;
        const fetchData = async () => {
            try {
                if (idRol == 1 || idRol == 2) { 
                    const [tiposPersonaRes, regimenesContribuyenteRes, empresasRes] = await Promise.all([
                        axios.get<TipoPersonaDTO[]>("/api/tipos-persona"),
                        axios.get<RegimenContribuyenteResponseDTO[]>("/api/regimenes-contribuyente"),
                        axios.get<EmpresaResponseDTO[]>("/api/empresas")
                    ])

                    if (tiposPersonaRes.status === 200) setTiposPersona(tiposPersonaRes.data)
                    if (regimenesContribuyenteRes.status === 200) setRegimenesContribuyente(regimenesContribuyenteRes.data)
                    if (empresasRes.status === 200) setEmpresas(empresasRes.data)
                } else {
                    obtenerEmpresas()
                }
            } catch (error) {
                console.error("Error al obtener los datos de Empresa Context:", error);
            }
        }
        fetchData();
    }, [status])


    return (
        <EmpresaContext.Provider value={{
            tiposPersona,
            setTiposPersona,
            regimenesContribuyente,
            setRegimenesContribuyente,
            empresas,
            setEmpresas,
            obtenerEmpresas
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
