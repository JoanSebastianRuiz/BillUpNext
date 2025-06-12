"use client";

import axios from "axios";
import { createContext, useState, useContext, ReactNode } from "react";
import { UbicacionVentaDTO } from "@/dto/UbicacionVentaDTO";
import { useSession } from "next-auth/react";
import { VentaDTO } from "@/dto/VentaDTO";
import { DetalleVentaDTO } from "@/dto/DetalleVentaDTO";
import { TipoMedioPagoDTO } from "@/dto/TipoMedioPagoDTO";


interface VentaContextType {
    ventas: VentaDTO[]
    setVentas: (ventas: VentaDTO[]) => void
    obtenerVentas: () => void
    ubicacionesVenta: UbicacionVentaDTO[]
    setUbicacionesVenta: (ubicacionesVenta: UbicacionVentaDTO[]) => void
    obtenerUbicacionesVenta: () => void
    detallesVentas: DetalleVentaDTO[]
    setDetallesVentas: (detallesVentas: DetalleVentaDTO[]) => void
    obtenerDetallesVentas: () => void
    tiposMedioPago: TipoMedioPagoDTO[];
    setTiposMedioPago: (tiposMediosPago: TipoMedioPagoDTO[]) => void;
    obtenerTiposMedioPago: () => void;
}

const VentaContext = createContext<VentaContextType | undefined>(undefined);

// Proveedor del contexto
interface CompraProviderProps {
    children: ReactNode;
}

export const VentaContextProvider: React.FC<CompraProviderProps> = ({ children }) => {
    const [ubicacionesVenta, setUbicacionesVenta] = useState<UbicacionVentaDTO[]>([]);
    const [tiposMedioPago, setTiposMedioPago] = useState<TipoMedioPagoDTO[]>([]);
    const [ventas, setVentas] = useState<VentaDTO[]>([]);
    const [detallesVentas, setDetallesVentas] = useState<DetalleVentaDTO[]>([]);
    const { data: session, status } = useSession();
    const idEmpresa = session?.user?.idEmpresa;

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

    const obtenerVentas = async () => {
        try {
            const respuesta = await axios.get<VentaDTO[]>(`/api/empresas/${idEmpresa}/ventas`);
            if (respuesta.status === 200) {
                setVentas(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo ventas", error);
        }
    };

    const obtenerDetallesVentas = async () => {
        try {
            const respuesta = await axios.get<DetalleVentaDTO[]>(`/api/empresas/${idEmpresa}/detalles-ventas`);
            if (respuesta.status === 200) {
                setDetallesVentas(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo detalles ventas", error);
        }
    };

    const obtenerTiposMedioPago = async () => {
        try {
            const respuesta = await axios.get<TipoMedioPagoDTO[]>("/api/tipos-medio-pago")
            if (respuesta.status === 200) {
                setTiposMedioPago(respuesta.data)
            }
        } catch (error) {
            console.error("Error obteniendo Tipos Medio Pago ", error)
        }
    }

    return (
        <VentaContext.Provider value={{
            ubicacionesVenta,
            setUbicacionesVenta,
            obtenerUbicacionesVenta,
            ventas,
            setVentas,
            obtenerVentas,
            detallesVentas,
            setDetallesVentas,
            obtenerDetallesVentas,
            tiposMedioPago,
            setTiposMedioPago,
            obtenerTiposMedioPago
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

