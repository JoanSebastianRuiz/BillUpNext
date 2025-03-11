"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { GravamenDTO } from "@/dto/GravamenDTO";
import axios from "axios";

interface GravamenContextType {
    gravamenes: GravamenDTO[];
    setGravamenes: (gravamenes: GravamenDTO[]) => void;
}

const GravamenContext = createContext<GravamenContextType | undefined>(undefined);

interface GravamenProviderProps {
    children: ReactNode;
}

export const GravamenContextProvider: React.FC<GravamenProviderProps> = ({ children }) => {
    const [gravamenes, setGravamenes] = useState<GravamenDTO[]>([]);

    useEffect(() => {
        const fetchGravamenes = async () => {
            try {
                const response = await axios.get('/api/gravamen');
                if (response.status === 200) {
                    setGravamenes(response.data);
                } else {
                    console.error("Error al obtener los gravamenes:", response.data.message);
                }
            } catch (error) {
                console.error("Error al obtener los gravamenes:", error);
            } 
        };

        fetchGravamenes();
    }, []);

    return (
        <GravamenContext.Provider value={{ gravamenes, setGravamenes }}>
            {children}
        </GravamenContext.Provider>
    );
};

export const useGravamenContext = (): GravamenContextType => {
    const context = useContext(GravamenContext);
    if (!context) {
        throw new Error("useGravamenContext debe usarse dentro de un GravamenContextProvider");
    }
    return context;
};