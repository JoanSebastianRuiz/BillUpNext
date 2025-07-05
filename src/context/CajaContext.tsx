"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { CajaDTO } from "@/dto/CajaDTO";
import axios from "axios";
import { useSession } from "next-auth/react";
import { DetalleCajaDTO } from "@/dto/DetalleCajaDTO";
import { MovimientoDTO } from "@/dto/MovimientoDTO";
import { useUsuarioContext } from "./UsuarioContext";


interface CajaContextType {
    cajas: CajaDTO[]
    setCajas: (cajas: CajaDTO[]) => void
    obtenerCajas: () => void
    cajaSeleccionada: number
    setCajaSeleccionada: (caja: number) => void
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
    const [cajaSeleccionada, setCajaSeleccionada] = useState<number>(0);
    const [detalleCajaActual, setDetalleCajaActual] = useState<DetalleCajaDTO | null>(null);
    const [detallesCajas, setDetallesCajas] = useState<DetalleCajaDTO[]>([]);
    const { data: session, status } = useSession();
    const idEmpresa = session?.user?.idEmpresa;
    const idRol = session?.user?.idRol;
    const idUsuario = session?.user?.idUsuario;
    const { usuario } = useUsuarioContext();


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

    const obtenerCajaAbierta = async () => {
        try {
            const response = await axios.get(`/api/cajas/caja-abierta-usuario/${usuario.idUsuario}`);
            if (response.status === 200) {
                setCajaSeleccionada(response.data);
                if (response.data !== 0) {
                    obtenerDetalleCajaActual(response.data);
                }
            } else {
                console.error("Error al obtener la caja abierta:", response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
        }
    }

    useEffect(() => {
        if (usuario.idRol === 3) {
            obtenerCajaAbierta();
        }
    }, [usuario]);

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

