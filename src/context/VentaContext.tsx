"use client";

import axios from "axios";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
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

    useEffect(() => {
        const fetchData = async () => {
            if (status !== "authenticated" || idEmpresa == undefined) return;
            if (idRol === 3) {
                const [ubicacionesVentaRes, ventasRes, detallesVentasRes, tiposMedioPagoRes ] = await Promise.all([
                    axios.get<UbicacionVentaDTO[]>(`/api/empresas/${idEmpresa}/ubicaciones-venta`),
                    axios.get<VentaDTO[]>(`/api/empresas/${idEmpresa}/ventas`),
                    axios.get<DetalleVentaDTO[]>(`/api/empresas/${idEmpresa}/detalles-ventas`),
                    axios.get<TipoMedioPagoDTO[]>("/api/tipos-medio-pago")
                ]);
                if (ubicacionesVentaRes.status === 200) setUbicacionesVenta(ubicacionesVentaRes.data);
                if (ventasRes.status === 200) setVentas(ventasRes.data.filter(venta => venta.idUsuario === session?.user?.idUsuario));
                if (detallesVentasRes.status === 200) setDetallesVentas(detallesVentasRes.data);
                if (tiposMedioPagoRes.status === 200) setTiposMedioPago(tiposMedioPagoRes.data);

            } else if (idRol === 2) {
                const [ubicacionesVentaRes, ventasRes, detallesVentasRes] = await Promise.all([
                    axios.get<UbicacionVentaDTO[]>(`/api/empresas/${idEmpresa}/ubicaciones-venta`),
                    axios.get<VentaDTO[]>(`/api/empresas/${idEmpresa}/ventas`),
                    axios.get<DetalleVentaDTO[]>(`/api/empresas/${idEmpresa}/detalles-ventas`)
                ]);
                if (ubicacionesVentaRes.status === 200) setUbicacionesVenta(ubicacionesVentaRes.data);
                if (ventasRes.status === 200) setVentas(ventasRes.data);
                if (detallesVentasRes.status === 200) setDetallesVentas(detallesVentasRes.data);
            }
        }
        fetchData();
    }, [status])

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

