"use client";

import axios from "axios";
import { createContext, useState, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

import { DepartamentoResponseDTO } from "@/dto/DepartamentoResponseDTO";
import { MunicipioResponseDTO } from "@/dto/MunicipioResponseDTO";
import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";
import { RolDTO } from "@/dto/RolDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";

interface UserContextType {
    usuario: UsuarioResponseDTO;
    setUsuario: (usuario: UsuarioResponseDTO) => void;
    departamentos: DepartamentoResponseDTO[];
    setDepartamentos: (departamentos: DepartamentoResponseDTO[]) => void;
    municipios: MunicipioResponseDTO[];
    setMunicipios: (municipios: MunicipioResponseDTO[]) => void;
    tiposDocumento: TipoDocumentoResponseDTO[];
    setTiposDocumento: (tiposDocumento: TipoDocumentoResponseDTO[]) => void;
    roles: RolDTO[];
    setRoles: (roles: RolDTO[]) => void;
    usuarios: UsuarioResponseDTO[];
    setUsuarios: (usuarios: UsuarioResponseDTO[]) => void;
    obtenerUsuarios: () => void;
    loading: boolean; // Estado de carga
}

const UsuarioContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UsuarioContextProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [usuario, setUsuario] = useState<UsuarioResponseDTO>({} as UsuarioResponseDTO);
    const [departamentos, setDepartamentos] = useState<DepartamentoResponseDTO[]>([]);
    const [municipios, setMunicipios] = useState<MunicipioResponseDTO[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoResponseDTO[]>([]);
    const [roles, setRoles] = useState<RolDTO[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);
    const [loading, setLoading] = useState(true); // Estado de carga

    const { data: session, status } = useSession();
    const idRol = session?.user?.idRol;
    const idEmpresa = session?.user?.idEmpresa;

    const obtenerUsuarios = async () => {
        if (status !== "authenticated" || idRol === undefined || idEmpresa === undefined) return;
        setLoading(true);
        try {
            const endpoint = idRol === 2 ? `/api/empresas/${idEmpresa}/usuarios` : "/api/usuarios";
            const respuesta = await axios.get<UsuarioResponseDTO[]>(endpoint);

            if (respuesta.status === 200) {
                if (idRol === 1) {
                    setUsuarios(respuesta.data);
                } else {
                    setUsuarios(respuesta.data.filter((usuario: UsuarioResponseDTO) => usuario.idUsuario !== session.user.idUsuario && usuario.idUsuario !== 1) || []);
                }
            } else {
                console.error(respuesta.data);
            }
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <UsuarioContext.Provider value={{
            usuario,
            setUsuario,
            departamentos,
            setDepartamentos,
            municipios,
            setMunicipios,
            tiposDocumento,
            setTiposDocumento,
            roles,
            setRoles,
            usuarios,
            setUsuarios,
            obtenerUsuarios,
            loading
        }}>
            {children}
        </UsuarioContext.Provider>
    );
};

export const useUsuarioContext = (): UserContextType => {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("useUsuarioContext debe usarse dentro de un UsuarioContextProvider");
    }
    return context;
};
