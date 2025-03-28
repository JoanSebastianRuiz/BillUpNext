"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { CajaDTO } from "@/dto/CajaDTO";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";


interface CajaContextType {
    cajas: CajaDTO[]
    setCajas: (cajas: CajaDTO[]) => void
    obtenerCajas: () => void
    cajaSeleccionada: CajaDTO | null
    setCajaSeleccionada: (caja: CajaDTO | null) => void
    detalleCajaActual: DetalleCajaDTO | null
    setDetalleCajaActual: (detalleCaja: DetalleCajaDTO | null) => void
    obtenerDetalleCajaActual: (idCaja: number) => void
    detallesCajas: DetalleCajaDTO[]
    setDetallesCajas: (detallesCajas: DetalleCajaDTO[]) => void
    obtenerDetallesCajas: () => void
}

const CajaContext = createContext<CajaContextType | undefined>(undefined);

// Proveedor del contexto
interface CajaProviderProps {
    children: ReactNode;
}

export const CajaContextProvider: React.FC<CajaProviderProps> = ({ children }) => {
    const [cajas, setCajas] = useState<CajaDTO[]>([]);
    const [cajaSeleccionada, setCajaSeleccionada] = useState<CajaDTO | null>(null);
    const [detalleCajaActual, setDetalleCajaActual] = useState<DetalleCajaDTO | null>(null);
    const [detallesCajas, setDetallesCajas] = useState<DetalleCajaDTO[]>([]);
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

    const obtenerDetalleCajaActual = async (idCaja: number) => {
        try {
            const respuesta = await axios.get<DetalleCajaDTO>(`/api/cajas/${idCaja}/detalle-caja-actual`);
            if (respuesta.status === 200) {
                setDetalleCajaActual(respuesta.data)
            }
        } catch (error) {
            console.error("Error obteniendo detalle caja actual", error)
        }
    }

    const obtenerDetallesCajas = async () => {
        try {
            const respuesta = await axios.get<DetalleCajaDTO[]>(`/api/empresas/${idEmpresa}/detalles-cajas`);
            if (respuesta.status === 200) {
                setDetallesCajas(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo detalles cajas", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (status !== "authenticated" || idEmpresa == undefined) return;
            if (idRol === 3) {
                obtenerCajas();

            } else if (idRol === 2) {
                const [cajasRes, detallesCajasRes] = await Promise.all([
                    axios.get<CajaDTO[]>(`/api/empresas/${idEmpresa}/cajas`),
                    axios.get<DetalleCajaDTO[]>(`/api/empresas/${idEmpresa}/detalles-cajas`)
                ]);
                if (cajasRes.status === 200) setCajas(cajasRes.data);
                if (detallesCajasRes.status === 200) setDetallesCajas(detallesCajasRes.data);
            }
        }
        fetchData();
    }, [status])

    return (
        <CajaContext.Provider value={{
            cajas,
            setCajas,
            obtenerCajas,
            cajaSeleccionada,
            setCajaSeleccionada,
            detalleCajaActual,
            setDetalleCajaActual,
            obtenerDetalleCajaActual,
            detallesCajas,
            setDetallesCajas,
            obtenerDetallesCajas
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

