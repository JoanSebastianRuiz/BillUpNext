"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { ProductoResponseDTO } from "@/dto/ProductoResponseDTO";
import { CategoriaDTO } from "@/dto/CategoriaDTO";

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
