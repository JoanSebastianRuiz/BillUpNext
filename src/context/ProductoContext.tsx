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


interface ProductoProviderProps {
    children: ReactNode;
}

export const ProductoContextProvider: React.FC<ProductoProviderProps> = ({ children }) => {
    const [productos, setProductos] = useState<ProductoResponseDTO[]>([]);
    const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('/api/categorias'); 
                
                if (response.status === 200) {
                    setCategorias(response.data);
                } else {
                    console.error("Error al obtener categorías:", response.data.message);
                }
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };

        const fetchProductos = async () => {
            try {
                const response = await axios.get('/api/productos');
                if (response.status === 200) {
                    setProductos(response.data);
                } else {
                    console.error("Error al obtener productos:", response.data.message);
                }
            } catch (error) {
                console.error("Error al obtener productos:", error);
            }
        };

        fetchCategorias();
        fetchProductos();
    }, []);

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
