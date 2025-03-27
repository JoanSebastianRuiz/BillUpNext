"use client";

import axios from "axios";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";
import { useSession } from "next-auth/react";


interface VentaContextType {
    ubicacionesVenta: UbicacionVentaDTO[]
    setUbicacionesVenta: (ubicacionesVenta: UbicacionVentaDTO[]) => void
    obtenerUbicacionesVenta: () => void
}

const VentaContext = createContext<VentaContextType | undefined>(undefined);

// Proveedor del contexto
interface CompraProviderProps {
    children: ReactNode;
}

export const VentaContextProvider: React.FC<CompraProviderProps> = ({ children }) => {
    const [ubicacionesVenta, setUbicacionesVenta] = useState<UbicacionVentaDTO[]>([]);
    const { data: session, status } = useSession();
    const idEmpresa = session?.user?.idEmpresa;
    const idRol = session?.user?.idRol;

    const obtenerUbicacionesVenta = async () => {
        try {
            const respuesta = await axios.get<UbicacionVentaDTO[]>(`/api/empresas/${idEmpresa}/ubicaciones-venta`);
            if (respuesta.status === 200) {
                setUbicacionesVenta(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo ubicaciones de venta", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (status !== "authenticated" || idEmpresa == undefined) return;
            if (idRol === 2 || idRol === 3) {
                obtenerUbicacionesVenta();
            }
        }
        fetchData();
    }, [status])

    return (
        <VentaContext.Provider value={{
            ubicacionesVenta,
            setUbicacionesVenta,
            obtenerUbicacionesVenta
        }}>
            {children}
        </VentaContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useVentaContext = (): VentaContextType => {
    const context = useContext(VentaContext);
    if (!context) {
        throw new Error("useVentaContext debe usarse dentro de un VentaContextProvider");
    }
    return context;
};

