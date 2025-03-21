"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { CajaDTO } from "@/dto/CajaDTO";
import axios from "axios";
import { useSession } from "next-auth/react";


interface CajaContextType {
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
    const [cajas, setCajas] = useState<CajaDTO[]>([]);
    const { data: session, status } = useSession();
    const idEmpresa = session?.user?.idEmpresa;
    const idRol = session?.user?.idRol;


    const obtenerCajas = async () => {
        try {
            const respuesta = await axios.get<CajaDTO[]>(`/api/empresas/${idEmpresa}/cajas`);
            if (respuesta.status === 200) {
                setCajas(respuesta.data)
            }
        } catch (error) {
            console.error("Error obteniendo cajas ", error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (status !== "authenticated" || idEmpresa == undefined) return;
            if (idRol === 2 || idRol === 3) {
                obtenerCajas();
            }
        }
        fetchData();
    }, [status])

    return (
        <CajaContext.Provider value={{
            cajas,
            setCajas,
            obtenerCajas
        }}>
            {children}
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

