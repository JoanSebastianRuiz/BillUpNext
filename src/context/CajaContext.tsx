"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { CajaDTO } from "@/dto/CajaDTO";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";
import axios from "axios";
import { useSession } from "next-auth/react";


interface CajaContextType {
    empresas: EmpresaResponseDTO[]
    setEmpresas: (empresas: EmpresaResponseDTO[]) => void
    cajas: CajaDTO[]
    setCajas: (cajas: CajaDTO[]) => void
    obtenerCajas: () => void
}

const CajaContext = createContext<CajaContextType | undefined>(undefined);

// Proveedor del contexto
interface CajaProviderProps {
    children: ReactNode;
}

export const CajaContextProvider: React.FC<CajaProviderProps> = ({ children }) => {
    const [empresas, setEmpresas] = useState<EmpresaResponseDTO[]>([]);
    const [cajas, setCajas]= useState<CajaDTO[]>([]);
    const { data: session, status } = useSession();

    const obtenerCajas = async () => {
        try {
            const respuesta = await axios.get<CajaDTO[]>("/api/caja")
            if (respuesta.status === 200) {
                setCajas(respuesta.data)
            }
        } catch (error) {
            console.error("Error obteniendo cajas ", error )
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;
            try {
                const [empresasRes, cajaRes] = await Promise.all([
                    axios.get<EmpresaResponseDTO[]>("/api/empresas"),
                    axios.get<CajaDTO[]>("/api/caja")
                ])

                if (empresasRes.status === 200) setEmpresas(empresasRes.data)
                if (cajaRes.status === 200) setCajas(cajaRes.data)
            } catch (error) {
                console.error("Error al obtener los datos de Caja Context: ", error)
            }
        }
        fetchData();
    }, [session]);

    return(
        <CajaContext.Provider value={{
            empresas,
            setEmpresas,
            cajas,
            setCajas, 
            obtenerCajas
        }}>
            { children}
        </CajaContext.Provider>    
    );
};

// Hook personalizado para usar el contexto
export const useCajaContext = (): CajaContextType => {
    const context = useContext(CajaContext);
    if (!context) {
        throw new Error("useCajaContex debe usarse dentro de un CajaContextProvider");
    }
    return context;
};

