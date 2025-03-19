"use client"

import axios from "axios";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";

import { TerceroResponseEmpresaDTO } from "@/dto/TerceroResponseEmpresaDTO";
import { TerceroResponsePersonaDTO } from "@/dto/TerceroResponsePersonaDTO";
import { TerceroProductoDTO } from "@/dto/TerceroProductoDTO";

interface TerceroContextType {
    clientesPersona: TerceroResponsePersonaDTO[]
    setClientesPersona: (clientesPersona: TerceroResponsePersonaDTO[]) => void
    clientesEmpresa: TerceroResponseEmpresaDTO[]
    setClientesEmpresa: (clientesEmpresa: TerceroResponseEmpresaDTO[]) => void
    proveedoresPersona: TerceroResponsePersonaDTO[]
    setProveedoresPersona: (proveedoresPersona: TerceroResponsePersonaDTO[]) => void
    proveedoresEmpresa: TerceroResponseEmpresaDTO[]
    setProveedoresEmpresa: (proveedoresEmpresa: TerceroResponseEmpresaDTO[]) => void
    proveedoresProducto: TerceroProductoDTO[]
    setProveedoresProducto: (proveedoresProducto: TerceroProductoDTO[]) => void
    obtenerPersonas: (tipoPersonas: string) => void
    obtenerEmpresas: (tipoEmpresas: string) => void
    obtenerProveedoresProducto: () => void
}

const TerceroContext = createContext<TerceroContextType | undefined>(undefined);

// Proveedor del contexto
interface TerceroProviderProps {
    children: ReactNode;
}

export const TerceroContextProvider: React.FC<TerceroProviderProps> = ({ children }) => {
    const [clientesPersona, setClientesPersona] = useState<TerceroResponsePersonaDTO[]>([]);
    const [clientesEmpresa, setClientesEmpresa] = useState<TerceroResponseEmpresaDTO[]>([]);
    const [proveedoresPersona, setProveedoresPersona] = useState<TerceroResponsePersonaDTO[]>([]);
    const [proveedoresEmpresa, setProveedoresEmpresa] = useState<TerceroResponseEmpresaDTO[]>([]);
    const [proveedoresProducto, setProveedoresProducto] = useState<TerceroProductoDTO[]>([]);
    const [loading, setLoading] = useState(true); // Estado de carga

    const { data: session, status } = useSession();
    const idRol = session?.user?.idRol;
    const idEmpresa = session?.user?.idEmpresa;

    const obtenerPersonas = async (tipoPersonas: string) => {
        if (!session || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
        try {
            const respuestaPersonas = await axios.get(`/api/empresas/${idEmpresa}/${tipoPersonas}?tipo=persona`);
            if (respuestaPersonas.status === 200) {
                if (tipoPersonas === "proveedores") {
                    setProveedoresPersona(respuestaPersonas.data)
                } else {
                    setClientesPersona(respuestaPersonas.data)
                }

            } else {
                console.error(respuestaPersonas.data)
            }

        } catch (error) {
            console.error(`Error al obtener los ${tipoPersonas} persona:`, error)
        }
    }

    const obtenerEmpresas = async (tipoEmpresas: string) => {
        if (!session || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
        try {
            const respuestaEmpresas = await axios.get(`/api/empresas/${idEmpresa}/${tipoEmpresas}?tipo=empresa`);
            if (respuestaEmpresas.status === 200) {
                if (tipoEmpresas === "proveedores") {
                    setProveedoresEmpresa(respuestaEmpresas.data)
                } else {
                    setClientesEmpresa(respuestaEmpresas.data)
                }

            } else {
                console.error(respuestaEmpresas.data)
            }

        } catch (error) {
            console.error(`Error al obtener los ${tipoEmpresas} empresa:`, error)
        }
    }

    const obtenerProveedoresProducto = async () => {
        if (!session || idEmpresa === undefined) return; // Esperar a que la sesión esté lista
        try {
            const respuesta = await axios.get(`/api/empresas/${idEmpresa}/tercero-producto`);
            if (respuesta.status === 200) {
                setProveedoresProducto(respuesta.data)

            } else {
                console.error(respuesta.data)
            }

        } catch (error) {
            console.error(`Error al obtener los proveedores producto:`, error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!session || idRol === undefined || idEmpresa === undefined) return;

            setLoading(true); // Iniciar carga antes de la petición
            try {
                if (idRol === 2) {
                    const [clientesPersonaRes, clientesEmpresaRes, proveedoresPersonaRes, proveedoresEmpresaRes, proveedoresProductoRes] = await Promise.all([
                        axios.get<TerceroResponsePersonaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=persona`),
                        axios.get<TerceroResponseEmpresaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=empresa`),
                        axios.get<TerceroResponsePersonaDTO[]>(`/api/empresas/${idEmpresa}/proveedores?tipo=persona`),
                        axios.get<TerceroResponseEmpresaDTO[]>(`/api/empresas/${idEmpresa}/proveedores?tipo=empresa`),
                        axios.get<TerceroProductoDTO[]>(`/api/empresas/${idEmpresa}/tercero-producto`)
                    ]); // Obtener los datos de los clientes y proveedores de la empresa

                    if (clientesPersonaRes.status === 200) setClientesPersona(clientesPersonaRes.data);
                    if (clientesEmpresaRes.status === 200) setClientesEmpresa(clientesEmpresaRes.data);
                    if (proveedoresPersonaRes.status === 200) setProveedoresPersona(proveedoresPersonaRes.data);
                    if (proveedoresEmpresaRes.status === 200) setProveedoresEmpresa(proveedoresEmpresaRes.data);
                    if (proveedoresProductoRes.status === 200) setProveedoresProducto(proveedoresProductoRes.data);

                } else if (idRol === 3 || idRol === 4) {
                    const [clientesPersonaRes, clientesEmpresaRes] = await Promise.all([
                        axios.get<TerceroResponsePersonaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=persona`),
                        axios.get<TerceroResponseEmpresaDTO[]>(`/api/empresas/${idEmpresa}/clientes?tipo=empresa`)
                    ]); // Obtener los datos de los clientes y proveedores de la empresa

                    if (clientesPersonaRes.status === 200) setClientesPersona(clientesPersonaRes.data);
                    if (clientesEmpresaRes.status === 200) setClientesEmpresa(clientesEmpresaRes.data);
                }

            } catch (error) {
                console.error("Error al obtener los datos de Tercero Context:", error);
            } finally {
                setLoading(false); // Finalizar carga después de obtener los datos
            }
        };

        fetchData();
    }, [session, idRol, idEmpresa]);

    return (
        <TerceroContext.Provider value={{
            clientesPersona,
            setClientesPersona,
            clientesEmpresa,
            setClientesEmpresa,
            proveedoresPersona,
            setProveedoresPersona,
            proveedoresEmpresa,
            setProveedoresEmpresa,
            proveedoresProducto,
            setProveedoresProducto,
            obtenerPersonas,
            obtenerEmpresas,
            obtenerProveedoresProducto
        }}>
            {children}
        </TerceroContext.Provider>
    )
}

// Hook personalizado para usar el contexto
export const useTerceroContext = (): TerceroContextType => {
    const context = useContext(TerceroContext);
    if (!context) {
        throw new Error("useTerceroContext debe usarse dentro de un TerceroContextProvider");
    }
    return context;
};
