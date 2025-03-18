    "use client";

    import { createContext, useState, useEffect, useContext, ReactNode } from "react";
    import { GravamenDTO } from "@/dto/GravamenDTO";
    import axios from "axios";
    import { useSession } from "next-auth/react";

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

        const { data: session, status } = useSession();
        const idRol = session?.user?.idRol;
        const idEmpresa = session?.user?.idEmpresa;

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

        useEffect(() => {
            if (idRol === 1) {
                if (!session || idRol === undefined || idEmpresa === undefined) return;
                obtenerGravamenes();
            };
        }, [session, idRol, idEmpresa]);

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