"use client";

import { createContext, useState, useContext, ReactNode, useEffect  } from "react";
import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";
import axios from "axios";
import { useSession } from "next-auth/react";



interface TipoMedioPagoContextType {
    tiposMediosPago: TipoMedioPagoDTO[];
    setTiposMediosPago: (tiposMediosPago: TipoMedioPagoDTO[]) => void;
    obtenerTiposMediosPago: () => void;
}

const tiposMediosPagoContext = createContext<TipoMedioPagoContextType | undefined>(undefined);

// Proveedor del contexto
interface tiposMediosPagoProviderProps {
    children: ReactNode;
}

export const TipoMedioPagoContextProvider: React.FC<tiposMediosPagoProviderProps> = ({ children }) => {
    const [tiposMediosPago, setTiposMediosPago] = useState<TipoMedioPagoDTO[]>([]);
    const { data: session, status } = useSession();

    const obtenerTiposMediosPago = async () => {
        try {
            const respuesta = await axios.get<TipoMedioPagoDTO[]>("/api/tipo-medio-pago")
            if (respuesta.status === 200) {
                setTiposMediosPago(respuesta.data)
            }
        } catch (error) {
            console.error("Error obteniendo Tipo Medio Pago ", error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;
           try {
            const [tiposMediosPagoRes] = await Promise.all([
                axios.get<TipoMedioPagoDTO[]>("/api/tipo-medio-pago")
            ])

            if (tiposMediosPagoRes.status === 200) setTiposMediosPago(tiposMediosPagoRes.data)
           } catch (error) {
            console.error("Error al obtener los datos de tipoMedioPago Context", error)
           }
        }
        fetchData();
    }, [session]);

    return(
        <tiposMediosPagoContext.Provider value={{
            tiposMediosPago,
            setTiposMediosPago,
            obtenerTiposMediosPago
        }}>
             {children}
        </tiposMediosPagoContext.Provider>
    );

};

// Hook personalizado para  usar el contexto
export const useTiposMediosPagoContext = (): TipoMedioPagoContextType => {
    const context = useContext(tiposMediosPagoContext);
    if (!context) {
        throw new Error("useTiposMediospagoContext debe usarse dentro de un TiposMediosPagoContextProvider");
    }
    return context;
};