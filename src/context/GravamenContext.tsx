    "use client";

    import { createContext, useState, useContext, ReactNode } from "react";
    import { GravamenDTO } from "@/dto/GravamenDTO";
    import axios from "axios";

    interface GravamenContextType {
        gravamenes: GravamenDTO[];
        setGravamenes: (gravamenes: GravamenDTO[]) => void;
        obtenerGravamenes: () => void;
    }

    const GravamenContext = createContext<GravamenContextType | undefined>(undefined);

    interface GravamenProviderProps {
        children: ReactNode;
    }

    export const GravamenContextProvider: React.FC<GravamenProviderProps> = ({ children }) => {
        const [gravamenes, setGravamenes] = useState<GravamenDTO[]>([]);

        const obtenerGravamenes = async () => {
            try {
                const respuesta = await axios.get<GravamenDTO[]>(`/api/gravamen`);
                if (respuesta.status === 200) {
                    setGravamenes(respuesta.data);
                }
            }
            catch (error) {
                console.error("Error obteniendo gravamenes", error);
            }
        };

        return (
            <GravamenContext.Provider value={{ gravamenes, setGravamenes, obtenerGravamenes }}>
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