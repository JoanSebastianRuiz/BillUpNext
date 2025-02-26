"use client"

import { createContext, useState, useContext, ReactNode } from "react";
import { DepartamentoDTO } from "@/dto/DepartamentoDTO";
import { MunicipioDTO } from "@/dto/MunicipioDTO";
import { TipoDocumentoDTO } from "@/dto/TipoDocumentoDTO";
import { RolDTO } from "@/dto/RolDTO";
import { UsuarioResponseDTO } from "@/dto/UsuarioResponseDTO";
import { EmpresaResponseDTO } from "@/dto/EmpresaResponseDTO";

interface UserContextType {
    documentoUsuario: string
    setDocumentoUsuario: (documento: string) => void
    departamentos: DepartamentoDTO[]
    setDepartamentos: (departamentos: DepartamentoDTO[]) => void
    municipios: MunicipioDTO[]
    setMunicipios: (municipios: MunicipioDTO[]) => void
    tiposDocumento: TipoDocumentoDTO[]
    setTiposDocumento: (tiposDocumento: TipoDocumentoDTO[]) => void
    roles: RolDTO[]
    setRoles: (roles: RolDTO[]) => void
    empresas: EmpresaResponseDTO[]
    setEmpresas: (empresas: EmpresaResponseDTO[]) => void
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
    const [departamentos, setDepartamentos] = useState<DepartamentoDTO[]>([]);
    const [municipios, setMunicipios] = useState<MunicipioDTO[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumentoDTO[]>([]);
    const [roles, setRoles] = useState<RolDTO[]>([]);
    const [empresas, setEmpresas] = useState<EmpresaResponseDTO[]>([]);
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
            empresas,
            setEmpresas,
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

