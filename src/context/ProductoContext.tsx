"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { CategoriaDTO } from "@/dto/CategoriaDTO";
import axios from "axios";
import { useSession } from "next-auth/react";

interface ProductoContextType {
    productos: ProductoResponseDTO[];
    setProductos: (productos: ProductoResponseDTO[]) => void;
    categorias: CategoriaDTO[];
    setCategorias: (categorias: CategoriaDTO[]) => void;
    obtenerCategorias: () => void;
    obtenerProductos: () => void;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);


interface ProductoProviderProps {
    children: ReactNode;
}

export const ProductoContextProvider: React.FC<ProductoProviderProps> = ({ children }) => {
    const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

    const { data: session, status } = useSession();
    const idRol = session?.user?.idRol;
    const idEmpresa = session?.user?.idEmpresa;

    const obtenerCategorias = async () => {
        try {
            const respuesta = await axios.get<CategoriaDTO[]>(`/api/empresas/${idEmpresa}/categorias`);
            if (respuesta.status === 200) {
                setCategorias(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo categorías", error);
        }
    };

    const obtenerProductos = async () => {
        try {
            const respuesta = await axios.get<ProductoResponseDTO[]>(
                `/api/empresas/${idEmpresa}/productos`
            );
            if (respuesta.status === 200) {
                setProductos(respuesta.data);
            }
        } catch (error) {
            console.error("Error obteniendo productos", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!session || idRol === undefined || idEmpresa === undefined) return;

                if (idRol === 2) {
                    const [categoriasRes, productosRes] = await Promise.all([
                        axios.get(`/api/empresas/${idEmpresa}/categorias`),
                        axios.get(`/api/empresas/${idEmpresa}/productos`)
                    ]);

                    if (categoriasRes.status === 200) {
                        setCategorias(categoriasRes.data);
                    } else {
                        console.error("Error al obtener categorías:", categoriasRes.data.message);
                    }

                    if (productosRes.status === 200) {
                        setProductos(productosRes.data);
                    } else {
                        console.error("Error al obtener productos:", productosRes.data.message);
                    }
                } else if (idRol === 3 || idRol === 4) {
                    const productosRes = await axios.get(`/api/empresas/${idEmpresa}/productos`);
                    if (productosRes.status === 200) {
                        setProductos(productosRes.data);
                    } else {
                        console.error("Error al obtener productos:", productosRes.data.message);
                    }
                }
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };

        fetchData();
    }, [session, idRol, idEmpresa]);

    return (
        <ProductoContext.Provider value={{ productos, setProductos, categorias, setCategorias, obtenerCategorias, obtenerProductos }}>
            {children}
        </ProductoContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useProductoContext = (): ProductoContextType => {
    const context = useContext(ProductoContext);
    if (!context) {
        throw new Error("useProductoContext debe usarse dentro de un ProductoContextProvider");
    }
    return context;
};
