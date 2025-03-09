"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { CategoriaDTO } from "@/dto/CategoriaDTO";
import axios from "axios";

interface ProductoContextType {
    productos: ProductoResponseDTO[];
    setProductos: (productos: ProductoResponseDTO[]) => void;
    categorias: CategoriaDTO[];
    setCategorias: (categorias: CategoriaDTO[]) => void;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

// Proveedor del contexto
interface ProductoProviderProps {
    children: ReactNode;
}

export const ProductoContextProvider: React.FC<ProductoProviderProps> = ({ children }) => {
    const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

    useEffect(() => {
        console.log("🔄 useEffect ejecutándose para obtener categorías...");

        axios.get("/api/categorias")
            .then(response => {
                console.log("Categorías obtenidas de la API:", response.data);  
                setCategorias(Array.isArray(response.data) ? response.data : []);
            })
            .catch(error => console.error(" Error al obtener categorías:", error));

    }, []);

    useEffect(() => {
        console.log(" Estado actualizado de categorías:", categorias);
    }, [categorias]);

    return (
        <ProductoContext.Provider value={{ productos, setProductos, categorias, setCategorias }}>
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
