"use client"

import { createContext, useState, useContext, ReactNode } from "react";
import { DepartamentoResponseDTO } from "@/dto/DepartamentoResponseDTO";
import { MunicipioResponseDTO } from "@/dto/MunicipioResponseDTO";
import { TipoDocumentoResponseDTO } from "@/dto/TipoDocumentoResponseDTO";
import { RolDTO } from "@/dto/RolDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";

interface UserContextType {
    documentoUsuario: string
    setDocumentoUsuario: (documento: string) => void
    departamentos: DepartamentoResponseDTO[]
    setDepartamentos: (departamentos: DepartamentoResponseDTO[]) => void
    municipios: MunicipioResponseDTO[]
    setMunicipios: (municipios: MunicipioResponseDTO[]) => void
    tiposDocumento: TipoDocumentoResponseDTO[]
    setTiposDocumento: (tiposDocumento: TipoDocumentoResponseDTO[]) => void
    roles: RolDTO[]
    setRoles: (roles: RolDTO[]) => void
    usuarios: UsuarioResponseDTO[]
    setUsuarios: (usuarios: UsuarioResponseDTO[]) => void
}

const UsuarioContext = createContext<UserContextType | undefined>(undefined);

// Proveedor del contexto
interface UserProviderProps {
    children: ReactNode;
}

export const UsuarioContextProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [documentoUsuario, setDocumentoUsuario] = useState("");
    const [departamentos, setDepartamentos] = useState<DepartamentoResponseDTO[]>([]);
    const [municipios, setMunicipios] = useState<MunicipioResponseDTO[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoResponseDTO[]>([]);
    const [roles, setRoles] = useState<RolDTO[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioResponseDTO[]>([]);

    return (
        <UsuarioContext.Provider value={{
            documentoUsuario,
            setDocumentoUsuario,
            departamentos,
            setDepartamentos,
            municipios,
            setMunicipios,
            tiposDocumento,
            setTiposDocumento,
            roles,
            setRoles,
            usuarios,
            setUsuarios
        }}>
            {children}
        </UsuarioContext.Provider>
    )
}

// Hook personalizado para usar el contexto
export const useUsuarioContext = (): UserContextType => {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error("useUsuarioContext debe usarse dentro de un UsuarioContextProvider");
    }
    return context;
};

