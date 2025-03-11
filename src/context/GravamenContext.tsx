"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { GravamenDTO } from "@/dto/GravamenDTO";
import axios from "axios";
import { useSession } from "next-auth/react";

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

    const { data: session, status } = useSession();
    const idRol = session?.user?.idRol;
    const idEmpresa = session?.user?.idEmpresa;

    useEffect(() => {
        const fetchGravamenes = async () => {

            try {
                if (!session || idRol === undefined || idEmpresa === undefined) return;
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
        if(idRol === 2) fetchGravamenes();
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