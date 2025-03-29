"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { CajaDTO } from "@/dto/CajaDTO";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";
import { MovimientoDTO } from "@/dto/MovimientoDTO";


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
    movimientos: MovimientoDTO[]
    setMovimientos: (movimientos: MovimientoDTO[]) => void
    obtenerMovimientos: () => void
}

const CajaContext = createContext<CajaContextType | undefined>(undefined);

// Proveedor del contexto
interface CajaProviderProps {
    children: ReactNode;
}

export const CajaContextProvider: React.FC<CajaProviderProps> = ({ children }) => {
    const [cajas, setCajas] = useState<CajaDTO[]>([]);
    const [movimientos, setMovimientos] = useState<MovimientoDTO[]>([]);
    const [cajaSeleccionada, setCajaSeleccionada] = useState<CajaDTO | null>(null);
    const [detalleCajaActual, setDetalleCajaActual] = useState<DetalleCajaDTO | null>(null);
    const [detallesCajas, setDetallesCajas] = useState<DetalleCajaDTO[]>([]);
    const { data: session, status } = useSession();
    const idEmpresa = session?.user?.idEmpresa;
    const idRol = session?.user?.idRol;
    const idUsuario = session?.user?.idUsuario;


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

    const obtenerMovimientos = async () => {
        try {
            const respuesta = await axios.get<MovimientoDTO[]>(`/api/empresas/${idEmpresa}/movimientos`);
            if (respuesta.status === 200) {
                if (idRol === 2) {
                    setMovimientos(respuesta.data)
                } else if (idRol === 3) {
                    const movimientosFiltrados = respuesta.data.filter(movimiento => movimiento.idUsuario === idUsuario);
                    setMovimientos(movimientosFiltrados)
                }
            }
        } catch (error) {
            console.error("Error obteniendo movimientos ", error)
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
                if (idRol === 2) {
                    setDetallesCajas(respuesta.data)
                } else if (idRol === 3) {
                    const detallesFiltrados = respuesta.data.filter(detalle => detalle.idUsuario === idUsuario);
                    setDetallesCajas(detallesFiltrados)
                }
            }
        } catch (error) {
            console.error("Error obteniendo detalles cajas", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (status !== "authenticated" || idEmpresa == undefined) return;
            if (idRol === 3) {
                const [cajasRes, detallesCajasRes, movimientosRes] = await Promise.all([
                    axios.get<CajaDTO[]>(`/api/empresas/${idEmpresa}/cajas`),
                    axios.get<DetalleCajaDTO[]>(`/api/empresas/${idEmpresa}/detalles-cajas`),
                    axios.get<MovimientoDTO[]>(`/api/empresas/${idEmpresa}/movimientos`)
                ]);
                if (cajasRes.status === 200) setCajas(cajasRes.data);
                if (detallesCajasRes.status === 200) setDetallesCajas(detallesCajasRes.data.filter(detalle => detalle.idUsuario === idUsuario));
                if (movimientosRes.status === 200) setMovimientos(movimientosRes.data.filter(movimiento => movimiento.idUsuario === idUsuario));

            } else if (idRol === 2) {
                const [cajasRes, detallesCajasRes, movimientosRes] = await Promise.all([
                    axios.get<CajaDTO[]>(`/api/empresas/${idEmpresa}/cajas`),
                    axios.get<DetalleCajaDTO[]>(`/api/empresas/${idEmpresa}/detalles-cajas`),
                    axios.get<MovimientoDTO[]>(`/api/empresas/${idEmpresa}/movimientos`)
                ]);
                if (cajasRes.status === 200) setCajas(cajasRes.data);
                if (detallesCajasRes.status === 200) setDetallesCajas(detallesCajasRes.data);
                if (movimientosRes.status === 200) setMovimientos(movimientosRes.data);
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
            obtenerDetallesCajas,
            movimientos,
            setMovimientos,
            obtenerMovimientos
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

